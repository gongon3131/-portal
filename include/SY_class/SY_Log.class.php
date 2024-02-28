<?php
/*
	* @class:SY_Debug:
	* @work:フレームワークのデバッグ管理クラス:
	* @date:2008/02/17:
*/
class SY_Log extends SY_Base {

	/**
		* @work:コンストラクター:
		* @arg::
		* @return::
	*/
	function SY_Log(){
		$this->SY_Base();
		$this->msg = array();
	}

	/**
		* @work:ログ情報を追加:
		* @arg:string array $string 文字列、又は文字列配列:
		* @return::
	*/
	function add($string){
		$string=date("Ymd-H-i-s").":".$string."\n";
		$fp=fopen($this->config['LOG_PATH'].date("Ym").".txt",'a');
		flock($fp, LOCK_EX);
		fwrite($fp,$string);
		flock($fp, LOCK_UN);
		fclose($fp);
	}


}

?>