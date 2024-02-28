<?php
///////////////////////////////////////////////////////////
// //
// //   ■ SY FRAME WORKS VERSION 0.0.1
// //      [ LastUpdate ]    2007-03-04
// //
///////////////////////////////////////////////////////////

/* Server設定情報 */
//require_once('server/server.php');

/**		注意事項：ディレクトリパスの最後には					**/
/**		必ず「/」を付けてください。このルールは厳守		**/
/**		サーバ別に、設定をカスタマイズします。 				**/

$SY_config=array();
//if(!file_exists('/var/www/testserver.php')){
		/* general setting */
		//$SY_config['BASE_URL'] = "http://839515541676dd8e.lolipop.jp/eco/";
		//$SY_config['BASE_URL'] = "https://ecobusiness.work/";
		$SY_config['BASE_URL'] = "http://192.168.4.233/new_portal/";
		$SY_config['BASE_PATH'] = "/var/www/html/new_portal/";
		/* sql setting */
		$SY_config['sql_host']			="192.168.4.233";
		$SY_config['sql_user']			="root";
		$SY_config['sql_password']		="H&B2BVyFX$5x";
		$SY_config['sql_db']			="portal2023";
		/* smtp setting */
		$SY_config['mail_from']='sendonly@happiness-party.jp'; // デフォルト
		$SY_config['smtp'] = array(
		'host'    => '127.0.0.1',		// ホスト名
		'port'    => 25,						// ポート番号
		'auth'    => false,					// 認証必要？
		'username'  => "ksnavi",	 	// ユーザー名
		'password'  => "AbqbTlhuHwPF2mCd",	// パスワード
		'persist' => true		// 持続的接続オプション
		);
//}else{
//	eixt('No config');
//}

$SY_config['file_key']="a3kgek2sgr3o24p5eye4";
$SY_config['key']="a3kgek23o24ewrp5eye4";

// // 基本ディレクトリ //////////////////////////////////////
$SY_config['INCLUDE_PATH'] = $SY_config['BASE_PATH']."include/";
$SY_config['FORM_PATH'] = $SY_config['INCLUDE_PATH']."SY_form/";
$SY_config['MAIL_PATH'] = $SY_config['INCLUDE_PATH']."SY_mail/";
$SY_config['LOG_PATH'] = $SY_config['INCLUDE_PATH']."SY_log/";

// // デバッグモード //////////////////////////////////////

// 0=本番:1=エラー時停止:2=全ＳＱＬ出力
$SY_config['DEBUG'] = 0;

// // キャッシュの設定 //////////////////////////////////
$SY_config['cache_dir']	=$SY_config['INCLUDE_PATH']."cache/";
$SY_config['cache_file']	=$SY_config['INCLUDE_PATH']."cache/cache.txt";

// // ＳＭＡＲＴＹの設定 //////////////////////////////////

// // デバッグモード //////////////////////////////////////
$SY_config['smarty_class']			=$SY_config['INCLUDE_PATH']."SY_class/smarty/Smarty.class.php";
$SY_config['smarty_config_dir']		=$SY_config['INCLUDE_PATH']."conf/";
$SY_config['smarty_template_dir']	=$SY_config['INCLUDE_PATH']."smarty_templates/";
$SY_config['smarty_compile_dir']		=$SY_config['INCLUDE_PATH']."smarty_templates_c/";
$SY_config['smarty_cache_dir']		=$SY_config['INCLUDE_PATH']."smarty_cache/";

// // ソフトウェア独自の設定 //////////////////////////////
$SY_config['upload_temp'] 	= $SY_config['INCLUDE_PATH']."upload_temp/";
$SY_config['upload_img'] 		= $SY_config['INCLUDE_PATH']."upload_img/";
$SY_config['upload_pdf'] 		= $SY_config['INCLUDE_PATH']."upload_pdf/";

/*
	* 指定された名前でセッションを開始します。
*/
$SY_config['session_name'] = 'aps';

// アップロード可能なファイル拡張子を定義
// コンテンツファイル
$SY_config['file_extension'][]='pdf';
$SY_config['file_extension'][]='png';
$SY_config['file_extension'][]='txt';
$SY_config['file_extension'][]='lzh';
$SY_config['file_extension'][]='zip';
$SY_config['file_extension'][]='mp3';

// 表紙画像ファイル
$SY_config['img_extension'][]='gif';
$SY_config['img_extension'][]='png';
$SY_config['img_extension'][]='jpg';

// // 設定の上書き ////////////////////////////////////////
// // テスト環境と本番環境が異なる場合は、この部分で、
// // 設定の上書きを行ってください。

// デバッグ用の書き出しスクリプト
// print_r($config);

?>
