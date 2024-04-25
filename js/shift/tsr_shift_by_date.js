//表示用json
var json;
//シフト保存用配列
let shift_data_ary = new Object();
//合計人数カウント用配列
let shift_count_by_time = new Object();
var activated_tab; // 現在のタブ
var previous_tab; // 以前のタブ
let user_authority;//操作権限フラグ
let tab_listener = 0;//タブ遷移フラグ

/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', by_date_kensaku);

//日付変更時イベント
$(document).on("change","#showen_date", function() {
    by_date_kensaku();
});


function init_shift_count_ary(){
    
    shift_count_by_time[0] = 0;
    shift_count_by_time[1] = 0;
    shift_count_by_time[2] = 0;
    shift_count_by_time[3] = 0;
    shift_count_by_time[4] = 0;
    shift_count_by_time[5] = 0;
    shift_count_by_time[6] = 0;
    shift_count_by_time[7] = 0;
    shift_count_by_time[8] = 0;
    shift_count_by_time[9] = 0;
    shift_count_by_time[10] = 0;
    shift_count_by_time[11] = 0;
    shift_count_by_time[12] = 0;
    shift_count_by_time[13] = 0;
    shift_count_by_time[14] = 0;
    shift_count_by_time[15] = 0;
    shift_count_by_time[16] = 0;
    shift_count_by_time[17] = 0;
    shift_count_by_time[18] = 0;
    shift_count_by_time[19] = 0;
    shift_count_by_time[20] = 0;
    shift_count_by_time[21] = 0;
    shift_count_by_time[22] = 0;
    shift_count_by_time[23] = 0;
}

function by_date_kensaku(){

    //操作権限フラグ
    user_authority = $("#user_authority").val();

    //人数保存用配列初期化
    init_shift_count_ary();

	//期間の始端と終端  
	var shown_date = $("#showen_date").val();
    /*
    if(section_sta == "" && section_end == ""){
        alert("有効なシフト登録期間はありません");
        return false;
    }
    */
	$.ajax({
		type:          'post',
		url:		   "../api/shift/tsr_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	      : 'summary_by_date',
						'showen_date'	  : shown_date
						},
		
		// 200 OK
		success: function(json_data) {   

			shift_data_ary = json_data;

            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{

                //データ表示描写用HTML生成	
                paging_form();
                paging_graph();
                
                var tab_name = "";
                if(activated_tab !== undefined){
                    tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/tsr_shift_by_date.php#" , "");
                    //tab_listener = 1
                }

                if(tab_name == 'graph_show'){
                    set_graph_by_date();
                }
                            
                //set_graph_by_date();
                //30分設定ボタンは非表示に
                $('#graph_min30').css('display','none');
            }
		},

		// HTTPエラー
		error: function(XMLHttpRequest, textStatus, errorThrown) {         
			alert("エラーが発生しました。システム管理者にお問い合わせください。");
			console.log("XMLHttpRequest : " + XMLHttpRequest.status);
			console.log("textStatus     : " + textStatus);
			console.log("errorThrown    : " + errorThrown.message);	
		},

		// 成功・失敗に関わらず通信が終了した際の処理
		complete: function() {     
		}
	})	
    
}

function paging_form(){

	//テーブルの内容を削除
	$('#maintable_by_date_form').empty();

    let contant = '';

    var shift_date = $("#showen_date").val();

    Object.keys(shift_data_ary).forEach(function(key) {

        //第1区間
        var first_hour_sta = "";
        var first_min_sta = "";
        if(String(shift_data_ary[key]['tdbc_start_time_first']).length == 4){
            first_hour_sta = String(shift_data_ary[key]['tdbc_start_time_first']).substring(0,2);
            first_hour_sta = Number(first_hour_sta);
            first_min_sta = String(shift_data_ary[key]['tdbc_start_time_first']).substring(2);
            first_min_sta = Number(first_min_sta);
        }
        if(first_min_sta == ""){
            first_min_sta = "00";
        }

        var first_hour_end = "";
        var first_min_end = "";
        if(String(shift_data_ary[key]['tdbc_end_time_first']).length == 4){
            first_hour_end = String(shift_data_ary[key]['tdbc_end_time_first']).substring(0,2);
            first_hour_end = Number(first_hour_end);
            first_min_end = String(shift_data_ary[key]['tdbc_end_time_first']).substring(2);
            first_min_end = Number(first_min_end);
        }

        if(first_min_end == ""){
            first_min_end = "00";
        }

        //第2区間
        var second_hour_sta = "";
        var second_min_sta = "";
        if(String(shift_data_ary[key]['tdbc_start_time_second']).length == 4){
            second_hour_sta = String(shift_data_ary[key]['tdbc_start_time_second']).substring(0,2);
            second_hour_sta = Number(second_hour_sta);
            second_min_sta = String(shift_data_ary[key]['tdbc_start_time_second']).substring(2);
            second_min_sta = Number(second_min_sta);
        }

        if(second_min_sta == ""){
            second_min_sta = "00";
        }

        var second_hour_end = "";
        var second_min_end = "";
        if(String(shift_data_ary[key]['tdbc_end_time_second']).length == 4){
            second_hour_end = String(shift_data_ary[key]['tdbc_end_time_second']).substring(0,2);
            second_hour_end = Number(second_hour_end);
            second_min_end = String(shift_data_ary[key]['tdbc_end_time_second']).substring(2);
            second_min_end = Number(second_min_end);
        }
        if(second_min_end == ""){
            second_min_end = "00";
        }

        contant += '<tr>';
        contant += '<td class="hope_shift_summary_cell3"><a href="#" class="shift_by_user" data-userid="' + shift_data_ary[key]['tdbc_user_id'] + '">' + shift_data_ary[key]['tdbc_user_id'] + '：' + shift_data_ary[key]['tmur_user_name'] + '</a></td>';
        //第1区間
        if(user_authority == 9){
            contant += '<td>';
            contant += '<div class="form-inline">';
            contant += '<div class="form_center">';
            contant += '<input type="text" id="bc_first_hour_sta_' + shift_data_ary[key]['tdbc_user_id'] + '" name="bc_first_hour_sta_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + first_hour_sta + '" class="form-control w15 form_right" oninput="value = value.replace(/[^0-9]+/i,' + "'');" + '">';
            contant += '：';
            contant += '<select name="bc_first_min_sta_' + shift_data_ary[key]['tdbc_user_id']  + '" class="form-control" id="bc_first_min_sta_' + shift_data_ary[key]['tdbc_user_id']  + '">';
            if(first_min_sta = "00"){
                contant += '<option label="" value="00" selected>00</option>';
                contant += '<option label="" value="30">30</option>';
            }else if(first_min_sta = "00"){
                contant += '<option label="" value="00" >00</option>';
                contant += '<option label="" value="30" selected>30</option>';
            }
            contant += '</select>';
            contant += '&nbsp;～&nbsp;';
            contant += '<input type="text" id="bc_first_hour_end_' + shift_data_ary[key]['tdbc_user_id'] + '" name="bc_first_hour_end_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + first_hour_end + '" class="form-control w15 form_right">';
            contant += '：';
            contant += '<select name="bc_first_min_end_' + shift_data_ary[key]['tdbc_user_id'] + '" class="form-control" id="bc_first_min_end_' + shift_data_ary[key]['tdbc_user_id'] + '">';
            if(first_min_end = "00"){
                contant += '<option label="" value="00" selected>00</option>';
                contant += '<option label="" value="30">30</option>';
            }else if(first_min_end = "00"){
                contant += '<option label="" value="00" >00</option>';
                contant += '<option label="" value="30" selected>30</option>';
            }
            contant += '</select>';
            contant += '</div>';
            contant += '</div>';
            contant += '</td>';
        }else{
            contant += '<td class="hope_shift_summary_cell1">';
            if(!(first_hour_sta == "" && first_hour_end == "")){
                contant += first_hour_sta + '：' + first_min_sta + "～" + first_hour_end + "：" + first_min_end;
            }
            contant += '</td>';
        }            
        //第2区間
        if(user_authority == 9){
            contant += '<td>';
            contant += '<div class="form-inline">';
            contant += '<div class="form_center">';
            contant += '<input type="text" id="bc_second_hour_sta_' + shift_data_ary[key]['tdbc_user_id'] + '" name="bc_second_hour_sta_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + second_hour_sta + '" class="form-control w15 form_right">';
            contant += '：';
            contant += '<select name="bc_second_min_sta_' + shift_data_ary[key]['tdbc_user_id'] + '" class="form-control" id="bc_second_min_sta_' + shift_data_ary[key]['tdbc_user_id'] + '">';
            if(second_min_sta = "00"){
                contant += '<option label="" value="00" selected>00</option>';
                contant += '<option label="" value="30">30</option>';
            }else if(second_min_sta = "00"){
                contant += '<option label="" value="00" >00</option>';
                contant += '<option label="" value="30" selected>30</option>';
            }
            contant += '</select>';
            contant += '&nbsp;～&nbsp;';
            contant += '<input type="text" id="bc_second_hour_end_' + shift_data_ary[key]['tdbc_user_id'] + '" name="bc_second_hour_end_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + second_hour_end + '" class="form-control w15 form_right">';
            contant += '：';
            contant += '<select name="bc_second_min_end_' + shift_data_ary[key]['tdbc_user_id'] + '" class="form-control" id="bc_second_min_end_' + shift_data_ary[key]['tdbc_user_id'] + '">';
            if(second_min_end = "00"){
                contant += '<option label="" value="00" selected>00</option>';
                contant += '<option label="" value="30">30</option>';
            }else if(second_min_end = "00"){
                contant += '<option label="" value="00" >00</option>';
                contant += '<option label="" value="30" selected>30</option>';
            }
            contant += '</select>';
            contant += '</div>';
            contant += '</div>';
            contant += '</td>';
        }else{
            contant += '<td class="hope_shift_summary_cell1">';
            if(!(second_hour_sta == "" && second_hour_end == "")){
                contant += second_hour_sta + '：' + second_min_sta + "～" + second_hour_end + "：" + second_min_end;
            }
            contant += '</td>';                
        }
        if(shift_data_ary[key]['tdbc_midnight_flg'] == "1"){
            contant += '<td><input type="checkbox" name="midnight_' + shift_data_ary[key]['tdbc_user_id'] + '" id="midnight_' + shift_data_ary[key]['tdbc_user_id'] + '" value="1" class="form-control" checked></td>';
        }else{
            contant += '<td><input type="checkbox" name="midnight_' + shift_data_ary[key]['tdbc_user_id'] + '" id="midnight_' + shift_data_ary[key]['tdbc_user_id'] + '" value="1" class="form-control"></td>';
        }

        if(shift_data_ary[key]['tdbc_holiday_flg'] == "1"){
            contant += '<td><input type="checkbox" name="holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" id="holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" value="1" class="form-control" checked></td>';
        }else{
            contant += '<td><input type="checkbox" name="holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" id="holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" value="1" class="form-control"></td>';
        }

        if(shift_data_ary[key]['tdbc_paid_holiday_flg'] == "1"){
            contant += '<td><input type="checkbox" name="paid_holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" id="paid_holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" value="1" class="form-control" checked></td>';
        }else{
            contant += '<td><input type="checkbox" name="paid_holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" id="paid_holiday_' + shift_data_ary[key]['tdbc_user_id'] + '" value="1" class="form-control"></td>';
        }

        contant += '<td><input type="text" name="tdbc_memo_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + shift_data_ary[key]['tdbc_memo'] + '" id="tdbc_memo_' + shift_data_ary[key]['tdbc_user_id'] + '" class="form-control"></td>';
        contant += '<td><input type="hidden" name="tdbc_update_date_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + shift_data_ary[key]['tdbc_update_date'] + '" id="tdbc_update_date_' + shift_data_ary[key]['tdbc_user_id'] + '" class="form-control"></td>';
        contant += '</tr>';
    })					

    $('#maintable_by_date_form').html(contant);

}

function paging_graph(){

	//テーブルの内容を削除
	$('#maintable_by_date_graph').empty();

    var shift_date = $("#showen_date").val();
    let contant = '';
    //合計人数表示
    contant += '<tr class="by_date_shift_height">';
    contant += '<td class="form_v_middle">合計</td>';
    if(user_authority == 9){
        contant += '<td></td>';
        contant += '<td></td>';
        contant += '<td></td>';
    }

    contant += '<td id="total_00" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_01" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_02" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_03" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_04" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_05" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_06" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_07" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_08" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_09" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_10" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_11" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_12" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_13" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_14" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_15" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_16" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_17" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_18" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_19" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_20" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_21" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_22" class="by_date_shift_total_cell"></td>';
    contant += '<td id="total_23" class="by_date_shift_total_cell"></td>';

    Object.keys(shift_data_ary).forEach(function(key) {
        contant += '<tr class="by_date_shift_height">';
        contant += '<td class="form_v_middle"><a href="#" class="shift_by_user" data-userid="' + shift_data_ary[key]['tdbc_user_id'] + '">' + shift_data_ary[key]['tdbc_user_id'] + '：' + shift_data_ary[key]['tmur_user_name'] + '</a>';
        contant += '<a hre="#" data-toggle="modal" data-target="#hope_shift_detail" data-backdrop="static" data-target-userid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-username="' + shift_data_ary[key]['tmur_user_name'] + '"><img src="../img/kibou_icn.png" class="graph_hope_detail_icn_by_date" id="hope_detail_icn_' + shift_data_ary[key]['tdbc_user_id'] + '"></a>';
        if(shift_data_ary[key]['tdbc_memo'] == ""){
            contant += '<a hre="#" data-toggle="modal" data-target="#shift_by_date_memo" data-backdrop="static" data-target-userid="' + shift_data_ary[key]['tdbc_user_id'] + '"><img src="../img/memo.png" class="graph_memo_icn_by_date" id="memo_icn_' + shift_data_ary[key]['tdbc_user_id'] + '"></a>';
        }else{
            contant += '<a hre="#" data-toggle="modal" data-target="#shift_by_date_memo" data-backdrop="static" data-target-userid="' + shift_data_ary[key]['tdbc_user_id'] + '"><img src="../img/memo_act.png" class="graph_memo_icn_by_date" id="memo_icn_' + shift_data_ary[key]['tdbc_user_id'] + '"></a>';
        }
        contant += '</td>';
        if(user_authority == 9){
            contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_holiday_set_' + shift_data_ary[key]['tdbc_user_id'] + '">休日</button>';
            contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_paid_holiday_set_' + shift_data_ary[key]['tdbc_user_id'] + '">有休</button>';
            contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_midnight_set_' + shift_data_ary[key]['tdbc_user_id'] + '">夜勤</button>';
        }
        contant += '<td id="op-col00_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="0" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col01_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="1" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col02_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="2" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col03_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="3" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col04_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="4" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col05_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="5" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col06_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="6" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col07_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="7" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col08_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="8" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col09_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="9" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col10_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="10" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col11_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="11" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col12_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="12" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col13_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="13" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col14_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="14" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col15_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="15" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col16_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="16" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col17_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="17" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col18_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="18" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col19_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="19" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col20_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="20" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col21_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="21" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col22_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="22" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td id="op-col23_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="23" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<input type="hidden" value="' + shift_data_ary[key]['tdbc_memo'] + '" id="tdbc_memo_' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-userid="' + shift_data_ary[key]['tdbc_user_id']  + '">';
        //前日夜勤フラグ（hiddenに保存）
        contant += '<input type="hidden" value="' + shift_data_ary[key]['yesterday_midnight_flg'] + '" id="yesterday_midnight_flg_' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-userid="' + shift_data_ary[key]['tdbc_user_id']  + '">';
        //ユーザータイプ
        contant += '<input type="hidden" id="user_type_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + shift_data_ary[key]['user_type'] + '"';
        //最終更新日
        contant += '<input type="hidden" id="tdbc_update_date_' + shift_data_ary[key]['tdbc_user_id'] + '" value="' + shift_data_ary[key]['tdbc_update_date'] + '"';
        contant += '</td>';
    })		
    
    $('#maintable_by_date_graph').html(contant);

}

//タブイベント
$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
	activated_tab = e.target; // 現在のタブ
	previous_tab = e.relatedTarget; // 以前のタブ

	var tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/tsr_shift_by_date.php#" , "");

	//フォーム⇒グラフへのタブ遷移
	if(tab_name == 'graph_show'){

        if(user_authority == 9){

            if(chk_section_form() == false){
                return false;
            }

            save_tsr_shift_for_form();
            
            //console.log(shift_count_by_time);
            //set_graph_by_date();
            //30分登録ボタンを表示させる
            $('#graph_min30').css('display','block');

        }
        //console.log(tab_listener);
        init_shift_count_ary();
        set_graph_by_date();
        //tab_listener = 0;
	
	//グラフ⇒フォームへのタブ遷移
	}else if(tab_name == 'form_show'){

        if(user_authority == 9){
            if(chk_section_graph() == false){
                alert("3区間以上の勤務時間が設定されています");
                return false;
            }

            save_tsr_shift_for_graph();
            set_form_by_date();
            //30分登録ボタンを非表示に
            $('#graph_min30').css('display','none');
        }
        //tab_listener = 0;
        set_form_by_date();

	}

})

//30分登録ボタン押下
$(document).on("click","#graph_min30", function() {

    //現在の状態の取得
    var status = $("#graph_min30").val();

    //通常から30分へ
    if(status == 0){

        //色とテキストの変更
        $("#graph_min30").removeClass("btn-success");
        $("#graph_min30").addClass("btn-danger");
        $("#graph_min30").text('通常設定');
        $("#graph_min30").val(1);
    
    //30分から通常へ
    }else if(status == 1){
        //色とテキストの変更
        $("#graph_min30").removeClass("btn-danger");
        $("#graph_min30").addClass("btn-success");
        $("#graph_min30").text('30分設定');
        $("#graph_min30").val(0);

    }

});

function set_shift_color(start_time,end_time,target_id,user_type){

    if(String(start_time).length == 4 && String(end_time).length == 4){

        var start_hour = String(start_time).substring(0,2);
        var start_min = String(start_time).substring(2);
        var end_hour = String(end_time).substring(0,2);
        var end_min = String(end_time).substring(2);
        //console.log(tab_listener);
        for (let i = start_hour; i < end_hour; i++){
            $("#op-col" + zeroPadding(i,2) + "_" + target_id).addClass("op_shift_1");
            if(user_type == 1){
                shift_count_by_time[Number(i)] = shift_count_by_time[Number(i)] + 1;
            }

        }

        //開始時刻が30分のとき
        if(start_min == "30"){
            $("#op-col" + zeroPadding(start_hour,2) + "_" + target_id).text("30分");
            $("#op-col" + zeroPadding(start_hour,2) + "_" + target_id).css('font-size','13px');
            $("#op-col" + zeroPadding(start_hour,2) + "_" + target_id).attr("data-min","30");
        }

        //終了時刻が30分のとき       
        if(end_min == "30"){
            $("#op-col" + zeroPadding(end_hour,2) + "_" + target_id).addClass("op_shift_1");
            $("#op-col" + zeroPadding(end_hour,2) + "_" + target_id).text("30分");
            $("#op-col" + zeroPadding(start_hour,2) + "_" + target_id).css('font-size','13px');
            $("#op-col" + zeroPadding(end_hour,2) + "_" + target_id).attr("data-min","30");
        }

    }

}

//シフト色切り替え
$(document).on("dblclick","[id^=op-col]", function() {

    if(user_authority != 9){
        return false;
    }
    
	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 
    //ダブルクリックされたセルの時間を取得
    var hour = $(this).data('hour'); 
    //ダブルクリックされたセルのuser_typeを取得
    var user_type = $(this).data('usertype'); ;
	//クラス名取得
	var class_name = $("#" + idname).attr("class");
    //30分登録モード
    var status_min30 = $("#graph_min30").val();

	if(class_name === undefined || class_name == ""){
		$("#" + idname).addClass("op_shift_1");
        if(user_type == 1){
            shift_count_by_time[Number(hour)] = shift_count_by_time[Number(hour)] + 1;
            set_total();
        }
        //30分登録モード時には、30分表記
        if(status_min30 == 1){
            $(this).text("30分");
            $(this).css('font-size','13px');
            $(this).attr("data-min","30");
        }
        
	}else if(class_name === "op_shift_1"){
		$("#" + idname).removeClass("op_shift_1");
        if(user_type == 1){
            shift_count_by_time[Number(hour)] = shift_count_by_time[Number(hour)] - 1;
            set_total();
        }
        $(this).text("");
        $(this).attr("data-min","00");
	}

});

function set_total(){

    //グラフ合計表示
    $("#total_00").text(shift_count_by_time[0]);
    $("#total_01").text(shift_count_by_time[1]);
    $("#total_02").text(shift_count_by_time[2]);
    $("#total_03").text(shift_count_by_time[3]);
    $("#total_04").text(shift_count_by_time[4]);
    $("#total_05").text(shift_count_by_time[5]);
    $("#total_06").text(shift_count_by_time[6]);
    $("#total_07").text(shift_count_by_time[7]);
    $("#total_08").text(shift_count_by_time[8]);
    $("#total_09").text(shift_count_by_time[9]);
    $("#total_10").text(shift_count_by_time[10]);
    $("#total_11").text(shift_count_by_time[11]);
    $("#total_12").text(shift_count_by_time[12]);
    $("#total_13").text(shift_count_by_time[13]);
    $("#total_14").text(shift_count_by_time[14]);
    $("#total_15").text(shift_count_by_time[15]);
    $("#total_16").text(shift_count_by_time[16]);
    $("#total_17").text(shift_count_by_time[17]);
    $("#total_18").text(shift_count_by_time[18]);
    $("#total_19").text(shift_count_by_time[19]);
    $("#total_20").text(shift_count_by_time[20]);
    $("#total_21").text(shift_count_by_time[21]);
    $("#total_22").text(shift_count_by_time[22]);
    $("#total_23").text(shift_count_by_time[23]);

}

//グラフ上での休日セット
$(document).on("click","[id^=graph_holiday_set_]", function() {

	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 
	//value値を取得
	var status_value = $(this).attr("value"); 

	//ターゲットのOPIDを取得
	var target_opid = idname.replace("graph_holiday_set_" , "");
    //ターゲットのuser_typeを取得
    var user_type = $("#user_type_" + target_opid).val();

	//valueが0のときは休日にセットする
	if(status_value == 0){
		for(let i = 0; i < 24; i++){
            if($("#op-col" + zeroPadding(i,2) + "_" + target_opid).attr("class") == "op_shift_1"){
                if(user_type == 1){
                    shift_count_by_time[Number(zeroPadding(i,2))] = shift_count_by_time[Number(zeroPadding(i,2))] - 1;
                }
            }            
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_1");
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).addClass("op_shift_holiday");           
		}
        set_total();
        $("#"+idname).val(1);
        $("#"+idname).text('解除');
        $("#"+idname).removeClass("btn-primary");
        $("#"+idname).addClass("btn-danger");
    
	//valueが1のときは休日解除
	}else if(status_value == 1){

		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_holiday");
		}

        $("#"+idname).val(0);
        $("#"+idname).text('休日');
        $("#"+idname).removeClass("btn-danger");
        $("#"+idname).addClass("btn-primary");
        //有休がセットされているときは、有休も同時に解除する
        $("#graph_paid_holiday_set_" + target_opid).val(0);
        $("#graph_paid_holiday_set_" + target_opid).text('有休');
        $("#graph_paid_holiday_set_"+target_opid).removeClass("btn-danger");
        $("#graph_paid_holiday_set_"+target_opid).addClass("btn-primary");
    }

});

//フォーム上での休日セット
$(document).on("click","[id^=holiday_]", function() {

	//値を取得
	var check_val = $(this).prop("checked");

    //チェックされたセルのidを取得
    var idname = $(this).attr("id");
    //OPIDを取得
    var target_opid = idname.replace("holiday_",""); 
    
    holiday_init(target_opid,check_val);

});


//グラフ上での有休セット
$(document).on("click","[id^=graph_paid_holiday_set_]", function() {

	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 

	//ターゲットのOPIDを取得
	var target_opid = idname.replace("graph_paid_holiday_set_" , "");
	//休日ボタンのvalue値を取得
	var status_value = $("#graph_holiday_set_" + target_opid).attr("value");    

	//valueが0のときは休日にセットする
	if(status_value == 0){

		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_1");
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).addClass("op_shift_holiday");
		}

        $("#"+idname).val(1);
        $("#graph_holiday_set_" + target_opid).val(1);
        $("#"+idname).text('解除');
        $("#graph_holiday_set_" + target_opid).text('解除');
        $("#"+idname).removeClass("btn-primary");
        $("#"+idname).addClass("btn-danger");
        $("#graph_holiday_set_" + target_opid).removeClass("btn-primary");
        $("#graph_holiday_set_" + target_opid).addClass("btn-danger");
    
	//valueが1のときは休日解除
	}else if(status_value == 1){

		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_holiday");
		}

        $("#"+idname).val(0);
        $("#graph_holiday_set_" + target_opid).val(0);
        $("#"+idname).text('有休');
        $("#graph_holiday_set_" + target_opid).text('休日');
        $("#"+idname).removeClass("btn-danger");
        $("#"+idname).addClass("btn-primary");
        $("#graph_holiday_set_" + target_opid).removeClass("btn-danger");
        $("#graph_holiday_set_" + target_opid).addClass("btn-primary");
    
	}

});

//フォーム上での有休セット
$(document).on("click","[id^=paid_holiday_]", function() {

	//値を取得
	var check_val = $(this).prop("checked");

    //チェックされたセルのidを取得
    var idname = $(this).attr("id");
    //OPIDを取得
    var target_opid = idname.replace("paid_holiday_",""); 
    
    holiday_init(target_opid,check_val);

    //休日欄もチェックを付ける
    if(check_val == 1){
        $("#holiday_" + target_opid).prop('checked',true);
    }else if(check_val == 0){
        $("#holiday_" + target_opid).prop('checked',false);
    }

});

//グラフ上での夜勤セット
$(document).on("click","[id^=graph_midnight_set_]", function() {

	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 
	//value値を取得
	var status_value = $(this).attr("value"); 

	//ターゲットのOPIDを取得
	var target_opid = idname.replace("graph_midnight_set_" , "");
    //前日夜勤フラグ
    var yesterday_midnight_flg =  $("#yesterday_midnight_flg_" + target_opid).val();

	if(status_value == 0){
        //当日のシフトは22時と23時のセルに色をつける
        //前日夜勤のときは8時台から色を除外して22と23時台に黄色
        if(yesterday_midnight_flg == 1){
            for(let i = 8; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_holiday");  
                if(i > 21) {   
                    $("#op-col" + zeroPadding(i,2) + "_" + target_opid).addClass("op_shift_1");
                }
            }
        //前日夜勤ではないときは、0時から色を除外して22と23時台に黄色
        }else{
            for(let i = 0; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_holiday");  
                if(i > 21) {   
                    $("#op-col" + zeroPadding(i,2) + "_" + target_opid).addClass("op_shift_1");
                }
            }
        }

        $("#graph_midnight_set_" + target_opid).val(1);
        $("#graph_midnight_set_" + target_opid).text('解除');
        $("#graph_midnight_set_" + target_opid).removeClass("btn-primary");
        $("#graph_midnight_set_" + target_opid).addClass("btn-danger");
        //有休と休日のボタンはデフォルトに戻す
        $("#graph_holiday_set_" + target_opid).text('休日');
        $("#graph_holiday_set_" + target_opid).removeClass("btn-danger");
        $("#graph_holiday_set_" + target_opid).addClass("btn-primary");
        $("#graph_paid_holiday_set_" + target_opid).text('有休');
        $("#graph_paid_holiday_set_" + target_opid).removeClass("btn-danger");
        $("#graph_paid_holiday_set_" + target_opid).addClass("btn-primary");

    
    //夜勤解除のとき    
	}else if(status_value == 1){
        //とりあえず22時と23時の色は除外
		for(let i = 22; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_1");           
		}
   
        $("#graph_midnight_set_" + target_opid).val(0);
        $("#graph_midnight_set_" + target_opid).text('夜勤');
        $("#graph_midnight_set_" + target_opid).removeClass("btn-danger");
        $("#graph_midnight_set_" + target_opid).addClass("btn-primary");
        
    }
    
});

//フォーム上での夜勤チェック時の保存
$(document).on("click","[id^=midnight_]", function() {

	//値を取得
	var check_val = $(this).prop("checked");
    //チェックされたセルのidを取得
    var idname = $(this).attr("id");
    //OPIDを取得
    var target_opid = idname.replace("midnight_","");
    //前日夜勤フラグの取得
    var yesterday_midnight_flg = $("#yesterday_midnight_flg_" + target_opid).val();
    //console.log(yesterday_midnight_flg);
    //夜勤チェック時
    if(check_val == true){

        //前日の夜勤フラグチェック
        if(yesterday_midnight_flg == 1){

            //前日が夜勤であれば、第2区間に22時から24時をセット
            $("#bc_second_hour_sta_" + target_opid).val('22');
            $("#bc_second_min_sta_" + target_opid).val('00');
            $("#bc_second_hour_end_" + target_opid).val('24');
            $("#bc_second_min_end_" + target_opid).val('00');
            $("#bc_second_hour_sta_" + target_opid).prop('disabled',true);
            $("#bc_second_min_sta_" + target_opid).prop('disabled',true);
            $("#bc_second_hour_end_" + target_opid).prop('disabled',true);
            $("#bc_second_min_end_" + target_opid).prop('disabled',true);
    
        }else{

            //前日が夜勤でなければ当該日の第1区間を22時から24時とする
            $("#bc_first_hour_sta_" + target_opid).val('22');
            $("#bc_first_min_sta_" + target_opid).val('00');
            $("#bc_first_hour_end_" + target_opid).val('24');
            $("#bc_first_min_end_" + target_opid).val('00');
            $("#bc_first_hour_sta_" + target_opid).prop('disabled',true);
            $("#bc_first_min_sta_" + target_opid).prop('disabled',true);
            $("#bc_first_hour_end_" + target_opid).prop('disabled',true);
            $("#bc_first_min_end_" + target_opid).prop('disabled',true);

        }

        //休日フラグと有休フラグはチェックを外す
        $("#holiday_" + target_opid).prop('checked',false);
        $("#paid_holiday_" + target_opid).prop('checked',false);
       
        //console.log(shift_data_ary);
    
    //夜勤解除時
    }else{

        //前日の夜勤フラグチェック
        if(yesterday_midnight_flg== 1){

            //前日が夜勤であれば、第2区間の22時から24時をリセット
            $("#bc_second_hour_sta_" + target_opid).val('');
            $("#bc_second_min_sta_" + target_opid).val('00');
            $("#bc_second_hour_end_" + target_opid).val('');
            $("#bc_second_min_end_" + target_opid).val('00');
            $("#bc_second_hour_sta_" + target_opid).prop('disabled',false);
            $("#bc_second_min_sta_" + target_opid).prop('disabled',false);
            $("#bc_second_hour_end_" + target_opid).prop('disabled',false);
            $("#bc_second_min_end_" + target_opid).prop('disabled',false);            

        }else{

            //前日が夜勤でなければ、当該日の第1区間をリセットする
            $("#bc_first_hour_sta_" + target_opid).val('');
            $("#bc_first_min_sta_" + target_opid).val('00');
            $("#bc_first_hour_end_" + target_opid).val('');
            $("#bc_first_min_end_" + target_opid).val('00');
            $("#bc_first_hour_sta_" + target_opid).prop('disabled',false);
            $("#bc_first_min_sta_" + target_opid).prop('disabled',false);
            $("#bc_first_hour_end_" + target_opid).prop('disabled',false);
            $("#bc_first_min_end_" + target_opid).prop('disabled',false);

        }

    }

});

function holiday_init(target_opid,check_val){
    //チェックされたときは、時刻入力欄は非活性
    if(check_val == 1){
        $("#bc_first_hour_sta_" + target_opid).val('');
        $("#bc_first_min_sta_" + target_opid).val('00');
        $("#bc_first_hour_end_" + target_opid).val('');
        $("#bc_first_min_end_" + target_opid).val('00');
        $("#bc_second_hour_sta_" + target_opid).val('');
        $("#bc_second_min_sta_" + target_opid).val('00');
        $("#bc_second_hour_end_" + target_opid).val('');
        $("#bc_second_min_end_" + target_opid).val('00');
        $("#midnight_" + target_opid).prop('checked',false);

        $("#bc_first_hour_sta_" + target_opid).prop('disabled',true);
        $("#bc_first_min_sta_" + target_opid).prop('disabled',true);
        $("#bc_first_hour_end_" + target_opid).prop('disabled',true);
        $("#bc_first_min_end_" + target_opid).prop('disabled',true);
        $("#bc_second_hour_sta_" + target_opid).prop('disabled',true);
        $("#bc_second_min_sta_" + target_opid).prop('disabled',true);
        $("#bc_second_hour_end_" + target_opid).prop('disabled',true);
        $("#bc_second_min_end_" + target_opid).prop('disabled',true);

    //チェック解除時は時刻入力欄を活性化させる
    }else if(check_val == 0){
        $("#bc_first_hour_sta_" + target_opid).val('');
        $("#bc_first_min_sta_" + target_opid).val('00');
        $("#bc_first_hour_end_" + target_opid).val('');
        $("#bc_first_min_end_" + target_opid).val('00');
        $("#bc_second_hour_sta_" + target_opid).val('');
        $("#bc_second_min_sta_" + target_opid).val('00');
        $("#bc_second_hour_end_" + target_opid).val('');
        $("#bc_second_min_end_" + target_opid).val('00');

        $("#bc_first_hour_sta_" + target_opid).prop('disabled',false);
        $("#bc_first_min_sta_" + target_opid).prop('disabled',false);
        $("#bc_first_hour_end_" + target_opid).prop('disabled',false);
        $("#bc_first_min_end_" + target_opid).prop('disabled',false);
        $("#bc_second_hour_sta_" + target_opid).prop('disabled',false);
        $("#bc_second_min_sta_" + target_opid).prop('disabled',false);
        $("#bc_second_hour_end_" + target_opid).prop('disabled',false);
        $("#bc_second_min_end_" + target_opid).prop('disabled',false);
    }
}

//メモ欄モーダル
$('#shift_by_date_memo').on('show.bs.modal', function (event) {

    //モーダルを取得
    var modal = $(this);
    
    var button = $(event.relatedTarget);
    var target_opid = button.data('target-userid');

    $("#shift_by_date_memo_target_userid").val(target_opid);

    //保存されているメモ情報をフォームに表示
    var memo = $("#tdbc_memo_" + target_opid).val();
    modal.find('#hs_memo').val(memo);
  
});

//メモ情報保存（hiddenに保存)
$(document).on("click","#shift_by_date_memo_regist", function() {

    var target_opid = $("#shift_by_date_memo_target_userid").val();

    //入力されたメモ情報を取得
    var memo = $("#hs_memo").val();
    $("#tdbc_memo_" + target_opid).val(memo);

    //メモ情報が空白ならアイコンを非表示
    if(memo != ""){
        $("#memo_icn_" + target_opid).attr("src","../img/memo_act.png");
    }else{
        $("#memo_icn_" + target_opid).attr("src","../img/memo.png");
    }
});

$('#shift_by_date_memo_regist').on('hidden.bs.modal', function (event) {
    $("#hs_memo").val("");

});

//氏名リンク押下
$(document).on("click",".shift_by_user", function() {

    var tmur_user_id =  $(this).data('userid');
    var section_sta = $("#section_sta").val();
    var section_end = $("#section_end").val();
    var url = "before_confirm_by_user.php";
    var param_ary = new Object();
    param_ary['tmur_user_id'] = tmur_user_id;
    param_ary['section_sta'] = section_sta;
    param_ary['section_end'] = section_end;
    
    post(url,param_ary);
});

//表示ボタン押下
$(document).on("click","#by_timezone_show", function() {
    by_timezone_kensaku();
});

//グラフの区間チェック
//3回勤務はNGとする
function chk_section_graph(){

    var chk_flg = 0;

    Object.keys(shift_data_ary).forEach(function(key) {

		//0時のシフトで色の変化回数の制御を分ける
		var zero_hour_class = "";
		zero_hour_class = $("#op-col00_" + shift_data_ary[key]['tdbc_user_id']).attr("class"); 
		//制御回数
		let limit_cnt = 0;

		var current_class_name = "";
		var change_cnt = 0;

		for(let i = 0; i < 24; i++){

			var class_name = $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).attr("class"); 
			if(class_name === undefined){
				class_name = "";
			}
			if(current_class_name != class_name){
				change_cnt ++;
			}

			if(change_cnt > 5){
                chk_flg ++;
				return false;
			}

			current_class_name = class_name;

		}
    })		

    if(chk_flg > 0){
        return false;
    }else{
        return true;
    }
}

function chk_section_form(){

	//エラーフラグ
	var err_form_depli = 0;
	var err_validate_mes = "";

    //日付
    var target_date = $("#showen_date").val();

    Object.keys(shift_data_ary).forEach(function(key) {

		//重複チェック
		if(chk_time(shift_data_ary[key]['tdbc_user_id'],target_date) == false){
			err_form_depli = 1;
		}

		//半角数字チェック
		//第1区間
		var first_hour_sta = $("#bc_first_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).val();
		var first_hour_end = $("#bc_first_hour_end_" + shift_data_ary[key]['tdbc_user_id']).val();

		//第2区間
		var second_hour_sta = $("#bc_second_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).val();
		var second_hour_end = $("#bc_second_hour_end_" + shift_data_ary[key]['tdbc_user_id']).val();

		if(first_hour_sta != "") {
			if(isNumber(first_hour_sta) == false){
				err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第1区間の開始時刻の入力値が不正です" + "\n";
			}else{
				if(Number(first_hour_sta) > 24){
					err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第1区間の開始時刻の入力値が不正です!" + "\n";
				}
			}
		}

		if(first_hour_end != ""){
		if(isNumber(first_hour_end) == false){
				err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第1区間の終了時刻の入力値が不正です" + "\n";
			}else{
				if(Number(first_hour_end) > 24){
					err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第1区間の終了時刻の入力値が不正です!" + "\n";
				}
			}
		}

		if(second_hour_sta != ""){
			if(isNumber(second_hour_sta) == false){
				err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第2区間の入力値が不正です" + "\n";
			}else{
				if(Number(second_hour_sta) > 24){
					err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第2区間の入力値が不正です" + "\n";
				}
			}
		}

		if(second_hour_end != ""){
			if(isNumber(second_hour_end) == false){
			err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第2区間の入力値が不正です" + "\n";
			}else{
				if(Number(second_hour_end) > 24){
					err_validate_mes = err_validate_mes + "ID：" + shift_data_ary[key]['tdbc_user_id'] + "の第2区間の入力値が不正です" + "\n";
				}
			}
		}

    })		

	if(err_form_depli == 1){
		alert("第1区間と第2区間の時間帯が重複しています");
		return false;
	}

	if(err_validate_mes != ""){
		alert(err_validate_mes);
		return false;
	}

	return true;
    
}

//第1区間と第2区間の重複チェック
function chk_time(target_userid,target_date){

    if($("#bc_first_hour_sta_" + target_userid).val() == ""){
        return true;
    }
    if($("#bc_first_hour_end_" + target_userid).val() == "" ){
        return true;
    }
    //第2区間が全てブランクならばチェック対象外
    if($("#bc_second_hour_sta_" + target_userid).val() == "" &&  $("#bc_second_hour_end_" + target_userid).val() == "" ){
        return true;
    }
    
    //まず第1区間を配列に入れる
    var first_hour_sta = String(zeroPadding($("#bc_first_hour_sta_" + target_userid).val(),2));
    var first_min_sta = String(zeroPadding($("#bc_first_min_sta_" + target_userid).val(),2));
    var first_hour_end = String(zeroPadding($("#bc_first_hour_end_" + target_userid).val(),2));
    var first_min_end = String(zeroPadding($("#bc_first_min_end_" + target_userid).val(),2));

    //第2区間のシフトを配列に入れる
    var second_hour_sta = String(zeroPadding($("#bc_second_hour_sta_" + target_userid).val(),2));
    var second_min_sta = String(zeroPadding($("#bc_second_min_sta_" + target_userid).val(),2));
    var second_hour_end = String(zeroPadding($("#bc_second_hour_end_" + target_userid).val(),2));
    var second_min_end = String(zeroPadding($("#bc_second_min_end_" + target_userid).val(),2));

    //第1区間の期間配列
    const date_from_first = target_date + " " + first_hour_sta + ":" + first_min_sta + ":00";
    const date_to_first = target_date + " " + first_hour_end + ":" + first_min_end + ":00";
    const first_span = {
        start: new Date(date_from_first),
        end: new Date(date_to_first)
    };
    //第2区間の期間配列
    const date_from_second = target_date + " " + second_hour_sta + ":" + second_min_sta + ":00";
    const date_to_second = target_date + " " + second_hour_end + ":" + second_min_end + ":00";
    const second_span = {
        start: new Date(date_from_second),
        end: new Date(date_to_second)
    };
    //重複チェック
    if(first_span['start'] <= second_span['end'] && first_span['end'] >= second_span['start']){
        return false;
    }else{
        return true;
    }

}

//登録ボタン押下
$(document).on("click","#tsr_shift_regist", function() {

    if(chk_section_form == false){
        return false;
    }

    if(chk_section_graph == false){
        alert("3区間以上の勤務時間が設定されています");
        return false;
    }

    //フォームおよびグラフの内容を保存
	//現在のタブ名取得
    var tab_name = "";
	if(activated_tab === undefined){
		tab_name = "";
	}else{
		tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/tsr_shift_by_date.php#" , "");
	}

	//フォーム⇒グラフへのタブ遷移
	if(tab_name == 'graph_show'){
        //save_before_confirm_for_form_by_user();
        save_tsr_shift_for_graph();
        set_graph_by_date();
	//グラフ⇒フォームへのタブ遷移
	}else if(tab_name == 'form_show'){
        // /save_before_confirm_for_graph_by_user();
        save_tsr_shift_for_form();
		set_form_by_date();
	}else if(tab_name == ""){
		save_tsr_shift_for_form();
	}    
    //console.log(shift_data_ary);
    
	//対象OPID
	var showen_date = $("#showen_date").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/tsr_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json', 
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'tsr_shift_regist_by_date',
						'token'       : $("#csrf_token").val(),
						'tdbc_shift_date':showen_date,
						'shift_data_ary':JSON.stringify(shift_data_ary)
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("シフト登録しました");
			//登録失敗
			}else if(json_data == "ng"){
				alert("登録に失敗しました");
            }else if(json_data == "conflict_ng"){
                $('#modal_conflict').modal();
			}else{
				Object.keys(json_data).forEach(function(key) {
					err_mes = err_mes + json_data[key] + "\n";
				})
				alert(err_mes);
			}
		},

		// HTTPエラー
		error: function(XMLHttpRequest, textStatus, errorThrown) {         
			alert("エラーが発生しました。システム管理者にお問い合わせください。");
			console.log("XMLHttpRequest : " + XMLHttpRequest.status);
			console.log("textStatus     : " + textStatus);
			console.log("errorThrown    : " + errorThrown.message);	
		},

		// 成功・失敗に関わらず通信が終了した際の処理
		complete: function() {     
		}
	})	
    
    
});