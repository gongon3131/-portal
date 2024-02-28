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

    public function CALLBACK__post_message(){

        //バリデート
        $this->validate('dashboard/post_message');

        //トークン
        if(isset($this->vars['token']) == false || $this->vars['token'] !== $_SESSION['csrf_token'] ){
            echo json_encode("token_ng");
            exit();
        }

        try{

            $json = $_POST['tdms_address_user'];
            //POSTされたjsonを配列に変換
            $post_address_ary = json_decode($json,true);
            //トランザクション開始
            $this->mysql->beginTransaction();      
            
            $sql = <<<EOF
                INSERT INTO td_message
                (
                    tdms_address_user,
                    tdms_title,
                    tdms_contents,
                    tdms_post_user
                )
                VALUES
            EOF;
            $target_sql = "";
            foreach($post_address_ary as $key => $target_userid){
                $target_sql .= "(";
                $target_sql .= ":tdms_address_user".$key.",";
                $target_sql .= ":tdms_title".$key.",";
                $target_sql .= ":tdms_contents".$key.",";
                $target_sql .= ":tdms_post_user".$key."";
                $target_sql .= "),";
            }

            $target_sql = rtrim($target_sql, ",");
            $sql = $sql.$target_sql;
            $stmt = $this->mysql->prepare($sql);

            foreach($post_address_ary as $key => $target_userid){
                $stmt->bindValue(":tdms_address_user".$key , $target_userid);
                $stmt->bindValue(":tdms_title".$key , $this->vars['tdms_title']);
                $stmt->bindValue(":tdms_contents".$key , $this->vars['tdms_contents']);
                $stmt->bindValue(":tdms_post_user".$key , $_SESSION['login_info']['user_id']);
            }
            
            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            //トランザクションコミット
            $this->mysql->commit();
            echo json_encode("ok");
            
        } catch(Exception $e) {
            //ロールバック
            $this->mysql->rollback();
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__message_detail(){

        //バリデート
        $this->validate('dashboard/message_detail');

        try{

            $sql = "SELECT tdms_id,tdms_title,REPLACE(tdms_contents,'\n','<br>') AS tdms_contents,tdms_post_user,tmur_user_name,tdms_open_confirm FROM td_message ";
            $sql .= " LEFT OUTER JOIN tm_user";
            $sql .= " ON tmur_user_id = tdms_post_user";
            $sql .= " WHERE tdms_id = :tdms_id";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdms_id" , $this->vars['tdms_id']);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //結果保存用配列
            $message_ary = Array();
            
            if($row_count == 1){
                while($message = $stmt->fetch()){
                    $message_ary['post_user'] = $message['tmur_user_name'];
                    $message_ary['post_title'] = $message['tdms_title'];
                    $message_ary['post_contents'] = str_replace('\n','<br>',$message['tdms_contents']);
                    $message_ary['post_id'] = $message['tdms_id'];
                    $message_ary['post_open_confirm'] = $message['tdms_open_confirm'];
                }

            }

            echo json_encode($message_ary);



        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__message_open_confirm(){

        //バリデート
        $this->validate('dashboard/message_open_confirm');

        try{

            //トランザクション開始
            $this->mysql->beginTransaction();      

            $sql = "UPDATE td_message SET tdms_open_confirm = 1 WHERE tdms_id = :tdms_id";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdms_id" , $this->vars['tdms_id']);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            //トランザクションコミット
            $this->mysql->commit();
            echo json_encode("ok");
            

        } catch(Exception $e) {
            //ロールバック
            $this->mysql->rollback();
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__get_message_list(){

        //バリデート
        $this->validate('dashboard/get_message_list');

        try{

            $sql = "SELECT tdms_id,tdms_title,tdms_contents,tdms_post_user,tmur_user_name,tdms_post_date,tdms_open_confirm FROM td_message";
            $sql .= " LEFT OUTER JOIN tm_user";
            $sql .= " ON tmur_user_id = tdms_post_user";
            $sql .= " WHERE tdms_address_user = :tdms_address_user";
            if($this->vars['tdms_open_confirm'] == 0){
                $sql .= " AND tdms_open_confirm = :tdms_open_confirm";
            }
            
            $stmt = $this->mysql->prepare($sql);
            if($this->vars['tdms_open_confirm'] == 0){
                $stmt->bindParam(":tdms_open_confirm" , $this->vars['tdms_open_confirm']);
            }
            $stmt->bindParam(":tdms_address_user" , $this->vars['tdms_address_user']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $all_message_ary = Array();

            while($shift = $stmt->fetch()){
                $message_ary = Array();
                $message_ary['post_date'] = $shift['tdms_post_date'];
                $message_ary['post_title'] = $shift['tdms_title'];
                $message_ary['post_user'] = $shift['tmur_user_name'];
                $message_ary['post_open_confirm'] = $shift['tdms_open_confirm'];
                $message_ary['id'] = $shift['tdms_id'];
                
                $all_message_ary[] = $message_ary;
            }
            
            echo json_encode($all_message_ary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__get_post_message_history(){

        //バリデート
        $this->validate('dashboard/get_post_message_history');

        try{

            $sql = " SELECT tdms_id,tdms_title,tdms_contents,tdms_post_user,tmur_user_name,tdms_post_date,";
            $sql .= " CASE ";
            $sql .= " WHEN tdms_open_confirm = 0 THEN '未開封'";
            $sql .= " WHEN tdms_open_confirm = 1 THEN '開封済'";
            $sql .= " END AS tdms_open_confirm";
            $sql .= " FROM td_message";
            $sql .= " LEFT OUTER JOIN tm_user";
            $sql .= " ON tmur_user_id = tdms_post_user";
            $sql .= " WHERE tdms_post_user = :tdms_post_user";

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdms_post_user" , $this->vars['tdms_post_user']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $all_message_ary = Array();

            while($shift = $stmt->fetch()){
                $message_ary = Array();
                $message_ary['post_date'] = $shift['tdms_post_date'];
                $message_ary['post_title'] = $shift['tdms_title'];
                $message_ary['post_user'] = $shift['tmur_user_name'];
                $message_ary['post_open_confirm'] = $shift['tdms_open_confirm'];
                $message_ary['id'] = $shift['tdms_id'];
                
                $all_message_ary[] = $message_ary;
            }
            
            echo json_encode($all_message_ary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

}//end of class


// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

