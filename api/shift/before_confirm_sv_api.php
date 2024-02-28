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

    public function CALLBACK__summary_sv(){

        //バリデート
        $this->validate('shift/summary_sv');

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
                    tdbs_user_id,
                    tdbs_shift_date,
                    tdbs_shift_time,
                    tdbs_fixed_flg,
                    tdbs_free_descripsion,
                    tdbs_memo,
                    tdbs_release_flg
                    FROM td_before_confirm_shift_sv
                    WHERE tdbs_shift_date = :current_date
                    AND tdbs_release_flg = 0
                EOF;

                $stmt = $this->mysql->prepare($sql);
                $stmt->bindParam(":current_date" , $current_date);

                //クエリ実行
                $execute = $stmt->execute();
                $shift_summary = $stmt->fetchAll();
                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

                $full_user_shift_ary = Array();
                $chk_ary = Array();

                //全ユーザー取得
                $all_sv_user = $this->get_all_sv_user();
                
                if(is_null($shift_summary) == true){

                    //未登録者のセット
                    foreach($all_sv_user as $key => $val){
                        //brank_ary
                        $brank_ary['tdbs_fixed_flg'] = "";
                        $brank_ary['tdbs_free_descripsion'] = "";
                        $brank_ary['tdbs_memo'] = "";
                        $brank_ary['tdbs_release_flg'] = "";
                        $brank_ary['tdbs_shift_date'] = $current_date;
                        $brank_ary['tdbs_shift_time'] = "";
                        $brank_ary['tdbs_shift_time_text'] = "";
                        $brank_ary['tdbs_user_id'] = $val['tmur_user_id'];

                        $full_user_shift_ary[$val['tmur_user_id']] = $brank_ary;

                    }

                }else{
                    //ChromePhp::log($shift_summary);
                    foreach($shift_summary as $key => $val){
                        $full_user_shift_ary[$val['tdbs_user_id']] = $val;
                        if($val['tdbs_shift_time'] == null){
                            $full_user_shift_ary[$val['tdbs_user_id']]['tdbs_shift_time_text'] = "";
                        }else{
                            $full_user_shift_ary[$val['tdbs_user_id']]['tdbs_shift_time_text'] = $this->define['hope_shift_sv'][$val['tdbs_shift_time']];
                        }
                        $chk_ary[] = $val['tdbs_user_id'];
                    }
                
                    //ChromePhp::log($chk_ary);

                    //未登録者のセット
                    foreach($all_sv_user as $key => $val){
                        //brank_ary
                        $brank_ary['tdbs_fixed_flg'] = "";
                        $brank_ary['tdbs_free_descripsion'] = "";
                        $brank_ary['tdbs_memo'] = "";
                        $brank_ary['tdbs_release_flg'] = "";
                        $brank_ary['tdbs_shift_date'] = "";
                        $brank_ary['tdbs_shift_time'] = "";
                        $brank_ary['tdbs_shift_time_text'] = "";
                        $brank_ary['tdbs_user_id'] = "";

                        if(!in_array($val['tmur_user_id'], $chk_ary)) {
                            $brank_ary['tdbs_user_id'] = $val['tmur_user_id'];
                            $full_user_shift_ary[$val['tmur_user_id']] = $brank_ary;
                        }
                    }

                    ksort($full_user_shift_ary);

                }

                $total_shift_summary[$current_date] = $full_user_shift_ary;

                $roop_date_sta->modify('+1 day');

            }// end of while()

            //ChromePhp::log($total_shift_summary);
            echo json_encode($total_shift_summary);

        } catch(Exception $e) {
            ChromePhp::log($e);
            echo json_encode("ng");
        }

    }//end of class

    public function CALLBACK__before_confirm_shift_sv_regist(){

        //バリデート
        $this->validate('shift/before_confirm_sv_shift_regist');

        //トークン
        if(isset($this->vars['token']) == false || $this->vars['token'] !== $_SESSION['csrf_token'] ){
            echo json_encode("ng");
            exit();
        }

        //識別
        $tdbs_release_flg = $this->vars['tdbs_release_flg'];

        $json = $_POST['shift_data_ary'];
        //POSTされたjsonを配列に変換
        $shift_data_ary = json_decode($json,true);

        $json = $_POST['remaining_holiday_ary'];
        //POSTされたjsonを配列に変換
        $remaining_holiday_ary = json_decode($json,true);
        ChromePhp::log($remaining_holiday_ary);
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
                    tdbs_memo,
                    tdbs_release_flg,
                    tdbs_create_date,
                    tdbs_update_date,
                    tdbs_update_user
                )
                VALUES
            EOF;  

            foreach($shift_data_ary as $target_date => $shift_user_ary){

                $current_date = date('Ymd', strtotime($target_date));;

                foreach($shift_user_ary as $target_user_id => $val){

                    //すでに確定済みのシフトのときは除外する
                    $chk_confirm = $this->chk_after_confirm($target_user_id,$val['tdbs_shift_date']);
                    if($chk_confirm == 1){
                        continue;
                    }

                    $sql .= "(";
                    $sql .= ":tdbs_user_id".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_shift_date".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_shift_time".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_fixed_flg".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_free_descripsion".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_memo".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_release_flg".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_create_date".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_update_date".$current_date."_".$target_user_id.",";
                    $sql .= ":tdbs_update_user".$current_date."_".$target_user_id;
                    $sql .= "),";

                }

            }
            
            $sql = rtrim($sql, ",");

            $sql .= <<<EOF
                ON DUPLICATE KEY UPDATE
                tdbs_shift_time = VALUES(tdbs_shift_time),
                tdbs_fixed_flg = VALUES(tdbs_fixed_flg),
                tdbs_free_descripsion = VALUES(tdbs_free_descripsion),
                tdbs_memo = VALUES(tdbs_memo),
                tdbs_release_flg = VALUES(tdbs_release_flg),
                tdbs_update_date = VALUES(tdbs_update_date),
                tdbs_update_user = VALUES(tdbs_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);

            foreach($shift_data_ary as $target_date => $shift_user_ary){

                $current_date = date('Ymd', strtotime($target_date));
                
                foreach($shift_user_ary as $target_user_id => $val){

                    //すでに確定済みのシフトのときは除外する
                    $chk_confirm = $this->chk_after_confirm($target_user_id,$val['tdbs_shift_date']);
                    if($chk_confirm == 1){
                        continue;
                    }

                    $tdbs_shift_time = $this->h($val['tdbs_shift_time']);
                    $tdbs_fixed_flg = $this->h($val['tdbs_fixed_flg']);
                    $tdbs_free_descripsion = $this->h($val['tdbs_free_descripsion']);
                    $tdbs_memo = $this->h($val['tdbs_memo']);
                    $today = date("Y-m-d H:i:s");
                    $user_id = $_SESSION['login_info']['user_id'];
    
                    $stmt->bindValue(":tdbs_user_id".$current_date."_".$target_user_id , $target_user_id);//OPID
                    $stmt->bindValue(":tdbs_shift_date".$current_date."_".$target_user_id , $target_date);//シフト年月日
                    //if($tdbs_shift_time == ""){
                    if($tdbs_shift_time == null){
                        //ChromePhp::log($current_date); 
                        //ChromePhp::log($target_user_id); 
                        $stmt->bindValue(":tdbs_shift_time".$current_date."_".$target_user_id , NULL, PDO::PARAM_NULL);//シフト時間
                    }else{
                        $stmt->bindValue(":tdbs_shift_time".$current_date."_".$target_user_id , $tdbs_shift_time , PDO::PARAM_INT);//シフト時間
                    }
                    $stmt->bindValue(":tdbs_fixed_flg".$current_date."_".$target_user_id , $tdbs_fixed_flg , PDO::PARAM_INT);//変更なしフラグ
                    $stmt->bindValue(":tdbs_free_descripsion".$current_date."_".$target_user_id , $tdbs_free_descripsion);//自由記述欄
                    $stmt->bindValue(":tdbs_memo".$current_date."_".$target_user_id , $tdbs_memo);//自由記述欄
                    $stmt->bindValue(":tdbs_release_flg".$current_date."_".$target_user_id , $this->vars['tdbs_release_flg'] , PDO::PARAM_INT);//公開フラグ
                    $stmt->bindValue(":tdbs_create_date".$current_date."_".$target_user_id , $today);//作成日
                    $stmt->bindValue(":tdbs_update_date".$current_date."_".$target_user_id , $today);//更新日
                    $stmt->bindValue(":tdbs_update_user".$current_date."_".$target_user_id , $user_id);//更新者
                    //ChromePhp::log(":tdbs_user_id".$current_date."_".$target_user_id); 

                }

            }

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //前月繰越日数の登録
            $sql = <<<EOF
                INSERT INTO ts_carry_over_holiday
                (
                    tsch_start_date,
                    tsch_end_date,
                    tsch_user_id,
                    tsch_carry_over_holiday,
                    tsch_create_date,
                    tsch_update_date,
                    tsch_update_user
                )
                VALUES
            EOF;  
            
            foreach($remaining_holiday_ary as $target_user_id => $val){

                $sql .= "(";
                $sql .= ":tsch_start_date"."_".$target_user_id.",";
                $sql .= ":tsch_end_date"."_".$target_user_id.",";
                $sql .= ":tsch_user_id"."_".$target_user_id.",";
                $sql .= ":tsch_carry_over_holiday"."_".$target_user_id.",";
                $sql .= ":tsch_create_date"."_".$target_user_id.",";
                $sql .= ":tsch_update_date"."_".$target_user_id.",";
                $sql .= ":tsch_update_user"."_".$target_user_id;
                $sql .= "),";

            }

            $sql = rtrim($sql, ",");
            
            $sql .= <<<EOF
                ON DUPLICATE KEY UPDATE
                tsch_carry_over_holiday = VALUES(tsch_carry_over_holiday),
                tsch_update_date = VALUES(tsch_update_date),
                tsch_update_user = VALUES(tsch_update_user)
            EOF;  
            $stmt = $this->mysql->prepare($sql);
            ChromePhp::log($sql);
            foreach($remaining_holiday_ary as $target_user_id => $val){

                $tsch_start_date = $this->vars['section_sta'];
                $tsch_end_date = $this->vars['section_end'];
                $today = date("Y-m-d H:i:s");
                $user_id = $_SESSION['login_info']['user_id'];

                $stmt->bindValue(":tsch_start_date"."_".$target_user_id , $tsch_start_date);//シフト期間始端
                $stmt->bindValue(":tsch_end_date"."_".$target_user_id , $tsch_end_date);//シフト期間終端
                $stmt->bindValue(":tsch_user_id"."_".$target_user_id , $target_user_id);//OPID
                $stmt->bindValue(":tsch_carry_over_holiday"."_".$target_user_id , $val , PDO::PARAM_INT);//前月繰越数
                $stmt->bindValue(":tsch_create_date"."_".$target_user_id , $today);//作成日
                $stmt->bindValue(":tsch_update_date"."_".$target_user_id , $today);//更新日
                $stmt->bindValue(":tsch_update_user"."_".$target_user_id , $user_id);//更新者

            }

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            //操作ログ
            $this->rec_operation_log($_SESSION['login_info']['user_id'],'確定前シフト','SV・リーダーシフト','シフト公開');
            
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

    function get_all_sv_user(){

        try{
            $sql = <<<EOF
                SELECT
                tmur_id,
                tmur_user_id,
                tmur_user_name
                FROM tm_user
                WHERE tmur_authority = 2
                AND tmur_is_used = 1
                ORDER BY tmur_user_id
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

    public function chk_after_confirm($user_id,$target_date){

        try{

            $sql = "SELECT tdbs_release_flg FROM td_before_confirm_shift_sv ";
            $sql .= " WHERE tdbs_user_id = :tdbs_user_id ";
            $sql .= " AND tdbs_shift_date = :tdbs_shift_date";

            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tdbs_user_id" , $user_id);
            $stmt->bindParam(":tdbs_shift_date" , $target_date);

            //クエリ実行
            $execute = $stmt->execute();
            $row_count = $stmt->rowCount();

            if($row_count == 1){
                $confirm = $stmt->fetch();
                return $confirm['tdbs_release_flg'];
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

