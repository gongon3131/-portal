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
    public function CALLBACK__get_one_user(){

        //バリデート
        $this->validate('user/get_one_user');

        //エラーメッセージ取得
        $err_ary = $this->error->get();

        //エラー時処理
		if($this->error->count() > 0){

            echo json_encode($err_ary);
            exit();  
        
        }

        try{

            $sql = <<<EOF
                SELECT
                tmur_id,
                tmur_user_id,
                tmur_password,
                tmur_user_name,
                tmur_user_name_kana,
                tmur_zipcode,
                tmur_address,
                tmur_apart,
                tmur_tel,
                tmur_mobile_phone,
                tmur_birthday,
                tmur_hire_date,
                tmur_mail,
                tmur_authority,
                tmur_employment_status,
                tmur_holiday_manage,
                tmur_is_used,
                tmur_import_status,
                IFNULL(tmur_memo,'') AS tmur_memo
                FROM tm_user
                WHERE tmur_id = :tmur_id
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tmur_id" , $this->vars['tmur_id']);

            //クエリ実行
            $stmt->execute();    
            $row_count = $stmt->rowCount();
            //$uriage = $stmt->fetchAll();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //結果保存用配列
            $user_ary = Array();

            if($row_count == 1){
                while($user = $stmt->fetch()){
                    $user_ary['tmur_id'] = $user['tmur_id'];
                    $user_ary['tmur_user_id'] = $user['tmur_user_id'];
                    $user_ary['tmur_password'] = $user['tmur_password'];
                    $user_ary['tmur_user_name'] = $user['tmur_user_name'];
                    $user_ary['tmur_user_name_kana'] = $user['tmur_user_name_kana'];
                    $user_ary['tmur_zipcode'] = $user['tmur_zipcode'];
                    $user_ary['tmur_address'] = $user['tmur_address'];
                    $user_ary['tmur_apart'] = $user['tmur_apart'];
                    $user_ary['tmur_tel'] = $user['tmur_tel'];
                    $user_ary['tmur_mobile_phone'] = $user['tmur_mobile_phone'];
                    $user_ary['tmur_birthday'] = $user['tmur_birthday'];
                    $user_ary['tmur_hire_date'] = $user['tmur_hire_date'];
                    $user_ary['tmur_mail'] = $user['tmur_mail'];
                    $user_ary['tmur_authority'] = $user['tmur_authority'];
                    $user_ary['tmur_employment_status'] = $user['tmur_employment_status'];
                    $user_ary['tmur_holiday_manage'] = $user['tmur_holiday_manage'];
                    $user_ary['tmur_is_used'] = $user['tmur_is_used'];
                    $user_ary['tmur_import_status'] = $user['tmur_import_status'];
                    $user_ary['skill_posession'] = $this->get_skill_possesion($user['tmur_user_id']);
                    $user_ary['business_posession'] = $this->get_business_possesion($user['tmur_user_id']);
                }

            }

            //JS側へ結果を返す
            echo json_encode($user_ary);


        } catch(Exception $e) {
            ChromePhp::log($e);
            return "ng";
        }            
    }

    //ユーザー登録
    public function CALLBACK__user_regist(){

        //バリデート
        $this->validate('user/user_regist');
       
        //エラー時処理
        if($this->error->count() > 0){
            
            foreach($this->vars as $key => $value){
                $this->form['safe'][$key] = htmlspecialchars($value);
            }
            //ChromePhp::log($this->error->get());
            echo json_encode($this->error->get());

            exit();
        }

        try{

            //トランザクション開始
            $this->mysql->beginTransaction();            

            $sql = "  INSERT INTO tm_user (";
            $sql .= " tmur_id,";
            $sql .= " tmur_user_id,";
            $sql .= " tmur_password,";
            $sql .= " tmur_user_name,";
            $sql .= " tmur_user_name_kana,";
            $sql .= " tmur_zipcode,";
            $sql .= " tmur_address,";
            $sql .= " tmur_apart,";
            $sql .= " tmur_tel,";
            $sql .= " tmur_mobile_phone,";
            $sql .= " tmur_birthday,";
            $sql .= " tmur_hire_date,";
            $sql .= " tmur_mail,";
            $sql .= " tmur_authority,";
            $sql .= " tmur_employment_status,";
            $sql .= " tmur_holiday_manage,";
            $sql .= " tmur_is_used,";
            $sql .= " tmur_import_status,";
            $sql .= " tmur_memo,";
            $sql .= " tmur_create_date,";
            $sql .= " tmur_update_date,";
            $sql .= " tmur_update_user";
            $sql .= " ) VALUES ( ";
            $sql .= " :tmur_id,";
            $sql .= " :tmur_user_id,";
            $sql .= " :tmur_password,";
            $sql .= " :tmur_user_name,";
            $sql .= " :tmur_user_name_kana,";
            $sql .= " :tmur_zipcode,";
            $sql .= " :tmur_address,";
            $sql .= " :tmur_apart,";
            $sql .= " :tmur_tel,";
            $sql .= " :tmur_mobile_phone,";
            $sql .= " :tmur_birthday,";
            $sql .= " :tmur_hire_date,";
            $sql .= " :tmur_mail,";
            $sql .= " :tmur_authority,";
            $sql .= " :tmur_employment_status,";
            $sql .= " :tmur_holiday_manage,";
            $sql .= " :tmur_is_used,";
            $sql .= " :tmur_import_status,";
            $sql .= " :tmur_memo,";
            $sql .= " :tmur_create_date,";
            $sql .= " :tmur_update_date,";
            $sql .= " :tmur_update_user";
            $sql .= " )";
            $sql .= " ON DUPLICATE KEY UPDATE";
            $sql .= " tmur_user_id = :tmur_user_id,";
            $sql .= " tmur_password = :tmur_password,";
            $sql .= " tmur_user_name = :tmur_user_name,";
            $sql .= " tmur_user_name_kana = :tmur_user_name_kana,";
            $sql .= " tmur_zipcode = :tmur_zipcode,";
            $sql .= " tmur_address = :tmur_address,";
            $sql .= " tmur_apart = :tmur_apart,";
            $sql .= " tmur_tel = :tmur_tel,";
            $sql .= " tmur_mobile_phone = :tmur_mobile_phone,";
            $sql .= " tmur_birthday = :tmur_birthday,";
            $sql .= " tmur_hire_date = :tmur_hire_date,";
            $sql .= " tmur_mail = :tmur_mail,";
            $sql .= " tmur_authority = :tmur_authority,";
            $sql .= " tmur_employment_status = :tmur_employment_status,";
            $sql .= " tmur_holiday_manage = :tmur_holiday_manage,";
            $sql .= " tmur_is_used = :tmur_is_used,";
            $sql .= " tmur_import_status = :tmur_import_status,";
            $sql .= " tmur_memo = :tmur_memo,";
            $sql .= " tmur_update_date = :tmur_update_date,";
            $sql .= " tmur_update_user = :tmur_update_user";
            
            $stmt = $this->mysql->prepare($sql);

            //PK
            //更新時
            if(empty($this->vars['tmur_id']) == false){
                $stmt->bindParam(":tmur_id" , $this->vars['tmur_id']);
            //新規作成時
            }else{
                $stmt->bindValue(":tmur_id" , NULL ,PDO::PARAM_NULL);
            }
            
            $stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);//ユーザーID
            $stmt->bindParam(":tmur_password" , $this->vars['tmur_password']);//パスワード
            $stmt->bindParam(":tmur_user_name" , $this->vars['tmur_user_name']);//氏名
            $stmt->bindParam(":tmur_user_name_kana" , $this->vars['tmur_user_name_kana']);//氏名カナ
            $stmt->bindParam(":tmur_zipcode" , $this->vars['tmur_zipcode']);//郵便番号
            $stmt->bindParam(":tmur_address" , $this->vars['tmur_address']);//住所
            $stmt->bindParam(":tmur_apart" , $this->vars['tmur_apart']);//建物名
            $stmt->bindParam(":tmur_tel" , $this->vars['tmur_tel']);//電話番号
            $stmt->bindParam(":tmur_mobile_phone" , $this->vars['tmur_mobile_phone']);//携帯電話番号
            $stmt->bindParam(":tmur_birthday" , $this->vars['tmur_birthday']);//生年月日
            $stmt->bindParam(":tmur_hire_date" , $this->vars['tmur_hire_date']);//入社日
            $stmt->bindParam(":tmur_mail" , $this->vars['tmur_mail']);//メールアドレス
            $stmt->bindParam(":tmur_authority" , $this->vars['tmur_authority']);//操作権限
            $stmt->bindParam(":tmur_employment_status" , $this->vars['tmur_employment_status']);//雇用形態
            $stmt->bindParam(":tmur_holiday_manage" , $this->vars['tmur_holiday_manage']);//休日管理
            $stmt->bindParam(":tmur_is_used" , $this->vars['tmur_is_used']);//在籍フラグ
            $stmt->bindParam(":tmur_import_status" , $this->vars['tmur_import_status']);//インポート対象
            $stmt->bindParam(":tmur_memo" , $this->vars['tmur_memo']);//メモ
            $stmt->bindValue(":tmur_create_date" , date("Y-m-d H:i:s"));//データ作成日
            $stmt->bindValue(":tmur_update_date" , date("Y-m-d H:i:s"));//データ更新日
            $stmt->bindParam(":tmur_update_user" , $_SESSION['login_info']['id']);//データ更新者
            
            //クエリ実行
            $execute = $stmt->execute();       

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //操作権限がSV以外のときは、td_business_possesionを削除して処理終了
            if($this->vars['tmur_authority'] != 2){

                $sql = "DELETE FROM td_business_possesion WHERE tdbp_user_id = :tdbp_user_id";
                $stmt = $this->mysql->prepare($sql);
                $stmt->bindValue(":tdbp_user_id" , $this->vars['tmur_user_id']);

                //クエリ実行
                $execute = $stmt->execute();    
                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

                //トランザクションコミット
                $this->mysql->commit();
                echo json_encode("ok");
                exit();

            }

            /**スキル情報の登録および担当可能業務情報の登録*/
            $business_data_ary = $this->get_all_business();

            $non_regist_cnt = 0;
            $non_regist_cnt2 = 0;

            //スキル保有情報
            foreach($business_data_ary as $key => $val){
                if( $_POST['tdsp_skill_possesion_'.$val['tmbc_business_id']] != 9 ){
                    $non_regist_cnt ++;
                }
            }

            //担当可能業務情報
            foreach($business_data_ary as $key => $val){
                if( $_POST['tdbp_business_possesion_'.$val['tmbc_business_id']] != 9 ){
                    $non_regist_cnt2 ++;
                }
            }

            //スキル保有情報で、未登録となっているデータを削除（9のデータ）
            foreach($business_data_ary as $key => $val){

                if($_POST['tdsp_skill_possesion_'.$val['tmbc_business_id']] == 9){

                    $sql = " DELETE FROM td_skill_possesion ";
                    $sql .= " WHERE tdsp_user_id = :tdsp_user_id";
                    $sql .= " AND tdsp_business_id = :tdsp_business_id";
                    $stmt = $this->mysql->prepare($sql);
                    $stmt->bindValue(":tdsp_user_id" , $this->vars['tmur_user_id']);
                    $stmt->bindValue(":tdsp_business_id" , $val['tmbc_business_id']);

                    //クエリ実行
                    $execute = $stmt->execute();    
                    // DEBUG OUTPUT
                    //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

                    
                }
            }

            //担当可能業務情報で、未登録となっているデータを削除（9のデータ）
            foreach($business_data_ary as $key => $val){

                if($_POST['tdbp_business_possesion_'.$val['tmbc_business_id']] == 9){

                    $sql = " DELETE FROM td_business_possesion ";
                    $sql .= " WHERE tdbp_user_id = :tdbp_user_id";
                    $sql .= " AND tdbp_business_id = :tdbp_business_id";
                    $stmt = $this->mysql->prepare($sql);
                    $stmt->bindValue(":tdbp_user_id" , $this->vars['tmur_user_id']);
                    $stmt->bindValue(":tdbp_business_id" , $val['tmbc_business_id']);

                    //クエリ実行
                    $execute = $stmt->execute();    
                    // DEBUG OUTPUT
                    //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
                    
                }
            }

            //スキル保有対象データが0のときは、ここでトランザクションコミットする
        
            if($non_regist_cnt == 0){
                //トランザクションコミット
                //$this->mysql->commit();
                //echo json_encode("ok");
                //exit();
            //登録対象データが存在するときは、INSERT実行
            }else{
                $sql = <<<EOF
                    INSERT INTO td_skill_possesion
                    (
                        tdsp_user_id,
                        tdsp_business_id,
                        tdsp_skill_possesion,
                        tdsp_create_date,
                        tdsp_update_date,
                        tdsp_update_user
                    )
                    VALUES
                EOF;  
            
                $target_sql = "";
                $index = 0;

                foreach($business_data_ary as $key => $val){
                    if( $_POST['tdsp_skill_possesion_'.$val['tmbc_business_id']] != 9 ){

                        $target_sql .= "(";
                        $target_sql .= ":tdsp_user_id".$index.",";
                        $target_sql .= ":tdsp_business_id".$index.",";
                        $target_sql .= ":tdsp_skill_possesion".$index.",";
                        $target_sql .= ":tdsp_create_date".$index.",";
                        $target_sql .= ":tdsp_update_date".$index.",";
                        $target_sql .= ":tdsp_update_user".$index;
                        $target_sql .= "),";
                        $index = $index + 1;
        
                    }

                }

                $target_sql = rtrim($target_sql, ",");
                $sql = $sql.$target_sql;

                $sql .= <<<EOF
                    ON DUPLICATE KEY UPDATE
                    tdsp_user_id = VALUES(tdsp_user_id),
                    tdsp_business_id = VALUES(tdsp_business_id),
                    tdsp_skill_possesion = VALUES(tdsp_skill_possesion),
                    tdsp_update_date = VALUES(tdsp_update_date),
                    tdsp_update_user = VALUES(tdsp_update_user)
                EOF;  
                $stmt = $this->mysql->prepare($sql);

                $index = 0;
                foreach($business_data_ary as $key => $val){
                    
                    if($_POST['tdsp_skill_possesion_'.$val['tmbc_business_id']] != 9){

                        $stmt->bindValue(":tdsp_user_id".$index , $this->vars['tmur_user_id']);//OPID
                        $stmt->bindValue(":tdsp_business_id".$index , $val['tmbc_business_id'] , PDO::PARAM_INT);//業務番号
                        $stmt->bindValue(":tdsp_skill_possesion".$index , $_POST['tdsp_skill_possesion_'.$val['tmbc_business_id']] , PDO::PARAM_INT);//スキル保有
                        $stmt->bindValue(":tdsp_create_date".$index , date("Y-m-d H:i:s"));
                        $stmt->bindValue(":tdsp_update_date".$index , date("Y-m-d H:i:s"));
                        $stmt->bindValue(":tdsp_update_user".$index , $_SESSION['login_info']['id']);
                        $index = $index + 1;
        
                    }

                }
                //クエリ実行
                $execute = $stmt->execute();       

                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            }

            //担当可能業務対象データが0のときは、ここでトランザクションコミット
            if($non_regist_cnt2 == 0){
                //トランザクションコミット
                //$this->mysql->commit();
                //echo json_encode("ok");
                //exit();
            //登録対象データが存在するときは、INSERT実行
            }else{
                $sql = <<<EOF
                    INSERT INTO td_business_possesion
                    (
                        tdbp_user_id,
                        tdbp_business_id,
                        tdbp_business_possesion,
                        tdbp_create_date,
                        tdbp_update_date,
                        tdbp_update_user
                    )
                    VALUES
                EOF;  
            
                $target_sql = "";
                $index = 0;

                foreach($business_data_ary as $key => $val){
                    if( $_POST['tdbp_business_possesion_'.$val['tmbc_business_id']] != 9 ){

                        $target_sql .= "(";
                        $target_sql .= ":tdbp_user_id".$index.",";
                        $target_sql .= ":tdbp_business_id".$index.",";
                        $target_sql .= ":tdbp_business_possesion".$index.",";
                        $target_sql .= ":tdbp_create_date".$index.",";
                        $target_sql .= ":tdbp_update_date".$index.",";
                        $target_sql .= ":tdbp_update_user".$index;
                        $target_sql .= "),";
                        $index = $index + 1;
        
                    }

                }

                $target_sql = rtrim($target_sql, ",");
                $sql = $sql.$target_sql;

                $sql .= <<<EOF
                    ON DUPLICATE KEY UPDATE
                    tdbp_user_id = VALUES(tdbp_user_id),
                    tdbp_business_id = VALUES(tdbp_business_id),
                    tdbp_business_possesion = VALUES(tdbp_business_possesion),
                    tdbp_update_date = VALUES(tdbp_update_date),
                    tdbp_update_user = VALUES(tdbp_update_user)
                EOF;  
                $stmt = $this->mysql->prepare($sql);

                $index = 0;
                foreach($business_data_ary as $key => $val){
                    
                    if($_POST['tdbp_business_possesion_'.$val['tmbc_business_id']] != 9){

                        $stmt->bindValue(":tdbp_user_id".$index , $this->vars['tmur_user_id']);//OPID
                        $stmt->bindValue(":tdbp_business_id".$index , $val['tmbc_business_id']);//業務番号
                        $stmt->bindValue(":tdbp_business_possesion".$index , $_POST['tdbp_business_possesion_'.$val['tmbc_business_id']] , PDO::PARAM_INT);//スキル保有
                        $stmt->bindValue(":tdbp_create_date".$index , date("Y-m-d H:i:s"));
                        $stmt->bindValue(":tdbp_update_date".$index , date("Y-m-d H:i:s"));
                        $stmt->bindValue(":tdbp_update_user".$index , $_SESSION['login_info']['id']);
                        $index = $index + 1;
        
                    }

                }
                //クエリ実行
                $execute = $stmt->execute();       

                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            }
            

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

    public function CALLBACK__get_all_business(){

        try{
            $sql = "SELECT tmbc_business_id , tmbc_business_name FROM tm_business_category ";
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $stmt->execute();   
            //結果保存用配列
            $business_ary = Array();
            $business_ary = $stmt->fetchAll();
            /*
            while($business = $stmt->fetch()){

                $business_ary[$business['tmbc_business_id']] = $business['tmbc_business_name'];
            }
            */
            echo json_encode($business_ary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }            

    }

    //ユーザー削除処理
    public function CALLBACK__user_delete(){
        //バリデート
        $this->validate('user/user_delete');

        //エラー時処理
		if($this->error->count() > 0){
            echo json_encode($this->error->get());
			exit();
        }

        try{

            //トランザクション開始
            $this->mysql->beginTransaction();            

            //クエリ文字列
            $sql = "DELETE FROM tm_user WHERE tmur_id  = :tmur_id";
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tmur_id" , $this->vars['tmur_id']);
            
            //クエリ実行
            $execute = $stmt->execute();       

            //トランザクションコミット
            $this->mysql->commit();
            echo json_encode("ok");

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function get_skill_possesion($tdsp_user_id){

        try{

            $sql = <<<EOF
                SELECT 
                    tmb.tmbc_business_id AS tmbc_business_id,
                    tmb.tmbc_business_name AS tmbc_business_name,
                    IFNULL(tsp.tdsp_skill_possesion,9) AS tdsp_skill_possesion
                FROM `tm_business_category` AS tmb
                LEFT OUTER JOIN 
                    (
                    SELECT 
                        tdsp_user_id,
                        tdsp_business_id,
                        tdsp_skill_possesion
                    FROM td_skill_possesion
                    WHERE tdsp_user_id = :tdsp_user_id
                    ) AS tsp 
                ON tsp.tdsp_business_id = tmb.tmbc_business_id
            EOF;
            
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdsp_user_id" , $tdsp_user_id);

            //クエリ実行
            $stmt->execute();    
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            $skill = $stmt->fetchAll();

            return $skill;
        
        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }            

    }

    public function get_business_possesion($tdbp_user_id){

        try{

            $sql = <<<EOF
                SELECT 
                    tmb.tmbc_business_id AS tmbc_business_id,
                    tmb.tmbc_business_name AS tmbc_business_name,
                    IFNULL(tsp.tdbp_business_possesion,9) AS tdbp_business_possesion
                FROM `tm_business_category` AS tmb
                LEFT OUTER JOIN 
                    (
                    SELECT 
                        tdbp_user_id,
                        tdbp_business_id,
                        tdbp_business_possesion
                    FROM td_business_possesion
                    WHERE tdbp_user_id = :tdbp_user_id
                    ) AS tsp 
                ON tsp.tdbp_business_id = tmb.tmbc_business_id
                ORDER BY tmb.tmbc_business_id
            EOF;
            
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbp_user_id" , $tdbp_user_id);

            //クエリ実行
            $stmt->execute();    
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            $skill = $stmt->fetchAll();

            return $skill;
        
        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }            

    }

    public function get_all_business(){

        try{
            $sql = "SELECT tmbc_business_id , tmbc_business_name FROM tm_business_category";
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $stmt->execute();    
            $business = $stmt->fetchAll();

            return $business;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }            


    }
    
}//end of class()

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

