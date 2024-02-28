<?php
/*
	* @class:SY_Result:
	* @work:結果保持用のクラス:
	* @date:2008/02/17:
*/
class SY_Result extends SY_Base {

	var $storage;

	/**
		* @work:コンストラクター:
		* @arg::
		* @return::
	*/
	function SY_Result (){
		$this->SY_Base();
		$this->storage = array();
	}

	/**
		* @work:結果を追加:
		* @arg:string $name 結果の名前:
		* @arg:string $name 結果の値:
		* @return::
	*/
	function add($name,$value){
		$this->storage[$name]=$value;
	}

	/**
		* @work:結果を配列で取得:
		* @arg::
		* @return:array 結果の配列:
	*/
	function get($name=null){
		if(isset($name)){
			if(isset($this->storage[$name])){
				return $this->storage[$name];
			}else{
				exit('Error:No result in array');
			}
		}else{
			return $this->storage;
		}
	}

	/**
		* @work:結果を変数を初期化:
		* @arg::
		* @return::
	*/
	function reset(){
		$this->storage = array();
	}

	/**
		* @work:結果の内容を書き出す:
		* @arg::
		* @return::
	*/
	function print_r(){
		print_r($this->storage);
		exit;
	}

	/**
		* @work:結果をHTMLセーフに変換:
		* @arg::
		* @return::
	*/
	function html_safe(){
		array_walk_recursive($this->storage,array($this,'validate'));
	}

	/**
		* @work:直接呼ばない:
		* @arg::
		* @return::
	*/
	//function validate(&$value,&$name){
	function validate($value){	
		$value=htmlspecialchars($value);
	}

}

?>