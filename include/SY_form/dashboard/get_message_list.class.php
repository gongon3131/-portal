<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_get_message_list extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tdms_open_confirm" => array(
				"title"	=> "ID",
				"require" 	=> true,
				"type" 		=> "INT",
			),
			"tdms_address_user" => array(
				"title"	=> "宛先",
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
