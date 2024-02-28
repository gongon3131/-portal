<?php

//ファイルの移動

class File {

	var $filename;

	// 機能概要：ファイルの構築
	// 引数：ファイルのフルパス
	function File($filename){
		$this->set_file($filename);
	}

	// 機能概要：ファイルをセット
	function set_file($filename){
		if( file_exists($filename) ){
			$this->filename = $filename;
			return true;
		}else{
			return false;
		}
	}

	// 機能概要：拡張子の取得
	// 引数：なし
	function get_file_extension($order=''){

		//ファイル名の取得
		if($order==''){
			$filename = $this->filename;
		}else{
			$filename = $order;
		}

		$filename = basename($filename);

		//区切り文字で分割
		$arr = split("\.",$filename);

		//拡張子の取得
		$type = $arr[count($arr)-1];

		return $type;

	}

	// 機能概要：ファイルの移動
	// 引数：移動先のファイルパス
	function move($dest){
		if( file_exists($this->filename)){
			if(copy($this->filename,$dest)){
				unlink($this->filename);
				$this->filename = $dest;
				return true;
			}
		}
		return false;
	}

	// 機能概要：コピーファイル
	// 引数：コピー先のファイルパス
	function copy($dest){
		if( file_exists($this->filename)){
			if( copy($this->filename,$dest)){
				return true;
			}
		}
		return false;
	}

	// 機能概要：ファイルの削除
	function unlink(){
		return unlink($this->filename);
	}

	// 機能概要：ファイルサイズの取得
	// 引数：なし
	function get_filesize(){
		return filesize($this->filename);
	}

	// 機能概要：ファイルの名前の取得
	// 引数：なし
	function get_basename(){
		return basename($this->filename);
	}

	// 機能概要：ファイルパスを取得
	// 引数：なし
	function get_filepath(){
		return $this->filename;
	}

	// 機能概要：ダウンロード
	// 引数：なし
	function download(){
		// 拡張子の取得
		$type = $this->get_file_extension();
		header("Content-Disposition: attachment; filename=\"download.{$type}\";");
		header('Content-Length: '.filesize($this->filename));
		header('Content-Type: application/octet-stream');
		readfile($this->filename);
		return true;
	}

	// 機能概要：download のエイリアス
	function send(){
		$this->download();
	}

	// 機能概要：アップロードファイルの移動
	// 引数：移動先
	function move_uploaded_file($dest){
		if(is_uploaded_file($this->filename)){
			move_uploaded_file($this->filename,$dest);
			return true;
		}else{
			return false;
		}
	}

}

?>