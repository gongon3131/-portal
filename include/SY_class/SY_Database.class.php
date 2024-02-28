<?php
/*
	* @class:SY_Database:
	* @work:データベースの管理クラス:
	* @date:2008/02/17:
*/
class SY_Database extends SY_Base {

	var $connection;
	var $dbh;
	var $rtn;
	var $dbo;

	/**
		* @work:SQLコネクションを開く:
		* @arg::
		* @return::
	*/
	function SY_Database (){
		$this->SY_Base();
		$this->connect();
	}

	/**
		* @work:リザルトを設定:
		* @arg:resorce $result SQLの結果:
		* @return::
	*/
	function set_result(&$result){
		$this->rtn = &$result;
	}

	/**
		* @work:SQLに接続する:
		* @arg::
		* @return::
	*/
	function connect(){

		//DB接続
	
		/*PHP7.4 */
		$this->connection = mysqli_connect($this->config['sql_host'],$this->config['sql_user'],$this->config['sql_password']); /* PHP5.6 */
		mysqli_select_db($this->connection, $this->config['sql_db']); 

		mysqli_query( $this->connection ,'SET NAMES utf8');

		
		if(!$this->connection){ /* PHP5.6 */
		//if ($mysqli->connect_error) { /* PHP7.4 */
			$this->error->fatal_error('アクセスが集中しております。しばらくしてからもう一度接続してください。');
		}

		return $this->connection;
	}

	function db_connect_pod(){
		$this->dbo = new PDO('mysql:dbname='.$this->config['sql_db'].';host='.$this->config['sql_host'],$this->config['sql_user'],$this->config['sql_password']);
		return $this->dbo;
	}

	/**PDO */
	function sql_prepare(){

		$options = array(
			// SQL実行失敗時には例外をスローしてくれる
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			// カラム名をキーとする連想配列で取得する．これが一番ポピュラーな設定
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			// バッファードクエリを使う(一度に結果セットをすべて取得し、サーバー負荷を軽減)
			// SELECTで得た結果に対してもrowCountメソッドを使えるようにする
			PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,);
		
		$dsn = 'mysql:dbname='.$this->config['sql_db'].';host='.$this->config['sql_host'].';charset=utf8';
		//$dsn = 'mysql:dbname='.$this->config['sql_db'].';host='.$this->config['sql_host'].';charset=utf8';
		$this->dbh = new PDO($dsn,$this->config['sql_user'],$this->config['sql_password'],$options);

		return $this->dbh;
	}

	function sql_prepare_for_sqlserver(){

		$dsn = 'sqlsrv:server=192.168.4.232;database=CTIOB_SUBDB';
		$user = 'sa';
		$password = 'ctiadmin';		

		$options = array(
			// SQL実行失敗時には例外をスローしてくれる
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			// カラム名をキーとする連想配列で取得する．これが一番ポピュラーな設定
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			// バッファードクエリを使う(一度に結果セットをすべて取得し、サーバー負荷を軽減)
			// SELECTで得た結果に対してもrowCountメソッドを使えるようにする
			PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,);
		
		//$dsn = 'mysql:dbname='.$this->config['sql_db'].';host='.$this->config['sql_host'].';charset=utf8';
		//$dsn = 'mysql:dbname='.$this->config['sql_db'].';host='.$this->config['sql_host'].';charset=utf8';
		$dbh2 = new PDO($dsn,$user,$password,$options);

		return $dbh2;
	}
	
	//PDOデバッグ
	function pdo_debugStrParams($s) {
	  ob_start();
	  $s->debugDumpParams();
	  $r = ob_get_contents();
	  ob_end_clean();
	  //return $r;
	  preg_match('/(?<=Sent SQL:).*?(?=Params:)/s', $r, $matches);
	  //print_r($matches);
		//return $matches[0];
		return $matches[0];


	}	

	/**PostgreSQL */
	/**
		* @work:クエリの実行:
		* @arg:string $query SQLのクエリを実行:
		* @return::
	*/
	function query($query){

		// クエリを実行する
		$this->rtn = pg_query($query);

		// デバッグ情報を登録
		$this->debug->add(htmlspecialchars($query));

		// クエリー失敗時の例外処理
		if($this->rtn == false){
			if($this->config['DEBUG']==1 || $this->config['DEBUG']==2){
				$this->error->fatal_error('<div>クエリの実行に失敗しました。</div><div>'.$query.'</div><div>'.pg_result_error().'</div>');
			}else{
				$this->error->fatal_error('クエリの実行に失敗しました。');
			}
		}
		return $this->rtn;
	}

	// 機能概要：直近のクエリーの結果行数を取得
	function num_rows($result=0){
			return pg_num_rows($this->rtn);
	}

	// 機能概要：直近のＳＱＬで更新された行数を取得。
	function affected_rows(){
		return pg_affected_rows();
	}

	// 機能概要：直近のクエリーの結果を配列で取得
	// 引数：第一引数「all」を指定すると全ての行を配列で取得します。
	function fetch_assoc($order='deffault'){
		if($order=='all' || $order=='ALL'){
			$result=array();
			while($line=pg_fetch_assoc($this->rtn) ){
				$result[] = $line;
			}
			return $result;
		}
		return pg_fetch_assoc($this->rtn);
	}

	// 機能概要：直近のクエリーの結果を配列で取得
	// 引数：第一引数「all」を指定すると全ての行を配列で取得します。
	function fetch_array($order='deffault'){
		if($order=='all'){
			$result=array();
			while($line=pg_fetch_array($this->rtn) ){
				$result[] = $line;
			}
			return $result;
		}
		return pg_fetch_array($this->rtn);
	}

	// 機能概要：配列で行を追加
	// '' で囲んだ配列は、関数としてＳＱＬで実行されます。
	function insert_array($tableName,$insertArray,$specFileds=''){

		// フィールドリストの取得
		$fieldsArray = $this->list_fieldNames($tableName);

		$SQL="INSERT INTO \"$tableName\" ";
		$names='';
		$values='';
		$counter=0;
		foreach($insertArray as $name => $value){
			// フィールドが存在しなければ飛ばす
			if(isset($fieldsArray[$name]) == false){
				continue;
			}
			if($counter>0){
				$names.=",";
				$values.=",";
			}
			if(!is_array($value)){
				if(preg_match("/^\'(.*)\'$/i",$value,$matches)){
					$values.=$matches[1];
				}else{
					$values.="'".$value."'";
				}
			}else{
				$values.="'".pg_escape_string(serialize($value))."'";
			}
			$names.=$name;
			$counter++;
		}

		$SQL.="(".$names.")";
		$SQL.="VALUES (".$values.")";

		return $this->query($SQL);

	}

	// 機能概要：配列で行を更新
	function update_array($tableName,$updateArray,$where){

		// フィールドリストの取得
		$fieldsArray = $this->list_fieldNames($tableName);

		$SQL="UPDATE \"$tableName\" SET ";
		$names='';
		$values='';
		$counter=0;
		foreach($updateArray as $name => $value){
			// フィールドが存在しなければ飛ばす
			if(isset($fieldsArray[$name]) == false){
				continue;
			}
			if($counter>0){
				$SQL.=", ";
			}
			if(!is_array($value)){
				if(preg_match("/^\'(.*)\'$/i",$value,$matches)){
					$SQL.="{$name}={$matches[1]}";
				}else{
					$SQL.="{$name}='{$value}'";
				}
			}else{
				$SQL.="{$name}='".pg_escape_string(serialize($value))."'";
			}
			$counter++;
		}

		$SQL.=" WHERE {$where}";

		return $this->query($SQL);

	}

	/**
		* @work:シーケンスIDの取得:
		* @arg::
		* @return::
	*/
	function get_sequence_id($seq_name){
		$sql="select nextval from nextval('{$seq_name}')";
		return current( pg_fetch_assoc($this->query($sql)) );
	}

	// 機能概要：レコード数をカウント
	function count_records($tableName,$misc){
		$SQL="SELECT count(*) as count FROM {$tableName} {$misc}";
		$this->query($SQL);
		$tmpArray = $this->fetch_assoc();
		return $tmpArray['count'];
	}

	// 機能概要：テーブルのフィールドリストを配列で取得
	function list_fieldNames($tableName){
		$SQL="select column_name from information_schema.columns where table_name ='{$tableName}'";
		$rtn=$this->query($SQL);
		$tempArray=array();
		while($value=pg_fetch_assoc($rtn)){
			$tempArray[$value['column_name']]=1;
		}
		return $tempArray;
	}

}

?>