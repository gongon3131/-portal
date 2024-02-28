<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_contact extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['from']='sendonly@happiness-party.jp';
		$this->mail_array['from_name']='happiness-party 運営事務局';
		$this->mail_array['subject']='お問い合わせ有難うございます。';

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ お問い合わせありがとうございます。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{$this->mail_array['contact_lastname']} 様

この度はお問い合わせいただきまして誠に有難うございます。
ハピネス運営事務局です。お客様のお問い合わせを受け付けましたので、
回答までしばらくお待ち下さい。

-------------------------------

タイトル：
{$this->define['contact_title'][$this->mail_array['contact_title']]}

お名前：
{$this->mail_array['contact_lastname']} {$this->mail_array['contact_firstname']} 様

お名前（カナ）：
{$this->mail_array['contact_lastname_kana']} {$this->mail_array['contact_firstname_kana']} 様

性別：
{$this->define['sex'][$this->mail_array['contact_sex']]}

携帯電話番号：
{$this->mail_array['contact_tel']}

メールアドレス：
{$this->mail_array['contact_email']}

お問い合わせ内容：
{$this->mail_array['contact_message']}

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
