<?php
/*
    * フレームワーク共通ファイルの呼び込み
*/
require_once 'common.php';
ini_set('display_errors', "On");

/**デバッキングコンソール */
include  'ChromePhp.php';

/*
    * @class:SY_App:
    * @work:フレームワークのメイン部分
    * @date:2008/02/17:
    * @msg:このクラスのコンストラクターを呼んではいけません:
    * @msg:初期化処理は、「prepare」メソッドを使用してください:
*/

class SY_App extends SY_Framework
{
    public function SY_prepare()
    {

        //DB接続
        $this->mysql = $this->db->sql_prepare();
        //ベースディレクトリ
        $this->result->add('base_url',$this->config['BASE_URL']);
        $this->result->add('base_path',$this->config['BASE_PATH']);
        
    }

    //ログイン画面出力
    public function CALLBACK__INDEX(){

		if($_SERVER['REQUEST_METHOD'] == 'POST'){

            //バリデート
            $this->validate('login/login');

            try{

                $sql = <<<EOF
                    SELECT
                    tmur_id,
                    tmur_user_id,
                    tmur_password,
                    tmur_user_name,
                    tmur_authority
                    FROM tm_user
                    WHERE tmur_user_id = :tmur_user_id
                    AND tmur_password = :tmur_password
                EOF;

                $stmt = $this->mysql->prepare($sql);
                $stmt->bindParam(":tmur_user_id" , $this->vars['user_id']);
                $stmt->bindParam(":tmur_password" , $this->vars['user_pass']);
    
                //クエリ実行
                $execute = $stmt->execute();
                $row_count = $stmt->rowCount();
                // DEBUG OUTPUT
                //ChromePhp::log($this->db->pdo_debugStrParams($stmt));

                if($row_count == 1){
                    $user = $stmt->fetch();
                    $_SESSION['login_info']['id'] = $user['tmur_id'];
                    $_SESSION['login_info']['user_id'] = $user['tmur_user_id'];
                    $_SESSION['login_info']['user_name'] = $user['tmur_user_name'];
                    $_SESSION['login_info']['user_authority'] = $user['tmur_authority'];
                    $_SESSION['login_info']['user_pass'] = $user['tmur_password'];

                    //header("Location: board/contents_summary.php");
                    header("Location: dashboard/dashboard.php");
       
                }else {
                    $this->result->add('err_mes','IDまたはパスワードが間違っています');
                    $this->display('index.tpl');
                    exit();
                }

            } catch(Exception $e) {
                ChromePhp::log($e);
                $this->result->add('err_mes','エラーが発生しました。システム管理者にお問い合わせください。');
                $this->display('index.tpl');
                exit();
            }


		}else{
            $this->display('index.tpl');
        }

    }

    //ログオフ処理
    public function CALLBACK__logout(){

        //セッション破棄
        $_SESSION = array();
        session_destroy();

        //操作ログ書き込み
        //$this->rec_operation_log($_SESSION['login_info']['user_id'],'ログアウト','','ログアウト','');

        //ログイン画面へ遷移させる
        header("Location: index.php");
        //$this->display('index.tpl');
        //$this->display('logout.tpl');

    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();
