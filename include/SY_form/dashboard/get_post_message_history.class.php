<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_get_post_message_history extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tdms_post_user" => array(
				"title"	=> "送信者",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			
		);


	}

	/**
		* @work:カスタムチェック:
		* @arg::
		* @return::
	*/
	function custom(){

	}

}


?>
