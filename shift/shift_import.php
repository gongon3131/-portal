<?php
require_once '../../common.php';

/**デバッキングコンソール */
include  '../../ChromePhp.php';

//ini_set('display_errors',1);
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as Reader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as Writer;

require '../../../vendor/autoload.php';

//バリデート
$this->validate('shift/shift_import');

$import_class_no = $this->vars['target_business_no'];
$period_from = $this->vars['target_date_from'];
$period_to = $this->vars['target_date_to'];

//当該集計期間のインポート情報取得
$all_import_data_ary = $this->get_import_data($import_class_no,$period_from,$period_to);
//OPの属性情報取得
$all_user_info_ary = $this->get_user_info();

//テンプレートの読み込み
$reader = new Reader;
$file_name = '../../excel/import_template.xlsx';
$spreadsheet = $reader->load($file_name);
date_default_timezone_set('Asia/Tokyo');

/**データマッピング */
$OP_ID = 65;//A列
$OP_NAME = 66;//B列
$OCCUPATION = 67;//C列
$EMPLOYMENT_STA = 68;//D列
$HOUR_ZERO = 69;//E列
//ChromePhp::log($all_import_data_ary);
foreach($all_import_data_ary as $target_date => $op_data){

    //行番号カウンター
    $row_cnt = 2;
    
    //対象となる日付の「日」と「月」を取得
    $target_day = date('d',  strtotime($target_date));
    $target_month = date('m',  strtotime($target_date));
    //シート選択
    //ChromePhp::log($target_day);
    $sheet = $spreadsheet->getSheetByName($target_day);

    //ChromePhp::log($op_data);
    //OPの属性情報を入力
    foreach($op_data as $opid => $val){

        //ID
        $sheet->setCellValue(chr($OP_ID).$row_cnt,$all_user_info_ary[$opid]['tmur_user_id']);
        //氏名
        $sheet->setCellValue(chr($OP_NAME).$row_cnt,$all_user_info_ary[$opid]['tmur_user_name']);
        //職種
        $sheet->setCellValue(chr($OCCUPATION).$row_cnt,$all_user_info_ary[$opid]['tmur_authority']);
        //雇用形態
        $sheet->setCellValue(chr($EMPLOYMENT_STA).$row_cnt,$all_user_info_ary[$opid]['tmur_employment_status']);

        //0時（E列）～23時（AB列）
        foreach($val as $hour){
            $sheet->setCellValue(chr($HOUR_ZERO + $hour).$row_cnt,1);
        }

        $row_cnt = $row_cnt + 1;

    }

}

//ファイル保存
$writer = new Writer($spreadsheet);
$outputPath = '../../excel/fugafuga.xlsx';
$writer->save( $outputPath );
//ファイル名をURLにセット
$filename = basename($outputPath);
$file_size = filesize($outputPath);
$extension = pathinfo($outputPath)['extension'];

header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Type: application/force-download");
header("Content-Length: {$file_size}");
//header("Content-Disposition: attachment; filename={$filename}.{$extension}");
header("Content-Disposition: attachment; filename={$filename}");
ob_end_clean();
readfile($outputPath);

public function get_user_info(){

    try{

        $sql = <<<EOF
            SELECT tmur_user_id,tmur_user_name,tmur_employment_status,tmur_authority
            FROM tm_user
            WHERE tmur_import_status = 1 AND tmur_is_used = 1
        EOF;
        $stmt = $this->mysql->prepare($sql);

        //クエリ実行
        $execute = $stmt->execute();

        $all_user_info_ary = Array();

        while($info = $stmt->fetch()){

            $one_user_info_ary = Array();

            $one_user_info_ary['tmur_user_id'] = $info['tmur_user_id'];
            $one_user_info_ary['tmur_user_name'] = $info['tmur_user_name'];
            $one_user_info_ary['tmur_employment_status'] = $this->define['employment_status'][$info['tmur_employment_status']];
            $one_user_info_ary['tmur_authority'] = $this->define['user_type'][$info['tmur_authority']];
            $all_user_info_ary[$info['tmur_user_id']] = $one_user_info_ary;
        }

        return $all_user_info_ary;

    } catch(Exception $e) {
        ChromePhp::log($e);
        return ("ng");
    }
}

public function get_all_user(){

    try{

        $sql = <<<EOF
            SELECT tmur_user_id,tmur_user_name,tmur_employment_status,tmur_authority
            FROM tm_user
            WHERE tmur_import_status = 1 AND tmur_is_used = 1
        EOF;
        $stmt = $this->mysql->prepare($sql);

        //クエリ実行
        $execute = $stmt->execute();
        $all_user_ary = $stmt->fetchAll();

        return $all_user_ary;

    } catch(Exception $e) {
        ChromePhp::log($e);
        return ("ng");
    }

}

public function get_import_data($import_class_no,$period_from,$period_to){

    //対象となるユーザーを全聚徳
    $all_user_ary = $this->get_all_user();
    //ChromePhp::log($all_user_ary);
    //全体データ保存用配列
    $all_import_data_ary = Array();

    //集計期間を日付オブジェクトに保存する
    $period_from_w = new Datetime($period_from);
    $period_to_w = new Datetime($period_to);

    while($period_from_w <= $period_to_w){

        $one_import_data_ary = Array();

        //日付オブジェクトをY-m-dのフォーマットに戻す
        $section_date_from = $period_from_w->format('Y-m-d');
        //対象となるユーザーを上から順に保存する
        foreach($all_user_ary as $key => $one_user){
           
            try{
                $sql = <<<EOF
                    SELECT
                    tdsb_shift_date,
                    tdsb_user_id,
                    tdsb_shift_hour,
                    tdsb_business_id,
                    tmbc_import_class,
                    tdsb_free_description
                    FROM td_shift_business
                    LEFT OUTER JOIN tm_business_category
                    ON tmbc_business_id = tdsb_business_id
                    WHERE tdsb_shift_date = :tdsb_shift_date
                    AND tmbc_import_class = :tmbc_import_class
                    AND tdsb_user_id = :tdsb_user_id
                EOF;
                $stmt = $this->mysql->prepare($sql);
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
                $stmt->bindParam(":tdsb_shift_date" , $section_date_from);
                $stmt->bindParam(":tmbc_import_class" , $import_class_no);
                $stmt->bindParam(":tdsb_user_id" , $one_user['tmur_user_id']);

                //クエリ実行
                $execute = $stmt->execute();
                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));
                
                $business_data_ary = Array();

                while($business_data = $stmt->fetch()){
                    $business_data_ary[] = $business_data['tdsb_shift_hour'];
                }
                $one_import_data_ary[$one_user['tmur_user_id']] = $business_data_ary;

            } catch(Exception $e) {
                ChromePhp::log($e);
                return ("ng");
            }

        }

        $all_import_data_ary[$section_date_from] = $one_import_data_ary;

        $period_from_w->modify('+1 day');

    }//end of while()

    //ChromePhp::log($all_import_data_ary);
    return $all_import_data_ary;
    //echo json_encode("ok");
}




?>