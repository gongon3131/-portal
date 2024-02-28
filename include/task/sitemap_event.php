<?php
// 共通ファイルの呼び込み。
// ここで全てのヘッダーファイルを読み込みます。
require_once(dirname($_SERVER['SCRIPT_FILENAME']).'/../../common.php');

// 機能概要：メッセージマップ
// 注意事項：このクラスのコンストラクターを呼んではいけません。
// 初期化処理は、「prepare」メソッドを使用してください。
class SY_App extends SY_Framework{

	var $interval;
	var $counter;

	// 機能概要：遷移前の独自設定
	// ユーザ認証等を実装
	function SY_prepare(){

	}

	// 機能概要：ＳＭＡＲＴＹ出力前の共通設定
	// 共通項目の登録等を実行
	function SY_prepare_display(){

	}

	// 機能概要：デフォルトで呼ばれる関数
	function CALLBACK__INDEX(){

		$this->counter = 0;
		$this->reset_sitemap();

		$sql="select * from event where event_status > 0 order by event_id desc limit 200000";
		$rtn_event = pg_query($sql);

		$cnt=0;

		while($event = pg_fetch_assoc($rtn_event)){

			if($cnt == 0){
				$this->reset_sitemap();
				$this->write_sitemap("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
				$this->write_sitemap("<?xml-stylesheet type=\"text/xsl\" href=\"https://happiness-party.jp/wordpress/wp-content/plugins/google-sitemap-generator/sitemap.xsl\"?>");
				$this->write_sitemap("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

			}
			$cnt++;

			$url = "https://happiness-party.jp/event.php?event_id={$event['event_id']}";
			$this->write_sitemap("<url>");
			$this->write_sitemap(" <loc>{$url}</loc>");
			$this->write_sitemap(" <priority>0.6</priority>");
			$this->write_sitemap(" <changefreq>weekly</changefreq>");
			$this->write_sitemap(" <lastmod>". date(DATE_ATOM,strtotime($event['event_update_dt'])) ."</lastmod>");
			$this->write_sitemap("</url>");

			if($cnt > 45000) {
				$this->write_sitemap("</urlset> ");
				$this->counter++;
				$cnt =0;
			}

		}
		$this->write_sitemap("</urlset> ");


	}

	function write_sitemap($str){
		file_put_contents("/var/www/html/sitemap{$this->counter}.xml",$str."\n",FILE_APPEND);
	}

	function reset_sitemap(){
		file_put_contents("/var/www/html/sitemap{$this->counter}.xml","");
	}

}

// 実行用のオブジェクトを作成
$SY_App= new SY_App();
$SY_App->start();

?>











