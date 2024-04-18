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

        //JS/CSSファイルのバージョン値（キャッシュ対策）
        $this->result->add('ver',rand());

    }

    //メイン画面出力アクション
    public function CALLBACK__INDEX(){

        //バリデート
        $this->validate('shift/summary_by_date');

        // ワンタイムトークン生成
        $toke_byte = openssl_random_pseudo_bytes(16);
        $csrf_token = bin2hex($toke_byte);
        // トークンをセッションに保存
        $_SESSION['csrf_token'] = $csrf_token;        
        $this->result->add('csrf_token',$csrf_token);
        
        $section = $this->get_hope_shift_section_sv();

        if($section == false){
            $this->result->add('section_sta',"");
            $this->result->add('section_end',"");
        }else{
            $this->result->add('section_sta',$section['tshs_start_date']);
            $this->result->add('section_end',$section['tshs_end_date']);
        }

        $holiday = $this->get_schedule_holiday($section['tshs_start_date'],$section['tshs_end_date']);
        $this->result->add('carry_over_holiday',$holiday);

        //SVメンバー取得
        $sv_user = $this->get_all_sv_user();
        $this->result->add('sv_user_ary',$sv_user);
        $this->result->add('sv_col_num',count($sv_user));

        //前日繰越休日取得
        $carry_over_holiday_ary = $this->get_carry_over_holiday($section['tshs_start_date'],$section['tshs_end_date']);
        //ChromePhp::log($carry_over_holiday_ary);
        $this->result->add('carry_over_holiday_ary',$carry_over_holiday_ary);

        //シフト期間リスト作成
        $all_shift_section = $this->get_shift_section();
        $section_list_ary = Array();

        foreach($all_shift_section as $key => $val){

            $section_sta = new Datetime($val['tshs_start_date']);
            $section_sta =  $section_sta->format('Y年m月d日');
            $section_end = new Datetime($val['tshs_end_date']);
            $section_end =  $section_end->format('Y年m月d日');
            
            $section_list_ary[$val['tshs_id']] = $section_sta."～".$section_end;
        }

        $this->result->add('section_list_ary',$section_list_ary);

        //本日の日付を起点に、デフォルトの値を取得
        $tshs_id = $this->get_today_section();
        $this->result->add('tshs_id',$tshs_id);

        $this->display('shift/sv_shift.tpl');
        
    }

    function get_today_section(){

        try{

            $sql = <<<EOF
                SELECT 
                tshs_id,
                tshs_start_date,
                tshs_end_date
                FROM ts_hope_shift_section_sv
                WHERE tshs_start_date <= Now()
                AND tshs_end_date >= Now()
            EOF;

            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            $all_shift_section = $stmt->fetchAll();
            $row_count = $stmt->rowCount();

            if($row_count == 1){
                return $all_shift_section[0]['tshs_id'];
            }else{
                return "";
            }


        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }        
        
    }

    function get_shift_section(){

        try{

            $sql = <<<EOF
                SELECT 
                tshs_id,
                tshs_start_date,
                tshs_end_date
                FROM ts_hope_shift_section_sv
                WHERE tshs_delete_date >= Now()
            EOF;

            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            $all_shift_section = $stmt->fetchAll();

            return $all_shift_section;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }        

    }

    function get_carry_over_holiday($section_sta,$section_end){

        try{

            $sql = <<<EOF
                SELECT 
                tsch_start_date,
                tsch_end_date,
                tmur_user_id,
                tmur_holiday_manage,
                IFNULL(tsch_carry_over_holiday,0) AS tsch_carry_over_holiday
                FROM tm_user AS tmu
                LEFT OUTER JOIN 
                (
                    SELECT
                    tsch_start_date,
                    tsch_end_date,
                    tsch_user_id,
                    tsch_carry_over_holiday
                    FROM ts_carry_over_holiday
                    WHERE tsch_start_date = :tsch_start_date
                    AND tsch_end_date = :tsch_end_date
                ) AS cw
                ON tmu.tmur_user_id = cw.tsch_user_id
                WHERE tmu.tmur_authority = 2
                ORDER BY tmur_user_id

            EOF;

            $stmt = $this->mysql->prepare($sql);
            $stmt->bindParam(":tsch_start_date" , $section_sta);
            $stmt->bindParam(":tsch_end_date" , $section_end);

            //クエリ実行
            $execute = $stmt->execute();
            $all_user_ary = $stmt->fetchAll();

            return $all_user_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

    function get_all_sv_user(){

        try{
            $sql = <<<EOF
                SELECT
                tmur_id,
                tmur_user_id,
                tmur_user_name,
                tmur_holiday_manage
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

    function get_company_holiday($start_date,$end_date){

        


    }

    function get_schedule_holiday($start_date,$end_date){

        $holiday_ary = Array();

        //期間中の祝日
        try{
            $sql = <<<EOF
                SELECT
                tshs_date,
                tshs_holiday_name
                FROM ts_company_holiday
                WHERE tshs_date >= :start_date
                AND tshs_date <= :end_date

            EOF;
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":start_date" , $start_date);
            $stmt->bindParam(":end_date" , $end_date);

            //クエリ実行
            $execute = $stmt->execute();

            while($holiday = $stmt->fetch()){
                $holiday_ary[] = $holiday['tshs_date'];
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }        
        

        //登録期間の日数取得
        $days = ((strtotime($end_date) - strtotime($start_date)) / 86400);
        //土日取得
        $roop_start_date = new Datetime($start_date);
        $start_date_origin = $roop_start_date;
        $roop_end_date = new Datetime($end_date);

        $holiday_days = 0;

        while ($roop_start_date <= $roop_end_date) {
            $current_day_of_week =  $roop_start_date->format('w');
            $current_date =  $roop_start_date->format('Y-m-d');
            //ChromePhp::log($holiday_ary);
            if($current_day_of_week == 0 || $current_day_of_week == 6){
                $holiday_days = $holiday_days + 1;
            }else{
                if(in_array($current_date, $holiday_ary)) {
                    $holiday_days = $holiday_days + 1;
                }                
            }

            $roop_start_date->modify('+1 day');

        }

        return $holiday_days;

    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

