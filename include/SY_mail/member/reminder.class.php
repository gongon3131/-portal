<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_reminder extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['from']='sendonly@happiness-party.jp';
		$this->mail_array['from_name']='happiness-party 運営事務局';
		$this->mail_array['subject']='パスワード再発行のお知らせ';

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ パスワード再発行のお知らせ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{$this->mail_array['member_lastname']} 様

いつも、ハピネスパーティーをご利用いただきまして誠に
ありがとうございます。お客様のログイン情報は下記のとおりです。

-------------------------------

メールアドレス（ログインID）：
{$this->mail_array['member_email']}

パスワード：
{$this->mail_array['member_password']}

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
