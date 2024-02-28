<?php

// フレームワーク拡張用クラス
class SY_FrameworkExtension extends SY_Base {

	/*
		@work:プログラム実行前の共通処理:
		@arg::
		@return::
	*/
	function SY_prepare_common(){
		/*
		// 管理者ID
		if(isset($_SESSION['admin_id']) && is_numeric($_SESSION['admin_id'])){
			$sql="select count(*) as count from event_reception ";
			$sql.=" where reception_process = 0 ";
			$rtn_count = pg_query($sql);
			$count = pg_fetch_result($rtn_count,0,'count');
			$this->result->add('process_count',$count);
		}

		// 自動ログイン
		// COOKIE情報のロード
		if(!isset($_SESSION['member_id'])){
			$member_id=0;
			if(isset($_COOKIE['member_id']) && is_numeric($_COOKIE['member_id'])){
				$member_id = pg_escape_string($_COOKIE['member_id']);
			}
			$member_cookie="";
			if(isset($_COOKIE['member_cookie'])){
				$member_cookie = pg_escape_string($_COOKIE['member_cookie']);
			}
			$sql="select ";
			$sql.=" * ";
			$sql.=" from member as m ";
			$sql.=" where ";
			$sql.=" member_id = '{$member_id}' ";
			$rtn_member = pg_query($sql);
			if(pg_num_rows($rtn_member) == 1){
				$member = pg_fetch_assoc($rtn_member);
				if($member['member_cookie'] == $member_cookie){
					$_SESSION['member_id'] = $member_id;
				}
			}
		}

		// メンバー情報をロード
		if(isset($_SESSION['member_id']) && is_numeric($_SESSION['member_id'])){
			$sql="select ";
			$sql.=" * ";
			$sql.=" from member as m ";
			$sql.=" where ";
			$sql.=" m.member_id = '{$_SESSION['member_id']}' ";
			$rtn_member = pg_query($sql);
			if(pg_num_rows($rtn_member) != 1){
				unset($_SESSION['member_id']);
				exit('no record');
			}
			$member = pg_fetch_assoc($rtn_member);
			$this->result->add('member',$member);

			//ポイント情報をロード
			$sql="select ";
			$sql.=" * ";
			$sql.=" from member_point as p ";
			$sql.=" where ";
			$sql.=" member_id = '{$_SESSION['member_id']}' ";
			$sql.=" order by point_id desc ";
			$sql.=" limit 1 ";
			$rtn_point = pg_query($sql);
			if(pg_num_rows($rtn_point) == 1){
				$point = pg_fetch_assoc($rtn_point);
				$point = $point['point_now'];
			}else{
				$point=0;
			}
			$this->result->add('point_now',$point);
		}

		$cal_ym = SY_get_post("cal_ym","int");
		if($cal_ym==0 || $cal_ym < 200000){
			$cal_ym=date('Ym');
		}
		$cal_y = substr($cal_ym,0,4);
		$cal_m = substr($cal_ym,5,6);

		$link_array=array();
		$sql="select ";
		$sql.=" *  ";
		$sql.=" from event as e ";
		$sql.=" where";
		$sql.=" event_status = 100 ";
		$sql.=" and event_start_dt > now() ";
		$sql.=" and to_char(event_start_dt, 'YYYYMM'::text) = '{$cal_ym}' ";
		$rtn_cal = pg_query($sql);
		while($cal = pg_fetch_assoc($rtn_cal)){
				$day = date('d',strtotime($cal['event_start_dt']));
				$ymd = date('Ymd',strtotime($cal['event_start_dt']));
				$link_array[$day]="/event_search.php?ymd={$ymd}&cal_ym={$cal_ym}";
				$exists_day[$day]=1;
		}
		//カレンダーをロード
		$calender = _calendar($cal_y,$cal_m,$link_array);
		$this->smarty->assign('calender',$calender);
		*/
	}

	/*
		@work:スマーティー出力前の共通処理:
		@arg::
		@return::
	*/
	function SY_prepare_display_common(){
	}

	/*
		@work:ログインしていなければ、ログイン画面にジャンプ:
		@arg:vendor,user:
		@return::
	*/
	function logincheck($type){
		if (empty($type) == false) {
			return true;
		} else {
			//header("Location: ../../new_portal/index.php");
			return false;
		}		
		
	}

	//XSSセーフティ
	function h($val){
		$val = trim($val);		
		return htmlspecialchars($val);
	}

	//操作ログ書き込み
	function rec_operation_log($user_id,$target_menu,$category,$event,$comment){

        //DB接続
		//$this->mysql = $this->db->connect();

		$sql = <<<EOF
			INSERT INTO ts_operation_log
			(
				id,
				user_id,
				target_menu,
				category,
				event,
				comment,
				operation_date
			)
			VALUES
			(
				NULL,
				:user_id,
				:target_menu,
				:category,
				:event,
				:comment,
				Now()
			)
		EOF;
		$stmt = $this->mysql->prepare($sql);

		$stmt->bindParam(":user_id" , $user_id);
		$stmt->bindParam(":target_menu" , $target_menu);
		$stmt->bindParam(":category" , $category);
		$stmt->bindParam(":event" , $event);
		$stmt->bindParam(":comment" , $comment);

		//クエリ実行
		$execute = $stmt->execute();     

		// DEBUG OUTPUT
		//ChromePhp::log($this->db->pdo_debugStrParams($stmt));

	}	

    //1ヶ月後の日付を取得
    function getNextDate($target_date=NULL, $term=1) {
        if (empty($target_date)) $target_date = date('Ymd');
        // 翌月末日を取得...(1)
        $last_date = date('Ymd', strtotime($target_date." last day of +{$term} month"));
        // 対象日の翌月日を取得...(2)
        $prev_date = date('Ymd', strtotime($target_date." +{$term} month"));
        // (1)と(2)を比較し、(2)の方が未来日の時とみ(1)を出力する
        if ($prev_date > $last_date) {
          return $last_date;
        } else {
          return $prev_date;
        }
    }

    //1か月前の日付を取得
    public function getPrevDate($target_date=NULL, $term=1) {
        if (empty($target_date)) $target_date = date('Ymd');
        // 前月末日を取得...(1)
        $last_date = date('Y-m-d', strtotime($target_date." last day of -{$term} month"));
        // 対象日の前月日を取得...(2)
        $prev_date = date('Y-m-d', strtotime($target_date." -{$term} month"));
        // (1)と(2)を比較し、(2)の方が未来日の時とみ(1)を出力する
        if ($prev_date > $last_date) {
            return $last_date;
        } else {
            return $prev_date;
        }
    }

	//希望シフト登録期間を取得（OP）
	public function get_hope_shift_section(){

		$sql = "SELECT tshs_start_date , tshs_end_date FROM ts_hope_shift_section WHERE tshs_reception_flg = 1";
		$stmt = $this->mysql->prepare($sql);
		//クエリ実行
		$execute = $stmt->execute();    
		$section = $stmt->fetch();
		return $section;

	}

	//希望シフト登録期間を取得（SV）
	public function get_hope_shift_section_sv(){

		$sql = "SELECT tshs_start_date , tshs_end_date FROM ts_hope_shift_section_sv WHERE tshs_reception_flg = 1";
		$stmt = $this->mysql->prepare($sql);
		//クエリ実行
		$execute = $stmt->execute();    
		$section = $stmt->fetch();
		return $section;

	}
	
	//ユーザーリスト取得
	public function get_user_list($tmur_authority){

		try{

			$sql = " SELECT tmur_id,tmur_user_id,tmur_user_name FROM tm_user";
			$sql .= " WHERE tmur_authority = :tmur_authority";
			$sql .= " AND tmur_is_used = 1";

			$stmt = $this->mysql->prepare($sql);
			$stmt->bindValue(":tmur_authority" , $tmur_authority , PDO::PARAM_INT);
			//クエリ実行
			$execute = $stmt->execute();
            $user_ary = Array();

            while($user = $stmt->fetch()){
                $user_ary[$user['tmur_user_id']] = $user['tmur_user_id']."：".$user['tmur_user_name'];
            }

			return $user_ary;

        } catch(Exception $e) {
            ChromePhp::log($e);
			return "";
        }

	}

}

?>
