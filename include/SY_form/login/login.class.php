<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_login extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(

			"user_id" => array(
				"title"	=> "ID",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"user_pass" => array(
				"title"	=> "パスワード",
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
