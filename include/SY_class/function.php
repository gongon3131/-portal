<?php

//レプリケーションチェック
function chk_replication($id,$tbl_name,$id_name,$del_flg){

	$sql = "SELECT * FROM {$tbl_name} WHERE {$del_flg} != '1' AND {$id_name} = {$id}";

	//クエリ実行
	$rtn_rep = mysql_query($sql);

	if(mysql_num_rows($rtn_rep) == 0){
		return true;
	}else{
		return false;
	}


}

function get_dbsafe($value,$type='text'){

	switch(strtolower($type)){
		case 'int':
			if(is_numeric($value)){
				$value = intval($value);
			}else{
				$value = 0;
			}
			break;
		case 'text':
			break;
	}
	return pg_escape_string($value);

}

function SY_get_post($key,$type='text'){
	$value='';
	if(isset($_GET[$key])){
		$value = $_GET[$key];
	}
	if(isset($_POST[$key])){
		$value = $_POST[$key];
	}
	switch(strtolower($type)){
		case 'int':
			if(is_numeric($value)){
				$value = intval($value);
			}else{
				$value = 0;
			}
			break;
		case 'text':
			break;
	}
	return pg_escape_string($value);
}

/**
	* @work:ログを追加:
	* @arg:string $string:
	* @return::
*/
function add_log($string){
	global $SY_config;
	$string=date("Ymd-H-i-s").":".$string."\n";
	$fp=fopen($SY_config['LOG_PATH'].date("Ym").".txt",'a');
	flock($fp, LOCK_EX);
	fwrite($fp,$string);
	flock($fp, LOCK_UN);
	fclose($fp);
}

/**
	* @work:ページナビゲーションを作成:
	* @arg:string $string:
	* @return::
*/
/*** function page_navigation($current,$limit,$rows) ***/
function page_navigation($current,$limit,$rows){

	if($current == 0){
		$current=1;
	}

	/*** 変数の初期化 ***/
	$page=array();

	/*** 結果数の計算 ***/
	$page['rows'] = $rows;

	/*** スタートページ ***/
	$page['start'] = 1;

	$maxp = $current + 5;
	$minp= $current - 3;

	/*** 最終ページ番号の取得 ***/
	if(($page['rows'] % $limit) != 0){
		$page['end']=intval(intval($page['rows'])/$limit)+2;
	}else{
		$page['end']=intval($page['rows'] / $limit)+1;
	}

	/*** 前後の調整 ***/
	if($page['start'] < $minp){
		$page['start'] = $minp;
	}
	if($page['end'] > $maxp){
		$page['end'] = $maxp - 1;
	}
	if($page['end'] < $page['start']){
		$page['end'] = $page['start'];
	}

	/*** 現在のページ番号の取得 ***/
	$page['now']=$current;
	if($page['now'] < 0 || $page['now'] > $page['end']){
		$page['now']=1;
	}

	/*** 戻ると次へを登録 ***/
	$page['next']=$page['now']+1;
	if($page['now'] > 1){
		$page['back']=$page['now']-1;
	}else{
		$page['back'] = 1;
	}

	if($page['next'] > $page['end']){
		$page['next'] = $page['end'];
	}
	return $page;
}

function _calendar($year = '', $month = '', $link=array()) {
    if (empty($year) && empty($month)) {
        $year = date('Y');
        $month = date('n');
    }

		$cal_back = date('Ym', strtotime(date("{$year}-{$month}-1").' -1 month'));
		//echo '今月 => '. date('Ym') .'<br>';
		$cal_next = date('Ym', strtotime(date("{$year}-{$month}-1").' +1 month'));

    //月末の取得
    $l_day = date('j', mktime(0, 0, 0, $month + 1, 0, $year));
    //初期出力
    $html = <<<EOM
<table class="calendar">
    <thead>
        <tr>
            <td colspan="2" style="text-align:center;"><a href="?cal_ym={$cal_back}"><</a></td>
            <th colspan="3">{$year}年{$month}月</th>
            <td colspan="2" style="text-align:center;"><a href="?cal_ym={$cal_next}">></a></td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th class="sun">日</th>
            <th>月</th>
            <th>火</th>
            <th>水</th>
            <th>木</th>
            <th>金</th>
            <th class="sat">土</th>
        </tr>\n
EOM;
    $lc = 0;

    // 月末分繰り返す
    for ($i = 1; $i < $l_day + 1;$i++) {
        $classes = array();
        $class   = '';

        // 曜日の取得
        $week = date('w', mktime(0, 0, 0, $month, $i, $year));

        // 曜日が日曜日の場合
        if ($week == 0) {
            $html .= "\t\t<tr>\n";
            $lc++;
        }

        // 1日の場合
        if ($i == 1) {
            if($week != 0) {
                $html .= "\t\t<tr>\n";
                $lc++;
            }
            $html .= _repeatEmptyTd($week);
        }

        if ($week == 6) {
            $classes[] = 'sat';
        } else if ($week == 0) {
            $classes[] = 'sun';
        }

        if ($i == date('j') && $year == date('Y') && $month == date('n')) {
            // 現在の日付の場合
            $classes[] = 'today';
        }

        if (count($classes) > 0) {
            $class = ' class="'.implode(' ', $classes).'"';
        }

				// リンクが有る場合
				if(isset($link[$i])){
        	$html .= "\t\t\t".'<td'.$class.'><a href="'.$link[$i].'">'.$i.'</a></td>'."\n";
				}else{
        	$html .= "\t\t\t".'<td'.$class.'>'.$i.'</td>'."\n";
				}

        // 月末の場合
        if ($i == $l_day) {
            $html .= _repeatEmptyTd(6 - $week);
        }
        // 土曜日の場合
        if ($week == 6) {
            $html .= "\t\t</tr>\n";
        }
    }

/*
    if ($lc < 6) {
        $html .= "\t\t<tr>\n";
        $html .= _repeatEmptyTd(7);
        $html .= "\t\t</tr>\n";
    }
*/
    if ($lc == 4) {
        $html .= "\t\t<tr>\n";
        $html .= _repeatEmptyTd(7);
        $html .= "\t\t</tr>\n";
    }

    $html .= "\t</tbody>\n";
    $html .= "</table>\n";

    return $html;
}

function _repeatEmptyTd($n = 0) {
    return str_repeat("\t\t<td> </td>\n", $n);
}

function startsWith($haystack, $needle)
{
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}


?>
