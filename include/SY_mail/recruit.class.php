<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_recruit extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['from']='sendonly@happiness-party.jp';
		$this->mail_array['from_name']='happiness-party 運営事務局';
		$this->mail_array['subject']='求人応募ありがとうございます。';

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ 求人応募ありがとうございます。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{$this->mail_array['recruit_lastname']} 様

この度は弊社の求人に応募頂き誠に有難うございます。

-------------------------------

希望勤務形態：
{$this->define['recruit_type'][$this->mail_array['recruit_type']]}

お名前：
{$this->mail_array['recruit_lastname']} {$this->mail_array['recruit_firstname']} 様

お名前（カナ）：
{$this->mail_array['recruit_lastname_kana']} {$this->mail_array['recruit_firstname_kana']} 様

性別：
{$this->mail_array['recruit_age']}

携帯電話番号：
{$this->mail_array['recruit_tel']}

メールアドレス：
{$this->mail_array['recruit_email']}

お問い合わせ内容：
{$this->mail_array['recruit_message']}

-------------------------------

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ご不明な点がございましたらお気軽にお問合せくださいませ。
info@happiness-party.jp
ハピネスパーティー
大阪府大阪市中央区北久宝寺町4丁目3-5　本町サミットビル2F
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";


	}
}

?>
