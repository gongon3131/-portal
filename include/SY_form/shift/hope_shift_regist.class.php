<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_hope_shift_regist extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tmur_user_id" => array(
				"title"	=> "OPID",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"token" => array(
				"title"	=> "csrf_token",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"target" => array(
				"title"	=> "terget",
				"require" 	=> false,
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
