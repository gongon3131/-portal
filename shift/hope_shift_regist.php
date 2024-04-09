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
        $this->validate('shift/hope_shift_regist');

        //JS/CSSファイルのバージョン値（キャッシュ対策）
        $this->result->add('ver',rand());
        // ワンタイムトークン生成
        $toke_byte = openssl_random_pseudo_bytes(16);
        $csrf_token = bin2hex($toke_byte);
        // トークンをセッションに保存
        $_SESSION['csrf_token'] = $csrf_token;  
        //現在の希望シフト登録期間
        $section;

        $this->result->add('tmur_user_id',$this->vars['tmur_user_id']);
        $this->result->add('csrf_token',$csrf_token);

        //管理者ユーザーからのアクセス
        //OP版
        if($_SESSION['login_info']['user_authority'] == 9 && $this->vars['target'] == 1){

            $section = $this->get_hope_shift_section();       
        
        //SV版
        }else if($_SESSION['login_info']['user_authority'] == 9 && $this->vars['target'] == 2){

            $section = $this->get_hope_shift_section_sv();

        //管理者ユーザー以外からのアクセス
        }else if($this->vars['target'] == ""){

            //OP
            if($_SESSION['login_info']['user_authority'] == 1){
                $section = $this->get_hope_shift_section();
            //SV
            }else if($_SESSION['login_info']['user_authority'] == 2){
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

        if($_SESSION['login_info']['user_authority'] == 9 && $this->vars['target'] == 1){

            $this->display('shift/hope_shift_regist.tpl');

        }else if($_SESSION['login_info']['user_authority'] == 9 && $this->vars['target'] == 2){
            $all_user_ary = $this->get_all_sv_user();
            $this->result->add('all_user_ary',$all_user_ary);               
            $this->display('shift/hope_shift_regist_sv.tpl');

        }else if($this->vars['target'] == ""){

            //OP
            if($_SESSION['login_info']['user_authority'] == 1){
                $this->display('shift/hope_shift_regist.tpl');
            //SV
            }else if($_SESSION['login_info']['user_authority'] == 2){
                $all_user_ary = $this->get_all_sv_user();
                $this->result->add('all_user_ary',$all_user_ary);               
                $this->display('shift/hope_shift_regist_sv.tpl');
            }

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
            //$all_user_ary = $stmt->fetchAll();
            $all_user_ary = Array();
            while($user = $stmt->fetch()){
                $all_user_ary[$user['tmur_user_id']] = $user['tmur_user_id']."：".$user['tmur_user_name'];
            }

            return $all_user_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
            return "";
        }

    }
    

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

