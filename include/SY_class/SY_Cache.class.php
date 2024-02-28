<?php
/*
	* @class:SY_Cache:
	* @work:フレームワークのキャッシュ管理クラス:
	* @date:2008/02/17:
*/
class SY_Cache extends SY_Base {

	var $cache_vars;
	var $cache_tmp;
	var $cache_dir;		
	var $path;
	var $fp;

	/**
		* @work:コンストラクター:
		* @arg::
		* @return::
	*/
	function SY_Cache(){
		// ベースクラスの読み込み
		$this->SY_Base();
		// 変数の初期化
		$this->cache_tmp=array();
		// ファイルパスのロード
		$this->cache_dir = $this->config['cache_dir'];
		// デフォルトファイル
		$this->loadfile('cache.txt');
	}

	/**
		* @work:新しいファイルをロード:
		* @arg:string $filename:
		* @return::
	*/
	function loadfile($filename='cache.txt'){
		// ファイル名の作成
		$this->path = $this->cache_dir.$filename;
		// ファイルが無ければ、ファイルを作成
		if(file_exists($this->path)==false){
			$this->fp = fopen($this->path,'w+');
			fclose($this->fp);
		}
		// ファイルのロード
		$this->loadCache();
		// 期限切れの変数を削除
		$this->lifeTimeCheck();
		// 値を反映させる
		$this->updateVars();
	}

	/**
		* @work:期限の切れた変数を削除:
		* @arg::
		* @return::
	*/
	function lifeTimeCheck(){
		if(is_array($this->cache_tmp)){
			foreach($this->cache_tmp as $name => $value){
				$limit = $this->cache_tmp[$name]['lifetime'] + $this->cache_tmp[$name]['regtime'];
				if($limit < time()){
					unset($this->cache_tmp[$name]);
				}
			}
		}
	}

	/**
		* @work:キャッシュ変数を追加:
		* @arg:string $name 名前:
		* @arg:string $string 内容:
		* @arg:string $lifetime 有効期限:
		* @return::
	*/
	function add($name,$string,$lifetime=3600){
		$this->cache_tmp[$name]['value']=$string;
		$this->cache_tmp[$name]['lifetime']=$lifetime;
		$this->cache_tmp[$name]['regtime']=time();
		$this->cache_vars[$name]=$string;
		return true;
	}

	/**
		* @work:指定した変数を削除:
		* @arg:string $name キャッシュ名:
		* @return::
	*/
	function remove($name){
		if(isset($this->cache_tmp[$name])){
			unset($this->cache_tmp[$name]);
		}
		if(isset($this->cache_vars[$name])){
			unset($this->cache_vars[$name]);
		}
	}

	/**
		* @work:指定したファイルを削除:
		* @arg:string $filename 削除するファイル名:
		* @return::
	*/
	function delete($filename=''){
		// ファイル名の作成
		$this->path = $this->cache_dir.$filename;
		// ファイルが存在すれば削除
		if(file_exists($this->path)){
			unlink($this->path);
		}
	}

	/**
		* @work:vars を最新の状態に更新:
		* @arg::
		* @return::
	*/
	function updateVars(){
		$result=array();
		if(is_array($this->cache_tmp)){
			foreach($this->cache_tmp as $name => $value){
				$result[$name]=$this->cache_tmp[$name]['value'];
			}
		}
		$this->cache_vars = $result;
	}

	/**
		* @work:変数を初期化:
		* @arg::
		* @return::
	*/
	function reset(){
		$this->cache_tmp=array();
		$this->cache_vars=array();
	}

	/**
		* @work:キャッシュ内容を書き出す:
		* @arg::
		* @return::
	*/
	function print_r(){
		print_r($this->cache_tmp);
	}

	/**
		* @work:キャッシュ内容を指定したファイルに保存:
		* @arg::
		* @return::
	*/
	function flush($filename='cache.txt'){
		$this->path = $this->cache_dir.$filename;
		$cache=serialize($this->cache_tmp);
		$this->fp = fopen($this->path,'r+');
		flock($this->fp, LOCK_EX);
		ftruncate ($this->fp,0);
		fseek($this->fp, 0);
		fwrite($this->fp,$cache);
		flock($this->fp, LOCK_UN);
		fclose($this->fp);
	}

	/**
		* @work:キャッシュファイルのロード:
		* @arg::
		* @return::
	*/
	function loadCache(){
		$cache='';
		$this->fp = fopen($this->path,'r');
		if ($this->fp) {
		    while (!feof($this->fp)) {
		        $cache.= fgets($this->fp, 4096);
		    }
		}
		fclose($this->fp);
		$this->cache_tmp = @unserialize($cache);
		if($this->cache_tmp == false){
			$this->cache_tmp=array();
		}else{
			// print_r(this->cache_tmp);
		}
	}

}

?>