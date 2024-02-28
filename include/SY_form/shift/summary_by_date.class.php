<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_summary_by_date extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"showen_date" => array(
				"title"	=> "シフト集計期間開始日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"section_sta" => array(
				"title"	=> "シフト集計期間開始日",
				"require" 	=> false,
				"type" 		=> "TEXT",
			),
			"section_end" => array(
				"title"	=> "シフト集計期間終了日",
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
