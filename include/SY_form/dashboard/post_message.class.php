<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_post_message extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			/*
			"tdms_address_user" => array(
				"title"	=> "宛先",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			*/
			"tdms_title" => array(
				"title"	=> "標題",
				"require" 	=> false,
				"type" 		=> "TEXT",
			),
			"tdms_contents" => array(
				"title"	=> "本文",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			
			"token" => array(
				"title"	=> "csrf_token",
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
