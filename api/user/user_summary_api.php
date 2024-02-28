<?php
/*
    * フレームワーク共通ファイルの呼び込み
*/
require_once '../../common.php';

/**デバッキングコンソール */
include  '../../ChromePhp.php';
/**レスポンスヘッダ */
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

//ini_set('display_errors',1);
/*
    * @class:SY_App:
    * @work:フレームワークのメイン部分
    * @date:2008/02/17:
    * @msg:このクラスのコンストラクターを呼んではいけません:
    * @msg:初期化処理は、「prepare」メソッドを使用してください:
*/

class SY_App extends SY_Framework{

    //var $pdo;

    public function SY_prepare(){

        //ログインチェック
        //$this->logincheck($_SESSION['login_info']['user_type']);
        //ChromePhp::log($_SERVER["HTTP_REFERER"]);
        //直接URL指定の禁止
        if (empty($_SERVER["HTTP_REFERER"])) {
			//$this->error->fatal_error('Permission Error!');
        }    
        
        //DB接続
        //$this->mysql = $this->db->connect();
        $this->mysql = $this->db->sql_prepare();
        //$this->pdo = $this->db->sql_prepare();

    }

    //ユーザー検索処理
    public function CALLBACK__user_summary(){

        //バリデート
        $this->validate('user/user_summary');

        //エラーメッセージ取得
        $err_ary = $this->error->get();

        //エラー時処理
		if($this->error->count() > 0){

            echo json_encode($err_ary);
            exit();  
        
        }

        //編集画面からの遷移のときは、検索条件をクリアしない
        if($_REQUEST['ses_flg'] == "") {
            $_SESSION['user_search_condition']['search_user_name'] = "";
            $_SESSION['user_search_condition']['search_address'] = "";
            $_SESSION['user_search_condition']['search_authority'] = "";

            $_SESSION['user_search_condition']['search_user_name'] = $this->vars['search_user_name'];
            $_SESSION['user_search_condition']['search_address'] = $this->vars['search_address'];
            $_SESSION['user_search_condition']['search_authority'] = $this->vars['search_authority'];
        }

        try{

            $sql = <<<EOF
                SELECT
                tmur_id,
                tmur_user_id,
                tmur_password,
                tmur_user_name,
                tmur_user_name_kana,
                tmur_authority,
                tmur_is_used
                FROM tm_user
                WHERE 1 = 1

            EOF;

            //氏名
            if($_SESSION['user_search_condition']['search_user_name'] != ''){
                $sql .= " AND tmur_user_name LIKE :tmur_user_name ";
            }
            //住所
            if($_SESSION['user_search_condition']['search_address'] != ''){
                $sql .= " AND tmur_address LIKE :tmur_address ";
            }

            //操作権限
            if($_SESSION['user_search_condition']['search_authority'] != '0' ){
                $sql .= " AND tmur_authority = :tmur_authority";
            }
            $sql .= " ORDER BY tmur_user_id";

            $stmt = $this->mysql->prepare($sql);

            if($_SESSION['user_search_condition']['search_user_name'] != ''){
                $stmt->bindParam(":tmur_user_name" , $_SESSION['user_search_condition']['search_user_name']);
            }
            if($_SESSION['user_search_condition']['search_address'] != ''){
                $stmt->bindParam(":tmur_address" , $_SESSION['user_search_condition']['search_address']);
            }
            if($_SESSION['user_search_condition']['search_authority'] != ''){
                $stmt->bindParam(":tmur_authority" , $_SESSION['user_search_condition']['search_authority']);
            }

            //クエリ実行
            $stmt->execute();       
            //$uriage = $stmt->fetchAll();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //結果保存用配列
            $user_summary_ary = Array();
            $brank_ary['tmur_id'] = "";
            $brank_ary['tmur_user_id'] = "";
            $brank_ary['tmur_user_name'] = "";
            $brank_ary['tmur_user_name_kana'] = "";
            $brank_ary['tmur_authority'] = "";
            $brank_ary['tmur_is_used'] = "";

            while($user = $stmt->fetch()){

                $brank_ary['tmur_id'] = $user['tmur_id'];
                $brank_ary['tmur_user_id'] = $user['tmur_user_id'];
                $brank_ary['tmur_user_name'] = $user['tmur_user_name'];
                $brank_ary['tmur_user_name_kana'] = $user['tmur_user_name_kana'];
                $brank_ary['tmur_is_used'] = "";
                    
                if($user['tmur_authority'] != -1){
                    $brank_ary['tmur_authority'] = $this->define['user_type'][$user['tmur_authority']];
                }else{
                    $brank_ary['tmur_authority'] = "";
                }
                $brank_ary['tmur_is_used']  = $this->define['enroll_status'][$user['tmur_is_used']];

                $user_summary_ary[] = $brank_ary;
            }

            //JS側へ結果を返す
            echo json_encode($user_summary_ary);


        } catch(Exception $e) {
            ChromePhp::log($e);
            return "ng";
        }            
    }
    
}//end of class()

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

