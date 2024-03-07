<?php
/*
    * フレームワーク共通ファイルの呼び込み
*/
require_once '../common.php';
ini_set('display_errors', "On");
/**デバッキングコンソール */
include  '../ChromePhp.php';
/**レスポンスヘッダ */
//header("Content-Type: application/json; charset=utf-8");
//header("Access-Control-Allow-Origin: *");

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as Reader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as Writer;



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

        //バリデート
        $this->validate('shift/business_assign');

        //JS/CSSファイルのバージョン値（キャッシュ対策）
        $this->result->add('ver',rand());
        // ワンタイムトークン生成
        $toke_byte = openssl_random_pseudo_bytes(16);
        $csrf_token = bin2hex($toke_byte);
        // トークンをセッションに保存
        $_SESSION['csrf_token'] = $csrf_token;        
        $this->result->add('csrf_token',$csrf_token);
        
        //対象年月日取得
        if($this->vars['showen_date'] == ""){
            $today = date("Y-m-d");
            $this->result->add('showen_date',$today);
        }else{
            $this->result->add('showen_date',$this->vars['showen_date']);
        }
        //インポート区分
        $this->result->add('import_kbn',$this->define['import_kbn']);



        $this->display('shift/shift_print.tpl');
        
    }

    

    function get_business_color(){

        try{

            $sql = <<<EOF
                SELECT
                    tmbc_business_id,
                    tmbc_business_name,
                    tmbc_color_code,
                    tmbc_import_class
                FROM tm_business_category
            EOF;
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $business_ct = Array();

            while($shift = $stmt->fetch()){
                $business_ct[$shift['tmbc_business_id']] = $shift['tmbc_color_code'];
            }

            //$business_ct = $stmt->fetchAll();

            return $business_ct;
            
        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }
    }

    function get_business_name(){

        try{

            $sql = <<<EOF
                SELECT
                    tmbc_business_id,
                    tmbc_business_name,
                    tmbc_color_code,
                    tmbc_import_class
                FROM tm_business_category
            EOF;
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

            $business_nm = Array();

            while($shift = $stmt->fetch()){
                $business_nm[$shift['tmbc_business_id']] = $shift['tmbc_business_name'];
            }

            //$business_ct = $stmt->fetchAll();

            return $business_nm;
            
        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }
    }

    public function CALLBACK__shift_print(){

        //header("Content-Type: application/json; charset=utf-8");

        require '../../vendor/autoload.php';

        //バリデート
        $this->validate('shift/shift_print');

        if($this->vars['target_date'] == ""){
            //echo json_encode("ng");
            exit();
        }        

        //テンプレートの読み込み
        $reader = new Reader;
        $file_name = '../excel/shift_template.xlsx';
        $spreadsheet = $reader->load($file_name);
        
        $sheet       = $spreadsheet->getActiveSheet();
        date_default_timezone_set('Asia/Tokyo');

        //出力データシフトデータをjsから受け取る
        $json = $_POST['shift_data_ary'];
        //POSTされたjsonを配列に変換
        $shift_data_ary = json_decode($json,true);
        //ChromePhp::log($shift_data_ary);

        //業務色分け情報をjsから取得
        $json = $_POST['business_assign_ary'];
        $business_assign_ary = json_decode($json,true);
        //ChromePhp::log($business_assign_ary);

        //業務別人数情報をjsから取得
        $json = $_POST['shift_count_by_time'];
        $shift_count_by_time_ary = json_decode($json,true);
        //ChromePhp::log($shift_count_by_time_ary);

        //業務色マスタからベースの色情報を取得
        $business_ct = $this->get_business_color();
        //ChromePhp::log($business_ct);

        //業務色マスタから業務名情報を取得
        $business_nm = $this->get_business_name();
        
        //行番号カウンター
        $row_cnt = 3;
        //列番号文字コード（B=66）
        $col_cnt = 66;
        
        foreach($shift_data_ary as $key => $val){
            //ChromePhp::log($shift_data_ary[$key]);
            //当該OPのシフト色分け情報
            $business_color_by_user = Array();
            $business_color_by_user[0] = "";
            $business_color_by_user[1] = "";
            $business_color_by_user[2] = "";
            $business_color_by_user[3] = "";
            $business_color_by_user[4] = "";
            $business_color_by_user[5] = "";
            $business_color_by_user[6] = "";
            $business_color_by_user[7] = "";
            $business_color_by_user[8] = "";
            $business_color_by_user[9] = "";
            $business_color_by_user[10] = "";
            $business_color_by_user[11] = "";
            $business_color_by_user[12] = "";
            $business_color_by_user[13] = "";
            $business_color_by_user[14] = "";
            $business_color_by_user[15] = "";
            $business_color_by_user[16] = "";
            $business_color_by_user[17] = "";
            $business_color_by_user[18] = "";
            $business_color_by_user[19] = "";
            $business_color_by_user[20] = "";
            $business_color_by_user[21] = "";
            $business_color_by_user[22] = "";
            $business_color_by_user[23] = "";

            //当該OPの自由記述欄情報
            $free_description_by_user = Array();
            $free_description_by_user[0] = "";
            $free_description_by_user[1] = "";
            $free_description_by_user[2] = "";
            $free_description_by_user[3] = "";
            $free_description_by_user[4] = "";
            $free_description_by_user[5] = "";
            $free_description_by_user[6] = "";
            $free_description_by_user[7] = "";
            $free_description_by_user[8] = "";
            $free_description_by_user[9] = "";
            $free_description_by_user[10] = "";
            $free_description_by_user[11] = "";
            $free_description_by_user[12] = "";
            $free_description_by_user[13] = "";
            $free_description_by_user[14] = "";
            $free_description_by_user[15] = "";
            $free_description_by_user[16] = "";
            $free_description_by_user[17] = "";
            $free_description_by_user[18] = "";
            $free_description_by_user[19] = "";
            $free_description_by_user[20] = "";
            $free_description_by_user[21] = "";
            $free_description_by_user[22] = "";
            $free_description_by_user[23] = "";
            
            if($shift_data_ary[$key]['tdbc_holiday_flg'] == 1 || $shift_data_ary[$key]['tdbc_start_time_first'] == "" || $shift_data_ary[$key]['tdbc_end_time_first'] == ""){
            //if($shift_data_ary[$key]['tdbc_holiday_flg'] == 1 ){
                //continue;
            }else{

                $start_hour_first = null;//第1区間開始時刻
                $end_hour_first = null;//第1区間終了時刻
                $start_hour_second = null;//第2区間開始時刻
                $end_hour_second = null;//第2区間終了時刻

                //開始時刻と終了時刻を取得
                if(strlen($shift_data_ary[$key]['tdbc_start_time_first']) == 4){
                    $start_hour_first = substr($shift_data_ary[$key]['tdbc_start_time_first'],0,2);
                }
                if(strlen($shift_data_ary[$key]['tdbc_end_time_first']) == 4){
                    $end_hour_first = substr($shift_data_ary[$key]['tdbc_end_time_first'],0,2);
                }
                if(strlen($shift_data_ary[$key]['tdbc_start_time_second']) == 4){
                    $start_hour_second = substr($shift_data_ary[$key]['tdbc_start_time_second'],0,2);
                }
                if(strlen($shift_data_ary[$key]['tdbc_end_time_second']) == 4){
                    $end_hour_second = substr($shift_data_ary[$key]['tdbc_end_time_second'],0,2);
                }

                //当該OPのシフト色取得
                foreach($business_assign_ary[$shift_data_ary[$key]['tdbc_user_id']] as $key2 => $val2){
                    if($val2['tdsb_shift_hour'] == ""){
                        continue;
                    } 
                    $business_color_by_user[$val2['tdsb_shift_hour']] = $val2['tdsb_business_id'];
                }

                //当該OPの自由記述欄情報取得する
                foreach($business_assign_ary[$shift_data_ary[$key]['tdbc_user_id']] as $key3 => $val3){
                    if($val3['tdsb_shift_hour'] == ""){
                        continue;
                    } 
                    $free_description_by_user[$val3['tdsb_shift_hour']] = $val3['tdsb_free_description'];
                }

                /**シフト表の書き込み */
                
                //枠線
                for($j = 67; $j < 91; $j++){
                    $borders = $sheet->getStyle(chr($j).$row_cnt)->getBorders();
                    $borders
                    ->getTop()
                    ->setBorderStyle('thin');
                    $borders
                    ->getRight()
                    ->setBorderStyle('thin');     
                    $borders
                    ->getBottom()
                    ->setBorderStyle('thin');     
                    $borders
                    ->getLeft()
                    ->setBorderStyle('thin');     
                }

                //氏名欄
                $sheet->getCell( chr($col_cnt).$row_cnt )->setValue( $shift_data_ary[$key]['tdbc_user_id']."：".$shift_data_ary[$key]['tmur_user_name'] );
                //枠線
                $borders = $sheet->getStyle(chr($col_cnt).$row_cnt)->getBorders();
                $borders
                ->getLeft()
                ->setBorderStyle('thin');

                //シフト欄（シフト情報が保存されている場合のみ実施）
                if($start_hour_first != null && $end_hour_first != null){

                    for($i = (int)$start_hour_first; $i < (int)$end_hour_first; $i++){
                        
                        //業務番号
                        $business_id = $business_color_by_user[$i];
                        //自由記述欄情報
                        $free_desctiption =  $free_description_by_user[$i];
                        //カラーコードRGB
                        $color_code = "";
                        //ChromePhp::log($business_id);
                        if($business_id != ""){
                            $color_code = $business_ct[$business_id];
                            $color_code = str_replace('#','',$color_code);
                        }
                        //$sheet->getCell( chr($col_cnt + $i + 1).$row_cnt )->setValue($business_color_by_user[$i]);
                        //自由記述欄がある場合は、そちらが優先される
                        if($free_desctiption != ""){
                            $sheet->getCell( chr($col_cnt + $i + 1).$row_cnt )->setValue($free_desctiption);
                        }else{
                            $sheet->getCell( chr($col_cnt + $i + 1).$row_cnt )->setValue($business_id);
                        }
                        //セル色の設定
                        if($color_code != ""){
                            $sheet->getStyle(chr($col_cnt + $i + 1).$row_cnt)
                            ->getFill()
                            ->setFillType('solid')
                            ->getStartColor()
                            ->setRGB($color_code);
                        }                        
                            
                    }

                }

                $row_cnt = $row_cnt + 1;

            }//end of if()

        }//end of foreach()

        /**業務別人数の表示 */

        foreach($shift_count_by_time_ary as $key => $val){

            //列番号はB列まで戻す
            $col_cnt = 66;

            //氏名欄は業務番号：業務名を表記
            $sheet->getCell( chr($col_cnt).$row_cnt )->setValue( $key."：".$business_nm[$key] );
            //カラーコード
            $color_code = $business_ct[$key];
            $color_code = str_replace('#','',$color_code);
            //セル色の設定
            if($color_code != ""){
                $sheet->getStyle(chr($col_cnt).$row_cnt)
                ->getFill()
                ->setFillType('solid')
                ->getStartColor()
                ->setRGB($color_code);
            }               
            
            //時刻欄に人数を出力する
            for($i = 0; $i < 24; $i++){
                
                $sheet->getCell( chr($col_cnt + $i + 1).$row_cnt )->setValue($val[$i]);
                //枠線
                $borders = $sheet->getStyle(chr($col_cnt + $i + 1).$row_cnt)->getBorders();
                $borders
                ->getTop()
                ->setBorderStyle('thin');
                $borders
                ->getRight()
                ->setBorderStyle('thin');     
                $borders
                ->getBottom()
                ->setBorderStyle('thin');     
                $borders
                ->getLeft()
                ->setBorderStyle('thin');     
                
            }

            $row_cnt = $row_cnt + 1;
        }

        //日付を出力
        $sheet->getCell( "B1" )->setValue( date('Y年m月d日', strtotime($this->vars['target_date']))."　勤務シフト表" );

        //0時～7時と22時～23時の列を非表示にしておく
        $sheet->getColumnDimension('C')->setVisible(false);
        $sheet->getColumnDimension('D')->setVisible(false);
        $sheet->getColumnDimension('E')->setVisible(false);
        $sheet->getColumnDimension('F')->setVisible(false);
        $sheet->getColumnDimension('G')->setVisible(false);
        $sheet->getColumnDimension('H')->setVisible(false);
        $sheet->getColumnDimension('I')->setVisible(false);
        $sheet->getColumnDimension('J')->setVisible(false);
        $sheet->getColumnDimension('Y')->setVisible(false);
        $sheet->getColumnDimension('Z')->setVisible(false);
        //ファイル保存
        $writer = new Writer($spreadsheet);
        $outputPath = '../excel/hogehoge.xlsx';
        $writer->save( $outputPath );
        //ファイル名をURLにセット
        $filename = basename($outputPath);
        ChromePhp::log($filename);
        $this->result->add('file_name',$filename);
        
    }
}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

