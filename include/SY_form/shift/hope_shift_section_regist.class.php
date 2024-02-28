<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_hope_shift_section_regist extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tshs_id" => array(
				"title"	=> "ID",
				"require" 	=> false,
				"type" 		=> "INT",
			),
			"tshs_start_date" => array(
				"title"	=> "開始日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tshs_end_date" => array(
				"title"	=> "終了日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tshs_dead_line" => array(
				"title"	=> "締切日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tshs_delete_date" => array(
				"title"	=> "データ消去日",
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
