<?php
////////////////////////////////////////////////////////////////////////
//
//  小規模特化型簡易フレームワーク
//  ＳＹコントローラークラス
//
////////////////////////////////////////////////////////////////////////

// 注意事項：共通処理をこのファイルに書いてはいけません。
// 共通処理は、ベースクラスである「SY_FrameworkExtension 」に
// 記述してください。

class SY_Framework extends SY_FrameworkExtension {

	/*
		@work:コンストラクター:
		@arg::
		@return::
		@msg:ここからプログラムが開始されます。:
	*/
	function SY_Framework(){
		$this->SY_Base();
	}

	/*
		@work:実行開始:
		@arg::
		@return::
		@msg:ここでプログラムが開始されます。
	*/
	function start(){
		$this->excute();
	}

	/*
		@work:実行:
		@arg::
		@return::
		@msg:ここでプログラムが実行されます。
	*/
	function excute(){

		// アクション名を取得
		if(isset($_GET['action']))
		{
				$this->action = addslashes($_GET['action']);
		}else{
			if( isset($_POST['action']))
			{
					$this->action = addslashes($_POST['action']);
			}
		}

		// 遷移まえにフレームワークの設定を変更
		if(method_exists($this,'SY_config'))
		{
			$this->SY_config();
		}

		// 遷移まえの共通準備を実行します。（ 拡張クラスで定義できます。 ）
		if(method_exists($this,'SY_prepare_common'))
		{
			$this->SY_prepare_common();
		}

		// 遷移まえの準備を実行します。
		if(method_exists($this,'SY_prepare'))
		{
			$this->SY_prepare();
		}

		// メッセージマップの開始
		$MessageMap 	= new SY_MessageMap($this,$this->action);
		$MessageMap->startMessageMap();

	}

	 function enc_var($tpl_output,&$smty)
	 {
	  //$tpl_output = mb_convert_encoding($tpl_output, OUTCODE, INCODE);
	  //return $tpl_output;
	 }

}

?>