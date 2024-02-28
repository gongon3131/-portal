<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_business_category_regist extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"tmbc_business_id" => array(
				"title"	=> "業務番号",
				"require" 	=> true,
				"type" 		=> "INT",
			),
			"tmbc_business_name" => array(
				"title"	=> "業務名",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tmbc_color_code" => array(
				"title"	=> "カラーコード",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tmbc_import_class" => array(
				"title"	=> "インポート区分",
				"require" 	=> true,
				"type" 		=> "INT",
			),
			"tmbc_memo" => array(
				"title"	=> "メモ",
				"require" 	=> false,
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
