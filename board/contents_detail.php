<?php
/*
    * フレームワーク共通ファイルの呼び込み
*/
require_once '../common.php';
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

        //ログインチェック
		$this->logincheck($_SESSION['login_info']['user_authority']);
		if($_SESSION['login_info']['user_authority'] == ''){
			$this->error->fatal_error('Permission Error!');
        }		
        
        //DB接続
        $this->mysql = $this->db->connect();

    }

    //メイン画面出力
    public function CALLBACK__INDEX(){

        //バリデート
        $this->validate('board/contents_detail');

        //エラー時処理
		if($this->error->count() > 0){
            print_r("error!!!");
        }

        //記事取得
        $sql = "SELECT * FROM td_board_contents WHERE tdbr_del_flg != '1' AND tdbr_id = {$this->vars['id']}";

        //クエリ実行
        $rtn_contents = mysqli_query($this->mysql,$sql);

        //検索結果レコードが1つのときのみ処理継続
        if(mysqli_num_rows($rtn_contents) == 1){
            $contents = mysqli_fetch_assoc($rtn_contents);
            //標題
            $this->result->add('subject',$contents['tdbr_subject']);
            //投稿者
            $this->result->add('post_user',$contents['tdbr_post_user']);
            //投稿日
            $this->result->add('post_date',$contents['tdbr_create_date']);
            //最終更新日
            $this->result->add('update_date',$contents['tdbr_update_date']);

            //記事本文
            $this->result->add('contents',$contents['tdbr_contents']);
            $this->display('borad/contents_detail.tpl');
    
        }else{
            exit();
        }



    }

    public function CALLBACK__post(){

        //デバッガ
        include '../ChromePhp.php';
        header("Content-Type: application/json; charset=utf-8");
        $aaa = json_decode($_POST['post_contents']);
        ChromePhp::log($aaa);
        ChromePhp::log($_POST['post_contents']);
        ChromePhp::log("insert!!!");

        //トランザクション開始
        mysqli_query($this->mysql,'begin');

        $sql = "";
        $sql .= "INSERT INTO td_board_contents VALUES(";
        //PK
        $sql .= "NULL ,";
        //本文
        $sql .= " '{$_POST['post_contents']}' ,";
        //カテゴリー
        $sql .= " {$_POST['category']} ,";        
        //標題
        $sql .= "'{$_POST['subject']}' ,";
        //投稿者
        $sql .= "'{$_SESSION['login_info']['user_id']}' ,";
        //データ作成日
        $sql .= " Now() , ";
        //データ更新日
        $sql .= " Now() , ";
        //データ更新者
        $sql .= " '{$_SESSION['login_info']['user_id']}', ";
        //削除フラグ
        $sql .= " '0' )";

        $rtn_contents = mysqli_query($this->mysql,$sql);

        //コミット
        mysqli_query($this->mysql,'commit');
        header_remove('Set-Cookie');

        if($rtn_contents == true){
            echo json_encode("ok");
        }else{
            echo json_encode("ng");
        }




    }

    public function CALLBACK__detail(){
        include 'ChromePhp.php';
        header("Content-Type: application/json; charset=utf-8");
        ChromePhp::log($_POST['contents_id']);

        $sql = "SELECT * FROM td_borad_contents WHERE tdbr_id = {$_POST['contents_id']}";
        //クエリ実行
        $rtn_syouhin = mysqli_query($this->mysql,$sql);

        //検索結果レコードが1つのときのみ処理継続
        if(mysqli_num_rows($rtn_syouhin) == 1){
            $syouhin = mysqli_fetch_assoc($rtn_syouhin);

            ChromePhp::log($syouhin);
            echo json_encode($syouhin);
        }


    }

}

// 実行用のオブジェクトを作成
$SY_App = new SY_App();
$SY_App->start();

