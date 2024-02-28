<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_get_one_detail extends SY_Validate {

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
			"section_sta" => array(
				"title"	=> "期間開始",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"section_end" => array(
				"title"	=> "期間終了",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"target" => array(
				"title"	=> "期間終了",
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
