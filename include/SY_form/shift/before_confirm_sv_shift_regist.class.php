<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_before_confirm_sv_shift_regist extends SY_Validate {

	/**
		* @work:フォームの初期設定:
		* @arg::
		* @return::
	*/
	function ini_form(){

		$this->fdefine = array(

			"token" => array(
				"title"	=> "csrf_token",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tdbs_release_flg" => array(
				"title"	=> "公開フラグ",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"section_sta" => array(
				"title"	=> "シフト期間始端",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"section_end" => array(
				"title"	=> "シフト期間終端",
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
