<?php
/*
	* @class:SY_Error:
	* @work:フレームワークのエラー管理クラス:
	* @date:2008/02/17:
*/
class SY_Error extends SY_Base {

	/*
		* @vars:msg:
		* @msg:エラーメッセージ管理配列:
	*/
	private $msg;

	/**
		* @work:コンストラクター:
		* @arg::
		* @return::
		* @msg:エラー配列の初期化:
	*/
	function SY_Error (){
		$this->SY_Base();
		$this->msg = array();
	}

	/**
		* @work:エラーの追加:
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

	function add_for_key($string,$key){
		if($string != '' and $key != ''){
			$this->msg[$key] = $string;
		}
	}

	/**
		* @work:エラーを配列で取得:
		* @arg::
		* @return:array エラー文字列が入った配列:
	*/
	function get(){
		return $this->msg;
	}

	/**
		* @work:エラーを数をカウント:
		* @arg::
		* @return:int エラーの個数を返す:
	*/
	function count(){
		return count($this->msg);
	}

	/**
		* @work:エラー変数を初期化:
		* @arg::
		* @return::
	*/
	function reset(){
		$this->msg = array();
	}

	/**
		* @work:エラーの内容を書き出す。デバッグ用:
		* @arg::
		* @return::
	*/
	function print_r(){
		print_r($this->msg);
		exit;
	}

	/**
		* @work:致命的エラーで終了:
		* @arg::
		* @return::
	*/
	function fatal_error($fatal_error){
		if($this->config['DEBUG'] > 0){
			$debug_msg = $this->debug->get();
			foreach($debug_msg as $name => $value){
					echo "<div>{$name}:{$value}</div>";
			}
		}
		$this->smarty->assign('SY_fatal_error_message',$fatal_error);
		$this->smarty->assign('SY_error_message',$this->msg);
		$this->display('fatal_error.tpl');
		exit;
	}

}

?>
