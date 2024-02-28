<?php
/*
	* SY_FRAMEWORK Version 0.0.3
*/

/**キャッシュ無効化 */
header('Expires: Tue, 1 Jan 2019 00:00:00 GMT');
header('Last-Modified:' . gmdate( 'D, d M Y H:i:s' ) . 'GMT');
header('Cache-Control:no-cache,no-store,must-revalidate,max-age=0');
header('Cache-Control:pre-check=0,post-check=0',false);
header('Pragma:no-cache');


mb_internal_encoding("UTF-8");
mb_language("Japanese");

/*
	* PHPのセキュリティー設定等を変更します。
*/
ini_set("magic_quotes_gpc",'off');
ini_set("mbstring.substitute_charactor",'');

/*
	* 標準設定ファイルを読み込みます。
*/
require_once('config.ini.php');

/*
	* セッションを開始
*/
session_name($SY_config['session_name']);
@session_start();

/*
  * 定数の設定
*/
define('SY_BASE_URL'				,$SY_config['BASE_URL']);
define('SY_BASE_PATH'				,$SY_config['BASE_PATH']);
define('SY_INCLUDE_PATH'		,$SY_config['INCLUDE_PATH']);
define('SY_FORM_PATH'				,$SY_config['FORM_PATH']);
define('SY_MAIL_PATH'				,$SY_config['MAIL_PATH']);
//print_r(SY_INCLUDE_PATH.'conf/common.define.php');

/*
	* 標準定義ファイルを読み込みます。
*/

require_once(SY_INCLUDE_PATH.'conf/common.define.php');
// PEARライブラリの読み込み（メール送信用）
// LINUXとWINDOWSで指定が異なるので注意が必要
/*
if(!file_exists('/var/www/testserver.php')){
  ini_set('include_path','.:'.SY_INCLUDE_PATH.'SY_class/pear/' );
}else{
  // windows
  ini_set('include_path','.;'.SY_INCLUDE_PATH.'SY_class/pear/' );
}
*/
/*
require_once(SY_INCLUDE_PATH.'SY_class/pear/Mail.php');
require_once(SY_INCLUDE_PATH.'SY_class/pear/Mail/mimeDecode.php');
*/
// フレームワーク共通読み込みファイル
require_once($SY_config['smarty_class']);
require_once(SY_INCLUDE_PATH.'SY_class/SY_Base.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Smarty.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_MessageMap.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_FrameworkExtension.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Framework.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Log.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Error.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Result.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Validate.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Database.class.php');
//require_once(SY_INCLUDE_PATH.'SY_class/SY_Mail.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Debug.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/SY_Cache.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/function.php');

// ライブラリの読み込み
require_once(SY_INCLUDE_PATH.'SY_class/lib/File.class.php');
require_once(SY_INCLUDE_PATH.'SY_class/lib/Image.class.php');

/*
  * ここからグローバル変数の定義
  * 共通機能を書き出しを行います、接頭語 $SY_ は変数としては使わないでください。
*/
$GLOBAL_SY_FRAMEWORK_SMARTY = new SY_Smarty();
$GLOBAL_SY_FRAMEWORK_SMARTY->template_dir	=	$SY_config['smarty_template_dir'];
$GLOBAL_SY_FRAMEWORK_SMARTY->compile_dir	=	$SY_config['smarty_compile_dir'];
$GLOBAL_SY_FRAMEWORK_SMARTY->config_dir		=	$SY_config['smarty_config_dir'];
$GLOBAL_SY_FRAMEWORK_SMARTY->cache_dir		=	$SY_config['smarty_cache_dir'];
//print_r($GLOBAL_SY_FRAMEWORK_SMARTY->template_dir);
/*
  * 変数の初期化処理を実行
*/
$GLOBAL_SY_FRAMEWORK_ERROR		= '';
$GLOBAL_SY_FRAMEWORK_DEBUG		= '';
$GLOBAL_SY_FRAMEWORK_RESULT	= '';
$GLOBAL_SY_FRAMEWORK_DB				= '';
$GLOBAL_SY_FRAMEWORK_CACHE		= '';
$GLOBAL_SY_FRAMEWORK_ACTION	= '';
$GLOBAL_SY_FRAMEWORK_LOG	= '';
$GLOBAL_SY_FRAMEWORK_SMTP			= false;
$GLOBAL_SY_FRAMEWORK_FORM			= Array();
$GLOBAL_SY_FRAMEWORK_VARS			= Array();
$GLOBAL_SY_FRAMEWORK_AGENT		= Array();
$GLOBAL_SY_FRAMEWORK_SHOP     = Array();

/*
  * 基本クラスを実体化
*/
$GLOBAL_SY_FRAMEWORK_LOG			= new SY_Log();
$GLOBAL_SY_FRAMEWORK_DEBUG		= new SY_Debug();
$GLOBAL_SY_FRAMEWORK_ERROR		= new SY_Error();
$GLOBAL_SY_FRAMEWORK_RESULT	  = new SY_Result();
$GLOBAL_SY_FRAMEWORK_DB				= new SY_Database();
$GLOBAL_SY_FRAMEWORK_CACHE		= new SY_Cache();
$GLOBAL_SY_FRAMEWORK_ACTION	= '';
$GLOBAL_SY_FRAMEWORK_FORM			= Array();
$GLOBAL_SY_FRAMEWORK_VARS			= Array();
$GLOBAL_SY_FRAMEWORK_AGENT		= Array();
$GLOBAL_SY_FRAMEWORK_SHOP     = Array();

?>
