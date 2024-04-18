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

        // ワンタイムトークン生成
        $toke_byte = openssl_random_pseudo_bytes(16);
        $csrf_token = bin2hex($toke_byte);
        // トークンをセッションに保存
        $_SESSION['csrf_token'] = $csrf_token;        
        $this->result->add('csrf_token',$csrf_token);
        
        //現在の希望シフト登録期間
        $section = $this->get_hope_shift_section();
        ChromePhp::log($section);
        if($section == false){
            $this->result->add('section_sta',"");
            $this->result->add('section_end',"");
        }else{
            $this->result->add('section_sta',$section['tshs_start_date']);
            $this->result->add('section_end',$section['tshs_end_date']);
        }

        $this->display('shift/shift_confirm.tpl');
        
    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

