<?php
require_once '../common.php';

/**デバッキングコンソール */
include  '../ChromePhp.php';

//ini_set('display_errors',1);
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as Reader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as Writer;

require '../../vendor/autoload.php';

//バリデート
//$this->validate('shift/shift_import');

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
    

    public function CALLBACK__INDEX(){

        //ファイルアップロード
        if (is_uploaded_file($_FILES["lg_file_upload"]["tmp_name"])) {
            if (move_uploaded_file($_FILES["lg_file_upload"]["tmp_name"], "../excel/" . $_FILES["lg_file_upload"]["name"])) {
                chmod("../excel/" . $_FILES["lg_file_upload"]["name"], 0644);
                //echo $_FILES["upfile"]["name"] . "をアップロードしました。";

                //アップロードしたファイルの読み込み
                $reader = new Reader;
                $file_name = "../excel/" . $_FILES["lg_file_upload"]["name"];
                $spreadsheet = $reader->load($file_name);
                //$sheet = $spreadsheet->getSheetByName('Sheet1'); // 読み込むシートを指定
                $sheet       = $spreadsheet->getActiveSheet();
                date_default_timezone_set('Asia/Tokyo');

                /**データマッピング */
                $SHIFT_DATE = 65; //A列
                $OP_ID = 67;//C列
                $OP_NAME = 68;//D列
                $HOUR_ZERO = 71;//G列
                
                //先頭行
                $row_num = 2;

                //色情報取得
                $color_info = $this->get_business_color_info();
                //全体取得用配列
                $all_color_ary = Array();
                //$sheet->getCell(chr($SHIFT_DATE).$row_num)->getValue();
                //シフト日付
                $shift_date = $sheet->getCell("A2")->getValue();
                
                
                while($sheet->getCell(chr($SHIFT_DATE).$row_num)->getValue() != ''){

                    //ID50000以上59999以下のみ処理をする
                    if($sheet->getCell(chr($OP_ID).$row_num)->getValue() >= 50000 && $sheet->getCell(chr($OP_ID).$row_num)->getValue() <= 59999){

                        //当該OPIDが存在しなければスルー
                        if($this->chk_is_user($sheet->getCell(chr($OP_ID).$row_num)->getValue()) == false){
                            ChromePhp::log($sheet->getCell(chr($OP_ID).$row_num)->getValue());
                            continue;
                        }

                        //横方向へ検索（時間別）
                        //0時台～23時台を横方向に検索
                        $w_color_ary = Array();
                        for($i = 0 ;$i < 24; $i++){
                            $chr_val = $HOUR_ZERO + $i;
                            if($i == 20){
                                $cell_chr = "AA";
                            }else if($i == 21){
                                $cell_chr = "AB";
                            }else if($i== 22){
                                $cell_chr = "AC";
                            }else if($i == 23){
                                $cell_chr = "AD";
                            }else{
                                $cell_chr = chr($HOUR_ZERO + $i);
                            }
                            //ChromePhp::log($cell_chr.$row_num);
                            //ChromePhp::log($sheet->getCell("O9")->getValue());
                        
                            //ChromePhp::log(in_array($sheet->getCell(chr($chr_val).$row_num)->getValue() , $color_info));
                            //ChromePhp::log($sheet->getCell(chr($HOUR_ZERO + $i).$row_num));
                            //if(in_array($sheet->getCell(chr($HOUR_ZERO + $i).$row_num)->getValue() , $color_info) == true){
                                
                            if(in_array($sheet->getCell($cell_chr.$row_num)->getValue() , $color_info) == true){
                                //$w_color_ary['shift_hour'] = $i;
                                //$w_color_ary['business_color_prefix'] = $sheet->getCell(chr($HOUR_ZERO + $i).$row_num)->getValue();
                                //$w_color_ary[$i] = $sheet->getCell(chr($HOUR_ZERO + $i).$row_num)->getValue();
                                $w_color_ary[$i]['prefix'] = $sheet->getCell(chr($HOUR_ZERO + $i).$row_num)->getValue();
                                $w_color_ary[$i]['shift_date'] = $sheet->getCell(chr($SHIFT_DATE).$row_num)->getValue();


                            }
                            
                        }
                        
                        $all_color_ary[$sheet->getCell(chr($OP_ID).$row_num)->getValue()] = $w_color_ary;
        
                    }

                    //行更新
                    $row_num = $row_num + 1;

                }// end of while()

                ChromePhp::log($all_color_ary);

                //insert
                foreach($all_color_ary as $target_userid => $val){

                    if(empty($val) == true){
                        continue;
                    }

                    try{

                        //トランザクション開始
                        $this->mysql->beginTransaction();            
            
                        $sql = <<<EOF
                            INSERT INTO td_shift_business
                            (
                                tdsb_shift_date,
                                tdsb_user_id,
                                tdsb_business_id,
                                tdsb_shift_hour,
                                tdsb_create_date,
                                tdsb_update_date,
                                tdsb_update_user
                            )
                            VALUES
                        EOF;  

                        $target_sql = "";

                        foreach($val as $shift_hour => $prefix){

                            $target_sql .= "(";
                            $target_sql .= ":tdsb_shift_date".$shift_hour.",";
                            $target_sql .= ":tdsb_user_id".$shift_hour.",";
                            $target_sql .= ":tdsb_business_id".$shift_hour.",";
                            $target_sql .= ":tdsb_shift_hour".$shift_hour.",";
                            $target_sql .= ":tdsb_create_date".$shift_hour.",";
                            $target_sql .= ":tdsb_update_date".$shift_hour.",";
                            $target_sql .= ":tdsb_update_user".$shift_hour;
                            $target_sql .= "),";
                                        
                        }

                        $target_sql = rtrim($target_sql, ",");
                        $sql = $sql.$target_sql;

                        $sql .= <<<EOF
                            ON DUPLICATE KEY UPDATE
                            tdsb_shift_date = VALUES(tdsb_shift_date),
                            tdsb_user_id = VALUES(tdsb_user_id),
                            tdsb_business_id = VALUES(tdsb_business_id),
                            tdsb_shift_hour = VALUES(tdsb_shift_hour),
                            tdsb_update_date = VALUES(tdsb_update_date),
                            tdsb_update_user = VALUES(tdsb_update_user)
                        EOF;  
                        $stmt = $this->mysql->prepare($sql);

                        //業務番号情報の配列を逆引きにする
                        $color_info_rev = array_flip($color_info);

                        foreach($val as $shift_hour => $prefix){

                            $today = date("Y-m-d H:i:s");
                            $user_id = $_SESSION['login_info']['user_id'];
            
                            $stmt->bindValue(":tdsb_shift_date".$shift_hour , $prefix['shift_date']);//シフト日付
                            $stmt->bindValue(":tdsb_user_id".$shift_hour , $target_userid);//ID
                            $stmt->bindValue(":tdsb_shift_hour".$shift_hour , $shift_hour , PDO::PARAM_INT);//シフト時間
                            $stmt->bindValue(":tdsb_business_id".$shift_hour , $color_info_rev[$prefix['prefix']] , PDO::PARAM_INT);//業務番号
                            $stmt->bindValue(":tdsb_create_date".$shift_hour , $today);
                            $stmt->bindValue(":tdsb_update_date".$shift_hour , $today);
                            $stmt->bindValue(":tdsb_update_user".$shift_hour , $user_id);
                                                    
                        }

                        //クエリ実行
                        $execute = $stmt->execute();
                        // DEBUG OUTPUT
                        //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
                        
                        //トランザクションコミット
                        $this->mysql->commit();
                        //echo json_encode("ok");
                        $shift_date_str = date('Y-m-d',  strtotime($shift_date));
                        header("Location: business_assign.php?showen_date=".$shift_date_str);

                    } catch(Exception $e) {
                        //ロールバック
                        $this->mysql->rollback();
                        ChromePhp::log($e);
                        //echo json_encode("ng");


                    }
                                
                }
                

            } else {
            //echo "ファイルをアップロードできません。";
            }
        } else {
        //echo "ファイルが選択されていません。";
        }
    }

    public function get_business_color_info(){

        try{

            $sql = "SELECT tmbc_business_id , IFNULL(tmbc_prefix,'') AS tmbc_prefix FROM tm_business_category ";
            $sql .= " WHERE tmbc_prefix != '' ";

            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $execute = $stmt->execute();

            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
            
            $row_count = $stmt->rowCount();
            //結果用配列
            $color_ary = Array();

            while($color = $stmt->fetch()){
                $color_ary[$color['tmbc_business_id']] = $color['tmbc_prefix'];
            }        

            return $color_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }

    public function chk_is_user($target_opid){

        try{

            $sql = "SELECT tmur_user_id FROM tm_user WHERE tmur_user_id = :tmur_user_id ";
            $stmt = $this->mysql->prepare($sql);

            $stmt->bindParam(":tmur_user_id" , $target_opid);

            //クエリ実行
            $execute = $stmt->execute();
            // DEBUG OUTPUT
            //ChromePhp::log($this->db->pdo_debugStrParams($stmt));  
            
            $row_count = $stmt->rowCount();

            if($row_count == 1){
                return true;
            }else{
                return false;
            }

        } catch(Exception $e) {
            ChromePhp::log($e);
            return false;
        }

    }


}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();


?>