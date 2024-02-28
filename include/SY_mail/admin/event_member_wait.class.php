<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_event_member_wait extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['from']='sendonly@happiness-party.jp';
		$this->mail_array['from_name']='happiness-party 運営事務局';
		$this->mail_array['subject']='現在予約状況は【待ち】となっております。';

		$ymd = date('Y年m月d日 H時i分',strtotime($this->mail_array['event_start_dt']));

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ 現在予約状況は【待ち】となっております。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{$this->mail_array['member_lastname']} 様

いつも、お世話になります。ハピネス運営事務局です。
現在予約状況は【待ち】となっております。

ご案内できるようになりましたら、こちらからお電話にて
ご連絡させていただきますので、電話番号の登録を忘れずお願い致します。

万が一、登録がない場合もしくは繋がらなかった場合は、メールでのご案内と
なりますが、弊社のドメインからの拒否設定をしていないか確認をお願い致します。
info@happiness-party.jp

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
