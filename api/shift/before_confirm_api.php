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
                    AND tdbc_release_flg = 0
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
                    if($first_hour_sta != "" && $first_hour_end != ""){
                        for($i = $first_hour_sta; $i < $first_hour_end; $i++){
                            $summary_date_ary[$i] = $summary_date_ary[$i] + 1;
                        }
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
                    if($second_hour_sta != "" && $second_hour_end != ""){
                        for($i = $second_hour_sta; $i < $second_hour_end; $i++){
                            $summary_date_ary[$i] = $summary_date_ary[$i] + 1;
                        }
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
                    AND tbc.tdbc_release_flg = 0
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
                $shift['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($this->vars['showen_date'],$shift['tdbc_user_id']);
                //公開非公開フラグ
                $shift['confirm_flg'] = $this->chk_after_confirm($shift['tdbc_user_id'],$this->vars['showen_date']);
                
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
                    //前日夜勤フラグ
                    $brank_ary['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($this->vars['showen_date'],$val['tdbc_user_id']);
                    $by_date_ary[$val['tmur_user_id']] = $brank_ary;
                }
                $chk_flg = 0;
            }

            //ChromePhp::log($by_date_ary);
            echo json_encode($by_date_ary);

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
                    tdbc_release_flg,
                    tdbc_memo
                FROM td_before_confirm_shift
                LEFT OUTER JOIN tm_user
                ON tdbc_user_id = tmur_user_id
                WHERE tdbc_shift_date >= :section_sta
                AND tdbc_shift_date <= :section_end
                AND tdbc_user_id = :tmur_user_id
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
            //ChromePhp::log($shift_detail);

            //ユーザー氏名
            $user_name = "";

            foreach($shift_detail as $key => $data){
                //前日夜勤フラグ
                $shift_detail[$key]['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($data['tdbc_shift_date'],$data['tdbc_user_id']);
                $user_name = $shift_detail[$key]['tmur_user_name'];
                $chk_date_ary[] = $data['tdbc_shift_date'];
            }

            $brank_ary['tdbc_user_id'] = $this->vars['tmur_user_id'];
            $brank_ary['tmur_user_name'] = $user_name;
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
                    $brank_ary['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($current_date,$this->vars['tmur_user_id']);
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

    public function CALLBACK__before_confirm_shift_regist_by_user(){

        //バリデート
        $this->validate('shift/before_confirm_shift_regist_by_user');

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
                tdbc_update_date = VALUES(tdbc_update_date),
                tdbc_update_user = VALUES(tdbc_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            //foreach($shift_data_ary as $target_date => $val){
            foreach($shift_data_ary as $key => $val){

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

    public function CALLBACK__before_confirm_shift_regist_by_date(){

        //バリデート
        $this->validate('shift/before_confirm_shift_regist_by_date');

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
                    tdbc_memo,
                    tdbc_create_date,
                    tdbc_update_date,
                    tdbc_update_user
                )
                VALUES
            EOF;  
            
            $target_sql = "";

            foreach($shift_data_ary as $target_userid => $val){
                //ChromePhp::log($val);
                //すでに確定済みのシフトのときは除外する
                $chk_confirm = $this->chk_after_confirm($target_userid,$val['tdbc_shift_date']);
                if($chk_confirm == true){
                    continue;
                }

                $target_sql .= "(";
                $target_sql .= ":tdbc_user_id".$target_userid.",";
                $target_sql .= ":tdbc_shift_date".$target_userid.",";
                $target_sql .= ":tdbc_start_time_first".$target_userid.",";
                $target_sql .= ":tdbc_end_time_first".$target_userid.",";
                $target_sql .= ":tdbc_start_time_second".$target_userid.",";
                $target_sql .= ":tdbc_end_time_second".$target_userid.",";
                $target_sql .= ":tdbc_holiday_flg".$target_userid.",";
                $target_sql .= ":tdbc_paid_holiday_flg".$target_userid.",";
                $target_sql .= ":tdbc_midnight_flg".$target_userid.",";
                $target_sql .= ":tdbc_memo".$target_userid.",";
                $target_sql .= ":tdbc_create_date".$target_userid.",";
                $target_sql .= ":tdbc_update_date".$target_userid.",";
                $target_sql .= ":tdbc_update_user".$target_userid;
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
                tdbc_update_date = VALUES(tdbc_update_date),
                tdbc_update_user = VALUES(tdbc_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            foreach($shift_data_ary as $target_userid => $val){

                //すでに確定済みのシフトのときは除外する
                $chk_confirm = $this->chk_after_confirm($target_userid,$val['tdbc_shift_date']);
                if($chk_confirm == true){
                    continue;
                }

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

                $stmt->bindValue(":tdbc_user_id".$target_userid , $target_userid);//OPID
                $stmt->bindValue(":tdbc_shift_date".$target_userid , $this->vars['tdbc_shift_date']);//シフト年月日
                $stmt->bindValue(":tdbc_start_time_first".$target_userid , $tdbc_start_time_first);//第1区間開始時刻
                $stmt->bindValue(":tdbc_end_time_first".$target_userid , $tdbc_end_time_first);//第1区間終了時刻
                $stmt->bindValue(":tdbc_start_time_second".$target_userid , $tdbc_start_time_second);//第2区間開始時刻
                $stmt->bindValue(":tdbc_end_time_second".$target_userid , $tdbc_end_time_second);//第2区間終了時刻
                $stmt->bindValue(":tdbc_holiday_flg".$target_userid , $tdbc_holiday_flg , PDO::PARAM_INT);//休日フラグ
                $stmt->bindValue(":tdbc_paid_holiday_flg".$target_userid , $tdbc_paid_holiday_flg , PDO::PARAM_INT);//有休フラグ
                $stmt->bindValue(":tdbc_midnight_flg".$target_userid , $tdbc_midnight_flg , PDO::PARAM_INT);//夜勤フラグ
                $stmt->bindValue(":tdbc_memo".$target_userid , $tdbc_memo);//メモ
                $stmt->bindValue(":tdbc_create_date".$target_userid , $today);
                $stmt->bindValue(":tdbc_update_date".$target_userid , $today);
                $stmt->bindValue(":tdbc_update_user".$target_userid , $user_id);
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
                    $stmt->bindValue(":tdbc_shift_date".$date_key , $val['tdbc_shift_date']);
                }
            }

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt)); 

            //操作ログ
            $this->rec_operation_log($_SESSION['login_info']['user_id'],'確定前シフト','OPシフト','シフト公開');
            
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

    //確定前シフト未登録人数取得
    function get_non_shift_regist_user($tdbc_shift_date){

        //未登録人数
        $non_regist_user = 0;

        try{

            $sql = <<<EOF
                SELECT COUNT(*) AS cnt FROM td_before_confirm_shift AS tbc
                LEFT OUTER JOIN  tm_user
                ON tmur_user_id = tdbc_user_id
                WHERE tdbc_shift_date = :tdbc_shift_date
                AND tmur_authority = 1 AND tmur_is_used = 1
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
            
            //純粋な登録人数に対する不足人数
            $non_regist_user = $all_user_cnt - $row_count;

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
                tdbc_midnight_flg,
                tdbc_release_flg
                FROM td_before_confirm_shift
                LEFT OUTER JOIN tm_user 
                ON tmur_user_id = tdbc_user_id
                WHERE tdbc_shift_date = :tdbc_shift_date AND tmur_is_used = 1
                ) AS cw
                WHERE (cw.tdbc_start_time_first = '' OR cw.tdbc_end_time_first = '')
                AND cw.tdbc_holiday_flg = 0
                AND cw.tdbc_paid_holiday_flg = 0
                AND cw.tdbc_midnight_flg = 0
                AND cw.tdbc_release_flg = 0
            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbc_shift_date" , $tdbc_shift_date);

            //クエリ実行
            $execute = $stmt->execute();
            $result = $stmt->fetch();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
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

