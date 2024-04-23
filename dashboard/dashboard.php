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

    //メイン画面出力アクション
    public function CALLBACK__INDEX(){

        //JS/CSSファイルのバージョン値（キャッシュ対策）
        $this->result->add('ver',rand());

        // ワンタイムトークン生成
        $toke_byte = openssl_random_pseudo_bytes(16);
        $csrf_token = bin2hex($toke_byte);
        // トークンをセッションに保存
        $_SESSION['csrf_token'] = $csrf_token;        
        $this->result->add('csrf_token',$csrf_token);

        /**勤務シフト変更履歴 */
        //管理者ユーザー
        //ChromePhp::log($_SESSION['login_info']);
        if($_SESSION['login_info']['user_authority'] != 1){
            $target_opid = "";
            $shift_history_ary_op = $this->get_op_shift_log($target_opid);
            $shift_history_ary_sv = $this->get_sv_shift_log();
            $shift_business_history_ary = $this->get_shift_business_log();
            $shift_history_ary_hope_op = $this->get_op_hope_shift_log($target_opid);
            $shift_history_ary_hope_sv = $this->get_sv_hope_shift_log();
            $shift_histry_ary = array_merge($shift_history_ary_op,$shift_history_ary_sv);
            $shift_histry_ary = array_merge($shift_histry_ary,$shift_business_history_ary);
            $shift_histry_ary = array_merge($shift_histry_ary,$shift_history_ary_hope_op);
            $shift_histry_ary = array_merge($shift_histry_ary,$shift_history_ary_hope_sv);

            //更新日の新しい順に連想配列をソートする
            $time_array = array_column($shift_histry_ary,'update_time');
            array_multisort($time_array, SORT_DESC , $shift_histry_ary);

            $this->result->add('shift_histry_ary',$shift_histry_ary);
        }else{
            $target_opid = $_SESSION['login_info']['user_id'];
            $shift_history_ary_op = $this->get_op_shift_log($target_opid);

            $this->result->add('shift_histry_ary_op',$shift_history_ary_op);
            
        }

        //更新履歴
        $operation_log_ary = $this->get_operation_log();
        $op_hope_shift_insert_log = $this->get_hope_shift_insert_log();

        //管理者ユーザーの場合はシフト希望新規登録情報も出力する
        if($_SESSION['login_info']['user_authority'] == 9){
            $total_operation_log_ary = array_merge($operation_log_ary,$op_hope_shift_insert_log);
        }else{
            $total_operation_log_ary = $operation_log_ary;
        }

        //更新日の新しい順に連想配列をソートする
        $time_array = array_column($total_operation_log_ary,'update_date');
        array_multisort($time_array, SORT_DESC , $total_operation_log_ary);

        $this->result->add('operation_log_ary',$total_operation_log_ary);

        //メッセージ管理
        $message_ary = $this->get_message($_SESSION['login_info']['user_id']);
        $this->result->add('message_ary',$message_ary);

        //メッセージ送信用宛先一覧
        $op_list_ary = $this->get_op_user_list();
        $this->result->add('op_list_ary',$op_list_ary);

        $this->display('dashboard/dashboard.tpl');
        
    }

    public function get_message($tdms_address_user){

        try{

            $sql = "SELECT tdms_id,tdms_title,tdms_contents,tdms_post_user,tmur_user_name,tdms_post_date,tdms_open_confirm FROM td_message";
            $sql .= " LEFT OUTER JOIN tm_user";
            $sql .= " ON tmur_user_id = tdms_post_user";
            $sql .= " WHERE tdms_address_user = :tdms_address_user";
            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tdms_address_user" , $tdms_address_user);

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
            
            return $all_message_ary;
            
        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    public function get_op_user_list(){

        try{
            $sql = "SELECT tmur_user_id,tmur_user_name FROM tm_user WHERE tmur_authority = 1 OR tmur_authority = 3";
            $stmt = $this->mysql->prepare($sql);
            //クエリ実行
            $execute = $stmt->execute();
            
            $op_list_ary = Array();

            while($shift = $stmt->fetch()){
                $op_list_ary[$shift['tmur_user_id']] = $shift['tmur_user_name'];
            }
            
            return $op_list_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    public function get_op_hope_shift_log($target_opid){

        try{
            
            $sql = <<<EOF
                SELECT
                cw1.tdsh_user_id AS tdsh_user_id,
                cw1.tmur_user_name AS tmur_user_name,
                cw1.tdsh_shift_date AS tdsh_shift_date,
                cw1.tdsh_start_time_first AS tdsh_start_time_first,
                cw1.tdsh_end_time_first AS tdsh_end_time_first,
                cw1.tdsh_start_time_second AS tdsh_start_time_second,
                cw1.tdsh_end_time_second AS tdsh_end_time_second,
                cw1.tdsh_holiday_flg AS tdsh_holiday_flg,
                cw1.tdsh_paid_holiday_flg AS tdsh_paid_holiday_flg,
                cw1.tdsh_midnight_flg AS tdsh_midnight_flg,
                cw1.tdsh_memo AS tdsh_memo,
                cw1.tdsh_start_time_first_old AS tdsh_start_time_first_old,
                cw1.tdsh_end_time_first_old AS tdsh_end_time_first_old,
                cw1.tdsh_start_time_second_old AS tdsh_start_time_second_old,
                cw1.tdsh_end_time_second_old AS tdsh_end_time_second_old,
                cw1.tdsh_holiday_flg_old AS tdsh_holiday_flg_old,
                cw1.tdsh_paid_holiday_flg_old AS tdsh_paid_holiday_flg_old,
                cw1.tdsh_midnight_flg_old AS tdsh_midnight_flg_old,
                cw1.tdsh_memo_old AS tdsh_memo_old,
                cw1.tdsh_update_user AS tdsh_update_user,
                tmu.tmur_user_name AS tdsh_update_user_name,
                cw1.log_time AS log_time,
                cw1.ins_flag AS ins_flag
                FROM
                (                
                    SELECT
                    tdsh_user_id,
                    tmur_user_name,
                    tdsh_shift_date,
                    tdsh_start_time_first,
                    tdsh_end_time_first,
                    tdsh_start_time_second,
                    tdsh_end_time_second,
                    tdsh_holiday_flg,
                    tdsh_paid_holiday_flg,
                    tdsh_midnight_flg,
                    tdsh_memo,
                    tdsh_start_time_first_old,
                    tdsh_end_time_first_old,
                    tdsh_start_time_second_old,
                    tdsh_end_time_second_old,
                    tdsh_holiday_flg_old,
                    tdsh_paid_holiday_flg_old,
                    tdsh_midnight_flg_old,
                    tdsh_memo_old,
                    tdsh_update_user,
                    log_time,
                    ins_flag
                    FROM ts_op_hope_shift_log
                    LEFT OUTER JOIN tm_user
                    ON tmur_user_id = tdsh_user_id
                    WHERE ins_flag = 0
                    ORDER BY log_time DESC
                ) AS cw1
                LEFT OUTER JOIN tm_user AS tmu
                ON tmu.tmur_user_id = cw1.tdsh_update_user
            EOF;
            
            if($target_opid != ""){
                $sql = $sql." WHERE cw1.tdsh_user_id = :tdsh_user_id";
            }

            $sql = $sql." ORDER BY cw1.log_time DESC";
            
            //ChromePhp::log($sql);
            $stmt = $this->mysql->prepare($sql);
            if($target_opid != ""){
                $stmt->bindParam(":tdsh_user_id" , $target_opid);
            }
            
            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $total_shift_histry_ary = Array();

            $key = 0;
            
            while($shift = $stmt->fetch()){
                $shift_histry_ary = Array();
                //ChromePhp::log($shift);
                $shift_histry_ary['target'] = "希望";
                $shift_histry_ary['opid'] = $shift['tdsh_user_id'];
                $shift_histry_ary['name'] = $shift['tmur_user_name'];
                $shift_histry_ary['shift_date'] = $shift['tdsh_shift_date'];
                $shift_histry_ary['update_user'] = $shift['tdsh_update_user']."：".$shift['tdsh_update_user_name'];
                $shift_histry_ary['update_time'] = $shift['log_time'];
                //ChromePhp::log($shift_histry_ary);

                //通常の時間変更
                //第1区間の比較
                if(($shift['tdsh_start_time_first'] != $shift['tdsh_start_time_first_old']) || ($shift['tdsh_end_time_first'] != $shift['tdsh_end_time_first_old'])){

                    //変更前
                    if($shift['tdsh_start_time_first_old'] != "" && $shift['tdsh_end_time_first_old'] != ""){
                        $shift_histry_ary['change_before'] = $shift['tdsh_start_time_first_old']."-".$shift['tdsh_end_time_first_old'];
                    }elseif($shift['tdsh_holiday_flg_old'] == 1){
                        $shift_histry_ary['change_before'] = "休み";
                    }elseif($shift['tdsh_paid_holiday_flg_old'] == 1){
                        $shift_histry_ary['change_before'] = "有休";
                    }else{
                        $shift_histry_ary['change_before'] = "未登録"; 
                    }

                    //変更後
                    if($shift['tdsh_start_time_first'] != "" && $shift['tdsh_end_time_first']){
                        $shift_histry_ary['change_after'] = $shift['tdsh_start_time_first']."-".$shift['tdsh_end_time_first'];
                    }elseif($shift['tdsh_holiday_flg'] == 1){
                        $shift_histry_ary['change_after'] = "休み";
                    }elseif($shift['tdsh_paid_holiday_flg'] == 1){
                        $shift_histry_ary['change_after'] = "有休";
                    }else{
                        $shift_histry_ary['change_after'] = "未登録"; 
                    }

                }

                //第2区間の比較
                //全て空白のときは、スキップする
                if($shift['tdsh_start_time_second'] == "" && $shift['tdsh_end_time_second'] == "" && $shift['tdsh_start_time_second_old'] == "" && $shift['tdsh_end_time_second_old'] == ""){
                    //continue;
                }else{
                    //変更前
                    $shift_histry_ary['change_before'] = $shift_histry_ary['change_before']."　".$shift['tdsh_start_time_second_old']."-".$shift['tdsh_end_time_second_old'];
                    //変更後
                    $shift_histry_ary['change_after'] = $shift_histry_ary['change_after']."　".$shift['tdsh_start_time_second']."-".$shift['tdsh_end_time_second'];
                }
                //ChromePhp::log($shift_histry_ary);
                $total_shift_histry_ary[] = $shift_histry_ary;

                $key++;
            }

            return $total_shift_histry_ary;


        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    public function get_op_shift_log($target_opid){

        try{
            $sql = <<<EOF
                SELECT
                cw1.tdbc_user_id AS tdbc_user_id,
                cw1.tmur_user_name AS tmur_user_name,
                cw1.tdbc_shift_date AS tdbc_shift_date,
                cw1.tdbc_start_time_first AS tdbc_start_time_first,
                cw1.tdbc_end_time_first AS tdbc_end_time_first,
                cw1.tdbc_start_time_second AS tdbc_start_time_second,
                cw1.tdbc_end_time_second AS tdbc_end_time_second,
                cw1.tdbc_holiday_flg AS tdbc_holiday_flg,
                cw1.tdbc_paid_holiday_flg AS tdbc_paid_holiday_flg,
                cw1.tdbc_midnight_flg AS tdbc_midnight_flg,
                cw1.tdbc_memo AS tdbc_memo,
                cw1.tdbc_start_time_first_old AS tdbc_start_time_first_old,
                cw1.tdbc_end_time_first_old AS tdbc_end_time_first_old,
                cw1.tdbc_start_time_second_old AS tdbc_start_time_second_old,
                cw1.tdbc_end_time_second_old AS tdbc_end_time_second_old,
                cw1.tdbc_holiday_flg_old AS tdbc_holiday_flg_old,
                cw1.tdbc_paid_holiday_flg_old AS tdbc_paid_holiday_flg_old,
                cw1.tdbc_midnight_flg_old AS tdbc_midnight_flg_old,
                cw1.tdbc_memo_old AS tdbc_memo_old,
                cw1.tdbc_release_flg AS tdbc_release_flg,
                cw1.tdbc_update_user AS tdbc_update_user,
                tmu.tmur_user_name AS tdbc_update_user_name,
                cw1.log_time AS log_time,
                cw1.ins_flag AS ins_flag
                FROM
                (                
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
                    tdbc_memo,
                    tdbc_start_time_first_old,
                    tdbc_end_time_first_old,
                    tdbc_start_time_second_old,
                    tdbc_end_time_second_old,
                    tdbc_holiday_flg_old,
                    tdbc_paid_holiday_flg_old,
                    tdbc_midnight_flg_old,
                    tdbc_memo_old,
                    tdbc_release_flg,
                    tdbc_update_user,
                    log_time,
                    ins_flag
                    FROM ts_op_shift_log
                    LEFT OUTER JOIN tm_user
                    ON tmur_user_id = tdbc_user_id
                    WHERE ins_flag = 0
                    ORDER BY log_time DESC
                ) AS cw1
                LEFT OUTER JOIN tm_user AS tmu
                ON tmu.tmur_user_id = cw1.tdbc_update_user
            EOF;
            
            if($target_opid != ""){
                $sql = $sql." WHERE cw1.tdbc_user_id = :tdbc_user_id";
            }

            $sql = $sql." ORDER BY cw1.log_time DESC";
            
            //ChromePhp::log($sql);
            $stmt = $this->mysql->prepare($sql);
            if($target_opid != ""){
                $stmt->bindParam(":tdbc_user_id" , $target_opid);
            }
            
            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $total_shift_histry_ary = Array();

            $key = 0;
            
            while($shift = $stmt->fetch()){
                $shift_histry_ary = Array();
                //ChromePhp::log($shift);
                $shift_histry_ary['target'] = "確定";
                $shift_histry_ary['opid'] = $shift['tdbc_user_id'];
                $shift_histry_ary['name'] = $shift['tmur_user_name'];
                $shift_histry_ary['shift_date'] = $shift['tdbc_shift_date'];
                $shift_histry_ary['update_user'] = $shift['tdbc_update_user']."：".$shift['tdbc_update_user_name'];
                $shift_histry_ary['update_time'] = $shift['log_time'];
                //ChromePhp::log($shift_histry_ary);

                //通常の時間変更
                //第1区間の比較
                if(($shift['tdbc_start_time_first'] != $shift['tdbc_start_time_first_old']) || ($shift['tdbc_end_time_first'] != $shift['tdbc_end_time_first_old'])){

                    //変更前
                    if($shift['tdbc_start_time_first_old'] != "" && $shift['tdbc_end_time_first_old'] != ""){
                        $shift_histry_ary['change_before'] = $shift['tdbc_start_time_first_old']."-".$shift['tdbc_end_time_first_old'];
                    }elseif($shift['tdbc_holiday_flg_old'] == 1){
                        $shift_histry_ary['change_before'] = "休み";
                    }elseif($shift['tdbc_paid_holiday_flg_old'] == 1){
                        $shift_histry_ary['change_before'] = "有休";
                    }else{
                        $shift_histry_ary['change_before'] = "未登録"; 
                    }

                    //変更後
                    if($shift['tdbc_start_time_first'] != "" && $shift['tdbc_end_time_first']){
                        $shift_histry_ary['change_after'] = $shift['tdbc_start_time_first']."-".$shift['tdbc_end_time_first'];
                    }elseif($shift['tdbc_holiday_flg'] == 1){
                        $shift_histry_ary['change_after'] = "休み";
                    }elseif($shift['tdbc_paid_holiday_flg'] == 1){
                        $shift_histry_ary['change_after'] = "有休";
                    }else{
                        $shift_histry_ary['change_after'] = "未登録"; 
                    }

                }

                //第2区間の比較
                //全て空白のときは、スキップする
                if($shift['tdbc_start_time_second'] == "" && $shift['tdbc_end_time_second'] == "" && $shift['tdbc_start_time_second_old'] == "" && $shift['tdbc_end_time_second_old'] == ""){
                    //continue;
                }else{
                    //変更前
                    if(empty($shift_histry_ary['change_before']) == true){
                        $shift_histry_ary['change_before'] = $shift['tdbc_start_time_second_old']."-".$shift['tdbc_end_time_second_old'];
                    }else{
                        $shift_histry_ary['change_before'] = $shift_histry_ary['change_before']."　".$shift['tdbc_start_time_second_old']."-".$shift['tdbc_end_time_second_old'];
                    }
                    //$shift_histry_ary['change_before'] = $shift_histry_ary['change_before']."　".$shift['tdbc_start_time_second_old']."-".$shift['tdbc_end_time_second_old'];
                    //変更後
                    if(empty($shift_histry_ary['change_after']) == true){
                        $shift_histry_ary['change_after'] = $shift['tdbc_start_time_second_old']."-".$shift['tdbc_end_time_second_old'];
                    }else{
                        $shift_histry_ary['change_after'] = $shift_histry_ary['change_after']."　".$shift['tdbc_start_time_second_old']."-".$shift['tdbc_end_time_second_old'];
                    }
                    
                    //$shift_histry_ary['change_after'] = $shift_histry_ary['change_after']."　".$shift['tdbc_start_time_second']."-".$shift['tdbc_end_time_second'];
                }
                //ChromePhp::log($shift_histry_ary);
                $total_shift_histry_ary[] = $shift_histry_ary;

                $key++;
            }

            return $total_shift_histry_ary;


        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    public function get_sv_hope_shift_log(){

        try{

            $sql = <<<EOF
                SELECT
                cw1.tdsv_user_id AS tdsv_user_id,
                cw1.tmur_user_name AS tmur_user_name,
                cw1.tdsv_shift_date AS tdsv_shift_date,
                cw1.tdsv_shift_time AS tdsv_shift_time,
                cw1.tdsv_fixed_flg AS tdsv_fixed_flg,
                cw1.tdsv_free_descripsion AS tdsv_free_descripsion,
                cw1.tdsv_memo AS tdsv_memo,
                cw1.tdsv_shift_time_old AS tdsv_shift_time_old,
                cw1.tdsv_fixed_flg_old AS tdsv_fixed_flg_old,
                cw1.tdsv_free_descripsion_old AS tdsv_free_descripsion_old,
                cw1.tdsv_memo_old AS tdsv_memo_old,
                cw1.tdsv_create_date AS tdsv_create_date,
                cw1.tdsv_update_date AS tdsv_update_date,
                cw1.tdsv_update_user AS tdsv_update_user,
                tmu.tmur_user_name AS tdsv_update_user_name,
                cw1.log_id AS log_id,
                cw1.log_time AS log_time,
                cw1.ins_flag AS ins_flag
                FROM
                (
                    SELECT
                    tdsv_user_id,
                    tmur_user_name,
                    tdsv_shift_date,
                    tdsv_shift_time,
                    tdsv_fixed_flg,
                    tdsv_free_descripsion,
                    tdsv_memo,
                    tdsv_shift_time_old,
                    tdsv_fixed_flg_old,
                    tdsv_free_descripsion_old,
                    tdsv_memo_old,
                    tdsv_create_date,
                    tdsv_update_date,
                    tdsv_update_user,
                    log_id,
                    log_time,
                    ins_flag
                    FROM ts_sv_hope_shift_log
                    LEFT OUTER JOIN tm_user
                    ON tdsv_user_id = tmur_user_id
                    WHERE ins_flag = 0
                    ORDER BY log_time DESC
                ) AS cw1
                LEFT OUTER JOIN tm_user AS tmu
                ON tmu.tmur_user_id = cw1.tdsv_update_user
                ORDER BY cw1.log_time DESC
            EOF;

            $stmt = $this->mysql->prepare($sql);
            //$stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $total_shift_histry_ary = Array();

            $key = 0;
            
            while($shift = $stmt->fetch()){
                $shift_histry_ary = Array();
                //ChromePhp::log($shift);
                $shift_histry_ary['target'] = "確定";
                $shift_histry_ary['opid'] = $shift['tdsv_user_id'];
                $shift_histry_ary['name'] = $shift['tmur_user_name'];
                $shift_histry_ary['shift_date'] = $shift['tdsv_shift_date'];
                $shift_histry_ary['update_user'] = $shift['tdsv_update_user']."：".$shift['tdsv_update_user_name'];
                $shift_histry_ary['update_time'] = $shift['log_time'];
                //ChromePhp::log($shift_histry_ary);

                //通常の時間変更
                if($shift['tdsv_shift_time'] != $shift['tdsv_shift_time_old']){

                    //変更前
                    //99「その他」のときは、自由記述欄を適用する
                    if($shift['tdsv_shift_time_old'] == 99){
                        $shift_histry_ary['change_before'] = $shift['tdsv_free_descripsion_old'];
                    }else{
                        $shift_histry_ary['change_before'] = $this->define['hope_shift_sv'][$shift['tdsv_shift_time_old']];
                    }

                    //変更後
                    //99「その他」のときは、自由記述欄を適用する
                    if($shift['tdsv_shift_time'] == 99){
                        $shift_histry_ary['change_after'] = $shift['tdsv_free_descripsion'];
                    }else{
                        $shift_histry_ary['change_after'] = $this->define['hope_shift_sv'][$shift['tdsv_shift_time']];
                    }

                }

                //ChromePhp::log($shift_histry_ary);
                $total_shift_histry_ary[] = $shift_histry_ary;

                $key++;
            }

            return $total_shift_histry_ary;
            
        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }
    

    public function get_sv_shift_log(){

        try{

            $sql = <<<EOF
                SELECT
                cw1.tdbs_user_id AS tdbs_user_id,
                cw1.tmur_user_name AS tmur_user_name,
                cw1.tdbs_shift_date AS tdbs_shift_date,
                cw1.tdbs_shift_time AS tdbs_shift_time,
                cw1.tdbs_fixed_flg AS tdbs_fixed_flg,
                cw1.tdbs_free_descripsion AS tdbs_free_descripsion,
                cw1.tdbs_memo AS tdbs_memo,
                cw1.tdbs_shift_time_old AS tdbs_shift_time_old,
                cw1.tdbs_fixed_flg_old AS tdbs_fixed_flg_old,
                cw1.tdbs_free_descripsion_old AS tdbs_free_descripsion_old,
                cw1.tdbs_memo_old AS tdbs_memo_old,
                cw1.tdbs_release_flg AS tdbs_release_flg,
                cw1.tdbs_create_date AS tdbs_create_date,
                cw1.tdbs_update_date AS tdbs_update_date,
                cw1.tdbs_update_user AS tdbs_update_user,
                tmu.tmur_user_name AS tdbs_update_user_name,
                cw1.log_id AS log_id,
                cw1.log_time AS log_time,
                cw1.ins_flag AS ins_flag
                FROM
                (
                    SELECT
                    tdbs_user_id,
                    tmur_user_name,
                    tdbs_shift_date,
                    tdbs_shift_time,
                    tdbs_fixed_flg,
                    tdbs_free_descripsion,
                    tdbs_memo,
                    tdbs_shift_time_old,
                    tdbs_fixed_flg_old,
                    tdbs_free_descripsion_old,
                    tdbs_memo_old,
                    tdbs_release_flg,
                    tdbs_create_date,
                    tdbs_update_date,
                    tdbs_update_user,
                    log_id,
                    log_time,
                    ins_flag
                    FROM ts_sv_shift_log
                    LEFT OUTER JOIN tm_user
                    ON tdbs_user_id = tmur_user_id
                    WHERE ins_flag = 0
                    ORDER BY log_time DESC
                ) AS cw1
                LEFT OUTER JOIN tm_user AS tmu
                ON tmu.tmur_user_id = cw1.tdbs_update_user
                ORDER BY cw1.log_time DESC
            EOF;

            $stmt = $this->mysql->prepare($sql);
            //$stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $total_shift_histry_ary = Array();

            $key = 0;
            
            while($shift = $stmt->fetch()){
                $shift_histry_ary = Array();
                //ChromePhp::log($shift);
                $shift_histry_ary['target'] = "確定";
                $shift_histry_ary['opid'] = $shift['tdbs_user_id'];
                $shift_histry_ary['name'] = $shift['tmur_user_name'];
                $shift_histry_ary['shift_date'] = $shift['tdbs_shift_date'];
                $shift_histry_ary['update_user'] = $shift['tdbs_update_user']."：".$shift['tdbs_update_user_name'];
                $shift_histry_ary['update_time'] = $shift['log_time'];
                //ChromePhp::log($shift_histry_ary);

                //通常の時間変更
                if($shift['tdbs_shift_time'] != $shift['tdbs_shift_time_old']){

                    //変更前
                    //99「その他」のときは、自由記述欄を適用する
                    if($shift['tdbs_shift_time_old'] == 99){
                        $shift_histry_ary['change_before'] = $shift['tdbs_free_descripsion_old'];
                    }else{
                        if($shift['tdbs_shift_time_old'] != ""){
                            $shift_histry_ary['change_before'] = $this->define['hope_shift_sv'][$shift['tdbs_shift_time_old']];
                        }
                    }

                    //変更後
                    //99「その他」のときは、自由記述欄を適用する
                    if($shift['tdbs_shift_time'] == 99){
                        $shift_histry_ary['change_after'] = $shift['tdbs_free_descripsion'];
                    }else{
                        if($shift['tdbs_shift_time'] != ""){
                            $shift_histry_ary['change_after'] = $this->define['hope_shift_sv'][$shift['tdbs_shift_time']];
                        }
                    }
                
                }

                //ChromePhp::log($shift_histry_ary);
                $total_shift_histry_ary[] = $shift_histry_ary;

                $key++;
            }

            return $total_shift_histry_ary;
            
        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    public function get_shift_business_log(){

        try{
            $sql = <<<EOF
                SELECT
                cw2.tdsb_shift_date AS tdsb_shift_date,
                cw2.tdsb_user_id AS tdsb_user_id,
                cw2.tmur_user_name AS tmur_user_name,
                cw2.tdsb_shift_hour AS tdsb_shift_hour,
                cw2.tdsb_business_id AS tdsb_business_id,
                cw2.tmbc_business_name AS tmbc_business_name,
                cw2.tdsb_business_id_old AS tdsb_business_id_old,
                tmb2.tmbc_business_name AS tmbc_business_name_old,
                cw2.tdsb_free_description AS tdsb_free_description,
                cw2.tdsb_free_description_old AS tdsb_free_description_old,
                cw2.tdsb_create_date AS tdsb_create_date,
                cw2.tdsb_update_date AS tdsb_update_date,
                cw2.tdsb_update_user AS tdsb_update_user,
                cw2.tdsb_update_user_name AS tdsb_update_user_name,
                cw2.log_id AS log_id,
                cw2.log_time AS log_time,
                cw2.ins_flag AS ins_flag
                FROM
                (
                    SELECT
                    cw1.tdsb_shift_date,
                    cw1.tdsb_user_id,
                    cw1.tmur_user_name,
                    cw1.tdsb_shift_hour,
                    cw1.tdsb_business_id,
                    tmb.tmbc_business_name AS tmbc_business_name,
                    cw1.tdsb_business_id_old,
                    cw1.tdsb_free_description,
                    cw1.tdsb_free_description_old,
                    cw1.tdsb_create_date,
                    cw1.tdsb_update_date,
                    cw1.tdsb_update_user,
                    tmu.tmur_user_name AS tdsb_update_user_name,
                    cw1.log_id,
                    cw1.log_time,
                    cw1.ins_flag
                    FROM
                    (
                        SELECT
                        sw1.tdsb_shift_date AS tdsb_shift_date,
                        sw1.tdsb_user_id AS tdsb_user_id,
                        tmur.tmur_user_name AS tmur_user_name,
                        sw1.tdsb_shift_hour AS tdsb_shift_hour,
                        sw1.tdsb_business_id AS tdsb_business_id,
                        sw1.tdsb_business_id_old AS tdsb_business_id_old,
                        sw1.tdsb_free_description AS tdsb_free_description,
                        sw1.tdsb_free_description_old AS tdsb_free_description_old,
                        sw1.tdsb_create_date AS tdsb_create_date,
                        sw1.tdsb_update_date AS tdsb_update_date,
                        sw1.tdsb_update_user AS tdsb_update_user,
                        sw1.log_id AS log_id,
                        sw1.log_time AS log_time,
                        sw1.ins_flag AS ins_flag
                        FROM ts_shift_business_log AS sw1
                        LEFT OUTER JOIN tm_user AS tmur
                        ON sw1.tdsb_user_id = tmur.tmur_user_id
                        WHERE ins_flag = 0
                        ORDER BY log_time DESC
                    )AS cw1
                    LEFT OUTER JOIN tm_user AS tmu
                    ON tmu.tmur_user_id = cw1.tdsb_update_user
                    LEFT OUTER JOIN tm_business_category AS tmb
                    ON tmb.tmbc_business_id = cw1.tdsb_business_id
                    ORDER BY cw1.log_time DESC
                )AS cw2
                LEFT OUTER JOIN tm_business_category AS tmb2
                ON tmb2.tmbc_business_id = cw2.tdsb_business_id_old
                EOF;

                $stmt = $this->mysql->prepare($sql);
                //$stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);
    
                //クエリ実行
                $execute = $stmt->execute();       
                $row_count = $stmt->rowCount();
    
                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
    
                $total_shift_histry_ary = Array();
    
                $key = 0;

                while($shift = $stmt->fetch()){
                    $shift_histry_ary = Array();
                    //ChromePhp::log($shift);
                    $shift_histry_ary['target'] = "確定";
                    $shift_histry_ary['opid'] = $shift['tdsb_user_id'];
                    $shift_histry_ary['name'] = $shift['tmur_user_name'];
                    $shift_histry_ary['shift_date'] = $shift['tdsb_shift_date'];
                    $shift_histry_ary['update_user'] = $shift['tdsb_update_user']."：".$shift['tdsb_update_user_name'];
                    $shift_histry_ary['update_time'] = $shift['log_time'];
                    //ChromePhp::log($shift_histry_ary);
    
    
                    //変更前
                    $shift_histry_ary['change_before'] = $shift['tdsb_shift_hour']."時：". $shift['tmbc_business_name_old'];
                    //変更後
                    $shift_histry_ary['change_after'] = $shift['tdsb_shift_hour']."時：". $shift['tmbc_business_name'];
    
    
                    //ChromePhp::log($shift_histry_ary);
                    $total_shift_histry_ary[] = $shift_histry_ary;
    
                    $key++;
                }
    
                return $total_shift_histry_ary;
        


        } catch(Exception $e) {
            ChromePhp::log($e);
        }


    }

    public function get_operation_log(){

        try{
            $sql = <<<EOF
                SELECT
                id,
                user_id,
                tmur_user_name,
                target_menu,
                category,
                event,
                comment,
                operation_date
                FROM ts_operation_log
                LEFT OUTER JOIN tm_user
                ON tmur_user_id = user_id
                ORDER BY operation_date DESC
            EOF;

            $stmt = $this->mysql->prepare($sql);
            //$stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $total_shift_histry_ary = Array();

            while($shift = $stmt->fetch()){
                $shift_histry_ary = Array();
                $shift_histry_ary['update_date'] = $shift['operation_date'];
                $shift_histry_ary['contents'] = $shift['category']." ".$shift['event'].$shift['comment'];
                $shift_histry_ary['update_user'] = $shift['tmur_user_name'];

                $total_shift_histry_ary[] = $shift_histry_ary;
                
            }
        
            return $total_shift_histry_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

    public function get_hope_shift_insert_log(){

        try{

            $sql = <<<EOF
                SELECT
                cw1.tdsh_user_id AS tdsh_user_id,
                cw1.tmur_user_name AS tmur_user_name,
                cw1.log_time AS log_time,
                cw1.tdsh_update_user AS tdsh_update_user,
                tmu.tmur_user_name AS tdsh_update_user_name
                FROM
                (
                    SELECT 
                    tdsh_user_id,
                    tmur_user_name,
                    log_time,
                    tdsh_update_user
                    FROM ts_op_hope_shift_log
                    LEFT OUTER JOIN tm_user
                    ON tmur_user_id = tdsh_user_id
                    WHERE ins_flag = 1
                    GROUP BY tdsh_user_id,
                    tmur_user_name,
                    log_time,
                    tdsh_update_user
                ) AS cw1
                LEFT OUTER JOIN tm_user AS tmu
                ON tmu.tmur_user_id = cw1.tdsh_update_user
            EOF;

            $stmt = $this->mysql->prepare($sql);
            //$stmt->bindParam(":tmur_user_id" , $this->vars['tmur_user_id']);

            //クエリ実行
            $execute = $stmt->execute();       
            $row_count = $stmt->rowCount();

            $total_shift_histry_ary = Array();

            while($shift = $stmt->fetch()){
                $shift_histry_ary = Array();
                $shift_histry_ary['update_date'] = $shift['log_time'];
                $shift_histry_ary['contents'] = $shift['tdsh_user_id']."：".$shift['tmur_user_name']."　希望シフト新規登録";
                $shift_histry_ary['update_user'] = $shift['tmur_user_name'];

                $total_shift_histry_ary[] = $shift_histry_ary;
                
            }

            return $total_shift_histry_ary;
            
        } catch(Exception $e) {
            ChromePhp::log($e);
        }

    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

