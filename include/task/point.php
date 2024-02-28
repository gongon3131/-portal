<?php
/*
	* フレームワーク共通ファイルの呼び込み
*/
require_once('/var/www/html/common.php');

/*
	* @class:SY_App:
	* @work:フレームワークのメイン部分
	* @date:2008/02/17:
	* @msg:このクラスのコンストラクターを呼んではいけません:
	* @msg:初期化処理は、「prepare」メソッドを使用してください:
*/
class SY_App extends SY_Framework{

	function SY_prepare(){
	}

	/**
		* @work:発行者登録処理:
		* @arg::
		* @return::
	*/
	function CALLBACK__INDEX(){

		$limit_dt = date('Y-m-d H:i:s',time()-3600*24*180);
		$sql="select ";
		$sql.=" * ";
		$sql.=" from member_point as mp ";
		$sql.=" where ";
		$sql.=" point_insert_dt <  '{$limit_dt}' ";
		$sql.=" and point_price > 0 ";
		$sql.=" and point_status = 1 ";
		$rtn_point = pg_query($sql);
		while($point = pg_fetch_assoc($rtn_point)){

			pg_query('begin');

			$sql="update member_point set ";
			$sql.=" point_status = 0 ";
			$sql.=" where ";
			$sql.=" point_id = '{$point['point_id']}' ";
			pg_query($sql);

			$this->insert_point($point['member_id'],-1*$point['point_price'],"期限失効");

			pg_query('commit');

		}

		exit('ok');

	}

}

// 実行用のオブジェクトを作成
$SY_App= new SY_App();
$SY_App->start();

?>
