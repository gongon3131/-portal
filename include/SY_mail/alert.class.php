<?php
/*
	* @class:SY_App:
	* @work:メール設定用クラス:
	* @date:2008/02/17:
*/
class SY_MAIL_alert extends SY_Mail {

	/**
		* @work:メールの設定:
		* @arg::
		* @return::
	*/
	function ini_mail(){

		// 基本項目の設定
		$this->mail_array['to']='info@ks-navi.net';
		$this->mail_array['from_name']='system';
		$this->mail_array['subject']='【KSNAVI】アクセスアラート';

		$system_time	=strftime("%Y-%m-%d %H:%M:%S",strtotime("now"));
		$remote_ip	=$_SERVER['REMOTE_ADDR'];
		$remote_host	=gethostbyaddr($_SERVER['REMOTE_ADDR']);
		$location		=$_SERVER["SCRIPT_FILENAME"];

		$getString='';
		$postString='';
		$sessionString='';

		foreach($_GET as $name => $value){
			$getString.="{$name}:{$value}
";
		}

		foreach($_POST as $name => $value){
			$postString.="{$name}:{$value}
";
		}

		foreach($_SESSION as $name => $value){
			$sessionString.="{$name}:{$value}
";
		}

$this->mail_array['message']="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ■ SYSTEM MESSAGE ACCESS ALERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■下記情報にて、アクセスを検知
LOCATION:{$location}
System-time:{$system_time}
REMOTEIP:{$remote_ip}
REMOTEHOST:{$remote_host}

■POST情報（プログラムに送信された情報）
{$getString}

■GET情報（プログラムに送信された情報）
{$postString}

■SESSION情報（プログラムに送信された情報）
{$sessionString}

連続的なロボットによるアクセス、
未登録IPアドレスからのアクセス時に
配信されます。

";

	}
}


?>
