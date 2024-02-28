<?php
/*
	* @class:SY_Debug:
	* @work:フレームワークのデバッグ管理クラス:
	* @date:2008/02/17:
*/
class SY_Debug extends SY_Base {

	private $msg;

	/**
		* @work:コンストラクター:
		* @arg::
		* @return::
	*/
	function SY_Debug(){
		$this->SY_Base();
		$this->msg = array();
	}

	/**
		* @work:デバッグ情報を追加:
		* @arg:string array $string 文字列、又は文字列配列:
		* @return::
	*/
	function add($string){
		if(is_array($string)){
			foreach($string as $name => $value){
				$this->msg[] = $value;
			}
		}else{
			if( $string != '' ){
				$this->msg[] = $string;
			}
		}
	}

	/**
		* @work:デバッグ情報を配列で取得:
		* @arg::
		* @return:デバッグ情報配列:
	*/
	function get(){
		return $this->msg;
	}

	/**
		* @work:デバッグ情報の個数をカウント:
		* @arg::
		* @return:デバッグ情報の個数:
	*/
	function count(){
		return count($this->msg);
	}

	/**
		* @work:デバッグ情報を初期化:
		* @arg::
		* @return::
	*/
	function reset(){
		$this->msg = array();
	}

	/**
		* @work:デバッグ情報を書き出す:
		* @arg::
		* @return::
	*/
	function print_r(){
		print_r($this->msg);
		exit;
	}

	/**
		* @work:デバッグ情報を書き出す:
		* @arg::
		* @return::
	*/
	function out(){
		echo "<div id='debug' style=\"position:absolute; top:10px; left:10px;\">";
			foreach($this->msg as $name => $value){
				echo $value."<br />";
			}
		echo "</div>";
	}

}

?>