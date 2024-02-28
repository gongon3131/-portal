<?php
/*
    * フレームワーク共通ファイルの呼び込み
*/
require_once 'common.php';
ini_set('display_errors', "On");
/*
    * @class:SY_App:
    * @work:フレームワークのメイン部分
    * @date:2008/02/17:
    * @msg:このクラスのコンストラクターを呼んではいけません:
    * @msg:初期化処理は、「prepare」メソッドを使用してください:
*/

class SY_App extends SY_Framework{

    public function SY_prepare(){

    }

    //メイン画面出力
    public function CALLBACK__INDEX(){

        // テンプレートの呼び出し
        //$this->display('main.tpl');
        $this->display('borad/contents_summary.tpl');
    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

