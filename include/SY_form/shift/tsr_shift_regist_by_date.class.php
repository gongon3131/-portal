<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_tsr_shift_regist_by_date extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tdbc_shift_date" => array(
				"title"	=> "OPID",
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
