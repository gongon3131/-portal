<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_order extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['from']='sendonly@happiness-party.jp';
		$this->mail_array['from_name']='happiness-party 運営事務局';
		$this->mail_array['subject']='お申込みありがとうございます。';

		$ymd = date('Y年m月d日 H時i分',strtotime($this->mail_array['event_start_dt']));

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ お申込みありがとうございます。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{$this->mail_array['member_lastname']} 様

いつも、ご利用頂きまして誠にありがうございます。ハピネス運営事務局です。
パーティーのお申し込みが完了しました。

-------------------------------

イベント名：
{$this->mail_array['event_title']}

開催概要：
https://happiness-party.jp/event.php?event_id={$this->mail_array['event_id']}

予約状況：
https://happiness-party.jp/member/reception_search.php

-------------------------------

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ご不明な点がございましたらお気軽にお問合せくださいませ。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";


	}
}

?>
