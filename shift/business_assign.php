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

        $this->display('shift/business_assign.tpl');
        
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

            $business_ct = $stmt->fetchAll();

            return $business_ct;
            
        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }
    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

