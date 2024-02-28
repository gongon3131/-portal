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

    public function CALLBACK__summary_by_timezone(){

        //バリデート
        $this->validate('shift/summary_by_timezone');

        //集計期間開始日
        $date_sta = $this->vars['date_sta'];
        $roop_date_sta = new Datetime($this->vars['date_sta']);
        //集計期間終了日
        $date_end = $this->vars['date_end'];
        $roop_date_end = new Datetime($this->vars['date_end']);
    

        try{

            $total_shift_summary = Array();

            while ($roop_date_sta <= $roop_date_end) {

                $current_date =  $roop_date_sta->format('Y-m-d');

                $sql = <<<EOF
                    SELECT
                    tdbc_user_id,
                    tdbc_shift_date,
                    tdbc_start_time_first,
                    tdbc_end_time_first,
                    tdbc_start_time_second,
                    tdbc_end_time_second,
                    tdbc_holiday_flg,
                    tdbc_paid_holiday_flg,
                    tdbc_midnight_flg,
                    tdbc_memo,
                    tdbc_release_flg
                    FROM td_before_confirm_shift
                    WHERE tdbc_shift_date = :current_date
                    AND tdbc_release_flg = 1
                EOF;

                $stmt = $this->mysql->prepare($sql);
                $stmt->bindParam(":current_date" , $current_date);

                //クエリ実行
                $execute = $stmt->execute();
                $shift_summary = $stmt->fetchAll();
                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
                

                //当該日の集計人数を保存する配列
                $summary_date_ary = Array();
                $summary_date_ary[0] = 0;
                $summary_date_ary[1] = 0;
                $summary_date_ary[2] = 0;
                $summary_date_ary[3] = 0;
                $summary_date_ary[4] = 0;
                $summary_date_ary[5] = 0;
                $summary_date_ary[6] = 0;
                $summary_date_ary[7] = 0;
                $summary_date_ary[8] = 0;
                $summary_date_ary[9] = 0;
                $summary_date_ary[10] = 0;
                $summary_date_ary[11] = 0;
                $summary_date_ary[12] = 0;
                $summary_date_ary[13] = 0;
                $summary_date_ary[14] = 0;
                $summary_date_ary[15] = 0;
                $summary_date_ary[16] = 0;
                $summary_date_ary[17] = 0;
                $summary_date_ary[18] = 0;
                $summary_date_ary[19] = 0;
                $summary_date_ary[20] = 0;
                $summary_date_ary[21] = 0;
                $summary_date_ary[22] = 0;
                $summary_date_ary[23] = 0;

                foreach($shift_summary as $key => $val){

                    //第1区間開始時刻
                    $first_hour_sta = "";
                    if(mb_strlen($val['tdbc_start_time_first']) == 4){
                        $first_hour_sta = mb_substr($val['tdbc_start_time_first'],0,2);
                        $first_hour_sta = (int)$first_hour_sta;
                    }

                    //第1区間終了時刻
                    $first_hour_end = "";
                    $first_min_end = "";
                    if(mb_strlen($val['tdbc_start_time_first']) == 4){
                        $first_hour_end = mb_substr($val['tdbc_end_time_first'],0,2);
                        $first_hour_end = (int)$first_hour_end;
                    }

                    //第1区間の集計
                    for($i = $first_hour_sta; $i < $first_hour_end; $i++){
                        $summary_date_ary[$i] = $summary_date_ary[$i] + 1;
                    }

                    //第2区間開始時刻
                    $second_hour_sta = "";
                    if(mb_strlen($val['tdbc_start_time_second']) == 4){
                        $second_hour_sta = mb_substr($val['tdbc_start_time_second'],0,2);
                        $second_hour_sta = (int)$second_hour_sta;
                    }

                    //第2区間終了時刻
                    $second_hour_end = "";
                    $second_min_end = "";
                    if(mb_strlen($val['tdbc_end_time_second']) == 4){
                        $second_hour_end = mb_substr($val['tdbc_end_time_second'],0,2);
                        $second_hour_end = (int)$second_hour_end;
                    }

                    //第2区間の集計
                    for($i = $second_hour_sta; $i < $second_hour_end; $i++){
                        $summary_date_ary[$i] = $summary_date_ary[$i] + 1;
                    }

                }//end of foreach()

                $total_shift_summary[$current_date] = $summary_date_ary;

                $roop_date_sta->modify('+1 day');

            }// end of while()

            //ChromePhp::log($total_shift_summary);
            echo json_encode($total_shift_summary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }//end of class

    public function CALLBACK__summary_by_date(){

        //バリデート
        $this->validate('shift/summary_by_date');

        try{
            $sql = <<<EOF
                SELECT
                cw1.tmur_user_id AS tdbc_user_id,
                cw1.tmur_user_name AS tmur_user_name,
                IFNULL(cw2.tdbc_shift_date,"") AS tdbc_shift_date,
                IFNULL(cw2.tdbc_start_time_first,"") AS tdbc_start_time_first,
                IFNULL(cw2.tdbc_end_time_first,"") AS tdbc_end_time_first,
                IFNULL(cw2.tdbc_start_time_second,"") AS tdbc_start_time_second,
                IFNULL(cw2.tdbc_end_time_second,"") AS tdbc_end_time_second,
                IFNULL(cw2.tdbc_holiday_flg,0) AS tdbc_holiday_flg,
                IFNULL(cw2.tdbc_paid_holiday_flg,0) AS tdbc_paid_holiday_flg,
                IFNULL(cw2.tdbc_midnight_flg,0) AS tdbc_midnight_flg,
                IFNULL(cw2.tdbc_memo,"") AS tdbc_memo
                FROM 
                (
                    SELECT
                    tmur_id,
                    tmur_user_id,
                    tmur_user_name
                    FROM tm_user
                    WHERE tmur_authority = 1
                    AND tmur_is_used = 1
                ) AS cw1
                LEFT OUTER JOIN
                (
                    SELECT
                    tbc.tdbc_user_id AS tdbc_user_id,
                    tmu.tmur_user_name AS tmur_user_name,
                    tbc.tdbc_shift_date AS tdbc_shift_date,
                    tbc.tdbc_start_time_first AS tdbc_start_time_first,
                    tbc.tdbc_end_time_first AS tdbc_end_time_first,
                    tbc.tdbc_start_time_second AS tdbc_start_time_second,
                    tbc.tdbc_end_time_second AS tdbc_end_time_second,
                    tbc.tdbc_holiday_flg AS tdbc_holiday_flg,
                    tbc.tdbc_paid_holiday_flg AS tdbc_paid_holiday_flg,
                    tbc.tdbc_midnight_flg AS tdbc_midnight_flg,
                    tbc.tdbc_memo AS tdbc_memo
                    FROM td_before_confirm_shift AS tbc
                    LEFT OUTER JOIN tm_user AS tmu
                    ON tbc.tdbc_user_id = tmu.tmur_user_id
                    WHERE tbc.tdbc_shift_date = :showen_date
                    AND tbc.tdbc_release_flg = 1
                )AS cw2
                ON cw1.tmur_user_id = cw2.tdbc_user_id
                ORDER BY CAST(cw1.tmur_user_id AS SIGNED) ASC
            EOF;
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":showen_date" , $this->vars['showen_date']);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //結果保存用配列
            $shift_data_ary = Array();
            $by_date_ary = Array();

            while($shift = $stmt->fetch()){
                //前日夜勤チェック
                $shift['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($shift['tdbc_shift_date'],$shift['tdbc_user_id']);
                //ユーザータイプ（1固定）
                $shift['user_type'] = 1;
                //担当可能業務情報（一般OPは固定でブランクを保存）
                $shift['business_enable_priority'] = "";

                $by_date_ary[$shift['tdbc_user_id']] = $shift;
            }

            $brank_ary['tdbc_user_id'] = "";
            $brank_ary['tmur_user_name'] = "";
            $brank_ary['tdbc_shift_date'] = "";
            $brank_ary['tdbc_start_time_first'] = "";
            $brank_ary['tdbc_end_time_first'] = "";
            $brank_ary['tdbc_start_time_second'] = "";
            $brank_ary['tdbc_end_time_second'] = "";
            $brank_ary['tdbc_holiday_flg'] = "";
            $brank_ary['tdbc_paid_holiday_flg'] = "";
            $brank_ary['tdbc_midnight_flg'] = "";
            $brank_ary['tdbc_memo'] = "";
            $brank_ary['yesterday_midnight_flg'] = "";
            $brank_ary['user_type'] = 1;
            $brank_ary['business_enable_priority'] = "";

            $all_user = $this->get_all_user();
            $chk_flg = 0;

            foreach($all_user as $key => $val){

                foreach($by_date_ary as $key => $chk_user){
                    if($val['tmur_user_id'] == $chk_user['tdbc_user_id']){
                        $chk_flg = 1;
                    }
                }

                if($chk_flg == 0){
                    $brank_ary['tdbc_user_id'] = $val['tmur_user_id'];
                    $brank_ary['tmur_user_name'] = $val['tmur_user_name'];
                    $brank_ary['tdbc_shift_date'] = $this->vars['showen_date'];
                    $brank_ary['business_enable_priority'] = "";

                    //前日夜勤フラグ
                    $brank_ary['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($this->vars['showen_date'],$val['tdbc_user_id']);
                    $by_date_ary[$val['tmur_user_id']] = $brank_ary;
                }
                $chk_flg = 0;
            }

            //SVシフト取得
            $sv_shift_ary = $this->get_sv_shift($this->vars['showen_date']);
            $total_shift_ary = array_merge($sv_shift_ary,$by_date_ary);

            $total_shift_ary2 = Array();
            foreach($total_shift_ary as $key => $val){
                $total_shift_ary2[$val['tdbc_user_id']] = $val;
            }
            //ChromePhp::log($total_shift_ary);
            uasort($total_shift_ary2 , function($x , $y){
                $key = 'user_type';
                $key2 = 'tdbc_user_id';
                //user_typeが2かどうか
                /*
                if($x[$key] == 2 && $y[$key] != 2) {
                    return -1;
                }
                if($x[$key] != 2 && $y[$key] == 2) {
                    return 1;
                }
                */
                /*
                if($x[$key] > $y[$key]) {
                    return -1;
                }
                if($x[$key] < $y[$key]) {
                    return 1;
                }
                */
                // bの降順
                /*
                if($x[$key2] > $y[$key2]) {
                    return 1;
                }
                else if($x[$key2] < $y[$key2]) {
                    return -1;
                }
                */
                return 0;                
                
                if ( $x[$key] == $y[$key] ) { return 0; }
                else if ( $x[$key] < $y[$key] ) { return -1; }
                else { return 1; }
                
            });

            /*
            $user_type_array = array_column($total_shift_ary, 'user_type');
            array_multisort($user_type_array, SORT_DESC, $total_shift_ary);
            */

            //ChromePhp::log($total_shift_ary);

            
            //ChromePhp::log($total_shift_ary2);
            echo json_encode($total_shift_ary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__summary_by_user(){

        //バリデート
        $this->validate('shift/summary_by_user');
        
        try{
            $sql = <<<EOF
                SELECT
                    tdbc_user_id,
                    tmur_user_name,
                    tdbc_shift_date,
                    tdbc_start_time_first,
                    tdbc_end_time_first,
                    tdbc_start_time_second,
                    tdbc_end_time_second,
                    tdbc_holiday_flg,
                    tdbc_paid_holiday_flg,
                    tdbc_midnight_flg,
                    tdbc_memo
                FROM td_before_confirm_shift
                LEFT OUTER JOIN tm_user
                ON tdbc_user_id = tmur_user_id
                WHERE tdbc_shift_date >= :section_sta
                AND tdbc_shift_date <= :section_end
                AND tdbc_user_id = :tmur_user_id
                AND tdbc_release_flg = 1
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $chk_date_ary = Array();

            $shift_detail = $stmt->fetchAll();

            foreach($shift_detail as $key => $data){
                //前日夜勤フラグ
                $shift_detail[$key]['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($data['tdbc_shift_date'],$data['tdbc_user_id']);
                $chk_date_ary[] = $data['tdbc_shift_date'];
            }

            $brank_ary['tdbc_user_id'] = $this->vars['tmur_user_id'];
            $brank_ary['tdbc_shift_date'] = "";
            $brank_ary['tdbc_start_time_first'] = "";
            $brank_ary['tdbc_end_time_first'] = "";
            $brank_ary['tdbc_start_time_second'] = "";
            $brank_ary['tdbc_end_time_second'] = "";
            $brank_ary['tdbc_holiday_flg'] = 0;
            $brank_ary['tdbc_paid_holiday_flg'] = 0;
            $brank_ary['tdbc_midnight_flg'] = 0;
            $brank_ary['tdbc_memo'] = "";
            $brank_ary['yesterday_midnight_flg'] = 0;

            $roop_start_date = new Datetime($this->vars['section_sta']);
            $start_date_origin = $roop_start_date;
            $roop_end_date = new Datetime($this->vars['section_end']);

            $chk_flg = 0;

            while ($roop_start_date <= $roop_end_date) {
                $current_date =  $roop_start_date->format('Y-m-d');

                foreach($chk_date_ary as $key => $chk_date){
                    if($current_date == $chk_date){
                        $chk_flg = 1;
                    }
                }

                if($chk_flg == 0){
                    $brank_ary['tdbc_shift_date'] = $current_date;
                    //前日夜勤フラグ
                    //$brank_ary['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($current_date,$this->vars['tmur_user_id']);
                    $shift_detail[] = $brank_ary;
                 }

                $roop_start_date->modify('+1 day');
                $chk_flg = 0;
            }

            foreach($shift_detail as $key => $data){
                //公開非公開フラグ
                $shift_detail[$key]['confirm_flg'] = $this->chk_after_confirm($data['tdbc_user_id'],$data['tdbc_shift_date']);
            }

            $ageArray = array_column($shift_detail, 'tdbc_shift_date');
            array_multisort($ageArray, SORT_ASC, $shift_detail);

            //ChromePhp::log($shift_detail);
            echo json_encode($shift_detail);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__tsr_shift_regist_by_user(){

        //バリデート
        $this->validate('shift/tsr_shift_regist_by_user');

        //トークン
        if(isset($this->vars['token']) == false || $this->vars['token'] !== $_SESSION['csrf_token'] ){
            echo json_encode("ng");
            exit();
        }

        $json = $_POST['shift_data_ary'];
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

            //トランザクション開始
            $this->mysql->beginTransaction();            

            $sql = <<<EOF
                INSERT INTO td_before_confirm_shift
                (
                    tdbc_user_id,
                    tdbc_shift_date,
                    tdbc_start_time_first,
                    tdbc_end_time_first,
                    tdbc_start_time_second,
                    tdbc_end_time_second,
                    tdbc_holiday_flg,
                    tdbc_paid_holiday_flg,
                    tdbc_midnight_flg,
                    tdbc_release_flg,
                    tdbc_memo,
                    tdbc_create_date,
                    tdbc_update_date,
                    tdbc_update_user
                )
                VALUES
            EOF;  
            
            $target_sql = "";

            //foreach($shift_data_ary as $target_date => $val){
            foreach($shift_data_ary as $key => $val){
                $date_key = date('Ymd',  strtotime($val['tdbc_shift_date']));
                $target_sql .= "(";
                $target_sql .= ":tdbc_user_id".$date_key.",";
                $target_sql .= ":tdbc_shift_date".$date_key.",";
                $target_sql .= ":tdbc_start_time_first".$date_key.",";
                $target_sql .= ":tdbc_end_time_first".$date_key.",";
                $target_sql .= ":tdbc_start_time_second".$date_key.",";
                $target_sql .= ":tdbc_end_time_second".$date_key.",";
                $target_sql .= ":tdbc_holiday_flg".$date_key.",";
                $target_sql .= ":tdbc_paid_holiday_flg".$date_key.",";
                $target_sql .= ":tdbc_midnight_flg".$date_key.",";
                //$target_sql .= "1,";
                $target_sql .= ":tdbc_release_flg".$date_key.",";
                $target_sql .= ":tdbc_memo".$date_key.",";
                $target_sql .= ":tdbc_create_date".$date_key.",";
                $target_sql .= ":tdbc_update_date".$date_key.",";
                $target_sql .= ":tdbc_update_user".$date_key;
                $target_sql .= "),";

            }
            $target_sql = rtrim($target_sql, ",");
            $sql = $sql.$target_sql;

            $sql .= <<<EOF
                ON DUPLICATE KEY UPDATE
                tdbc_start_time_first = VALUES(tdbc_start_time_first),
                tdbc_end_time_first = VALUES(tdbc_end_time_first),
                tdbc_start_time_second = VALUES(tdbc_start_time_second),
                tdbc_end_time_second = VALUES(tdbc_end_time_second),
                tdbc_holiday_flg = VALUES(tdbc_holiday_flg),
                tdbc_paid_holiday_flg = VALUES(tdbc_paid_holiday_flg),
                tdbc_midnight_flg = VALUES(tdbc_midnight_flg),
                tdbc_memo = VALUES(tdbc_memo),
                tdbc_release_flg = VALUES(tdbc_release_flg),
                tdbc_update_date = VALUES(tdbc_update_date),
                tdbc_update_user = VALUES(tdbc_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            //foreach($shift_data_ary as $target_date => $val){
            foreach($shift_data_ary as $key => $val){
                //ChromePhp::log($val); 
                $tdbc_release_flg = 1;
                //シフト情報すべてブランクで来たときは、非公開扱いとする
                if($val['tdbc_start_time_first'] == "" && $val['tdbc_end_time_first'] == "" && $val['tdbc_holiday_flg'] == 0 && $val['tdbc_paid_holiday_flg'] == 0 && $val['tdbc_midnight_flg'] == ""){
                    $tdbc_release_flg = 0;
                }

                $date_key = date('Ymd',  strtotime($val['tdbc_shift_date']));
                $tdbc_start_time_first = $this->h($val['tdbc_start_time_first']);
                $tdbc_end_time_first = $this->h($val['tdbc_end_time_first']);
                $tdbc_start_time_second = $this->h($val['tdbc_start_time_second']);
                $tdbc_end_time_second = $this->h($val['tdbc_end_time_second']);
                $tdbc_holiday_flg = $this->h($val['tdbc_holiday_flg']);
                $tdbc_paid_holiday_flg = $this->h($val['tdbc_paid_holiday_flg']);
                $tdbc_midnight_flg = $this->h($val['tdbc_midnight_flg']);
                $tdbc_memo = $this->h($val['tdbc_memo']);
                $today = date("Y-m-d H:i:s");
                $user_id = $_SESSION['login_info']['user_id'];

                $stmt->bindValue(":tdbc_user_id".$date_key , $this->vars['tmur_user_id']);//
                $stmt->bindValue(":tdbc_shift_date".$date_key , $val['tdbc_shift_date']);//
                $stmt->bindValue(":tdbc_start_time_first".$date_key , $tdbc_start_time_first);//
                $stmt->bindValue(":tdbc_end_time_first".$date_key , $tdbc_end_time_first);//
                $stmt->bindValue(":tdbc_start_time_second".$date_key , $tdbc_start_time_second);//
                $stmt->bindValue(":tdbc_end_time_second".$date_key , $tdbc_end_time_second);//
                $stmt->bindValue(":tdbc_holiday_flg".$date_key , $tdbc_holiday_flg , PDO::PARAM_INT);//
                $stmt->bindValue(":tdbc_paid_holiday_flg".$date_key , $tdbc_paid_holiday_flg , PDO::PARAM_INT);//
                $stmt->bindValue(":tdbc_midnight_flg".$date_key , $tdbc_midnight_flg , PDO::PARAM_INT);//
                $stmt->bindValue(":tdbc_release_flg".$date_key , $tdbc_release_flg , PDO::PARAM_INT);//
                $stmt->bindValue(":tdbc_memo".$date_key , $tdbc_memo);//
                $stmt->bindValue(":tdbc_create_date".$date_key , $today);
                $stmt->bindValue(":tdbc_update_date".$date_key , $today);
                $stmt->bindValue(":tdbc_update_user".$date_key , $user_id);
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

    public function CALLBACK__tsr_shift_regist_by_date(){

        //バリデート
        $this->validate('shift/tsr_shift_regist_by_date');

        //トークン
        if(isset($this->vars['token']) == false || $this->vars['token'] !== $_SESSION['csrf_token'] ){
            echo json_encode("ng");
            exit();
        }

        $json = $_POST['shift_data_ary'];
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

            //トランザクション開始
            $this->mysql->beginTransaction();   
            
            /**********一般OPのシフト登録 **********/

            $sql = <<<EOF
                INSERT INTO td_before_confirm_shift
                (
                    tdbc_user_id,
                    tdbc_shift_date,
                    tdbc_start_time_first,
                    tdbc_end_time_first,
                    tdbc_start_time_second,
                    tdbc_end_time_second,
                    tdbc_holiday_flg,
                    tdbc_paid_holiday_flg,
                    tdbc_midnight_flg,
                    tdbc_memo,
                    tdbc_release_flg,
                    tdbc_create_date,
                    tdbc_update_date,
                    tdbc_update_user
                )
                VALUES
            EOF;  
            
            $target_sql = "";

            foreach($shift_data_ary as $key => $val){
            //foreach($shift_data_ary as $key => $val){
                //ChromePhp::log($target_date); 
                //$date_userid = date('Ymd',  $target_date);
                if($val['user_type'] == 1){
                    $target_sql .= "(";
                    $target_sql .= ":tdbc_user_id".$key.",";
                    $target_sql .= ":tdbc_shift_date".$key.",";
                    $target_sql .= ":tdbc_start_time_first".$key.",";
                    $target_sql .= ":tdbc_end_time_first".$key.",";
                    $target_sql .= ":tdbc_start_time_second".$key.",";
                    $target_sql .= ":tdbc_end_time_second".$key.",";
                    $target_sql .= ":tdbc_holiday_flg".$key.",";
                    $target_sql .= ":tdbc_paid_holiday_flg".$key.",";
                    $target_sql .= ":tdbc_midnight_flg".$key.",";
                    $target_sql .= ":tdbc_memo".$key.",";
                    $target_sql .= "1,";
                    $target_sql .= ":tdbc_create_date".$key.",";
                    $target_sql .= ":tdbc_update_date".$key.",";
                    $target_sql .= ":tdbc_update_user".$key;
                    $target_sql .= "),";
                }

            }
            $target_sql = rtrim($target_sql, ",");
            $sql = $sql.$target_sql;

            $sql .= <<<EOF
                ON DUPLICATE KEY UPDATE
                tdbc_start_time_first = VALUES(tdbc_start_time_first),
                tdbc_end_time_first = VALUES(tdbc_end_time_first),
                tdbc_start_time_second = VALUES(tdbc_start_time_second),
                tdbc_end_time_second = VALUES(tdbc_end_time_second),
                tdbc_holiday_flg = VALUES(tdbc_holiday_flg),
                tdbc_paid_holiday_flg = VALUES(tdbc_paid_holiday_flg),
                tdbc_midnight_flg = VALUES(tdbc_midnight_flg),
                tdbc_memo = VALUES(tdbc_memo),
                tdbc_update_date = VALUES(tdbc_update_date),
                tdbc_update_user = VALUES(tdbc_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            foreach($shift_data_ary as $key => $val){
            //foreach($shift_data_ary as $key => $val){
                //$date_key = date('Ymd',  $target_date);

                if($val['user_type'] == 1){
                    
                    $tdbs_user_id = $this->h($val['tdbc_user_id']);
                    $tdbc_start_time_first = $this->h($val['tdbc_start_time_first']);
                    $tdbc_end_time_first = $this->h($val['tdbc_end_time_first']);
                    $tdbc_start_time_second = $this->h($val['tdbc_start_time_second']);
                    $tdbc_end_time_second = $this->h($val['tdbc_end_time_second']);
                    $tdbc_holiday_flg = $this->h($val['tdbc_holiday_flg']);
                    $tdbc_paid_holiday_flg = $this->h($val['tdbc_paid_holiday_flg']);
                    $tdbc_midnight_flg = $this->h($val['tdbc_midnight_flg']);
                    $tdbc_memo = $this->h($val['tdbc_memo']);
                    $today = date("Y-m-d H:i:s");
                    $user_id = $_SESSION['login_info']['user_id'];

                    $stmt->bindValue(":tdbc_user_id".$key , $tdbs_user_id);//OPID
                    $stmt->bindValue(":tdbc_shift_date".$key , $this->vars['tdbc_shift_date']);//シフト年月日
                    $stmt->bindValue(":tdbc_start_time_first".$key , $tdbc_start_time_first);//第1区間開始時刻
                    $stmt->bindValue(":tdbc_end_time_first".$key , $tdbc_end_time_first);//第1区間終了時刻
                    $stmt->bindValue(":tdbc_start_time_second".$key , $tdbc_start_time_second);//第2区間開始時刻
                    $stmt->bindValue(":tdbc_end_time_second".$key , $tdbc_end_time_second);//第2区間終了時刻
                    $stmt->bindValue(":tdbc_holiday_flg".$key , $tdbc_holiday_flg , PDO::PARAM_INT);//休日フラグ
                    $stmt->bindValue(":tdbc_paid_holiday_flg".$key , $tdbc_paid_holiday_flg , PDO::PARAM_INT);//有休フラグ
                    $stmt->bindValue(":tdbc_midnight_flg".$key , $tdbc_midnight_flg , PDO::PARAM_INT);//夜勤フラグ
                    $stmt->bindValue(":tdbc_memo".$key , $tdbc_memo);//メモ
                    $stmt->bindValue(":tdbc_create_date".$key , $today);
                    $stmt->bindValue(":tdbc_update_date".$key , $today);
                    $stmt->bindValue(":tdbc_update_user".$key , $user_id);
                }
            }

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  

            $total_target_delete_ary = Array();


            //シフト色付けの制御（シフト日付は固定されている）
            foreach($shift_data_ary as $key => $val){

                //まず当該OPのシフト色付け情報が存在しているかどうか
                $business_data = $this->is_shift_business_data($this->vars['tdbc_shift_date'],$val['tdbc_user_id']);
                //ChromePhp::log($business_data);  
                if($business_data == ""){
                    continue;
                }else{

                    //第1区間の開始時刻（時のみ）
                    $first_sta = (int)substr($val['tdbc_start_time_first'],0,2);
                    $first_end = (int)substr($val['tdbc_end_time_first'],0,2);
                    //第2区間の開始時刻（時のみ）
                    $second_sta = (int)substr($val['tdbc_start_time_second'],0,2);
                    $second_end = (int)substr($val['tdbc_end_time_second'],0,2);

                    //削除対象データ保存用配列
                    $target_delete_ary = Array();

                    foreach($business_data as $key2 => $val2){
                        $hit_flg = 0;
                
                        for($i = $first_sta; $i < $first_end; $i++){

                            if((int)$val2['tdsb_shift_hour'] == (int)$i){
                                $hit_flg = 1;
                            }

                        }

                        if($hit_flg == 0){
                            $target_delete_ary[] = $val2['tdsb_shift_hour'];
                        }

                    }

                    if(count($target_delete_ary) > 0){
                        $total_target_delete_ary[$val['tdbc_user_id']] = $target_delete_ary;
                    }

                }

            }

            //ChromePhp::log($total_target_delete_ary);

            /**********SVのシフト登録 **********/

            $sql = <<<EOF
                INSERT INTO td_before_confirm_shift_sv
                (
                    tdbs_user_id,
                    tdbs_shift_date,
                    tdbs_shift_time,
                    tdbs_fixed_flg,
                    tdbs_free_descripsion,
                    tdbs_memo,
                    tdbs_release_flg,
                    tdbs_create_date,
                    tdbs_update_date,
                    tdbs_update_user
                )
                VALUES
            EOF;  

            $target_sql = "";

            foreach($shift_data_ary as $key => $val){

                if($val['user_type'] == 2){
                    $target_sql .= "(";
                    $target_sql .= ":tdbs_user_id".$key.",";
                    $target_sql .= ":tdbs_shift_date".$key.",";
                    $target_sql .= ":tdbs_shift_time".$key.",";
                    $target_sql .= ":tdbs_fixed_flg".$key.",";
                    $target_sql .= ":tdbs_free_descripsion".$key.",";
                    $target_sql .= ":tdbs_memo".$key.",";
                    $target_sql .= "1,";
                    $target_sql .= ":tdbs_create_date".$key.",";
                    $target_sql .= ":tdbs_update_date".$key.",";
                    $target_sql .= ":tdbs_update_user".$key;
                    $target_sql .= "),";
                }

            }
            $target_sql = rtrim($target_sql, ",");
            $sql = $sql.$target_sql;
            
            $sql .= <<<EOF
                ON DUPLICATE KEY UPDATE
                tdbs_shift_time = VALUES(tdbs_shift_time),
                tdbs_fixed_flg = VALUES(tdbs_fixed_flg),
                tdbs_free_descripsion = VALUES(tdbs_free_descripsion),
                tdbs_memo = VALUES(tdbs_memo),
                tdbs_update_date = VALUES(tdbs_update_date),
                tdbs_update_user = VALUES(tdbs_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            //シフト時間の定義
            $sv_shift_list_ary = $this->define['hope_shift_sv'];

            foreach($shift_data_ary as $key => $val){
    
                if($val['user_type'] == 2){
                    $other_flg = 0;
                    //OPID
                    $tdbs_user_id = $this->h($val['tdbc_user_id']);
                    //シフト時間
                    $val_shift = 0;
                    $tdbc_start_time_first = $val['tdbc_start_time_first'];
                    $tdbc_end_time_first = $val['tdbc_end_time_first'];
                    //シフト文字列
                    $str_shift = "";
                    if($tdbc_start_time_first != "" && $tdbc_end_time_first != ""){
                        $str_shift = ltrim(substr($tdbc_start_time_first,0,2),"0")."-".ltrim(substr($tdbc_end_time_first,0,2),"0");
                    }
                    //自由記述欄
                    $tdbs_free_descripsion = "";
                    //変更なしフラグ
                    $tdbs_fixed_flg = 0;
                    //メモ
                    $tdbs_memo = $this->h($val['tdbc_memo']);
                    $today = date("Y-m-d H:i:s");
                    $user_id = $_SESSION['login_info']['user_id'];

                    if($val['tdbc_holiday_flg'] == 1){
                        $val_shift = 20;
                    }

                    if($val['tdbc_paid_holiday_flg'] == 1){
                        $val_shift = 30;
                    }

                    if($val['tdbc_midnight_flg'] == 1){
                        $val_shift = 12;
                    }

                    //シフト時間文字列の検索
                    foreach($sv_shift_list_ary as $shift_val => $shift_text){
                        if($shift_text == $str_shift){
                            $val_shift = $shift_val;
                        }
                    }

                    //シフト時間99「その他」のとき
                    if($val_shift == 0 && $str_shift != ""){
                        $val_shift = 99;
                        $tdbs_free_descripsion = $str_shift;
                    }

                    $stmt->bindValue(":tdbs_user_id".$key , $tdbs_user_id);//OPID
                    $stmt->bindValue(":tdbs_shift_date".$key , $this->vars['tdbc_shift_date']);//シフト年月日
                    $stmt->bindValue(":tdbs_shift_time".$key , $val_shift);//シフト時間
                    $stmt->bindValue(":tdbs_fixed_flg".$key , $tdbs_fixed_flg);//変更なしフラグ
                    $stmt->bindValue(":tdbs_free_descripsion".$key , $tdbs_free_descripsion);//自由記述欄
                    $stmt->bindValue(":tdbs_memo".$key , $tdbs_memo);//メモ
                    $stmt->bindValue(":tdbs_create_date".$key , $today);
                    $stmt->bindValue(":tdbs_update_date".$key , $today);
                    $stmt->bindValue(":tdbs_update_user".$key , $user_id);
                }
            }

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            /***************色付け情報の削除***************/
            $sql_in = "(";

            foreach($total_target_delete_ary as $target_id => $val){

                foreach($val as $target_hour){
                    $sql_in = $sql_in.$target_hour.",";
                }

                $sql_in = rtrim($sql_in, ",");
                $sql_in = $sql_in.")";

                $sql = "DELETE FROM td_shift_business WHERE tdsb_shift_date = :tdsb_shift_date AND tdsb_user_id = :tdsb_user_id AND tdsb_shift_hour IN ".$sql_in;
                $stmt = $this->mysql->prepare($sql);
                $stmt->bindValue(":tdsb_shift_date", $this->vars['tdbc_shift_date']);//
                $stmt->bindValue(":tdsb_user_id" , $target_id);//

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

    public function CALLBACK__before_confirm_summary(){

        //バリデート
        $this->validate('shift/shift_confirm');

        try{
            $sql = <<<EOF
                SELECT
                tdbc_shift_date,
                tdbc_release_flg,
                CASE tdbc_release_flg
                WHEN 0 THEN '確定前'
                WHEN 1 THEN '確定済'
                ELSE ''
                END AS tdbc_release_text
                FROM td_before_confirm_shift
                WHERE tdbc_shift_date >= :section_sta
                AND tdbc_shift_date <= :section_end
                GROUP BY tdbc_shift_date , tdbc_release_flg
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);
            
            //クエリ実行
            $execute = $stmt->execute();
            $confirm_data = $stmt->fetchAll();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));              

            //未登録人数と確定チェック保存用
            foreach($confirm_data as $key => $val){
                $confirm_data[$key]['non_regist_num'] = $this->get_non_shift_regist_user($confirm_data[$key]['tdbc_shift_date']);
                $confirm_data[$key]['confirm_check'] = 0;
            }
            //ChromePhp::log($confirm_data);
            echo json_encode($confirm_data);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__shift_confirm_release(){
        //バリデート
        $this->validate('shift/shift_confirm_release');

        //トークン
        if(isset($this->vars['token']) == false || $this->vars['token'] !== $_SESSION['csrf_token'] ){
            echo json_encode("ng_token");
            exit();
        }

        $json = $_POST['shift_data_ary'];
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

            //トランザクション開始
            $this->mysql->beginTransaction();            

            $sql = " UPDATE td_before_confirm_shift SET tdbc_release_flg = 1 WHERE ";
            foreach($shift_data_ary as $key => $val){
                if($val['confirm_check'] == 1){
                    $date_key = date('Ymd',  strtotime($val['tdbc_shift_date']));
                    $sql .= " tdbc_shift_date = :tdbc_shift_date".$date_key.",";
                }
            }

            $sql = rtrim($sql, ",");
            $stmt = $this->mysql->prepare($sql);

            foreach($shift_data_ary as $key => $val){
                if($val['confirm_check'] == 1){
                    $date_key = date('Ymd',  strtotime($val['tdbc_shift_date']));
                    $stmt->bindValue(":tdbc_shift_date".$date_key , $val['tdbc_shift_date']);//メモ
                }
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

    function get_sv_shift($showen_date){

        try{

            $sql = <<<EOF
                SELECT
                tmu.tmur_user_id AS tmur_user_id,
                tmu.tmur_user_name AS tmur_user_name,
                IFNULL(cw.tdbs_shift_date , '') AS tdbs_shift_date,
                cw.tdbs_shift_time AS tdbs_shift_time,
                cw.tdbs_fixed_flg AS tdbs_fixed_flg,
                cw.tdbs_free_descripsion AS tdbs_free_descripsion,
                IFNULL(cw.tdbs_memo , '') AS tdbs_memo,
                cw.tdbs_release_flg AS tdbs_release_flg
                FROM 
                (
                    SELECT
                    tmur_user_id,
                    tmur_user_name
                    FROM tm_user
                    WHERE tmur_authority = 2
                ) AS tmu
                LEFT OUTER JOIN
                (
                    SELECT 
                    tdbs_user_id,
                    tdbs_shift_date,
                    tdbs_shift_time,
                    tdbs_fixed_flg,
                    tdbs_free_descripsion,
                    tdbs_memo,
                    tdbs_release_flg
                    FROM 
                    td_before_confirm_shift_sv
                    WHERE tdbs_shift_date = :showen_date
                )AS cw
                ON tmu.tmur_user_id = cw.tdbs_user_id
            EOF;
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":showen_date" , $showen_date);

            //クエリ実行
            $execute = $stmt->execute();
            $result = $stmt->fetchAll();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
            //ChromePhp::log($result);  
            //結果保存用配列
            $sv_shift_ary = Array();

            foreach($result as $key => $val){
                //シフト時間取得
                $shift_val = $val['tdbs_shift_time'];
                $shift_text = "";

                if($shift_val > 0 && $shift_val < 12){
                    $shift_text = $this->define['hope_shift_sv'][$shift_val];
                }

                //シフト時間が99「その他」のときは、自由記述欄からシフト時間を作成する
                if($shift_val == 99){
                    $shift_text = $val['tdbs_free_descripsion'];
                }

                //第1区間開始時刻
                $start_time_first = "";
                //第1区間終了時刻
                $end_time_first = "";
                //第2区間開始時刻
                $start_time_second = "";
                //第2区間終了時刻
                $end_time_second = "";
                //前日夜勤フラグ
                $yesterday_midnight_flg = 0;

                if($shift_text != ""){
                    $shift_text_ary = explode('-',$shift_text);
                    $start_time_first = $shift_text_ary[0];
                    $start_time_first = sprintf('%02d' , $start_time_first)."00";
                    $end_time_first = $shift_text_ary[1];
                    $end_time_first = sprintf('%02d' , $end_time_first)."00";
                }


                //夜勤のときは当日のシフト時間は22-24へ変換する
                if($shift_val == 12){

                    //前日夜勤チェック
                    $chk_yesterday_midnight = $this->chk_sv_yesterday_midnight($showen_date,$val['tmur_user_id']);
                    //前日夜勤のときは、第1区間第2区間を2200-2400に第2区間を0000-0800に
                    if($chk_yesterday_midnight == true){
                        $start_time_first = "0000";
                        $end_time_first = "0800";
                        $start_time_second = "2200";
                        $end_time_second = "2400";
                        $yesterday_midnight_flg = 1;
                    
                    //前日夜勤でない場合は、第1区間に2200-2400をセット    
                    }else if($chk_yesterday_midnight == false){
                        $start_time_first = "2200";
                        $end_time_first = "2400";
                        $yesterday_midnight_flg = 0;
                    }

                }

                $brank_ary['tdbc_user_id'] = $val['tmur_user_id'];//OPID
                $brank_ary['tmur_user_name'] = $val['tmur_user_name'];//氏名
                $brank_ary['tdbc_shift_date'] = $showen_date;//シフト日付
                $brank_ary['tdbc_start_time_first'] = $start_time_first;//第1区間シフト開始時刻
                $brank_ary['tdbc_end_time_first'] = $end_time_first;//第1区間シフト終了時刻
                $brank_ary['tdbc_start_time_second'] = $start_time_second;//第2区間シフト開始時刻
                $brank_ary['tdbc_end_time_second'] = $end_time_second;//第2区間シフト終了時刻
                //休日フラグ
                if($shift_val == 20){
                    $brank_ary['tdbc_holiday_flg'] = 1;
                }else{
                    $brank_ary['tdbc_holiday_flg'] = 0;
                }
                //有休フラグ
                if($shift_val == 30){
                    $brank_ary['tdbc_paid_holiday_flg'] = 1;
                }else{
                    $brank_ary['tdbc_paid_holiday_flg'] = 0;
                }
                //夜勤フラグ
                if($shift_val == 12){
                    $brank_ary['tdbc_midnight_flg'] = 1;
                }else{
                    $brank_ary['tdbc_midnight_flg'] = 0;
                }
                //メモ
                $brank_ary['tdbc_memo'] = $val['tdbs_memo'];
                //前日夜勤フラグ
                $brank_ary['yesterday_midnight_flg'] = $yesterday_midnight_flg;
                //ユーザータイプ（２固定）
                $brank_ary['user_type'] = 2;
                //担当可能業務情報
                $brank_ary['business_enable_priority'] = $this->get_business_enable_priority($val['tmur_user_id']);

                $sv_shift_ary[$val['tmur_user_id']] = $brank_ary;

            }
            
            return $sv_shift_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
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

    //SVの前日夜勤チェック
    function chk_sv_yesterday_midnight($target_date,$target_userid){

        //前日の日付取得
        $target_date = new Datetime($target_date);
        $target_date->modify('-1 day');
        $yesterday_date =  $target_date->format('Y-m-d');
        
        try{

            $sql = "SELECT tdbs_shift_time FROM td_before_confirm_shift_sv WHERE tdbs_user_id = :target_userid AND tdbs_shift_date = :target_date";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":target_userid" , $target_userid);
            $stmt->bindParam(":target_date" , $yesterday_date);

            //クエリ実行
            $execute = $stmt->execute();
            $result = $stmt->fetchAll();
            $row_count = $stmt->rowCount();

            if($row_count == 1){
                if($result[0]['tdbs_shift_time'] == 12){
                    return true;
                }else{
                    return false;
                }
            }else{
                return "";
            }


        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }


    }

    function get_non_shift_regist_user($tdbc_shift_date){

        //未登録人数
        $non_regist_user = 0;

        try{

            $sql = <<<EOF
                SELECT COUNT(*) AS cnt FROM td_before_confirm_shift
                WHERE tdbc_shift_date = :tdbc_shift_date
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbc_shift_date" , $tdbc_shift_date);
            
            //クエリ実行
            $execute = $stmt->execute();
            $result = $stmt->fetch();
            $row_count = $result['cnt'];
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));              

            //対象人数を取得
            $all_user_ary = $this->get_all_user();
            $all_user_cnt = count($all_user_ary);
            //ChromePhp::log("all_user_cnt");
            //ChromePhp::log($all_user_cnt);
            //ChromePhp::log("row_count");
            //ChromePhp::log($row_count);
            
            //純粋な登録人数に対する不足人数
            $non_regist_user = $all_user_cnt - $row_count;
            //ChromePhp::log("1回目");
            //ChromePhp::log($non_regist_user);
            

            //登録済み人数に対して不備データの人数
            $sql = <<<EOF
                SELECT COUNT(*) AS cnt FROM 
                (
                SELECT
                tdbc_user_id,
                tdbc_shift_date,
                tdbc_start_time_first,
                tdbc_end_time_first,
                tdbc_start_time_second,
                tdbc_end_time_second,
                tdbc_holiday_flg,
                tdbc_paid_holiday_flg,
                tdbc_midnight_flg
                FROM td_before_confirm_shift
                td_before_confirm_shift
                WHERE tdbc_shift_date = :tdbc_shift_date
                ) AS cw
                WHERE (cw.tdbc_start_time_first = '' OR cw.tdbc_end_time_first = '')
                AND cw.tdbc_holiday_flg = 0
                AND cw.tdbc_paid_holiday_flg = 0
                AND cw.tdbc_midnight_flg = 0
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbc_shift_date" , $tdbc_shift_date);

            //クエリ実行
            $execute = $stmt->execute();
            $result = $stmt->fetch();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
            //ChromePhp::log("2回目");
            //ChromePhp::log(intval($result['cnt']));
            $total_non_regist_user = $non_regist_user + intval($result['cnt']);

            return $total_non_regist_user;


        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
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
                WHERE tmur_authority = 1
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

    //シフト色付け情報が存在しているかのチェック
    public function is_shift_business_data($target_date,$target_userid){

        try{
            $sql = <<<EOF
                SELECT
                tdsb_shift_date,
                tdsb_user_id,
                tdsb_shift_hour,
                tdsb_business_id
                FROM td_shift_business
                WHERE tdsb_shift_date = :tdsb_shift_date
                AND tdsb_user_id = :tdsb_user_id
                ORDER BY tdsb_shift_hour
            EOF;
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tdsb_shift_date" , $target_date);
            $stmt->bindParam(":tdsb_user_id" , $target_userid);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            if($row_count == 0){
                return "";
            }else{
                $business_data = $stmt->fetchAll();
                return $business_data;
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }
        
    }

    //前日が夜勤かどうかのチェック
    public function chk_yesterday_midnight($target_date,$user_id){

        //前日の日付取得
        $target_date = new Datetime($target_date);
        $target_date->modify('-1 day');
        $yesterday_date =  $target_date->format('Y-m-d');

        try{
            $sql = <<<EOF
                SELECT
                tdbc_user_id,
                tdbc_midnight_flg
                FROM td_before_confirm_shift
                WHERE tdbc_user_id = :tdbc_user_id
                AND tdbc_shift_date = :yesterday_date
            EOF;
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tdbc_user_id" , $user_id);
            $stmt->bindParam(":yesterday_date" , $yesterday_date);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            if($row_count == 1){
                $midnight = $stmt->fetch();
                return $midnight['tdbc_midnight_flg'];
            }else{
                return "";
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

    public function chk_after_confirm($user_id,$target_date){

        try{

            $sql = "SELECT tdbc_release_flg FROM td_before_confirm_shift ";
            $sql .= " WHERE tdbc_user_id = :tdbc_user_id ";
            $sql .= " AND tdbc_shift_date = :tdbc_shift_date";

            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tdbc_user_id" , $user_id);
            $stmt->bindParam(":tdbc_shift_date" , $target_date);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();

            if($row_count == 1){
                $confirm = $stmt->fetch();
                return $confirm['tdbc_release_flg'];
            }else{
                return "";
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

}//end of class()

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

