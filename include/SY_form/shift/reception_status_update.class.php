<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_reception_status_update extends SY_Validate {

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
				"type" 		=> "INT",
			),
			"current_status" => array(
				"title"	=> "現在ステータス",
				"require" 	=> true,
				"type" 		=> "INT",
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
