<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_shift_import extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(

			"target_business_no" => array(
				"title"	=> "日付",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"target_date_from" => array(
				"title"	=> "集計開始日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"target_date_to" => array(
				"title"	=> "集計終了日",
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
