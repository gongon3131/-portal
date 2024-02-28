<?php
/*
	* @class:SY_MessageMap:
	* @work:フレームワークのメッセージマップクラス:
	* @date:2008/02/17:
*/
class SY_MessageMap {

	/*
		* @vars:instance:
		* @msg:フレームワークのインスタンス:
	*/
	var $instance;

	/*
		* @vars:message:
		* @msg:メッセージを管理:
	*/
	var $message;

	/**
		* @work:メッセージマップの初期化:
		* @arg:instance $instance メッセージマップを開始するオブジェクト:
		* @arg:string $message メッセージ変数:
		* @return::
	*/
	function SY_MessageMap($instance,$message){
		$this->instance = $instance;
		if(isset($message)){
			$this->message = $message;
		}else{
			$this->message = false;
		}
	}

	/**
		* @work:安全に関数をコール:
		* @arg::
		* @return::
	*/
	function startMessageMap(){
		if($this->message == false){
			// メッセージが存在しない場合
			if(method_exists($this->instance,"CALLBACK__INDEX")){
				$call_name = array($this->instance,"CALLBACK__INDEX");
				call_user_func($call_name);
			}
		}else{
			// メッセージのマッピング処理
			$is_loaded=false;
			if(method_exists($this->instance,"CALLBACK__".$this->message)){
				$is_loaded=true;
				$call_name = array($this->instance, "CALLBACK__".$this->message);
				call_user_func($call_name);
			}
			// メッセージが一致しない場合の処理
			if(!$is_loaded){
				if(method_exists($this->instance,"CALLBACK__INDEX")){
					$call_name = array($this->instance, "CALLBACK__INDEX");
					call_user_func($call_name);
				}
			}
		}
	}
}

?>