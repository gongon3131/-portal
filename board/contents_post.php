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

    }

    /** 新規投稿画面出力 */
    public function CALLBACK__INDEX(){

        //カテゴリー選択用リスト
        //$this->result->add('category_ary',$this->get_category_list());

        //カテゴリー一覧取得
        $sql = "SELECT tmct_id, tmct_category_name FROM tm_category WHERE tmct_del_flg != '1'";
        $stmt = $this->mysql->prepare($sql);

        //クエリ実行
        $execute = $stmt->execute();       

        $array_category = Array();

        while($category = $stmt->fetch()){
            
            $array_category[$category['tmct_id']] = $category['tmct_category_name'];
        }

        $this->result->add('category_ary',$array_category);
        $this->display('board/contents_post.tpl');

    }

    /**新規投稿アクション */
    public function CALLBACK__post(){
        header("Content-Type: application/json; charset=utf-8");

        //バリデート
        $this->validate('board/contents_post');
        //エラー時処理
		if($this->error->count() > 0){
            ChromePhp::log($this->error);
            echo json_encode("ng2");
        }

        try{

            //トランザクション開始
            $this->mysql->beginTransaction();    
            
            $sql = <<<EOF
                INSERT INTO td_board_contents
                (
                tdbr_id,
                tdbr_contents,
                tdbr_category_id,
                tdbr_subject,
                tdbr_post_user,
                tdbr_create_date,
                tdbr_update_date,
                tdbr_update_user
                )
                VALUES
                (
                NULL,
                :tdbr_contents,
                :tdbr_category_id,
                :tdbr_subject,
                :tdbr_post_user,
                :tdbr_create_date,
                :tdbr_update_date,
                :tdbr_update_user
                )
            EOF;
            $stmt = $this->mysql->prepare($sql);
            $today = date("Y-m-d H:i:s");
            $stmt->bindParam(":tdbr_contents" , $this->vars['post_contents']);
            $stmt->bindParam(":tdbr_category_id" , $this->vars['category']);
            $stmt->bindParam(":tdbr_subject" , $this->vars['subject']);
            $stmt->bindParam(":tdbr_post_user" , $_SESSION['login_info']['user_id']);
            $stmt->bindParam(":tdbr_create_date" , $today);
            $stmt->bindParam(":tdbr_update_date" , $today);
            $stmt->bindParam(":tdbr_update_user" , $_SESSION['login_info']['user_id']);
            
            //クエリ実行
            $execute = $stmt->execute();     

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            //操作ログ書き込み
            $this->rec_operation_log($_SESSION['login_info']['user_id'],'掲示板',$this->get_category_name($this->vars['category']),'新規投稿','');
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

    /**投稿記事表示アクション */
    public function CALLBACK__detail(){
        header("Content-Type: application/json; charset=utf-8");
        
        try{

            $sql = "SELECT 	tbc.tdbr_id AS tdbr_id,";
            $sql .= " tbc.tdbr_contents AS tdbr_contents, ";
            $sql .= " tbc.tdbr_subject AS tdbr_subject, ";
            $sql .= " tbc.tdbr_category_id AS tdbr_category_id, ";
            $sql .= " tbc.tdbr_post_user AS tdbr_post_user, ";
            $sql .= " tbc.tdbr_create_date AS tdbr_create_date, ";
            $sql .= " tbc.tdbr_update_date AS tdbr_update_date, ";
            $sql .= " tmu.tmur_user_name AS tmur_user_name ";
            $sql .= " FROM td_board_contents AS tbc ";
            $sql .= " LEFT OUTER JOIN tm_user AS tmu ";
            $sql .= " ON tmu.tmur_user_id = tbc.tdbr_post_user";
            //$sql .= " WHERE tbc.tdbr_id = {$_POST['contents_id']}";
            $sql .= " WHERE tbc.tdbr_id = :tdbr_id";

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbr_id" , $_POST['contents_id']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            //検索結果レコードが1つのときのみ処理継続
            if($row_count == 1){

                $contents = $stmt->fetch();
                echo json_encode($contents);
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    /**編集画面出力 */
    public function CALLBACK__edit_show(){

        //カテゴリー選択用リスト
        $this->result->add('category_ary',$this->get_category_list());

        $id = htmlspecialchars($_REQUEST['id']);

        try{

            $sql = <<<EOF
                SELECT
                tdbr_id,
                tdbr_contents,
                tdbr_category_id,
                tdbr_subject,
                tdbr_post_user,
                tdbr_create_date,
                tdbr_update_date
                FROM td_board_contents WHERE tdbr_id = :tdbr_id
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbr_id" , $id);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            //検索結果レコードが1つのときのみ処理継続
            if($row_count == 1){
                $contents = $stmt->fetch();
                //記事番号
                $this->result->add('contents_id',$contents['tdbr_id']);
                //標題
                $this->result->add('subject',$contents['tdbr_subject']);
                //投稿者
                $this->result->add('post_user',$contents['tdbr_post_user']);
                //投稿日
                $this->result->add('post_date',$contents['tdbr_create_date']);
                //最終更新日
                $this->result->add('update_date',$contents['tdbr_update_date']);
                //カテゴリ
                $this->result->add('category',$contents['tdbr_category_id']);
                //ChromePhp::log($contents['tdbr_category_id']);
                //記事本文
                $this->result->add('contents',$contents['tdbr_contents']);
                $this->display('board/contents_edit.tpl');
        
            }else{
                exit();
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    /**記事更新アクション */
    public function CALLBACK__edit(){

        header("Content-Type: application/json; charset=utf-8");

        //バリデート
        $this->validate('board/contents_edit');
        //エラー時処理
		if($this->error->count() > 0){
            echo json_encode($this->error);
            exit();
        }

        try{
            //トランザクション開始
            $this->mysql->beginTransaction();   
            
            $sql = <<<EOF
                UPDATE td_board_contents SET
                tdbr_contents = :tdbr_contents,
                tdbr_category_id = :tdbr_category_id,
                tdbr_subject = :tdbr_subject,
                tdbr_post_user = :tdbr_post_user,
                tdbr_update_date = :tdbr_update_date,
                tdbr_update_user = :tdbr_update_user
                WHERE tdbr_id = :tdbr_id
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $today = date("Y-m-d H:i:s");
            $stmt->bindParam(":tdbr_contents" , $this->vars['post_contents']);
            $stmt->bindParam(":tdbr_category_id" , $this->vars['category']);
            $stmt->bindParam(":tdbr_subject" , $this->vars['subject']);
            $stmt->bindParam(":tdbr_post_user" , $_SESSION['login_info']['user_id']);
            $stmt->bindParam(":tdbr_update_date" , $today);
            $stmt->bindParam(":tdbr_update_user" , $_SESSION['login_info']['user_id']);
            $stmt->bindParam(":tdbr_id" , $this->vars['id']);

            //クエリ実行
            $execute = $stmt->execute();     
            // DEBUG OUTPUT
            ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            //操作ログ書き込み
            $this->rec_operation_log($_SESSION['login_info']['user_id'],'掲示板',$this->get_category_name($this->vars['category']),'更新','');
            //トランザクションコミット
            $this->mysql->commit();
            echo json_encode("ok");
            //ERR_RESPONSE_HEADERS_TOO_BIG対策
            //Chromeでのみ出現するので、レスポンス時のヘッダを削除する
            header_remove();

        } catch(Exception $e) {
            //ロールバック
            $this->mysql->rollback();
            ChromePhp::log($e);
            echo json_encode("ng");
        }
    }

    /**記事削除アクション */
    public function CALLBACK__delete(){

        header("Content-Type: application/json; charset=utf-8");

        //バリデート
        $this->validate('board/contents_delete');
        //エラー時処理
		if($this->error->count() > 0){
            echo json_encode($this->error);
            exit();
        }

        try{
            //トランザクション開始
            $this->mysql->beginTransaction();            

            $sql = "";
            $sql .= "UPDATE td_board_contents SET tdbr_del_flg = '1' WHERE tdbr_id = :tdbr_id";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbr_id" , $this->vars['id']);

            //クエリ実行
            $execute = $stmt->execute();     
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            //トランザクションコミット
            $this->mysql->commit();

            header_remove();
            echo json_encode("ok");

        } catch(Exception $e) {
            //ロールバック
            $this->mysql->rollback();
            ChromePhp::log($e);
            echo json_encode("ng");
        }
    }

    //カテゴリー一覧取得アクション
    public function CALLBACK__get_category(){

        header("Content-Type: application/json; charset=utf-8");

        try{

            $sql = "SELECT tmct_category_name,tmct_id FROM tm_category WHERE tmct_del_flg != '1'";
            $stmt = $this->mysql->prepare($sql);
            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            $array_category = Array();

            while($category = $stmt->fetch()){
                
                $array_category[$category['tmct_id']] = $category['tmct_category_name'];
            }

            echo json_encode($array_category);

        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    //カテゴリー登録アクション
    public function CALLBACK__category_edit(){
        header("Content-Type: application/json; charset=utf-8");

        //バリデート
        $this->validate('board/category_edit');
        ChromePhp::log($this->error->get());
        //エラー時処理
		if($this->error->count() > 0){
            //echo json_encode($this->error);
            echo json_encode("ng");
            exit();
        }

        try{

            //トランザクション開始
            $this->mysql->beginTransaction();            

            $sql = "";
            $stmt;
            //登録アクション
            if($this->vars['tmct_id'] == 0){

                $sql .= <<<EOF
                    INSERT INTO tm_category (
                    tmct_id,
                    tmct_category_name,
                    tmct_create_date,
                    tmct_update_date,
                    tmct_update_user)
                    VALUES(
                    NULL,
                    :tmct_category_name,
                    :tmct_create_date,
                    :tmct_update_date,
                    :tmct_update_user)

                EOF;
                $stmt = $this->mysql->prepare($sql);
                $today = date("Y-m-d H:i:s");
                $stmt->bindParam(":tmct_category_name" , $this->vars['tmct_category_name']);
                $stmt->bindParam(":tmct_create_date" , $today);
                $stmt->bindParam(":tmct_update_date" , $today);
                $stmt->bindParam(":tmct_update_user" , $_SESSION['login_info']['user_id']);
                    
            //修正アクション
            }else{
                $sql .= " UPDATE tm_category SET tmct_category_name = :tmct_category_name";
                $sql .= " WHERE tmct_id = :tmct_id";
                $stmt = $this->mysql->prepare($sql);
                $stmt->bindParam(":tmct_category_name" , $this->vars['tmct_category_name']);
                $stmt->bindParam(":tmct_id" , $this->vars['tmct_id']);
                
            }

            //クエリ実行
            $execute = $stmt->execute();     

            // DEBUG OUTPUT
            ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
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

    //カテゴリー削除アクション
    public function CALLBACK__category_delete(){
        header("Content-Type: application/json; charset=utf-8");

        //バリデート
        $this->validate('board/category_delete');
        ChromePhp::log($this->error->count());
        //エラー時処理
		if($this->error->count() > 0){
            //echo json_encode($this->error);
            echo json_encode("ng");
            exit();
        }

        try{

            //トランザクション開始
            $this->mysql->beginTransaction();            

            $sql = "DELETE FROM tm_category WHERE tmct_id = :tmct_id";

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tmct_id" , $this->vars['tmct_id']);

            //クエリ実行
            $execute = $stmt->execute();     

            // DEBUG OUTPUT
            ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
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

    //カテゴリー選択用リスト取得
    public function get_category_list(){

        try{

            //カテゴリー一覧取得
            $sql = "SELECT tmct_id,tmct_category_name FROM tm_category WHERE tmct_del_flg != '1'";
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();       

            $array_category = Array();
            $array_category['0'] = "-----選択してください-----";

            while($category = $stmt->fetch()){
                
                $array_category[$category['tmct_id']] = $category['tmct_category_name'];
            }

            return $array_category;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

    //カテゴリー取得
    public function get_category_name($category_id){

        try{

            //$sql = "SELECT tmct_category_name FROM tm_category WHERE tmct_id = {$category_id}";
            $sql = "SELECT tmct_category_name FROM tm_category WHERE tmct_id = :tmct_id";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tmct_id" , $category_id);
            
            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //検索結果レコードが1つのときのみ処理継続
            if($row_count == 1){

                $category_name = $stmt->fetch();
                return $category_name['tmct_category_name'];
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

