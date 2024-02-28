<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_shop_insert extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['from']='sendonly@ks-navi.net';
		$this->mail_array['from_name']='KS-NAVI運営事務局';
		$this->mail_array['subject']='新規店舗が登録されました。';

		// 日付の作成 開始日
		$start_dt = $this->vars['shop_plan_start_year']
			."-".$this->vars['shop_plan_start_month']
			."-".$this->vars['shop_plan_start_day'];
		// 日付の作成 終了日
		$end_dt = $this->vars['shop_plan_end_year']
			."-".$this->vars['shop_plan_end_month']
			."-".$this->vars['shop_plan_end_day'];

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ 新規店舗が登録されました。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{$this->mail_array['primary_company']} 様

いつも、お世話になります。KS-NAVI運営事務局です。
代理店「{$this->agent['agent_company']}」が店舗契約を追加しましたので
ご連絡させていただきました。

-------------------------------

契約日：
{$start_dt}?{$end_dt}

店舗名：
{$this->vars['shop_name']}

住所：
{$this->define['pref'][$this->vars['shop_pref']]}{$this->vars['shop_address1']}{$this->vars['shop_address2']}

電話番号：
{$this->mail_array['shop_tel']}

携帯番号：
{$this->mail_array['shop_tel_mobile']}

-------------------------------

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ご不明な点がございましたらお気軽にお問合せくださいませ。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";


	}
}

?>
