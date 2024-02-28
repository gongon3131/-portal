<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_get_one_user extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tmct_category_name" => array(
				"title"	=> "カテゴリー名",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tmct_id" => array(
				"title"	=> "ID",
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
