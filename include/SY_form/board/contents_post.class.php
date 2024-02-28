<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_contents_post extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(
			"post_contents" => array(
				"title"	=> "本文",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"category" => array(
				"title"	=> "カテゴリー",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"subject" => array(
				"title"	=> "標題",
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
