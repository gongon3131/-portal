<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_member_signup extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['from']='sendonly@happiness-party.jp';
		$this->mail_array['from_name']='happiness-party 運営事務局';
		$this->mail_array['subject']='会員登録ありがとうございます。';

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ 会員登録が完了しました。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{$this->mail_array['member_lastname']} 様

いつも、お世話になります。ハピネス運営事務局です。

-------------------------------

登録メールアドレス：
{$this->mail_array['member_email']}

パスワード
{$this->mail_array['member_password']}

-------------------------------

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ご不明な点がございましたらお気軽にお問合せくださいませ。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";


	}
}

?>
