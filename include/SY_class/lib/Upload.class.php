<?php

//ファイルのアップロード

class upload {

	var $upfile;

	// 機能概要：ファイルの構築
	// 引数：フォームの名前
	function upload($userfile){
		// ファイル名の取得
		foreach($_FILE as $KEY){
			if($KEY == $userfile){
				if(is_uploaded_file($_FILES[$userfile]['tmp_name'])){
					$upfile = $_FILE[$KEY];
					return true;
				}
			}
		}
		return false;
	}

	// 機能概要：拡張子の取得
	// 引数：なし
	function get_file_extension(){

		//ファイル名の取得
		$filename = $this->upfile['name'];
		$filename = basename($filename);

		//区切り文字で分割
		$arr = split("\.",$filename);

		//拡張子の取得
		$type = $arr[count($arr)-1];

		return $type;

	}

	// 機能概要：アップロードファイルの移動
	// 引数：移動先
	function move_uploaded_file($dest){
		if( is_uploaded_file($this->upfile['tmp_name'])){
			move_uploaded_file($this->upfile['tmp_name'],$dest);
			return true;
		}else{
			return false;
		}
	}

	// 機能概要：ファイルサイズの取得
	// 引数：なし
	function get_file_size(){
		return $this->upfile['size'];
	}

	// 機能概要：アップロードエラーの取得
	// 引数：なし
	function get_upload_error(){
		return $this->upfile['error'];
	}

	// 機能概要：一時ファイルの名前
	// 引数：なし
	function get_temp_name(){
		return $this->upfile['tmp_name'];
	}

}

?>