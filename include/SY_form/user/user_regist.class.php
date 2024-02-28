<?php
/*
	* @class:SY_App:
	* @work:フォームの入力チェック用クラス
*/
class SY_FORM_user_regist extends SY_Validate {

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
				"type" 		=> "ALPHA_NUM",
			),
			"tmur_password" => array(
				"title"	=> "パスワード",
				"require" 	=> true,
				"type" 		=> "ALPHA_NUM",
			),
			"tmur_user_name" => array(
				"title"	=> "氏名",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tmur_user_name_kana" => array(
				"title"	=> "氏名カナ",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tmur_zipcode" => array(
				"title"	=> "郵便番号",
				"require" 	=> true,
				"type" 		=> "ZIP",
			),
			"tmur_address" => array(
				"title"	=> "住所",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tmur_apart" => array(
				"title"	=> "建物名",
				"require" 	=> false,
				"type" 		=> "TEXT",
			),
			"tmur_tel" => array(
				"title"	=> "電話番号",
				"require" 	=> true,
				"type" 		=> "TEL",
			),
			"tmur_mobile_phone" => array(
				"title"	=> "携帯電話番号",
				"require" 	=> false,
				"type" 		=> "TEL",
			),
			"tmur_birthday" => array(
				"title"	=> "生年月日",
				"require" 	=> true,
				"type" 		=> "TEXT",
			),
			"tmur_mail" => array(
				"title"	=> "メールアドレス",
				"require" 	=> false,
				"type" 		=> "MAIL",
			),
			"tmur_hire_date" => array(
				"title"	=> "入社日",
				"require" 	=> false,
				"type" 		=> "TEXT",
			),
			"tmur_authority" => array(
				"title"	=> "操作権限",
				"require" 	=> true,
				"type" 		=> "INT",
				"define"	=>	$this->define['user_type'],
			),
			"tmur_holiday_manage" => array(
				"title"	=> "休日管理",
				"require" 	=> true,
				"type" 		=> "INT",
				"define"	=>	$this->define['holiday_manage'],
			),			
			"tmur_is_used" => array(
				"title"	=> "在籍状況",
				"require" 	=> true,
				"type" 		=> "INT",
				"define"	=>	$this->define['enroll_status'],
			),
			"tmur_memo" => array(
				"title"	=> "備考",
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

		//ID5桁チェック
		if(empty($this->vars['tmur_user_id']) == false){
			if(mb_strlen($this->vars['tmur_user_id']) != 5){
				$this->error->add('IDは5桁で入力してください');
			}
		}

		//パスワード6桁チェック
		if(empty($this->vars['tmur_password']) == false){
			if(mb_strlen($this->vars['tmur_password']) != 6){
				$this->error->add('パスワードは6桁で入力してください');
			}
		}

		//生年月日整合性チェック
		if(empty($this->vars['tmur_birthday']) == false){
			list($Y, $m, $d) = explode('-', $this->vars['tmur_birthday']);

			if (checkdate($m, $d, $Y) === false) {
				$this->error->add('生年月日の入力が不正です');
			}
		}

		//入社日整合性チェック
		if(empty($this->vars['tmur_hire_date']) == false){
			list($Y, $m, $d) = explode('-', $this->vars['tmur_hire_date']);

			if (checkdate($m, $d, $Y) === false) {
				$this->error->add('入社日の入力が不正です');
			}
		}
	}

}


?>
