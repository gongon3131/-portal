<?php
/*
    * フレームワーク共通ファイルの呼び込み
*/
require_once '../common.php';
ini_set('display_errors', "On");
//デバッガ
include '../ChromePhp.php';

/*
    * @class:SY_App:
    * @work:フレームワークのメイン部分
    * @date:2008/02/17:
    * @msg:このクラスのコンストラクターを呼んではいけません:
    * @msg:初期化処理は、「prepare」メソッドを使用してください:
*/

class SY_App extends SY_Framework{

    public function SY_prepare(){

        //ログインチェック
        $this->logincheck($_SESSION['login_info']['user_authority']);

		if($_SESSION['login_info']['user_authority'] == ''){
			$this->error->fatal_error('Permission Error!');
        }		
        //DB接続
        //$this->mysql = $this->db->connect();
        $this->mysql = $this->db->sql_prepare();
        //$this->pdo = $this->db->sql_prepare();

        //ベースディレクトリ
        $this->result->add('base_url',$this->config['BASE_URL']);

        //JS/CSSファイルのバージョン値（キャッシュ対策）
        $this->result->add('ver',rand());
        
    }

    //メイン画面出力アクション
    public function CALLBACK__INDEX(){

        //JS/CSSファイルのバージョン値（キャッシュ対策）
        $this->result->add('ver',rand());
        $this->display('shift/shift_table_show.tpl');

    }

    //投稿記事取得アクション
    public function CALLBACK__get_contents(){

        header("Content-Type: application/json; charset=utf-8");

        //バリデート
        $this->validate('board/contents_summary');

        //エラー時処理
		if($this->error->count() > 0){

        }

        try{

            $sql = <<<EOF
                SELECT
                tbc.tdbr_id AS tdbr_id,
                tbc.tdbr_subject AS tdbr_subject,
                tmc.tmct_category_name AS tdbr_category_name,
                tmu.tmur_user_name AS tdur_post_user_name,
                tbc.tdbr_post_user AS tdbr_post_user,
                tbc.tdbr_update_date AS tdbr_update_date,
                tbc.tdbr_contents AS tdbr_contents
                FROM td_board_contents AS tbc
                LEFT OUTER JOIN tm_user AS tmu
                ON tbc.tdbr_post_user = tmu.tmur_user_id
                LEFT OUTER JOIN tm_category AS tmc
                ON tbc.tdbr_category_id = tmc.tmct_id
                WHERE tdbr_del_flg != '1'

            EOF;
            
            //新着のみフラグが送られてきたとき
            if($this->vars['category'] == 0){
                $setting_disp_days = $this->get_settings("new_contetnts_disp_days");
                if(empty($setting_disp_days) == true){
                    $setting_disp_days = 30;
                }
                $sql .= " AND tbc.tdbr_update_date > (NOW() - INTERVAL {$setting_disp_days} DAY)";
            }
            //カテゴリー検索条件
            if(empty($this->vars['category']) == false){
                $sql .= " AND tbc.tdbr_category_id = :tdbr_category_id";
            }
            $sql .= " ORDER BY tbc.tdbr_update_date DESC";

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbr_category_id" , $this->vars['category']);
        
            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //検索結果保存用配列
            $array_contents = $stmt->fetchAll();
            
            //JS側へ結果を返す
            echo json_encode($array_contents);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    //カテゴリー名取得
    public function CALLBACK__get_category(){

        header("Content-Type: application/json; charset=utf-8");
        $category_id = htmlspecialchars($_POST['category_id']);

        $sql = "SELECT tmct_category_name FROM tm_category WHERE tmct_id = :category_id";

        $stmt = $this->mysql->prepare($sql);
        $stmt->bindParam(":category_id" , $category_id);

        //クエリ実行
        $execute = $stmt->execute();       
        $row_count = $stmt->rowCount();

        // DEBUG OUTPUT
        //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

        //検索結果レコードが1つのときのみ処理継続
        if($row_count >= 0){
            $category = $stmt->fetch();
            //JS側へ結果を返す
            echo json_encode($category);
        }        

    }

    //環境設定値取得
    public function get_settings($name){

        //$sql = "SELECT {$name} FROM ts_settings WHERE user_id = '{$_SESSION['login_info']['user_id']}'";
        $sql = "SELECT {$name} FROM ts_settings WHERE user_id = :user_id";

        $stmt = $this->mysql->prepare($sql);
        $stmt->bindParam(":user_id" , $_SESSION['login_info']['user_id']);
    
        //クエリ実行
        $execute = $stmt->execute();       
        $row_count = $stmt->rowCount();

        //検索結果レコードが1つのときのみ処理継続
        if($row_count == 1){
            $settings = $stmt->fetch();
            return $settings[$name];
        }        

    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

