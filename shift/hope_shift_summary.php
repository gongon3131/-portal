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
        $this->validate('shift/hope_shift_summary');

        //JS/CSSファイルのバージョン値（キャッシュ対策）
        $this->result->add('ver',rand());
        //現在の希望シフト登録期間
        $section;
        //OP
        if($_SESSION['login_info']['user_authority'] == 1){
            $section = $this->get_hope_shift_section();
        //SV
        }else if($_SESSION['login_info']['user_authority'] == 2){
            $section = $this->get_hope_shift_section_sv();
        //管理者
        }else if($_SESSION['login_info']['user_authority'] == 9){

            //OP登録状況一覧
            if($this->vars['target'] == 1){
                $section = $this->get_hope_shift_section();
            //SV登録状況一覧
            }else if($this->vars['target'] == 2){
                $section = $this->get_hope_shift_section_sv();
            }
            
        }

        if($section == false){
            $this->result->add('section_sta',"");
            $this->result->add('section_end',"");
        }else{
            $this->result->add('section_sta',$section['tshs_start_date']);
            $this->result->add('section_end',$section['tshs_end_date']);
        }
        
        //管理者用
        if($_SESSION['login_info']['user_authority'] == 9){
            $this->result->add('target',$this->vars['target']);
            $this->display('shift/hope_shift_summary.tpl');
        //SV・OP用
        }else{
            $this->display('shift/hope_shift_summary_personal.tpl');
        }

    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

