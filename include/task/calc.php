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

		// イベント情報をロード
		$sql="select ";
		$sql.=" * ";
		$sql.=" from event as e ";
		$sql.=" where ";
		$sql.=" event_flag_point = 1 ";
		$rtn_event = pg_query($sql);
		while($event = pg_fetch_assoc($rtn_event)){

			pg_query('begin');

			//配列を初期化
			$impression_point = array();
			$impression_point[100] = array();
			$impression_point[200] = array();

			//中間発表
			$sql="select ";
			$sql.=" * ";
			$sql.=" from event_reception as er ";
			$sql.=" inner join event_impression as ei on er.reception_id = ei.reception_id ";
			$sql.=" inner join member as m on ei.impression_target = m.member_id ";
			$sql.=" where ";
			$sql.=" impression_rank <= 3 ";
			$sql.=" and er.event_id = '{$event['event_id']}' ";
			$sql.=" and reception_status = 100 ";
			$rtn_impression = pg_query($sql);
			while($impression = pg_fetch_assoc($rtn_impression)){
				//ターゲットにポイント付与
				$pt=0;
				switch($impression['impression_rank']){
					case 1:
						$pt=5;
						break;
					case 2:
						$pt=3;
						break;
					case 3:
						$pt=1;
						break;
				}

				if(isset($impression_point[$impression['member_sex']][$impression['impression_target']])){
					$impression_point[$impression['member_sex']][$impression['impression_target']]+=$pt;
				}else{
					$impression_point[$impression['member_sex']][$impression['impression_target']]=$pt;
				}

			}
			arsort($impression_point[100]);
			arsort($impression_point[200]);
			//print_r($impression_point);

			// 女性ポイント
			$i=0;
			foreach($impression_point[100] as $key => $pt){
				if($i > 2){
					break;
				}
				if($i==0){
					$this->insert_point($key,300,"指名ポイント");
				}
				if($i==1){
					$this->insert_point($key,200,"指名ポイント");
				}
				if($i==2){
					$this->insert_point($key,100,"指名ポイント");
				}
				$i++;
			}

			// 男性ポイント
			$i=0;
			foreach($impression_point[200] as $key => $pt){
				if($i > 2){
					break;
				}
				if($i==0){
					$this->insert_point($key,300,"指名ポイント");
				}
				if($i==1){
					$this->insert_point($key,200,"指名ポイント");
				}
				if($i==2){
					$this->insert_point($key,100,"指名ポイント");
				}
				$i++;
			}

			//成立ポイント
			$sql="select ";
			$sql.=" * ";
			$sql.=" from event_reception as er ";
			$sql.=" where ";
			$sql.=" event_id = '{$event['event_id']}' ";
			$sql.=" and reception_status = 100 ";
			$rtn_couple = pg_query($sql);
			while($couple = pg_fetch_assoc($rtn_couple)){
				if(is_numeric($couple['reception_couple'])){
					$this->insert_point($couple['reception_couple'],100,"成立ポイント");
				}
			}

			//WEB申し込み
			$sql="select ";
			$sql.=" * ";
			$sql.=" from event_reception as er ";
			$sql.=" where ";
			$sql.=" event_id = '{$event['event_id']}' ";
			$sql.=" and reception_status = 100 ";
			$rtn_web = pg_query($sql);
			while($web = pg_fetch_assoc($rtn_web)){
				if($web['reception_flag_web'] == 1){
					$this->insert_point($web['member_id'],500,"WEB予約ポイント");
				}
			}

			//会員ランク調整
			/*
				$SY_define['member_rank'][1000]="ブロンド";
				$SY_define['member_rank'][2000]="シルバー";
				$SY_define['member_rank'][3000]="ゴールド";
				$SY_define['member_rank'][4000]="プラチナ";
				$SY_define['member_rank'][5000]="ルビー";
			 */
			$sql="select ";
			$sql.=" * ";
			$sql.=" from event_reception as er ";
			$sql.=" where ";
			$sql.=" event_id = '{$event['event_id']}' ";
			$sql.=" and reception_status = 100 ";
			$rtn_rank = pg_query($sql);
			while($rank = pg_fetch_assoc($rtn_rank)){

				$sql="select ";
				$sql.=" count(*) as count ";
				$sql.=" from ";
				$sql.=" event_reception as er ";
				$sql.=" inner join event as e on e.event_id = er.event_id ";
				$sql.=" where ";
				$sql.=" er.reception_status = 100 ";
				$sql.=" and e.event_start_dt <= '{$event['event_start_dt']}' ";
				$sql.=" and er.member_id = '{$rank['member_id']}' ";
				$rtn_count = pg_query($sql);
				$rank['count'] = pg_fetch_result($rtn_count,0,'count');

				$my_rank=1000;
				$pt=100;
				if($rank['count'] >= 10){
					$my_rank=2000;
					$pt=200;
				}
				if($rank['count'] >= 20){
					$my_rank=3000;
					$pt=300;
				}
				if($rank['count'] >= 30){
					$my_rank=4000;
					$pt=400;
				}
				if($rank['count'] >= 50){
					$my_rank=5000;
					$pt=500;
				}
				//ランクを反映
				$sql="update member set ";
				$sql.=" member_rank = '{$my_rank}' ";
				$sql.=" where ";
				$sql.=" member_id = '{$rank['member_id']}' ";
				pg_query($sql);
				//ランク別ポイントを反映
				$this->insert_point($rank['member_id'],$pt,"参加ポイント");
			}

			//紹介者
			$sql="select ";
			$sql.=" * ";
			$sql.=" from event_reception as er ";
			$sql.=" where ";
			$sql.=" event_id = '{$event['event_id']}' ";
			$sql.=" and reception_status = 100 ";
			$rtn_intro = pg_query($sql);
			while($intro = pg_fetch_assoc($rtn_intro)){
				//print_r($intro);
				$sql="select ";
				$sql.=" * ";
				$sql.=" from order_item as oi ";
				$sql.=" where ";
				$sql.=" escort_id = '{$intro['member_id']}' ";
				$sql.=" and order_id = '{$intro['order_id']}' ";
				$rtn_item = pg_query($sql);
				if(pg_num_rows($rtn_item) > 1){
					//echo $sql;
					$this->insert_point($intro['member_id'],300,"紹介ポイント");
				}
			}

			//フラグをアップデート
			$sql="update event set ";
			$sql.=" event_flag_point = 2 ";
			$sql.=" where ";
			$sql.=" event_id = '{$event['event_id']}' ";
			pg_query($sql);

			pg_query('commit');

		}

		exit('ok');

	}

}

// 実行用のオブジェクトを作成
$SY_App= new SY_App();
$SY_App->start();

?>
