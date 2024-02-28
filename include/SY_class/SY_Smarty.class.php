<?php
/*
	* @class:SY_Smarty:
	* @work:SMARTY拡張用の継承クラス:
	* @date:2008/02/17:
*/
class SY_Smarty extends Smarty {

	function SY_Smarty(){

		/*
			* @smarty:ダイナミックブロックの登録:
		*/
		$this->register_block('dynamic', array($this,'dynamic'), false);
		$this->register_block('htmlsafe', array($this,'htmlsafe'), false);

		/*
			* @smarty:URL自動リンク関数:
		*/
		$this->register_function('convert_link', array($this,'convert_link'));

		/*
			* @smarty:フォームで選択された項目を表示:
		*/
		$this->register_function('select', array($this,'select'));

		/*
			* @smarty:モディファーの登録:
		*/
		$this->register_modifier('comma_format', array($this,'comma_format'));
		$this->register_modifier('urlencode', array($this,'urlencode'));
		$this->register_modifier('href', array($this,'href'));

	}

	/**
		* @work:URLエンコード:
		* @arg:Smarty Callback Param:
		* @return::
	*/
	function urlencode($string){
		return urlencode($string);
	}

	/**
		* @work:数値にカンマを付加:
		* @arg:Smarty Callback Param:
		* @return::
	*/
	function comma_format($string){
		return number_format($string);
	}

	function href($string){
		$text = $string;
		$text = ereg_replace("[^\"](https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)","<a href=\"\\1\" target=\"_blank\">\\1</a>",$text);
		return $text;
	}

	/**
		* @work:URLを自動リンク:
		* @arg:Smarty Callback Param:
		* @return::
	*/
	function convert_link($params, &$smarty){
		$text = $params['text'];
		$text = ereg_replace("(https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)","<a href=\"\\1\" target=\"_blank\">\\1</a>",$text);
		return $text;
	}

	/**
		* @work:フォームで選択された項目を表示:
		* @arg:Smarty Callback Param:
		* @return::
	*/
	function select($params, &$smarty){
		$text='';
		if(is_array($params['selected'])){
			foreach($params['selected'] as $name => $value ){
				if(isset($params['options'][$value])){
					$text.=$params['options'][$value]." ";
				}
			}
		}
		return $text;
	}

	/**
		* @work:キャッシュ対策のブロック関数:
		* @arg:Smarty Callback Param:
		* @return::
	*/
	function dynamic($param, $content, &$smarty) {
	    return $content;
	}

	function htmlsafe($param, $content, &$smarty) {
	    return htmlspecialchars($content);
	}

}

?>
