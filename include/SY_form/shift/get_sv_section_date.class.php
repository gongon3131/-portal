<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_get_sv_section_date extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tshs_id" => array(
				"title"	=> "ID",
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
