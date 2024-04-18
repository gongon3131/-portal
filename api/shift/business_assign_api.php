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

    //業務別カラー情報取得アクション
    public function CALLBACK__business_summary(){

        //バリデート
        $this->validate('shift/business_assign');

        if($this->vars['showen_date'] == ""){
            echo json_encode("ng");
            exit();
        }

        try{
            $sql = <<<EOF
                SELECT
                tmu.tmur_user_id AS tdsb_user_id,
                tmu.tmur_user_name AS tmur_user_name,
                tmu.tmur_authority AS tmur_authority,
                IFNULL(cw1.tdsb_shift_date , "") AS tdsb_shift_date,
                IFNULL(cw1.tdsb_shift_hour , "") AS tdsb_shift_hour,
                IFNULL(cw1.tdsb_business_id , "") AS tdsb_business_id,
                IFNULL(cw1.tdsb_free_description , "") AS tdsb_free_description,
                IFNULL(cw1.tdsb_rest_flg , "") AS tdsb_rest_flg,
                IFNULL(cw1.tdsb_training_flg , "") AS tdsb_training_flg,
                IFNULL(cw1.tdsb_update_date , "") AS tdsb_update_date,
                IFNULL(cw1.tmbc_business_name , "") AS tmbc_business_name,
                IFNULL(cw1.tmbc_color_code , "") AS tmbc_color_code
                FROM tm_user AS tmu
                LEFT OUTER JOIN
                (
                    SELECT
                    tsb.tdsb_shift_date AS tdsb_shift_date,
                    tsb.tdsb_user_id AS tdsb_user_id,
                    tmu.tmur_user_name AS tmur_user_name,
                    tmu.tmur_authority AS tmur_authority,
                    tsb.tdsb_shift_hour AS tdsb_shift_hour,
                    tsb.tdsb_business_id AS tdsb_business_id,
                    IFNULL(tsb.tdsb_free_description , '') AS tdsb_free_description,
                    tsb.tdsb_rest_flg AS tdsb_rest_flg,
                    tsb.tdsb_training_flg AS tdsb_training_flg,
                    tsb.tdsb_update_date AS tdsb_update_date,
                    tbc.tmbc_business_name AS tmbc_business_name,
                    tbc.tmbc_color_code AS tmbc_color_code
                    FROM td_shift_business AS tsb
                    LEFT OUTER JOIN tm_business_category AS tbc
                    ON tsb.tdsb_business_id = tbc.tmbc_business_id
                    LEFT OUTER JOIN tm_user AS tmu
                    ON tsb.tdsb_user_id = tmu.tmur_user_id
                    WHERE tdsb_shift_date = :tdsb_shift_date
                )AS cw1
                ON cw1.tdsb_user_id = tmu.tmur_user_id
                
            EOF;
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tdsb_shift_date" , $this->vars['showen_date']);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //結果保存用配列
            $business_summary_ary = Array();
            $w_ary = Array();
            //全ユーザー取得
            //$all_user = $this->get_all_user();

            while($shift = $stmt->fetch()){
                //::log($shift['tdsb_user_id']);
                $w_ary['tdsb_user_id'] = $shift['tdsb_user_id'];
                $w_ary['tmur_user_name'] = $shift['tmur_user_name'];
                $w_ary['tmur_authority'] = $shift['tmur_authority'];
                $w_ary['tdsb_shift_hour'] = $shift['tdsb_shift_hour'];
                $w_ary['tdsb_business_id'] = $shift['tdsb_business_id'];
                $w_ary['tdsb_training_flg'] = $shift['tdsb_training_flg'];
                $w_ary['tdsb_update_date'] = $shift['tdsb_update_date'];
                $w_ary['tdsb_rest_flg'] = $shift['tdsb_rest_flg'];
                $w_ary['tdsb_free_description'] = $shift['tdsb_free_description'];
                $w_ary['tmbc_business_name'] = $shift['tmbc_business_name'];
                $w_ary['tmbc_color_code'] = $shift['tmbc_color_code'];
                $w_ary['business_enable_priority'] = $this->get_business_enable_priority($shift['tdsb_user_id']);
                
                $business_summary_ary[$shift['tdsb_user_id']][] = $w_ary;

            }

            $brank_ary['tdsb_user_id'] = "";
            $brank_ary['tmur_user_name'] = "";
            $brank_ary['tmur_authority'] = "";
            $brank_ary['tdsb_shift_hour'] = "";
            $brank_ary['tdsb_business_id'] = "";
            $brank_ary['tdsb_free_description'] = "";
            $brank_ary['tdsb_rest_flg'] = "";
            $brank_ary['tdsb_training_flg'] = ""; 
            $brank_ary['tdsb_update_date'] = ""; 
            $brank_ary['tmbc_business_name'] = "";
            $brank_ary['tmbc_color_code'] = "";
            $brank_ary['business_enable_priority'] = "";

            $all_user = $this->get_all_user();
            $chk_flg = 0;
            //ChromePhp::log($all_user);
            foreach($all_user as $key => $val){

                foreach($business_summary_ary as $key => $chk_user){
                    if($val['tmur_user_id'] == $key){
                        $chk_flg = 1;
                    }
                }

                if($chk_flg == 0){
                    $brank_ary['tdsb_user_id'] = $val['tmur_user_id'];
                    $brank_ary['tmur_user_name'] = $val['tmur_user_name'];
                    //ChromePhp::log($val['tmur_user_id']);
                    //ChromePhp::log($this->get_business_enable_priority($shift['tdsb_user_id']));
                    $brank_ary['business_enable_priority'] = "";
                    $business_summary_ary[$val['tmur_user_id']][] = $brank_ary;
                }
                $chk_flg = 0;
            }            

            $color_info = $this->count_color($this->vars['showen_date']);
            $business_summary_ary['color_info'] = $color_info;

            echo json_encode($business_summary_ary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    //SVの優先業務取得
    function get_business_enable_priority($tdbp_user_id){

        try{

            $sql = "SELECT tdbp_business_id,tdbp_business_possesion FROM td_business_possesion WHERE tdbp_user_id = :tdbp_user_id AND tdbp_business_possesion = 0";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbp_user_id" , $tdbp_user_id);

            //クエリ実行
            $execute = $stmt->execute();
            $result = $stmt->fetchAll();
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            if($row_count == 1){
                return $result[0]['tdbp_business_id'];

            }else{
                return "";
            }


        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

    public function count_color($tdsb_shift_date){

        try{
            $sql = <<<EOF
                SELECT
                tdsb_shift_date,
                tdsb_user_id,
                tmur_authority,
                tdsb_shift_hour,
                tdsb_business_id
                FROM td_shift_business
                LEFT OUTER JOIN tm_user
                ON tdsb_user_id = tmur_user_id
                WHERE tdsb_shift_date = :tdsb_shift_date
            EOF;
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tdsb_shift_date" , $tdsb_shift_date);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //結果保存用配列
            $business_summary_ary = Array();
            $w_ary = Array();
            $w_ary[0] = 0;
            $w_ary[1] = 0;
            $w_ary[2] = 0;
            $w_ary[3] = 0;
            $w_ary[4] = 0;
            $w_ary[5] = 0;
            $w_ary[6] = 0;
            $w_ary[7] = 0;
            $w_ary[8] = 0;
            $w_ary[9] = 0;
            $w_ary[10] = 0;
            $w_ary[11] = 0;
            $w_ary[12] = 0;
            $w_ary[13] = 0;
            $w_ary[14] = 0;
            $w_ary[15] = 0;
            $w_ary[16] = 0;
            $w_ary[17] = 0;
            $w_ary[18] = 0;
            $w_ary[19] = 0;
            $w_ary[20] = 0;
            $w_ary[21] = 0;
            $w_ary[22] = 0;
            $w_ary[23] = 0;


            //全業務情報取得
            $all_business = $this->get_all_business_category();
            foreach($all_business as $key => $val){
                //ChromePhp::log();
                $business_summary_ary[$val['tmbc_business_id']] = $w_ary;
            }


            while($color = $stmt->fetch()){
                if($color['tmur_authority'] == 1 && $color['tdsb_business_id'] > 0){
                    $business_summary_ary[$color['tdsb_business_id']][$color['tdsb_shift_hour']] = $business_summary_ary[$color['tdsb_business_id']][$color['tdsb_shift_hour']] + 1;
                }
            }        

            //ChromePhp::log($business_summary_ary);
            return $business_summary_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

    public function get_all_business_category(){

        try{
            $sql = "SELECT tmbc_business_id FROM tm_business_category";
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            $business_ct = $stmt->fetchAll();

            return $business_ct;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

    //業務カテゴリーマスタ情報取得アクション
    public function CALLBACK__get_business_color(){

        try{

            $sql = <<<EOF
                SELECT
                    tmbc_business_id,
                    tmbc_business_name,
                    tmbc_color_code,
                    tmbc_import_class,
                    IFNULL(tmbc_prefix,'') AS tmbc_prefix,
                    IFNULL(tmbc_memo,'') AS tmbc_memo
                FROM tm_business_category
            EOF;
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $business_ct = $stmt->fetchAll();

            echo json_encode($business_ct);
            
        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__business_category_regist(){

        //バリデート
        $this->validate('shift/business_category_regist');

        //トークン
        if(isset($this->vars['token']) == false || $this->vars['token'] !== $_SESSION['csrf_token'] ){
            echo json_encode("token_ng");
            exit();
        }

        //エラーメッセージ取得
        $err_ary = $this->error->get();

        //エラー時処理
        if($this->error->count() > 0){
            echo json_encode($err_ary);
            exit();  
        }   

        try{

            //トランザクション開始
            $this->mysql->beginTransaction();            

            $sql = <<<EOF
                INSERT INTO tm_business_category
                (
                    tmbc_business_id,
                    tmbc_business_name,
                    tmbc_color_code,
                    tmbc_import_class,
                    tmbc_prefix,
                    tmbc_memo,
                    tmbc_create_date,
                    tmbc_update_date,
                    tmbc_update_user
                )
                VALUES
                (
                    :tmbc_business_id,
                    :tmbc_business_name,
                    :tmbc_color_code,
                    :tmbc_import_class,
                    :tmbc_prefix,
                    :tmbc_memo,
                    :tmbc_create_date,
                    :tmbc_update_date,
                    :tmbc_update_user
                )
                ON DUPLICATE KEY UPDATE
                tmbc_business_id = :tmbc_business_id,
                tmbc_business_name = :tmbc_business_name,
                tmbc_color_code = :tmbc_color_code,
                tmbc_import_class = :tmbc_import_class,
                tmbc_prefix = :tmbc_prefix,
                tmbc_memo = :tmbc_memo,
                tmbc_update_date = :tmbc_update_date,
                tmbc_update_user = :tmbc_update_user
            EOF;  
             
            $stmt = $this->mysql->prepare($sql);

            $today = date("Y-m-d H:i:s");
            $user_id = $_SESSION['login_info']['user_id'];

            $stmt->bindValue(":tmbc_business_id" , $this->vars['tmbc_business_id'] , PDO::PARAM_INT);//
            $stmt->bindValue(":tmbc_business_name" , $this->vars['tmbc_business_name']);//
            $stmt->bindValue(":tmbc_color_code" , $this->vars['tmbc_color_code']);//
            $stmt->bindValue(":tmbc_import_class" , $this->vars['tmbc_import_class'] , PDO::PARAM_INT);//
            $stmt->bindValue(":tmbc_prefix" , $this->vars['tmbc_prefix']);//
            $stmt->bindValue(":tmbc_memo" , $this->vars['tmbc_memo']);//
            $stmt->bindValue(":tmbc_create_date" , $today);
            $stmt->bindValue(":tmbc_update_date" , $today);
            $stmt->bindValue(":tmbc_update_user" , $user_id);

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

    public function CALLBACK__business_color_regist(){

        //バリデート
        $this->validate('shift/business_color_regist');

        //トークン
        if(isset($this->vars['token']) == false || $this->vars['token'] !== $_SESSION['csrf_token'] ){
            echo json_encode("token_ng");
            exit();
        }

        $json = $_POST['business_assign_ary'];
        //POSTされたjsonを配列に変換
        $shift_data_ary = json_decode($json,true);

        //エラーメッセージ取得
        $err_ary = $this->error->get();

        //エラー時処理
        if($this->error->count() > 0){
            echo json_encode($err_ary);
            exit();  
        }   

        try{

            foreach($shift_data_ary as $key => $val){
                //ChromePhp::log($val);  
                foreach($val as $key2 => $val2){
                    $sql = "  SELECT tdsb_update_date FROM td_shift_business WHERE tdsb_user_id = :tdsb_user_id AND tdsb_shift_date = :tdsb_shift_date AND tdsb_shift_hour = :tdsb_shift_hour";
                    $sql .= " AND tdsb_update_date = :tdsb_update_date";
                    $stmt = $this->mysql->prepare($sql);

                    $stmt->bindValue(":tdsb_user_id" , $val2['tdsb_user_id']);
                    $stmt->bindValue(":tdsb_shift_date" , $this->vars['tdbc_shift_date']);
                    $stmt->bindValue(":tdsb_shift_hour" , $val2['tdsb_shift_hour']);
                    $stmt->bindValue(":tdsb_update_date" , $val2['tdsb_update_date']);

                    //クエリ実行
                    $execute = $stmt->execute();
                    // DEBUG OUTPUT
                    //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
                    
                    $row_count = $stmt->rowCount();

                    if($row_count < 1){
                        echo json_encode("conflict_ng");
                        exit();
                    }
                }

            }

            //トランザクション開始
            $this->mysql->beginTransaction();        

            //対象日付
            $target_date = $this->vars['tdbc_shift_date'];

            $sql = "DELETE FROM td_shift_business WHERE tdsb_shift_date = :target_date";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindValue(":target_date" , $this->vars['tdbc_shift_date']);//シフト年月日

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  

            $sql = <<<EOF
                INSERT INTO td_shift_business
                (
                    tdsb_shift_date,
                    tdsb_user_id,
                    tdsb_shift_hour,
                    tdsb_business_id,
                    tdsb_free_description,
                    tdsb_rest_flg,
                    tdsb_training_flg,  
                    tdsb_create_date,
                    tdsb_update_date,
                    tdsb_update_user
                )
                VALUES
            EOF;  

            $target_sql = "";
            
            $index = 0;

            foreach($shift_data_ary as $target_userid => $val){
                foreach($val as $key => $color_ary){
                    //ChromePhp::log($target_date); 
                    //$date_userid = date('Ymd',  $target_date);
                    if($color_ary['tdsb_shift_hour'] == "" || $color_ary['tdsb_business_id'] == ""){
                        if($color_ary['tdsb_rest_flg'] == 0){
                            break;
                        }
                    }

                    $target_sql .= "(";
                    $target_sql .= ":tdsb_shift_date".$index.",";
                    $target_sql .= ":tdsb_user_id".$index.",";
                    $target_sql .= ":tdsb_shift_hour".$index.",";
                    $target_sql .= ":tdsb_business_id".$index.",";
                    $target_sql .= ":tdsb_free_description".$index.",";
                    $target_sql .= ":tdsb_rest_flg".$index.",";
                    $target_sql .= ":tdsb_training_flg".$index.",";
                    $target_sql .= ":tdsb_create_date".$index.",";
                    $target_sql .= ":tdsb_update_date".$index.",";
                    $target_sql .= ":tdsb_update_user".$index;
                    $target_sql .= "),";
                    $index = $index + 1;
                }
            }

            $target_sql = rtrim($target_sql, ",");
            $sql = $sql.$target_sql;

            $stmt = $this->mysql->prepare($sql);

            $index = 0;

            foreach($shift_data_ary as $target_userid => $val){
                foreach($val as $key => $color_ary){
                    //ChromePhp::log($color_ary);
                    //$tdsb_shift_date = $this->h($color_ary['tdsb_shift_date']);
                    if($color_ary['tdsb_shift_hour'] == "" || $color_ary['tdsb_business_id'] == ""){
                        if($color_ary['tdsb_rest_flg'] == 0){
                            break;
                        }
                    }
                    
                    $tdsb_user_id = $this->h($color_ary['tdsb_user_id']);
                    $tdsb_shift_hour = $this->h($color_ary['tdsb_shift_hour']);
                    $tdsb_business_id = $this->h($color_ary['tdsb_business_id']);
                    $tdsb_free_description = $this->h($color_ary['tdsb_free_description']);
                    $tdsb_rest_flg = $this->h($color_ary['tdsb_rest_flg']);
                    $tdsb_training_flg = $this->h($color_ary['tdsb_training_flg']);                    
                    $today = date("Y-m-d H:i:s");
                    $user_id = $_SESSION['login_info']['user_id'];

                    $stmt->bindValue(":tdsb_shift_date".$index , $this->vars['tdbc_shift_date']);//シフト年月日
                    $stmt->bindValue(":tdsb_user_id".$index , $tdsb_user_id);//OPID
                    $stmt->bindValue(":tdsb_shift_hour".$index , $tdsb_shift_hour , PDO::PARAM_INT);//シフト時間帯
                    $stmt->bindValue(":tdsb_business_id".$index , $tdsb_business_id , PDO::PARAM_INT);//業務番号
                    $stmt->bindValue(":tdsb_free_description".$index , $tdsb_free_description);//自由記述欄
                    $stmt->bindValue(":tdsb_rest_flg".$index , $tdsb_rest_flg , PDO::PARAM_INT);//休憩フラグ
                    $stmt->bindValue(":tdsb_training_flg".$index , $tdsb_training_flg , PDO::PARAM_INT);//研修フラグ                 
                    $stmt->bindValue(":tdsb_create_date".$index , $today);
                    $stmt->bindValue(":tdsb_update_date".$index , $today);
                    $stmt->bindValue(":tdsb_update_user".$index , $user_id);
                    $index = $index + 1;
                }
            }

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
            
            //トランザクションコミット
            $this->mysql->commit();
            echo json_encode("ok");


/*

            $sql = <<<EOF
                INSERT INTO td_shift_business
                (
                    tdsb_shift_date,
                    tdsb_user_id,
                    tdsb_shift_hour,
                    tdsb_business_id,
                    tdsb_free_description,
                    tdsb_rest_flg,
                    tdsb_training_flg,  
                    tdsb_create_date,
                    tdsb_update_date,
                    tdsb_update_user
                )
                VALUES
            EOF;  
            
            $target_sql = "";
            
            $index = 0;

            foreach($shift_data_ary as $target_userid => $val){
                foreach($val as $key => $color_ary){
                    //ChromePhp::log($target_date); 
                    //$date_userid = date('Ymd',  $target_date);
                    if($color_ary['tdsb_shift_hour'] == "" || $color_ary['tdsb_business_id'] == ""){
                        if($color_ary['tdsb_rest_flg'] == 0){
                            break;
                        }
                    }

                    $target_sql .= "(";
                    $target_sql .= ":tdsb_shift_date".$index.",";
                    $target_sql .= ":tdsb_user_id".$index.",";
                    $target_sql .= ":tdsb_shift_hour".$index.",";
                    $target_sql .= ":tdsb_business_id".$index.",";
                    $target_sql .= ":tdsb_free_description".$index.",";
                    $target_sql .= ":tdsb_rest_flg".$index.",";
                    $target_sql .= ":tdsb_training_flg".$index.",";
                    $target_sql .= ":tdsb_create_date".$index.",";
                    $target_sql .= ":tdsb_update_date".$index.",";
                    $target_sql .= ":tdsb_update_user".$index;
                    $target_sql .= "),";
                    $index = $index + 1;
                }
            }
            $target_sql = rtrim($target_sql, ",");
            $sql = $sql.$target_sql;

            $sql .= <<<EOF
                ON DUPLICATE KEY UPDATE
                tdsb_shift_date = VALUES(tdsb_shift_date),
                tdsb_user_id = VALUES(tdsb_user_id),
                tdsb_shift_hour = VALUES(tdsb_shift_hour),
                tdsb_business_id = VALUES(tdsb_business_id),
                tdsb_free_description = VALUES(tdsb_free_description),
                tdsb_rest_flg = VALUES(tdsb_rest_flg),
                tdsb_training_flg = VALUES(tdsb_training_flg),
                tdsb_update_date = VALUES(tdsb_update_date),
                tdsb_update_user = VALUES(tdsb_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            $index = 0;

            foreach($shift_data_ary as $target_userid => $val){
                foreach($val as $key => $color_ary){
                    //ChromePhp::log($color_ary);
                    //$tdsb_shift_date = $this->h($color_ary['tdsb_shift_date']);
                    if($color_ary['tdsb_shift_hour'] == "" || $color_ary['tdsb_business_id'] == ""){
                        if($color_ary['tdsb_rest_flg'] == 0){
                            break;
                        }
                    }
                    
                    $tdsb_user_id = $this->h($color_ary['tdsb_user_id']);
                    $tdsb_shift_hour = $this->h($color_ary['tdsb_shift_hour']);
                    $tdsb_business_id = $this->h($color_ary['tdsb_business_id']);
                    $tdsb_free_description = $this->h($color_ary['tdsb_free_description']);
                    $tdsb_rest_flg = $this->h($color_ary['tdsb_rest_flg']);
                    $tdsb_training_flg = $this->h($color_ary['tdsb_training_flg']);                    
                    $today = date("Y-m-d H:i:s");
                    $user_id = $_SESSION['login_info']['user_id'];

                    $stmt->bindValue(":tdsb_shift_date".$index , $this->vars['tdbc_shift_date']);//シフト年月日
                    $stmt->bindValue(":tdsb_user_id".$index , $tdsb_user_id);//OPID
                    $stmt->bindValue(":tdsb_shift_hour".$index , $tdsb_shift_hour , PDO::PARAM_INT);//シフト時間帯
                    $stmt->bindValue(":tdsb_business_id".$index , $tdsb_business_id , PDO::PARAM_INT);//業務番号
                    $stmt->bindValue(":tdsb_free_description".$index , $tdsb_free_description);//自由記述欄
                    $stmt->bindValue(":tdsb_rest_flg".$index , $tdsb_rest_flg , PDO::PARAM_INT);//休憩フラグ
                    $stmt->bindValue(":tdsb_training_flg".$index , $tdsb_training_flg , PDO::PARAM_INT);//研修フラグ                 
                    $stmt->bindValue(":tdsb_create_date".$index , $today);
                    $stmt->bindValue(":tdsb_update_date".$index , $today);
                    $stmt->bindValue(":tdsb_update_user".$index , $user_id);
                    $index = $index + 1;
                }
            }

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
            
            //トランザクションコミット
            $this->mysql->commit();
            echo json_encode("ok");
*/
        } catch(Exception $e) {
            //ロールバック
            $this->mysql->rollback();
            ChromePhp::log($e);
            echo json_encode("ng");
        }
        
    }

    function get_all_user(){

        try{
            $sql = <<<EOF
                SELECT
                tmur_id,
                tmur_user_id,
                tmur_user_name
                FROM tm_user
                WHERE tmur_authority = 1 OR tmur_authority = 2
                AND tmur_is_used = 1
            EOF;
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            $all_user_ary = $stmt->fetchAll();

            return $all_user_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }


}//end of class()

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

