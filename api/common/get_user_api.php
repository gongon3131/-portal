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
       
        //DB接続
        //$this->mysql = $this->db->connect();
        $this->mysql = $this->db->sql_prepare();
        //$this->pdo = $this->db->sql_prepare();

    }

    //指定ユーザーの情報を取得
    public function CALLBACK__get_one_user(){
        //バリデート
        $this->validate('common/get_one_user');

        try{
            $sql = <<<EOF
                SELECT tmur_id , tmur_user_id , tmur_user_name , tmur_authority
                FROM tm_user
                WHERE tmur_user_id = :tmur_user_id
                AND tmur_is_used = 1
            EOF;
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            if($row_count == 1){
                $user = $stmt->fetch();
                echo json_encode($user);
            }else{
                echo json_encode("no");
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__get_hope_shift_for_user(){

        $sql = "SELECT tshs_start_date , tshs_end_date FROM ts_hope_shift_section";
        $stmt = $this->mysql->prepare($sql);
        //クエリ実行
        $execute = $stmt->execute();    
        $section = $stmt->fetchAll();
        return $section;

    }

    //希望シフト登録期間を取得
    public function get_hope_shift_section(){

        $sql = "SELECT tshs_start_date , tshs_end_date FROM ts_hope_shift_section";
        $stmt = $this->mysql->prepare($sql);
        //クエリ実行
        $execute = $stmt->execute();    
        $section = $stmt->fetchAll();
        return $section;

    }

    
}//end of class()

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

