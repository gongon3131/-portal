<?php
/*
	* @class:SY_Base:
	* @work:フレームワーク全てののクラスのベースクラス:
	* @date:2008/02/17:
*/
class SY_Base {

	// グローバルユーザ情報の格納
	var $agent;
	var $shop;
	//Mysqli Link
	var $mysql;
	/*
		* @vars:action:
		* @msg:アクション名が入ります:
	*/
	var $action;

	/*
		* @vars:db:
		* @msg:グローバルDBクラスのインスタンス:
	*/
	var $db;

	/*
		* @vars:result:
		* @msg:グローバル結果クラスのインスタンス:
	*/
	var $result;

	/*
		* @vars:error:
		* @msg:グローバルエラークラスのインスタンス:
	*/
	var $error;

	/*
		* @vars:debug:
		* @msg:グローバルデバッグクラスのインスタンス:
	*/
	var $debug;

	/*
		* @vars:cache:
		* @msg:グローバルキャッシュクラスのインスタンス:
	*/
	var $cache;

	/*
		* @vars:cache:
		* @msg:グローバルログクラスのインスタンス:
	*/
	var $log;

	/*
		* @vars:config:
		* @msg:アプリケーションの基本設定配列:
	*/
	var $config;

	/*
		* @vars:config:
		* @msg:アプリケーションの基本定義配列:
	*/
	var $define;

	/*
		* @vars:form:
		* @msg:SMARTY登録用のフォーム配列:
	*/
	var $form;

	/*
		* @vars:validate:
		* @msg:二重呼び出し防止
	*/
	var $validate;

	/*
		* @vars:vars:
		* @msg:プログラム処理で利用するSQLセーフの値 [mysql_real_escape_string]:
	*/
	var $vars;


	var $mobile;

	/**
		* @work:コンストラクター:
		* @arg:string $string:
		* @return::
		* @msg:グローバルオブジェクトをクラス変数として読み込みます。:
	*/
	function SY_Base()
	{
		global $SY_config;
		global $SY_define;
		global $GLOBAL_SY_FRAMEWORK_DB;
		global $GLOBAL_SY_FRAMEWORK_RESULT;
		global $GLOBAL_SY_FRAMEWORK_ERROR;
		global $GLOBAL_SY_FRAMEWORK_FORM;
		global $GLOBAL_SY_FRAMEWORK_SMARTY;
		global $GLOBAL_SY_FRAMEWORK_CACHE;
		global $GLOBAL_SY_FRAMEWORK_VARS;
		global $GLOBAL_SY_FRAMEWORK_ACTION;
		global $GLOBAL_SY_FRAMEWORK_DEBUG;
		global $GLOBAL_SY_FRAMEWORK_LOG;
		global $GLOBAL_SY_FRAMEWORK_AGENT;
		global $GLOBAL_SY_FRAMEWORK_SHOP;
		$this->config	=&$SY_config;
		$this->define	=&$SY_define;
		$this->smarty	=&$GLOBAL_SY_FRAMEWORK_SMARTY;
		$this->log		=&$GLOBAL_SY_FRAMEWORK_LOG;
		$this->db		=&$GLOBAL_SY_FRAMEWORK_DB;
		$this->result	=&$GLOBAL_SY_FRAMEWORK_RESULT;
		$this->error	=&$GLOBAL_SY_FRAMEWORK_ERROR;
		$this->debug 	=&$GLOBAL_SY_FRAMEWORK_DEBUG;
		$this->cache	=&$GLOBAL_SY_FRAMEWORK_CACHE;
		$this->action	=&$GLOBAL_SY_FRAMEWORK_ACTION;
		$this->form	 	=&$GLOBAL_SY_FRAMEWORK_FORM;
		$this->vars		=&$GLOBAL_SY_FRAMEWORK_VARS;
		$this->agent 	=&$GLOBAL_SY_FRAMEWORK_AGENT;
		$this->shop		=&$GLOBAL_SY_FRAMEWORK_SHOP;
		$this->mobile = $this->getMobileCarrier();
	}

	/**
		* @work:入力チェックを実行:
		* @arg:string $string:
		* @return::
		* @msg:入力チェックを実行し、配列に情報を登録します。:
	*/
	function validate($validate_name)
	{
		// 実行記録を管理
		if(!is_array($this->validate)){
			$this->validate=array();
		}
		if ( in_array($validate_name,$this->validate) ){
			return;
		}else{
			$this->validate[] = $validate_name;
		}
		// フォーム定義の存在をチェック
		if(file_exists($this->config['FORM_PATH']."/".$validate_name.".class.php"))
		{
			require_once($this->config['FORM_PATH']."/".$validate_name.".class.php");
			$class_name = "SY_FORM_".basename($validate_name);
			// 入力チェックの実行
			if(class_exists($class_name))
			{
				$form = new $class_name($validate_name);
				$form->excute();
			}else{
				$this->error->fatal_error('フォーム定義クラスが存在しません。');
			}
		}else{
			$this->error->fatal_error('フォーム定義ファイルが存在しません。');
		}
	}

	/**
		* @work:メールクラスのインスタンスを作成:
		* @arg:string $mail_name メール定義ファイル名:
		* @return:メールオブジェクトのインスタンス:
		* @msg:グローバルオブジェクトをクラス変数として読み込みます。:
	*/
	function mail($mail_name)
	{
		// メール定義ディレクトリにファイルが存在するかチェックします。
		if(file_exists($this->config['MAIL_PATH']."/".$mail_name.".class.php"))
		{
			require_once($this->config['MAIL_PATH']."/".$mail_name.".class.php");
			// 定義ディレクトリにファイルが存在する場合は、インスタンスの作成を試みます。
			$class_name = "SY_MAIL_".basename($mail_name);
			if(class_exists($class_name))
			{
				return new $class_name();
			}else{
				$this->error->fatal_error("指定されたメール定義クラスが存在しません。");
			}
		}else{
			$this->error->fatal_error("指定されたメール定義ファイルが存在しません。");
		}
	}

	/*** キャリア特定 ***/
	function getMobileCarrier(){
		if(isset($_SERVER['HTTP_USER_AGENT'])){
			$agent = strtolower(" ".$_SERVER['HTTP_USER_AGENT']);
		}else{
			return '';
		}

		/** Smartphone **/
		//Android
		if(stripos($agent,"android")) { return "smart_";}
		//iPhone
		if(stripos($agent,"iphone")) { return "smart_";}
		//iPod
		if(stripos($agent,"ipod")) { return "smart_";}
		//iPad
		if(stripos($agent,"ipad")) { return "smart_";}

		//if(strpos($agent,"android")) { return "mobile_";}
		if(strpos($agent,"docomo")) { return "mobile_";}
		//SoftBank
		if(strpos($agent,"softbank")) { return "mobile_";}
		if(strpos($agent,"vodafone")) { return "mobile_";}
		if(strpos($agent,"j-phone")) { return "mobile_";}
		//Au（KDDI)
		if(strpos($agent,"up.browser")) { return "mobile_";}
		// 携帯デバッグ用
		// return "_ktai";
		//PCからのアクセス。
		return '';
	}


	/**
		* @work:SMARTYに画面出力:
		* @arg:string $template テンプレートファイル名:
		* @arg:int $cache_id キャッシュ番号:
		* @return::
		* @msg:グローバルオブジェクトをクラス変数として読み込みます。:
	*/
	function display($template,$cache_id=false){

		// デバッグモードであれば、デバッグ情報を出力
		if($this->config['DEBUG'] > 1){
			$this->debug->out();
		}

		// DISPLAYの出力前に共通メソッドを呼び出します。
		if(method_exists($this,'SY_prepare_display_common'))
		{
			$this->SY_prepare_display_common();
		}

		// DISPLAYの出力前に個別メソッドを呼び出します。
		if(method_exists($this,'SY_prepare_display'))
		{
			$this->SY_prepare_display();
		}

		/*** 携帯判定 ***/
		$mobile = $this->getMobileCarrier();
		if(strlen($mobile) != 0){
			$this->form['mobile_session'] = session_id();		//セッション情報
			$this->form['mobile_carrier'] = $mobile;				//キャリア情報
		}

		// 定義ファイルの登録
		$this->smarty->assign('SY_define',$this->define);

		// アクション名を登録
		$this->smarty->assign('SY_action',htmlspecialchars($this->action));

		// セッションを登録
		$this->smarty->assign('SY_session',$_SESSION);

		// キャッシュを登録
		$this->smarty->assign('SY_cache',$this->cache->cache_vars);

		// フォーム情報を登録
		$this->smarty->assign('SY_form',$this->form);

		// エラー情報を登録
		$error=array();
		$error['message']	=$this->error->get();
		$error['count']		=$this->error->count();
		$this->smarty->assign('SY_error',$error);

		// 結果情報をHTMLセーフに変換して登録
		$this->result->html_safe();
		$this->smarty->assign($this->result->get());

		$path = pathinfo($template);

		/*** 携帯用の出力 ***/
		if($mobile == 'mobile_'){
		 	$tpl_name = $path['dirname'] . "/mobile_".$path['filename'].".".$path['extension'];
			if($this->smarty->template_exists($tpl_name)){
				header("Content-type: application/xhtml+xml;charset=Shift_JIS");
				echo mb_convert_encoding(str_replace('UTF-8','SHIFT-JIS',$this->smarty->fetch($tpl_name)),"SJIS","UTF-8");
				exit();
			}
		}

		/*** スマホの出力 ***/
		if($mobile == 'smart_'){
			$tpl_name = $path['dirname'] . "/smart_".$path['filename'].".".$path['extension'];
			if($this->smarty->template_exists($tpl_name)){
				echo mb_convert_encoding(str_replace('UTF-8','UTF-8',$this->smarty->fetch($tpl_name)),"UTF-8","UTF-8");
				exit();
			}
		}

		// 画面出力を実行　キャッシュコントロール
		if($cache_id == false)
		{
			$this->smarty->display($template);
		} else {
			$this->smarty->display($template,$cache_id);
		}

	}
}

?>
