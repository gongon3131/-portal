<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_user_summary extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"search_user_name" => array(
				"title"	=> "氏名",
				"require" 	=> false,
				"type" 		=> "TEXT",
			),
			"search_address" => array(
				"title"	=> "住所",
				"require" 	=> false,
				"type" 		=> "TEXT",
			),
			"search_authority" => array(
				"title"	=> "操作権限",
				"require" 	=> false,
				"type" 		=> "INT",
			),
			"ses_flg" => array(
				"title"	=> "ses_flg",
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
