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

    
    public function CALLBACK__hope_shift_regist(){

        //バリデート
        $this->validate('shift/hope_shift_regist');

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
                INSERT INTO td_hope_shift
                (
                    tdsh_user_id,
                    tdsh_shift_date,
                    tdsh_start_time_first,
                    tdsh_end_time_first,
                    tdsh_start_time_second,
                    tdsh_end_time_second,
                    tdsh_holiday_flg,
                    tdsh_paid_holiday_flg,
                    tdsh_midnight_flg,
                    tdsh_memo,
                    tdsh_create_date,
                    tdsh_update_date,
                    tdsh_update_user
                )
                VALUES
            EOF;  
            
            $target_sql = "";

            foreach($shift_data_ary as $target_date => $val){
                $date_key = date('Ymd',  strtotime($target_date));
                $target_sql .= "(";
                $target_sql .= ":tdsh_user_id".$date_key.",";
                $target_sql .= ":tdsh_shift_date".$date_key.",";
                $target_sql .= ":tdsh_start_time_first".$date_key.",";
                $target_sql .= ":tdsh_end_time_first".$date_key.",";
                $target_sql .= ":tdsh_start_time_second".$date_key.",";
                $target_sql .= ":tdsh_end_time_second".$date_key.",";
                $target_sql .= ":tdsh_holiday_flg".$date_key.",";
                $target_sql .= ":tdsh_paid_holiday_flg".$date_key.",";
                $target_sql .= ":tdsh_midnight_flg".$date_key.",";
                $target_sql .= ":tdsh_memo".$date_key.",";
                $target_sql .= ":tdsh_create_date".$date_key.",";
                $target_sql .= ":tdsh_update_date".$date_key.",";
                $target_sql .= ":tdsh_update_user".$date_key;
                $target_sql .= "),";

            }
            $target_sql = rtrim($target_sql, ",");
            $sql = $sql.$target_sql;

            $sql .= <<<EOF
                ON DUPLICATE KEY UPDATE
                tdsh_start_time_first = VALUES(tdsh_start_time_first),
                tdsh_end_time_first = VALUES(tdsh_end_time_first),
                tdsh_start_time_second = VALUES(tdsh_start_time_second),
                tdsh_end_time_second = VALUES(tdsh_end_time_second),
                tdsh_holiday_flg = VALUES(tdsh_holiday_flg),
                tdsh_paid_holiday_flg = VALUES(tdsh_paid_holiday_flg),
                tdsh_midnight_flg = VALUES(tdsh_midnight_flg),
                tdsh_memo = VALUES(tdsh_memo),
                tdsh_update_date = VALUES(tdsh_update_date),
                tdsh_update_user = VALUES(tdsh_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            foreach($shift_data_ary as $target_date => $val){
                $date_key = date('Ymd',  strtotime($target_date));
                $tdsh_start_time_first = $this->h($val['tdsh_start_time_first']);
                $tdsh_end_time_first = $this->h($val['tdsh_end_time_first']);
                $tdsh_start_time_second = $this->h($val['tdsh_start_time_second']);
                $tdsh_end_time_second = $this->h($val['tdsh_end_time_second']);
                $tdsh_holiday_flg = $this->h($val['tdsh_holiday_flg']);
                $tdsh_paid_holiday_flg = $this->h($val['tdsh_paid_holiday_flg']);
                $tdsh_midnight_flg = $this->h($val['tdsh_midnight_flg']);
                $tdsh_memo = $this->h($val['tdsh_memo']);
                $today = date("Y-m-d H:i:s");
                $user_id = $_SESSION['login_info']['user_id'];

                $stmt->bindValue(":tdsh_user_id".$date_key , $this->vars['tmur_user_id']);//
                $stmt->bindValue(":tdsh_shift_date".$date_key , $target_date);//
                $stmt->bindValue(":tdsh_start_time_first".$date_key , $tdsh_start_time_first);//
                $stmt->bindValue(":tdsh_end_time_first".$date_key , $tdsh_end_time_first);//
                $stmt->bindValue(":tdsh_start_time_second".$date_key , $tdsh_start_time_second);//
                $stmt->bindValue(":tdsh_end_time_second".$date_key , $tdsh_end_time_second);//
                $stmt->bindValue(":tdsh_holiday_flg".$date_key , $tdsh_holiday_flg , PDO::PARAM_INT);//
                $stmt->bindValue(":tdsh_paid_holiday_flg".$date_key , $tdsh_paid_holiday_flg , PDO::PARAM_INT);//
                $stmt->bindValue(":tdsh_midnight_flg".$date_key , $tdsh_midnight_flg , PDO::PARAM_INT);//
                $stmt->bindValue(":tdsh_memo".$date_key , $tdsh_memo);//
                $stmt->bindValue(":tdsh_create_date".$date_key , $today);
                $stmt->bindValue(":tdsh_update_date".$date_key , $today);
                $stmt->bindValue(":tdsh_update_user".$date_key , $user_id);
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

    //指定ユーザーの情報を取得
    public function CALLBACK__get_hope_shift(){

        //バリデート
        $this->validate('shift/get_hope_shift');

        //エラーメッセージ取得
        //$err_ary = $this->error->get();

        //エラー時処理
        /*
        if($this->error->count() > 0){
            echo json_encode($err_ary);
            exit();  
        }   
        */

        try{
            $sql = <<<EOF
                SELECT 
                tdsh_user_id,
                tdsh_shift_date,
                tdsh_start_time_first,
                tdsh_end_time_first,
                tdsh_start_time_second,
                tdsh_end_time_second,
                tdsh_holiday_flg,
                tdsh_paid_holiday_flg,
                tdsh_midnight_flg,
                tdsh_memo
                FROM td_hope_shift
                WHERE tdsh_shift_date >= :section_sta
                AND tdsh_shift_date <= :section_end
                AND tdsh_user_id = :tmur_user_id
                ORDER BY tdsh_shift_date
            EOF;
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //結果保存用配列
            $shift_data_ary = Array();
            $chk_date_ary = Array();

            while($hope_shift = $stmt->fetch()){
                $hope_shift['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($hope_shift['tdsh_shift_date'],$this->vars['tmur_user_id']);
                $shift_data_ary[$hope_shift['tdsh_shift_date']] = $hope_shift;
                $chk_date_ary[] = $hope_shift['tdsh_shift_date'];
            }

            $brank_ary['tdsh_user_id'] = $this->vars['tmur_user_id'];
            $brank_ary['tdsh_shift_date'] = "";
            $brank_ary['tdsh_start_time_first'] = "";
            $brank_ary['tdsh_end_time_first'] = "";
            $brank_ary['tdsh_start_time_second'] = "";
            $brank_ary['tdsh_end_time_second'] = "";
            $brank_ary['tdsh_holiday_flg'] = "";
            $brank_ary['tdsh_paid_holiday_flg'] = "";
            $brank_ary['tdsh_midnight_flg'] = "";
            $brank_ary['tdsh_memo'] = "";

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
                    $brank_ary['tdsh_shift_date'] = $current_date;
                    $brank_ary['yesterday_midnight_flg'] = $this->chk_yesterday_midnight($current_date,$this->vars['tmur_user_id']);
                    $shift_data_ary[$current_date] = $brank_ary;
                 }

                $roop_start_date->modify('+1 day');
                $chk_flg = 0;
            }
            //ChromePhp::log($shift_data_ary);
            echo json_encode($shift_data_ary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    //希望シフト登録削除アクション
    public function CALLBACK__hope_shift_delete(){

        //バリデート
        $this->validate('shift/hope_shift_delete');

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

            $sql = " DELETE FROM td_hope_shift ";
            $sql .= " WHERE tdsh_user_id = :tdsh_user_id";
            $sql .= " AND tdsh_shift_date >= :section_sta";
            $sql .= " AND tdsh_shift_date <= :section_end";

            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tdsh_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);

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

    //希望シフト登録状況取得アクション
    public function CALLBACK__hope_shift_summary(){

        //バリデート
        $this->validate('shift/hope_shift_summary');

        try{
            $sql = "";
            if($this->vars['target'] == 1){
                $sql = <<<EOF
                    SELECT
                    DISTINCT tmur_user_id,
                    tmur_user_name,
                    CASE 
                    WHEN tdsh_shift_date IS NULL THEN 0
                    ELSE 1 END AS tdsh_shift_date,
                    tdsh_update_date
                    FROM
                    (
                    SELECT
                    tmu.tmur_user_id AS tmur_user_id,
                    tmu.tmur_user_name AS tmur_user_name,
                    tmu.tmur_authority AS tmur_authority,
                    tmu.tmur_is_used AS tmur_is_used,
                    cw1.tdsh_shift_date AS tdsh_shift_date,
                    cw1.tdsh_update_date AS tdsh_update_date
                    FROM tm_user AS tmu
                    LEFT OUTER JOIN
                    (
                    SELECT tdsh_user_id , tdsh_shift_date , tdsh_update_date FROM td_hope_shift
                    WHERE tdsh_shift_date >= :section_sta
                    AND tdsh_shift_date <= :section_end
                    ) AS cw1
                    ON tmu.tmur_user_id = cw1.tdsh_user_id
                    ) AS cw2
                    WHERE tmur_authority = :tmur_authority
                    AND tmur_is_used = 1
                EOF;
            }else if($this->vars['target'] == 2){
                $sql = <<<EOF
                    SELECT
                    DISTINCT tmur_user_id,
                    tmur_user_name,
                    CASE 
                    WHEN tdsv_shift_date IS NULL THEN 0
                    ELSE 1 END AS tdsv_shift_date,
                    tdsv_update_date
                    FROM
                    (
                    SELECT
                    tmu.tmur_user_id AS tmur_user_id,
                    tmu.tmur_user_name AS tmur_user_name,
                    tmu.tmur_authority AS tmur_authority,
                    tmu.tmur_is_used AS tmur_is_used,
                    cw1.tdsv_shift_date AS tdsv_shift_date,
                    cw1.tdsv_update_date AS tdsv_update_date
                    FROM tm_user AS tmu
                    LEFT OUTER JOIN
                    (
                    SELECT tdsv_user_id , tdsv_shift_date , tdsv_update_date FROM td_hope_shift_sv
                    WHERE tdsv_shift_date >= :section_sta
                    AND tdsv_shift_date <= :section_end
                    ) AS cw1
                    ON tmu.tmur_user_id = cw1.tdsv_user_id
                    ) AS cw2
                    WHERE tmur_authority = :tmur_authority
                    AND tmur_is_used = 1
                EOF;                
            }

            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);
            $stmt->bindParam(":tmur_authority" , $this->vars['target'] , PDO::PARAM_INT);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $shift_summary = $stmt->fetchAll();

            echo json_encode($shift_summary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }
        
    }

    //当該OP希望シフト詳細取得アクション
    public function CALLBACK__get_one_detail(){

        //バリデート
        $this->validate('shift/get_one_detail');

        $sql = "";
        //ChromePhp::log($this->vars['target']);
        try{
            //一般ユーザーおよびSVユーザーの勤務シフト表での希望シフト詳細画面表示
            if($this->vars['target'] == 1 || $this->vars['target'] == ""){
                $sql = <<<EOF
                    SELECT
                    tdsh_user_id,
                    tdsh_shift_date,
                    tdsh_start_time_first,
                    tdsh_end_time_first,
                    tdsh_start_time_second,
                    tdsh_end_time_second,
                    tdsh_holiday_flg,
                    tdsh_paid_holiday_flg,
                    tdsh_midnight_flg,
                    tdsh_memo
                    FROM td_hope_shift
                    WHERE tdsh_user_id = :tmur_user_id
                    AND tdsh_shift_date >= :section_sta
                    AND tdsh_shift_date <= :section_end
                EOF;
            //SVユーザーの希望シフト詳細画面表示（自分自身の希望シフト）
            }else if($this->vars['target'] == 2){
                $sql = <<<EOF
                    SELECT
                    tdsv_user_id,
                    tdsv_shift_date,
                    tdsv_shift_time,
                    tdsv_fixed_flg,
                    tdsv_free_descripsion,
                    tdsv_memo
                    FROM td_hope_shift_sv
                    WHERE tdsv_user_id = :tmur_user_id
                    AND tdsv_shift_date >= :section_sta
                    AND tdsv_shift_date <= :section_end
                EOF;
            }

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
                if($this->vars['target'] == 1 || $this->vars['target'] == ""){
                    $chk_date_ary[] = $data['tdsh_shift_date'];
                }else if($this->vars['target'] == 2){
                    $chk_date_ary[] = $data['tdsv_shift_date'];
                }
            }

            if($this->vars['target'] == 1 || $this->vars['target'] == ""){

                $brank_ary['tdsh_user_id'] = $this->vars['tmur_user_id'];
                $brank_ary['tdsh_shift_date'] = "";
                $brank_ary['tdsh_start_time_first'] = "";
                $brank_ary['tdsh_end_time_first'] = "";
                $brank_ary['tdsh_start_time_second'] = "";
                $brank_ary['tdsh_end_time_second'] = "";
                $brank_ary['tdsh_holiday_flg'] = "";
                $brank_ary['tdsh_paid_holiday_flg'] = "";
                $brank_ary['tdsh_midnight_flg'] = "";
                $brank_ary['tdsh_memo'] = "";

            }else if($this->vars['target'] == 2){

                $brank_ary['tdsv_user_id'] = $this->vars['tmur_user_id'];
                $brank_ary['tdsv_shift_date'] = "";
                $brank_ary['tdsv_shift_time'] = "";
                $brank_ary['tdsv_fixed_flg'] = "";
                $brank_ary['tdsv_free_descripsion'] = "";
                $brank_ary['tdsv_memo'] = "";

            }

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
                    if($this->vars['target'] == 1 || $this->vars['target'] == ""){
                        $brank_ary['tdsh_shift_date'] = $current_date;
                    }else if($this->vars['target'] == 2){
                        $brank_ary['tdsv_shift_date'] = $current_date;
                    }
                    $shift_detail[] = $brank_ary;
                 }

                $roop_start_date->modify('+1 day');
                $chk_flg = 0;
            }

            //ChromePhp::log($shift_detail);
            echo json_encode($shift_detail);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    //希望シフト期間情報取得アクション
    public function CALLBACK__get_regist_reception_status(){

        try{

            $sql = <<<EOF
                SELECT
                tshs_id,
                tshs_start_date,
                tshs_end_date,
                tshs_dead_line,
                tshs_reception_flg,
                tshs_delete_date
                FROM ts_hope_shift_section
            EOF;

            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $shift_section = $stmt->fetchAll();

            echo json_encode($shift_section);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__reception_status_update(){

        //バリデート
        $this->validate('shift/reception_status_update');

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

            $sql = "UPDATE ts_hope_shift_section SET tshs_reception_flg = 0 WHERE tshs_reception_flg = 1";
            $stmt = $this->mysql->prepare($sql);
            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //当該期間データのステータスを更新
            $sql = <<<EOF
                UPDATE ts_hope_shift_section 
                SET tshs_reception_flg = :current_status
                WHERE tshs_id = :tshs_id
            EOF;

            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":current_status" , $this->vars['current_status']);
            $stmt->bindParam(":tshs_id" , $this->vars['tshs_id']);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //操作ログ書き込み
            $sction_date = $this->get_section_date($this->vars['tshs_id']);  
            
            $section_date_str = "（".date('Y年m月d',  strtotime($sction_date['tshs_start_date']))."～".date('Y年m月d',  strtotime($sction_date['tshs_end_date']))."）";
            if($this->vars['current_status'] == 1){
                $this->rec_operation_log($_SESSION['login_info']['user_id'],'希望シフト管理','OP希望シフト','登録受付開始',$section_date_str);
            }else if($this->vars['current_status'] == 0){
                $this->rec_operation_log($_SESSION['login_info']['user_id'],'希望シフト管理','OP希望シフト','登録受付解除',$section_date_str);
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

    public function get_section_date($tshs_id){

        try{

            $sql = "SELECT tshs_start_date,tshs_end_date FROM ts_hope_shift_section WHERE tshs_id = :tshs_id";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tshs_id" , $tshs_id);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $shift = $stmt->fetch();

            return $shift;

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function CALLBACK__hope_shift_section_regist(){

        //バリデート
        $this->validate('shift/hope_shift_section_regist');

        if(empty($this->vars['tshs_id']) == true){
            if($this->vars['tshs_start_date'] != "" && $this->vars['tshs_end_date'] != ""){
                $span_chk = $this->chk_section_span($this->vars['tshs_start_date'],$this->vars['tshs_end_date']);
                if($span_chk == false){
                    $this->error->add('既に登録さている期間と重なっています');
                }
            }
        }
        if($this->vars['tshs_dead_line'] != "" && $this->vars['tshs_start_date'] != ""){
            $dead_line_chk = $this->chk_dead_line($this->vars['tshs_dead_line'],$this->vars['tshs_start_date']);
            if($dead_line_chk == false){
                $this->error->add('登録締切日は登録期間開始日より前にする必要があります');
            }
        }
        if($this->vars['tshs_dead_line'] != "" && $this->vars['tshs_start_date'] != ""){
            $delete_date_chk = $this->chk_delete_date($this->vars['tshs_delete_date'],$this->vars['tshs_end_date']);
            if($delete_date_chk == false){
                $this->error->add('データ消去日は登録期間終了日より後にする必要があります');
            }
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
                INSERT INTO ts_hope_shift_section 
                (
                    tshs_id,
                    tshs_start_date,
                    tshs_end_date,
                    tshs_dead_line,
                    tshs_reception_flg,
                    tshs_delete_date
                )
                VALUES
                (
                    :tshs_id,
                    :tshs_start_date,
                    :tshs_end_date,
                    :tshs_dead_line,
                    :tshs_reception_flg,
                    :tshs_delete_date
                )
                ON DUPLICATE KEY UPDATE
                tshs_start_date = :tshs_start_date,
                tshs_end_date = :tshs_end_date,
                tshs_dead_line = tshs_dead_line,
                tshs_reception_flg = :tshs_reception_flg,
                tshs_delete_date = :tshs_delete_date
            EOF;

            $stmt = $this->mysql->prepare($sql);

            $is_reception_stats = $this->is_reception_status();
            $tshs_reception_flg;

            //PK
            //更新時
            if(empty($this->vars['tshs_id']) == false){
                $stmt->bindParam(":tshs_id" , $this->vars['tshs_id']);
                $tshs_reception_flg = $this->get_reception_status($this->vars['tshs_id']);

            //新規作成時
            }else{
                $stmt->bindValue(":tshs_id" , NULL ,PDO::PARAM_NULL);
                if($is_reception_stats == true){
                    $tshs_reception_flg = 0;
                }else if($is_reception_stats == false){
                    $tshs_reception_flg = 1;
                }   
            }

            $stmt->bindParam(":tshs_start_date" , $this->vars['tshs_start_date']);
            $stmt->bindParam(":tshs_end_date" , $this->vars['tshs_end_date']);
            $stmt->bindParam(":tshs_dead_line" , $this->vars['tshs_dead_line']);
            $stmt->bindParam(":tshs_delete_date" , $this->vars['tshs_delete_date']);
            $stmt->bindParam(":tshs_reception_flg" , $tshs_reception_flg);

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

    //当該OPの希望シフト情報を取得
    public function CALLBACK__hope_shift_reflection(){

        //バリデート
        $this->validate('shift/hope_shift_reflection');

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
                    tdbc_memo
                )
                SELECT
                tdsh_user_id,
                tdsh_shift_date,
                tdsh_start_time_first,
                tdsh_end_time_first,
                tdsh_start_time_second,
                tdsh_end_time_second,
                tdsh_holiday_flg,
                tdsh_paid_holiday_flg,
                tdsh_midnight_flg,
                tdsh_memo
                FROM td_hope_shift AS ths
                WHERE 
                tdsh_user_id = :tdsh_user_id
                AND tdsh_shift_date >= :section_sta
                AND tdsh_shift_date <= :section_end
                ON DUPLICATE KEY UPDATE
                tdbc_start_time_first = ths.tdsh_start_time_first,
                tdbc_end_time_first = ths.tdsh_end_time_first,
                tdbc_end_time_second = ths.tdsh_end_time_second,
                tdbc_holiday_flg = ths.tdsh_holiday_flg,
                tdbc_paid_holiday_flg = ths.tdsh_paid_holiday_flg,
                tdbc_midnight_flg = ths.tdsh_midnight_flg,
                tdbc_memo = ths.tdsh_memo,

            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdsh_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            //更新者の挿入
            $sql = "UPDATE td_before_confirm_shift SET tdbc_update_user = :tdbc_update_user WHERE tdbc_user_id = :tdbc_user_id";
            $sql .= " AND tdbc_shift_date >= :section_sta";
            $sql .= " AND tdbc_shift_date <= :section_end";

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbc_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);
            $stmt->bindParam(":tdbc_update_user" , $_SESSION['login_info']['user_id']);

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

    //当該OPの希望シフト情報を取得
    public function CALLBACK__hope_shift_reflection_sv(){

        //バリデート
        $this->validate('shift/hope_shift_reflection_sv');


        //すでに公開されているときは、登録しない
        try{

            $sql = <<<EOF
                SELECT COUNT(*) AS cnt FROM td_before_confirm_shift_sv 
                WHERE tdbs_user_id = :tdbs_user_id
                AND tdbs_shift_date >= :section_sta
                AND tdbs_shift_date <= :section_end
                AND tdbs_release_flg = 1
            EOF;
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdbs_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();

            if($row_count > 0){
				$this->error->add('すでに公開されている期間なので反映できません');
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
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
                INSERT INTO td_before_confirm_shift_sv
                (
                    tdbs_user_id,
                    tdbs_shift_date,
                    tdbs_shift_time,
                    tdbs_fixed_flg,
                    tdbs_free_descripsion,
                    tdbs_memo
                )
                SELECT
                tdsv_user_id,
                tdsv_shift_date,
                tdsv_shift_time,
                tdsv_fixed_flg,
                tdsv_free_descripsion,
                tdsv_memo
                FROM td_hope_shift_sv AS ths 
                WHERE tdsv_user_id = :tdsv_user_id 
                AND tdsv_shift_date >= :section_sta 
                AND tdsv_shift_date <= :section_end 
                ON DUPLICATE KEY UPDATE 
                tdbs_shift_time = ths.tdsv_shift_time,
                tdbs_fixed_flg = ths.tdsv_fixed_flg,
                tdbs_free_descripsion = ths.tdsv_free_descripsion,
                tdbs_memo = ths.tdsv_memo
            EOF;
            //ChromePhp::log($sql);
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdsv_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            //更新者の挿入
            $sql = "UPDATE td_before_confirm_shift_sv SET tdbs_update_user = :tdbs_update_user , tdbs_update_date = :tdbs_update_date WHERE tdbs_user_id = :tdbs_user_id";
            $sql .= " AND tdbs_shift_date >= :section_sta";
            $sql .= " AND tdbs_shift_date <= :section_end";

            $stmt = $this->mysql->prepare($sql);
            $today = date("Y-m-d H:i:s");
            $stmt->bindParam(":tdbs_user_id" , $this->vars['tmur_user_id']);
            $stmt->bindParam(":section_sta" , $this->vars['section_sta']);
            $stmt->bindParam(":section_end" , $this->vars['section_end']);
            $stmt->bindParam(":tdbs_update_user" , $_SESSION['login_info']['user_id']);
            $stmt->bindParam(":tdbs_update_date" , $today);

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

    public function CALLBACK__hope_shift_summary_personal(){

        //バリデート
        $this->validate('shift/hope_shift_summary_personal');
        
        try{

            //現在登録されている期間を取得

            $sql = <<<EOF
                SELECT
                tshs_id,
                tshs_start_date,
                tshs_end_date,
                tshs_dead_line,
                tshs_reception_flg
                FROM ts_hope_shift_section
                WHERE tshs_reception_flg = 1
            EOF;
            $stmt = $this->mysql->prepare($sql);
            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $shift_section = $stmt->fetchAll();

            $personal_summary_ary = Array();

            foreach($shift_section as $key => $section_data){

                $w_ary = Array();

                $sql_w = <<<EOF
                    SELECT
                    tdsh_user_id,
                    tdsh_shift_date,
                    tdsh_start_time_first,
                    tdsh_end_time_first,
                    tdsh_start_time_second,
                    tdsh_end_time_second,
                    tdsh_holiday_flg,
                    tdsh_paid_holiday_flg,
                    tdsh_midnight_flg,
                    tdsh_start_time_second,
                    tdsh_memo,
                    tdsh_update_date
                    FROM td_hope_shift
                    WHERE tdsh_user_id = :tdsh_user_id
                    AND tdsh_shift_date >= :section_sta
                    AND tdsh_shift_date <= :section_end
                EOF;

                $stmt = $this->mysql->prepare($sql_w);
                $stmt->bindParam(":tdsh_user_id" , $this->vars['tdsh_user_id']);
                $stmt->bindParam(":section_sta" , $section_data['tshs_start_date']);
                $stmt->bindParam(":section_end" , $section_data['tshs_end_date']);

                //クエリ実行
                $execute = $stmt->execute();
                $row_count = $stmt->rowCount();
                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

                $section = $stmt->fetchAll();

                //当該期間内の行数取得（登録状況判定用）
                $roop_start_date = new Datetime($section_data['tshs_start_date']);
                $start_date = new Datetime($section_data['tshs_start_date']);
                $roop_end_date = new Datetime($section_data['tshs_end_date']);
                $regular_cnt = 0;
                while ($roop_start_date <= $roop_end_date) {
                    $regular_cnt ++;
                    $roop_start_date->modify('+1 day');
                }

                $w_ary['section'] = $start_date->format('Y年m月d日')."～".$roop_end_date->format('Y年m月d日');
                if($regular_cnt <= $row_count){
                    $w_ary['reception_status_text'] = "登録済";
                    $w_ary['reception_status'] = 1;
                    $w_ary['last_update'] = $section[0]['tdsh_update_date'];
                }else{
                    $w_ary['reception_status_text'] = "未登録";
                    $w_ary['reception_status'] = 0;
                    $w_ary['last_update'] = "";
                }
                $w_ary['dead_line'] = $section_data['tshs_dead_line'];
                //hidden保存用
                $w_ary['section_sta'] = $section_data['tshs_start_date'];
                $w_ary['section_end'] = $section_data['tshs_end_date'];


                $personal_summary_ary[] = $w_ary;

            }

            echo json_encode($personal_summary_ary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
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
                    //ChromePhp::log($yesterday_date);
                    //ChromePhp::log($user_id);
                    //ChromePhp::log($midnight['tdbc_midnight_flg']);
    
                    return $midnight['tdbc_midnight_flg'];
                }else{
                    return "";
                }
    
            } catch(Exception $e) {
                ChromePhp::log($e);
                return "";
            }
    
        }

    public function chk_dead_line($dead_line,$start_date){

        $dead_line_chk = new Datetime($dead_line);
        $start_date_chk = new Datetime($start_date);
        if($dead_line_chk >=  $start_date_chk){
            return false;
        }else{
            return true;
        }

    }

    public function chk_delete_date($delete_date,$end_date){

        $delete_date_chk = new Datetime($delete_date);
        $end_date_chk = new Datetime($end_date);

        if($delete_date_chk <=  $end_date_chk){
            return false;
        }else{
            return true;
        }

    }

    public function chk_section_span($start_date,$end_date){

        try{

            $sql = "SELECT tshs_start_date,tshs_end_date FROM ts_hope_shift_section WHERE tshs_reception_flg = 1";
            $stmt = $this->mysql->prepare($sql);
            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $result = $stmt->fetchAll();

            foreach($result as $key => $data){

                $current_start_date = $data['tshs_start_date'];
                $current_end_date = $data['tshs_end_date'];

                $roop_start_date = new Datetime($current_start_date);
                $start_date_origin = $roop_start_date;
                $roop_end_date = new Datetime($current_end_date);
    
                $chk_flg = 0;
                
                //すでに登録されている区間のループ
                while ($roop_start_date <= $roop_end_date) {

                    $current_date =  $roop_start_date->format('Y-m-d');

                    $roop_start_date_chk = new Datetime($start_date);
                    $roop_end_date_chk = new Datetime($end_date);
    
                    //チェック対象期間のループ
                    while ($roop_start_date_chk <= $roop_end_date_chk) {
                        
                        $current_date_chk =  $roop_start_date_chk->format('Y-m-d');

                        if($current_date == $current_date_chk){
                            //$chk_flg = 1;
                            return false;
                        }
    
                        if($chk_flg == 0){
                            //return true;
                        }
                                
                        $roop_start_date_chk->modify('+1 day');
                    }
    
                    $roop_start_date->modify('+1 day');

                }
    
            }

            return true;

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }
        
    }
    
    public function is_reception_status(){

        try{

            $sql = "SELECT COUNT(*) AS cnt FROM ts_hope_shift_section WHERE tshs_reception_flg = 1";
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            $result = $stmt->fetchAll();
            //ChromePhp::log($result);
            if($result[0]['cnt'] > 0){
                return true;
            }else{
                return false;
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }

    public function get_reception_status($tshs_id){

        try{

            $sql = "SELECT tshs_reception_flg FROM ts_hope_shift_section WHERE tshs_id = :tshs_id";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tshs_id" , $tshs_id);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
            
            if($row_count == 1){
                $status = $stmt->fetch();
                return $status['tshs_reception_flg'];
            }else {
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

