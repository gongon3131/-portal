<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_get_hope_shift_sv extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tmur_user_id" => array(
				"title"	=> "ID",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"section_sta" => array(
				"title"	=> "シフト期間開始日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"section_end" => array(
				"title"	=> "シフト期間終了日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),		);

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
