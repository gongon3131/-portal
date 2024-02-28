<?php
// ----------------------------------------------------------------------------
//  メール送信用のクラス
// ----------------------------------------------------------------------------

// SMTPサーバ接続

class SY_Mail extends SY_Base{

	var $mail_array;

	/**
		* @work:コンストラクター:
		* @arg::
		* @return::
	*/
	function SY_Mail(){
		$this->SY_Base();
	}

	/**
		* @work:メール本文を新規作成する:
		* @arg:array $mail_array:
		* @return::
	*/
	function make($mail_array=null){
		$this->mail_array = $mail_array;
		$this->ini_mail();
	}

	/**
		* @work:メールの送信を実行:
		* @arg::
		* @return::
	*/
	function send(){

		global $GLOBAL_SY_FRAMEWORK_SMTP;

		if(!$GLOBAL_SY_FRAMEWORK_SMTP){
			$GLOBAL_SY_FRAMEWORK_SMTP=& Mail::factory("SMTP",$this->config['smtp']);
		}

		$inputcheck[]='to';
		$inputcheck[]='subject';
		$inputcheck[]='message';
		foreach($inputcheck as $value){
			if(!isset($this->mail_array[$value]) || strlen($this->mail_array[$value]) == 0){
				$this->error->fatal_error('メール作成時に致命的エラーが発生しました');
			}
		}

		// 送信元がなければデフォルト値を使用
		if(isset($this->mail_array['from']) == false || strlen($this->mail_array['from']) == 0){
			if(isset($this->config['mail_from'])){
				$this->mail_array['from']=$this->config['mail_from'];
			}else{
				$this->error->fatal_error('[FROM]メール作成時に致命的エラーが発生しました');
			}
		}

		// 送信者名が存在すればセット。
		if(isset($this->mail_array['from_name']) ){
			$from = mb_encode_mimeheader(mb_convert_encoding($this->mail_array['from_name'],"ISO-2022-JP","UTF-8"));
			$from.=" <{$this->mail_array['from']}>";
		}else{
			$from="<{$this->mail_array['from']}>";
		}

		// CCの処理
		if(isset($this->mail_array['cc'])){
			$this->mail_array['to'].=",".$this->mail_array['cc'];
			$mheader['Cc']=$this->mail_array['cc'];
		}

		$mheader['To']		=$this->mail_array['to'];
		$mheader['Error-to']	="sendonly@happiness-party.jp";
		$mheader['From']		=$from;
		//$mheader['Subject']	=mb_convert_encoding($this->mail_array['subject'],"ISO-2022-JP","UTF-8");
		$mheader['Subject']	=mb_encode_mimeheader($this->mail_array['subject']);
		$mheader['Date']		=date("j M Y H:i:s")." +0900";
		$mheader['Content-Type']="text/plain; charset=\"ISO-2022-JP\"";
		$mheader['Content-Transfer-Encoding']="7bit";
		$this->mail_array['message']=mb_convert_encoding($this->mail_array['message'],"ISO-2022-JP","UTF-8");

		// BCCの処理
		if(isset($this->mail_array['bcc'])){
			$this->mail_array['to'].=",".$this->mail_array['bcc'];
		}

		// メールを送信
		$result = $GLOBAL_SY_FRAMEWORK_SMTP->send($this->mail_array['to'],$mheader,$this->mail_array['message']);

		if(PEAR::isError($result)) {
		  // die("エラーメッセージ：".$result->getMessage());
		}

	}
}

?>
