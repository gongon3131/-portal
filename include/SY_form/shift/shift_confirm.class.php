<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_shift_confirm extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(

			"section_sta" => array(
				"title"	=> "シフト期間開始",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"section_end" => array(
				"title"	=> "シフト期間終了",
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
