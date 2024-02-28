<?php
/////////////////////////////////////////////////////////////////////////////////////////////////
//  機能概要：フォームの入力チェック用クラス
//  2007年12月30日 INTの扱いを変更
//  2007年8月7日新ラジオボタン、チェックボックス、ファイル形式に対応
//  2007年3月12日新フレームワーク用にバージョンアップ。
//  2007年2月11日完成。
//  ・配列投稿に対するセキュリティー問題を修正
//  ・フォームが固有のＩＤを持つように変更
/////////////////////////////////////////////////////////////////////////////////////////////////
/*
//--------------------------------------------------------------------
//  アスキー般データ
//--------------------------------------------------------------------

	title		タイトル（ 必須 ）
	max		最大文字数
	min			最小文字数
	require		必須設定
	type		データタイプ

//--------------------------------------------------------------------
// データタイプ（type）
//--------------------------------------------------------------------

	ARRAY 配列
	MAIL		メールアドレス
	URL		ＵＲＬ
	TEXT		テキスト
	HTML		ＨＴＭＬ
	INT			数値
	NUM		数字（文字列扱い）
	KANA_ZEN 全角カタカナ
	KANA_HAN 半角カタカナ
	ALPHA		半角英字
	ALPHA_NUM	半角英数字
	SELECT		選択値
	CHECKBOX		チェックボックス
	FAX			ＦＡＸのフォーマット
	TEL				電話番号のフォーマット
	ZIP				郵便番号

	RADIO		セレクト値
	define　セレクト値

//--------------------------------------------------------------------
// 使用例
//--------------------------------------------------------------------

	$form = array(
		"account" => array(
			"title" 	=> "アカウント名",
			"max" 		=> 10,
			"min" 		=> 0,
			"require" 	=> true,
			"type" 		=> "TEXT",
			"select"	=> "Y|N",
			"default"	=> "N",
			"define"	=>	$define['city'],
		),
			"password" => array(
			"title" 	=> "パスワード",
			"max" 		=> 12,
			"min" 		=> 4,
			"require" 	=> true,
			"type" 		=> "ALPHA_NUM",
		)
	);
*/
/////////////////////////////////////////////////////////////////////////////////////////////////

// 機能概要：フォームの入力データのチェック
// 最終更新日：２００７年４月９日
// 2007年3月12日新フレームワーク用にバージョンアップ。
class SY_Validate extends SY_Base
{
	/*
		* $form の構造
		*	$form['id']				トランザクションID
		*	$form['safe']			HTMLセーフの配列
		*	$form['hidden']	隠し属性
		*	$form['file']			ファイル属性
		*	$form['query']		URLクエリー
	*/

	/*
		* @vars:fdefine:
		* @msg:フォームの定義ファイル:
	*/
	var $fdefine;

	/*
		* @vars:fvars:
		* @msg:フォームからの登録された生データ:
	*/
	var $fvars;

	/*
		* @vars:validate_name:
		* @msg:フォームの入力チェック定義名:
	*/
	var $validate_name;

	/**
		* @work:コンストラクター:
		* @arg:string $string:
		* @return::
	*/
	function SY_Validate($validate_name){
		$this->SY_Base();
		$this->fdefine['validate_name'][]=$validate_name;
	}

	/**
		* @work:入力チェックを開始:
		* @arg::
		* @return::
	*/
	function excute(){

		// フォームの設定定義をロード
		$this->ini_form();

		// フォーム定義にＩＤが存在する場合のみ。
		if(isset($this->fdefine['SY_form_id'])){
			$this->set_form_id();
		}

		// 取得したフォーム値を全て「$this->fvars」変数にロードする。
		$this->get_form_vars();
		// $this->encode('EUC-JP','auto');

		// 入力チェックを実行。
		//$this->validate();
		$validate_name = "";
		$this->validate($validate_name);

		// 安全化したデータを変数に登録
		$this->set_sql_safe();
		$this->set_hidden();
		$this->set_html_safe();
		$this->set_query();

		// カスタムチェックを実行。
		if(method_exists($this,'custom') ){
			$this->custom();
		}

	}

	/**
		* @work:入力チェックの実行の有無をチェック:
		* @arg:string $validate_name:
		* @return::
	*/
	function is_validated($validate_name){
		foreach($this->fdefine['validate_name'] as $name => $value){
			if($validate_name == $value){
				return true;
			}
		}
		return false;
	}

	/**
		* @work:フォームの生データを文字コード変換:
		* @arg:string $to     変換先の文字コード:
		* @arg:string $from 変換元の文字コード:
		* @return::
	*/
	function encode($to,$from){
		if(isset($this->fvars) && is_array($this->fvars))
			foreach($this->fvars as $key => $value ){
				if(is_array($this->fvars[$key])==false){
					$this->fvars[$key] = mb_convert_encoding($this->fvars[$key],$to,$from);
				}
			}
		return true;
	}

	/**
		* @work:フォームIDを作成:
		* @arg:string $to     変換先の文字コード:
		* @arg:string $from 変換元の文字コード:
		* @return::
	*/
	function set_form_id(){
		if(isset($_GET['SY_form_id'])){
			$_POST['SY_form_id'] = $_GET['SY_form_id'];
		}
		// フォームＩＤの作成
		if(isset($_POST['SY_form_id']) == false OR
			isset($_SESSION['SY_form_id'][$_POST['SY_form_id']])==false){
			$id = $this->db->get_sequence_id('seq_form_id');
			$id = $id . '_' . md5($id);
			$_SESSION['SY_form_id'][$id] = $id;
		}else{
			$id = $_SESSION['SY_form_id'][$_POST['SY_form_id']];
		}
		$this->fdefine['SY_form_id']['title']='SYSTEM_FORM_ID';
		$this->fdefine['SY_form_id']['type']='TEXT';
		$this->fdefine['SY_form_id']['require']=true;
		$_POST['SY_form_id'] = $id;
		// デバッグ情報の出力
		$this->debug->add($id);
		// ＩＤを登録
		$this->form['id'] = $id;
	}



	/**
		* @work:全てのフォームデータをロード:
		* @arg::
		* @return::
	*/
	function get_form_vars(){
		if(!empty($_GET)){
			foreach($_GET as $key => $val){
				$this->fvars[$key] = $val;
			}
		}
		if(!empty($_POST)){
			foreach($_POST as $key => $val){
				$this->fvars[$key] = $val;
			}
		}
		if(!empty($_FILES)){
			foreach($_FILES as $key => $val){
				$this->fvars[$key] = $val;
			}
		}
	}


	/**
		* @work:SQLセーフな値を登録:
		* @arg::
		* @return::
	*/
	function set_sql_safe(){
		foreach($this->fdefine as $key => $value){
			if(isset($this->fvars[$key])){
				if($value['type'] != 'FILE')
				{
					if(is_array($this->fvars[$key]) == false)
					{
						if($this->mobile == '_mobile'){
							$this->vars[$key] = mb_convert_encoding($this->fvars[$key],"UTF-8","SJIS");
							$this->vars[$key] = trim($this->vars[$key]);
							$this->vars[$key] = pg_escape_string($this->vars[$key]);
						}else{
							$this->vars[$key] = trim($this->fvars[$key]);
							$this->vars[$key] = pg_escape_string($this->vars[$key]);
							//DB接続
							$this->mysql = $this->db->connect();
							$this->vars[$key] = mysqli_real_escape_string($this->mysql,$this->vars[$key]);
						}
					}else{
						if($value['type'] == 'CHECKBOX')
						{
							$this->vars[$key]=$this->fvars[$key];
						}
					}
				}
			}else{
				$this->vars[$key]='';
			}
		}
		return true;
	}

	/**
		* @work:GET用のクエリを作成:
		* @arg::
		* @return::
	*/
	function set_query(){
		// データの初期化
		if(!isset($this->form['query'])){
			$this->form['query']='';
		}
		foreach($this->fdefine as $name => $value){
			// ファイルの場合はスキップ
			if($value['type'] == 'FILE'){
				continue;
			}
			if(isset($this->fvars[$name])){
				if($this->form['query'] != ''){
					$this->form['query'].="&";
				}
				if(is_array($this->fvars[$name])){
					foreach($this->fvars[$name] as $value2){
						$this->form['query'].=$name."[]=".rawurlencode($value2);
					}
				}else{
					$this->form['query'].=$name."=".urlencode($this->fvars[$name]);
				}
			}
		}
		$this->debug->add($this->form['query']);
	}

	/**
		* @work:HTMLが無効化されたデータを変数に登録:
		* @arg::
		* @return::
		* @msg:定義されたデータのみを登録:
	*/
	function set_html_safe(){
		foreach($this->fdefine as $key => $value){
			if(isset($this->fvars[$key])){
				if($value['type'] != 'FILE'){
					if(is_array($this->fvars[$key]) == false){
						$this->form['safe'][$key] = trim($this->fvars[$key]);
						$this->form['safe'][$key] = htmlspecialchars($this->form['safe'][$key]);
					}else{
						if($value['type'] == 'CHECKBOX'){
							$this->form['safe'][$key]=$this->fvars[$key];
						}
					}
				}
			}else{
				$this->form['safe'][$key]='';
			}
		}
		return true;
	}

	/**
		* @work:フォームのデータ受け渡し用の隠し属性を変数に登録:
		* @arg::
		* @return::
		* @msg:定義されたデータのみを登録します:
	*/
	function set_hidden(){
		$hiddens=array();
		foreach($this->fdefine as $name => $option){
			if(isset($this->fvars[$name])){
				if($option['type'] != 'FILE' && $option['type'] != 'CHECKBOX'){
					$value=htmlspecialchars($this->fvars[$name]);
					$this->form['hidden'][] = "<input type=\"hidden\" name=\"{$name}\" value=\"{$value}\">";
				}
				if($option['type'] == 'CHECKBOX' && is_array($this->fvars[$name])){
					foreach($this->fvars[$name] as $aname => $avalue){
						$this->form['hidden'][] = "<input type=\"hidden\" name=\"{$name}[]\" value=\"{$avalue}\">";
					}
				}
			}else{
				$value="";
				$this->form['hidden'][] = "<input type=\"hidden\" name=\"{$name}\" value=\"{$value}\">";
			}
		}

		return true;
	}

	/**
		* @work:フォームの入力チェック:
		* @arg::
		* @return::
		* @msg:このクラスのメインはここになります:
	*/
	function validate($validate_name){

		// 配列がセットされていない場合は、配列を初期化
		if(isset($this->fdefine)==false){
			$this->fdefine=array();
		}

		// 定義ファイルのチェックループを開始。
		foreach($this->fdefine as $name => $option){

			// 必須属性が設定されていなければ、必須条件を解除する
			if(isset($option['require'])==false){
				$option['require']=false;
			}

			// データタイプを設定していなければ強制終了
			if(isset($option['type'])==false){
//print_r($option);
				$this->error->fatal_error($option['title']."のデータタイプ設定が間違えています。");
			}

			/////////////////////////////////////////////////////////////////////////////////////////////////////////
			// ファイルのチェック（一時フォルダに保存）
			/////////////////////////////////////////////////////////////////////////////////////////////////////////
			if($option['type'] == 'FILE'){
				// フォームＩＤが存在するか？
				if(isset($this->fdefine['SY_form_id']) == false){
					$this->error->fatal_error('FORMIDが設定されずにファイルがアップロードされました。');
				}
				// 基本変数システムチェック
				if(isset($option['extension'])==false || is_array($option['extension']) == false){
					$this->error->fatal_error($option['title'].'の拡張子の設定が無効です。(extension:array)');
				}
				// 最大アップロードサイズ
				if(isset($option['max']) == false || is_numeric($option['max']) == false){
					$this->error->fatal_error($option['title'].'の最大ファイルサイズ設定が無効です。(max:numeric)');
				}
				// ファイルがアップロードされていれば、一時フォルダに移動する
				if(isset($_FILES[$name]['tmp_name']) && is_uploaded_file($_FILES[$name]['tmp_name']) &&
					$_FILES[$name]['size'] > 0){
					// 既にファイルが既に存在していれば削除
					foreach($option['extension'] as $value){
						$filename=$this->config['upload_temp'].$name."_".$this->form['id'].".".$value;
						if(file_exists($filename)){
							unlink($filename);
						}
					}
					// ファイルオブジェクトの作成
					$uploaded_file = new File($_FILES[$name]['tmp_name']);
					// ファイルの拡張子をチェック
					$fileTypeCheck=false;
					foreach($option['extension'] as $value){
						$fileType=mb_strtolower($uploaded_file->get_file_extension($_FILES[$name]['name']));
						if($fileType == $value){
							$fileTypeCheck=true;
						}
					}
					if($fileTypeCheck){
						// ファイルサイズのチェック、問題が無ければアップロード。
						if($uploaded_file->get_filesize() < $option['max']){
							$filename=$this->config['upload_temp'].$name.'_'.$this->form['id'].'.'.$fileType;
							$uploaded_file->move_uploaded_file($filename);
							// アップロードしたファイル情報を登録
							$this->form['file'][$name]['extension']=$fileType;
							$this->form['file'][$name]['path']=$filename;
							$this->form['file'][$name]['filename']=basename($filename);
							$this->form['file'][$name]['key']=md5(basename($filename).$this->config['file_key']);
						}else{
							$this->error->add($option['title'].'のファイルサイズが大きすぎます。');
						}
					}else{
						$this->error->add($option['title'].'はアップロードできない種類のファイルです。');
					}
				}else{
					// 必須、且つファイルがアップロードされていない場合
					// 一時ファイルは既に存在しているか？
					$fileExists=false;
					foreach($option['extension'] as $value){
						$filename=$this->config['upload_temp'].$name."_".$this->form['id'].".".$value;
						if(file_exists($filename)){
							$fileExists=true;
							$this->form['file'][$name]['extension']=$value;
							$this->form['file'][$name]['path']=$filename;
							$this->form['file'][$name]['filename']=basename($filename);
							$this->form['file'][$name]['key']=md5(basename($filename).$this->config['file_key']);
						}
					}
					if($fileExists == false && $option['require']){
						$this->error->add($option['title'].'がアップロードされていません。');
					}
				}
				continue;
			}
			/////////////////////////////////////////////////////////////////////////////////////////////////////////
			// ファイルのチェック終了
			/////////////////////////////////////////////////////////////////////////////////////////////////////////

			// データが存在すればチェックを実行する
			if(isset($this->fvars[$name])){

				// 配列データ等不正なデータは投稿されていないかチェック
				if(is_array($this->fvars[$name])){
					if($option['type'] != 'CHECKBOX' && $option['type'] != 'FILE'){
						$this->fvars[$name]='';
						$this->error->fatal_error($option['title'].'は無効なデータ');
					}
				}else{
					if($option['require'] == true && strlen($this->fvars[$name]) == 0){
						// 何も入力されていない。
						if(isset($option['default'])){
							$this->fvars[$name]=$option['default'];
						}else{
							switch($option['type']){
								case 'INT':
								case 'FLOAT':
									$this->fvars[$name]=0;
									break;
								default:
								$this->fvars[$name]='';
							}
							$this->error->add($option['title'].'は入力必須項目です。');
							continue;
						}
					}else{
						// 数値属性で数値でない場合は０を登録
						if(!is_numeric($this->fvars[$name])){
							switch($option['type']){
								case 'INT':
								case 'FLOAT':
								case 'NUM':
									$this->fvars[$name]=0;
									break;
							}
						}
					}
				}

				// チェックボックスのチェック
				if($option['type'] == 'CHECKBOX'){
					if(isset($option['define']) == false || is_array($option['define']) == false){
						$this->error->fatal_error($option['title'].'の「define」設定が不正です。');
					}
					// 検査、配列で無い場合
					if(!is_array($this->fvars[$name])){
						$this->fvars[$name]=@unserialize($this->fvars[$name]);
						if(!is_array($this->fvars[$name])){
							$this->fvars[$name]='';
							continue;
						}
					}
					foreach($this->fvars[$name] as $tmp){
						// FLIPはタイトルが重複している場合、エラーとなるので廃止
						if(isset($option['define'][$tmp])==false){
							$this->fvars[$name]='';
							$this->error->add($option['title'].'のデータが不正です。');
						}
					}
					continue;
				}

				// 必須入力項目で無い且つ、入力されていなければ無視
				if($option['require'] == false && strlen($this->fvars[$name]) == 0 ){
					continue;
				}

				// 必須項目のチェック
				if($option['require']){
					if(is_array($this->fvars[$name])==false){
						if(strlen($this->fvars[$name])==0){
							 $this->error->add($option['title'].'は入力必須項目です。');
							 continue;
						}
					}
				}

				// ラジオボックスのチェック
				if($option['type'] == 'RADIO' || $option['type'] == 'define'){
					// データ型のチェック
					if(isset($option['define']) == false || is_array($option['define']) == false){
						$this->error->fatal_error($option['title'].'の「RADIO:define」設定が不正です。');
					}
					if(in_array($this->fvars[$name],array_flip($option['define']))==false){
						$this->fvars[$name]='';
						$this->error->add($option['title'].'のデータが不正です。');
					}
					continue;
				}

				// 最大文字数、最小値のチェック（数値の場合は最大値のチェックに変更）
				if(isset($option['max'])){
					if($option['type']!="INT"){
						if(strlen($this->fvars[$name]) > $option['max']){
							$this->error->add($option['title']."は".$option['max']."文字以内で入力してください。");
						}
					}else{
						if($this->fvars[$name] > $option['max']){
							$this->error->add($option['title']."は".$option['max']."以内の数値で入力してください。");
						}
					}
				}

				// 最小文字数のチェック、最小値のチェック（数値の場合は最小値のチェックに変更）
				if(isset($option['min'])){
					if($option['type']!="INT"){
						if(strlen( $this->fvars[$name] ) < $option['min'] ){
								$this->error->add($option['title']."は".$option['min']."文字以上で入力してください。");
						}
					}else{
						if($this->fvars[$name] < $option['min']){
							$this->error->add($option['title']."は".$option['min']."以上の数値で入力してください。");
						}
					}
				}

				// 最大文字数のチェック
				if(isset($option['max_len'])){
					if(strlen($this->fvars[$name]) > $option['max_len']){
						$this->error->add($option['title']."は".$option['max_len']."文字以内で入力してください。");
					}
				}

				// 最小文字数のチェック
				if(isset($option['min_len'])){
					if(strlen($this->fvars[$name]) < $option['min_len']){
						$this->error->add($option['title']."は".$option['min_len']."文字以上で入力してください。");
					}
				}

				// データタイプのチェック
				if(isset($option['type'])){

					// テキストデータなら改行を修正
					if($option['type'] == "TEXT"){
						$this->fvars[$name]=str_replace("\\r\\n","\n",$this->fvars[$name]);
					}

					// データがメールアドレス形式で入力されているか？
					if($option['type'] == "MAIL"){
						$this->fvars[$name] = trim($this->fvars[$name]);
						if(!preg_match('/^[a-zA-Z0-9_\.\-]+?@[A-Za-z0-9_\.\-]+$/',$this->fvars[$name]) ){
							$this->error->add($option['title']."のメールアドレス形式が正しくありません。");
						}
					}

					// データがURL形式で入力されているか？
					if($option['type'] == "URL"){
						if(!preg_match('/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/',$this->fvars[$name]) ){
							$this->error->add($option['title']."のＵＲＬ形式が正しくありません。");
						}
					}

					// データが数字のみで構成されているか？
					if($option['type'] == "INT" || $option['type'] == "NUM"){
						if(!preg_match("/^[-]{0,1}[0-9]+$/",$this->fvars[$name]) ){
							$this->error->add($option['title']."は全て数値で入力してください。");
							if(isset($option['default']) == true){
								$this->fvars[$name]=$option['default'];
							}else{
								$this->fvars[$name]=0;
							}
						}else{
							// 整数に変換
							if(!is_numeric($this->fvars[$name])){
								$this->fvars[$name]=0;
							}
						}
					}

					// データが数字のみで構成されているか？
					if($option['type'] == "FLOAT"){
						if(!preg_match("/^[0-9\.]+$/",$this->fvars[$name]) ){
							$this->error->add($option['title']."は全て数値で入力してください。");
							$this->fvars[$name]=0;
						}
						if(!is_numeric($this->fvars[$name])){
							$this->fvars[$name]=0;
						}
					}

					// 半角英数字のチェック
					if($option['type'] == "ALPHA_NUM"){
						if(!preg_match("/^[a-zA-Z0-9\-]+$/",$this->fvars[$name]) ){
							$this->error->add($option['title']."は全て半角英数で入力してください。");
						}
					}

					// 半角英字のチェック
					if($option['type'] == "ALPHA"){
						if(!preg_match("/^[a-zA-Z]+$/",$this->fvars[$name]) ){
							$this->error->add($option['title']."は全て半角英字で入力してください。");
						}
					}

					// 全角カタカナ
					if($option['type'] == "KANA_ZEN"){
						mb_regex_encoding('UTF-8');
						if (!mb_ereg("^[ァ-ヶ　（）ー]+$",trim($this->fvars[$name]))) {
							$this->error->add($option['title']."は全て全角カタカナで入力してください。");
						}
					}

					// 半角カタカナ
					if($option['type'] == "KANA_HAN"){
						if (!mb_ereg("^[ｱ-ﾝﾞﾟ() ]+$",$this->fvars[$name])) {
							$this->error->add($option['title']."は全て半角カタカナで入力してください。");
						}
					}

					// 郵便番号の入力チェック
					if($option['type'] == "ZIP"){
						if(!preg_match("/^\d{3}\-\d{4}$/",$this->fvars[$name])){
							$this->error->add($option['title']."の入力が正しくありません");
						}
					}

					// 電話番号の入力チェック
					if($option['type'] == "TEL"){
						if(!preg_match('/^[0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}$/',$this->fvars[$name])){
							$this->error->add($option['title']."の入力が正しくありません");
						}
					}
					// 選択値の処理
					if($option['type'] == "SELECT"){
						// 値を配列に分解する。
						$selectArray=array();
						$selectArray=explode("|",$option["select"]);
						// フォーム値が該当するか？
						$selectCheck=false;
						foreach($selectArray as $tmp){
							if($this->fvars[$name]==$tmp){
								$selectCheck=true;
							}
						}
						// 該当無しの場合の処理。
						if($selectCheck == false){
							if(isset($option['default'])){
								$this->fvars[$name]=$option['default'];
							}else{
								$this->error->add($option['title']."の選択値が不正です。");
							}
						}
					}
				}
			}else{
				// 必須時はエラー //////////////////////////////////////////////////
				if($option['require'] == true){
					$this->fvars[$name]='';
					$this->error->add($option['title']."は入力必須項目です。");
				}
				if(isset($option['default'])){
					$this->fvars[$name]=$option['default'];
				}else{

					switch($option['type']){
						case 'INT':
						case 'FLOAT':
							$this->fvars[$name]=0;
							break;
						default:
							$this->fvars[$name]='';
					}
				}
			}
		}

	}

/*
	-------------------------------------------------------------
	* 直接呼出し可能メソッド
	-------------------------------------------------------------
*/

	/**
		* @work:文字列がメールアドレスかどうか？:
		* @arg:string $string チェックする文字列:
		* @return:BOOL:
	*/
	function is_mail($string){
		if(preg_match('/^[a-zA-Z0-9_\.\-]+?@[A-Za-z0-9_\.\-]+$/',$string)){
			return true;
		}
		return false;
	}

	/**
		* @work:文字列がURLかどうか？:
		* @arg:string $string チェックする文字列:
		* @return:BOOL:
	*/
	function is_url($string){
		if(!preg_match('/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/',$string)){
			return false;
		}
		return true;
	}

	/**
		* @work:全て英数字かどうか？:
		* @arg:string $string チェックする文字列:
		* @return:BOOL:
	*/
	function is_alpha_num($string){
		if(preg_match("/^[a-zA-Z0-9]+$/",$string)){
			return true;
		}
		return false;
	}

}

?>
