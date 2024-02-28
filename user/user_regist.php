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

        //バリデート
        $this->validate('user/get_one_user');
        //編集時にはIDをhiddenにセット
        if($this->vars['tmur_id'] == 0){
            $this->result->add('tmur_id',"");
        }else{
            $this->result->add('tmur_id',$this->vars['tmur_id']);
        }

        $this->result->add('tmur_id',$this->vars['tmur_id']);
        $this->display('user/user_regist.tpl');
        
    }

    public function get_all_business(){

        try{
            $sql = "SELECT tmbc_business_id , tmbc_business_name FROM tm_business_category ";
            $stmt = $this->mysql->prepare($sql);

            //クエリ実行
            $stmt->execute();   
            //結果保存用配列
            $business_ary = Array();

            while($business = $stmt->fetch()){

                $business_ary[$business['tmbc_business_id']] = $business['tmbc_business_name'];
            }

            return $business_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }            


    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

