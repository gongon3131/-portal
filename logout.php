<?php
/*
    * フレームワーク共通ファイルの呼び込み
*/
require_once 'common.php';

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
    }

    /**
     * @work:発行者登録処理:
     * @arg::
     * @return::
     */
    public function CALLBACK__INDEX()
    {

        $_SESSION = array();
        session_destroy();

        // テンプレートの呼び出し
        //header("Location: index.php");
        $this->display('logout.tpl');
    }
   
}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

