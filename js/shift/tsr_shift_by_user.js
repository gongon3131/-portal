//シフト保存用配列
let shift_data_ary = new Object();
var activated_tab; // 現在のタブ
var previous_tab; // 以前のタブ
let user_authority;

/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', by_user_kensaku);

//OPの変更イベント
$("#tmur_user_id").change(function(){
    var tmur_user_id = $(this).val();
    by_user_kensaku();
  });

function by_user_kensaku(){

    //操作権限フラグ
    user_authority = $("#user_authority").val();
    //$("#user_authority").val("");

	//期間の始端と終端  
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
    //ユーザーID
    $("#tmur_user_id").val($("#user_id").val());
    var tmur_user_id = $("#tmur_user_id").val();
    
    if(section_sta == "" && section_end == ""){
        alert("有効なシフト登録期間はありません");
        return false;
    }
    
	$.ajax({
		type:          'post',
		url:		   "../api/shift/tsr_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	      : 'summary_by_user',
                        'tmur_user_id'    : tmur_user_id,
						'section_sta'	  : section_sta,
						'section_end'	  : section_end
						},
		
		// 200 OK
		success: function(json_data) {   

			//shift_data_ary = json_data;

            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                shift_data_ary = json_data;
                //フォーム表示
                paging_form();
                //管理者ユーザー以外は編集不可
                if(user_authority != 9){
                    //$('[id^=midnight_]').prop('disabled',true);
                }
                paging_graph();
                set_tsr_shift_for_graph_by_user();
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
	$('#maintable_by_user_form').empty();

    let contant = '';

    Object.keys(shift_data_ary).forEach(function(key) {

        var current_date = shift_data_ary[key]['tdbc_shift_date'];

        //第1区間
        var first_hour_sta = "";//開始時刻・時
        var first_min_sta = "";//開始時刻・分
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
            //終了時刻・時
            first_hour_end = String(shift_data_ary[key]['tdbc_end_time_first']).substring(0,2);
            first_hour_end = Number(first_hour_end);
            //終了時刻・分
            first_min_end = String(shift_data_ary[key]['tdbc_end_time_first']).substring(2);
            first_min_end = Number(first_min_end);
        }

        if(first_min_end == ""){
            first_min_end = "00";
        }

        //第2区間
        var second_hour_sta = "";//開始時刻・時
        var second_min_sta = "";//開始時刻・分
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
        //日付
        contant += '<td class="hope_shift_summary_cell1 shift_form_text"><a href="#" class="shift_by_user_fm" data-target-date-fm="' + current_date + '">' + current_date + '</a></td>';
        //第1区間
        if(user_authority == 9){
            contant += '<td>';
            contant += '<div class="form-inline">';
            contant += '<div class="form_center">';
            contant += '<input type="text" data-target-date-fm="' + current_date + '" id="bc_first_hour_sta_' + current_date + '" name="bc_first_hour_sta_' + current_date + '" value="' + first_hour_sta + '" class="form-control w15 form_right" oninput="value = value.replace(/[^0-9]+/i,' + "'');" + '">';
            contant += '：';
            contant += '<select data-target-date-fm="' + current_date + '" name="bc_first_min_sta_' + current_date  + '" class="form-control" id="bc_first_min_sta_' + current_date  + '">';
            if(first_min_sta = "00"){
                contant += '<option label="" value="00" selected>00</option>';
                contant += '<option label="" value="30">30</option>';
            }else if(first_min_sta = "00"){
                contant += '<option label="" value="00" >00</option>';
                contant += '<option label="" value="30" selected>30</option>';
            }
            contant += '</select>';
            contant += '&nbsp;～&nbsp;';
            contant += '<input type="text" data-target-date-fm="' + current_date + '" id="bc_first_hour_end_' + current_date + '" name="bc_first_hour_end_' + current_date + '" value="' + first_hour_end + '" class="form-control w15 form_right">';
            contant += '：';
            contant += '<select data-target-date-fm="' + current_date + '" name="bc_first_min_end_' + current_date + '" class="form-control" id="bc_first_min_end_' + current_date + '">';
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
            contant += '<input type="text" data-target-date-fm="' + current_date + '" id="bc_second_hour_sta_' + current_date + '" name="bc_second_hour_sta_' + current_date + '" value="' + second_hour_sta + '" class="form-control w15 form_right">';
            contant += '：';
            contant += '<select data-target-date-fm="' + current_date + '" name="bc_second_min_sta_' + current_date + '" class="form-control" id="bc_second_min_sta_' + current_date + '">';
            if(second_min_sta = "00"){
                contant += '<option label="" value="00" selected>00</option>';
                contant += '<option label="" value="30">30</option>';
            }else if(second_min_sta = "00"){
                contant += '<option label="" value="00" >00</option>';
                contant += '<option label="" value="30" selected>30</option>';
            }
            contant += '</select>';
            contant += '&nbsp;～&nbsp;';
            contant += '<input type="text" data-target-date-fm="' + current_date + '" id="bc_second_hour_end_' + current_date + '" name="bc_second_hour_end_' + current_date + '" value="' + second_hour_end + '" class="form-control w15 form_right">';
            contant += '：';
            contant += '<select data-target-date-fm="' + current_date + '" name="bc_second_min_end_' + current_date + '" class="form-control" id="bc_second_min_end_' + current_date + '">';
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
        //夜勤フラグ
        if(shift_data_ary[key]['tdbc_midnight_flg'] == "1"){
            contant += '<td><input type="checkbox" data-target-date-fm="' + current_date + '" name="midnight_' + current_date + '" id="midnight_' + current_date + '" value="1" class="form-control" checked></td>';
        }else{
            contant += '<td><input type="checkbox" data-target-date-fm="' + current_date + '" name="midnight_' + current_date + '" id="midnight_' + current_date + '" value="1" class="form-control"></td>';
        }
        //休日フラグ
        if(shift_data_ary[key]['tdbc_holiday_flg'] == "1"){
            contant += '<td><input type="checkbox" data-target-date-fm="' + current_date + '" name="holiday_' + current_date + '" id="holiday_' + current_date + '" value="1" class="form-control" checked></td>';
        }else{
            contant += '<td><input type="checkbox" data-target-date-fm="' + current_date + '" name="holiday_' + current_date + '" id="holiday_' + current_date + '" value="1" class="form-control"></td>';
        }
        //有休フラグ
        if(shift_data_ary[key]['tdbc_paid_holiday_flg'] == "1"){
            contant += '<td><input type="checkbox" data-target-date-fm="' + current_date + '" name="paid_holiday_' + current_date + '" id="paid_holiday_' + current_date + '" value="1" class="form-control" checked></td>';
        }else{
            contant += '<td><input type="checkbox" data-target-date-fm="' + current_date + '" name="paid_holiday_' + current_date + '" id="paid_holiday_' + current_date + '" value="1" class="form-control"></td>';
        }
        //メモ
        contant += '<td><input type="text" data-target-date-fm="' + current_date + '" name="tdbc_memo_' + current_date + '" value="' + shift_data_ary[key]['tdbc_memo'] + '" id="tdbc_memo_' + current_date + '" class="form-control"></td>';
        //公開・非公開フラグ
        contant += '<input type="hidden" id="confirm_flg_' + current_date + '" value="' + shift_data_ary[key]['confirm_flg'] + '">';
        //最終更新日（hiddenに保存）
        contant += '<input type="hidden" id="tdbc_update_date_' + current_date + '" value="' + shift_data_ary[key]['tdbc_update_date'] + '">';
        contant += '</tr>';
    })					

    $('#maintable_by_user_form').html(contant);

}

function paging_graph(){

	//テーブルの内容を削除
	$('#maintable_by_user_graph').empty();

    let contant = '';

    Object.keys(shift_data_ary).forEach(function(key) {

        var current_date = shift_data_ary[key]['tdbc_shift_date'];
        
        contant += '<tr class="by_user_shift_height">';
        //日付
        contant += '<td class="form_v_middle shift_form_text"><a href="#" class="shift_by_user_gh" data-target-date-gh="' + current_date + '">' + current_date + '</a>';
        //希望シフトアイコン
        contant += '<a hre="#" data-toggle="modal" data-target="#hope_shift_detail" data-backdrop="static" data-target-userid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-username="' + shift_data_ary[key]['tmur_user_name'] + '"><img src="../img/kibou_icn.png" class="graph_hope_detail_icn_by_date" id="hope_detail_icn_' + current_date + '"></a>';
        //メモアイコン
        if(shift_data_ary[key]['tdbc_memo'] == ""){
            contant += '<a hre="#" data-toggle="modal" data-target="#shift_by_user_memo" data-backdrop="static" data-target-date="' + current_date + '"><img src="../img/memo.png" class="graph_memo_icn_by_date" id="memo_icn_' + current_date + '"></a>';
        }else{
            contant += '<a hre="#" data-toggle="modal" data-target="#shift_by_user_memo" data-backdrop="static" data-target-date="' + current_date + '"><img src="../img/memo_act.png" class="graph_memo_icn_by_date" id="memo_icn_' + current_date + '"></a>';
        }
        contant += '</td>';
        //休日・有休・夜勤ボタン
        if(user_authority == 9){
            contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_holiday_set_' + current_date + '">休日</button>';
            contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_paid_holiday_set_' + current_date + '">有休</button>';
            contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_midnight_set_' + current_date + '">夜勤</button>';
        }
        contant += '<td id="op-col00_' + current_date + '" data-min="00" data-hour="0" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col01_' + current_date + '" data-min="00" data-hour="1" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col02_' + current_date + '" data-min="00" data-hour="2" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col03_' + current_date + '" data-min="00" data-hour="3" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col04_' + current_date + '" data-min="00" data-hour="4" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col05_' + current_date + '" data-min="00" data-hour="5" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col06_' + current_date + '" data-min="00" data-hour="6" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col07_' + current_date + '" data-min="00" data-hour="7" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col08_' + current_date + '" data-min="00" data-hour="8" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col09_' + current_date + '" data-min="00" data-hour="9" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col10_' + current_date + '" data-min="00" data-hour="10" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col11_' + current_date + '" data-min="00" data-hour="11" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col12_' + current_date + '" data-min="00" data-hour="12" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col13_' + current_date + '" data-min="00" data-hour="13" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col14_' + current_date + '" data-min="00" data-hour="14" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col15_' + current_date + '" data-min="00" data-hour="15" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col16_' + current_date + '" data-min="00" data-hour="16" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col17_' + current_date + '" data-min="00" data-hour="17" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col18_' + current_date + '" data-min="00" data-hour="18" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col19_' + current_date + '" data-min="00" data-hour="19" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col20_' + current_date + '" data-min="00" data-hour="20" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col21_' + current_date + '" data-min="00" data-hour="21" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col22_' + current_date + '" data-min="00" data-hour="22" data-target-date="' + current_date + '"></td>';
        contant += '<td id="op-col23_' + current_date + '" data-min="00" data-hour="23" data-target-date="' + current_date + '"></td>';
        //メモ内容保存用hidden
        contant += '<input type="hidden" value="' + shift_data_ary[key]['tdbc_memo'] + '" id="tdbc_memo_gh' + current_date + '">';
        //公開・非公開フラグ
        contant += '<input type="hidden" id="confirm_flg_fm_' + current_date + '" value="' + shift_data_ary[key]['confirm_flg'] + '">';
        //前日夜勤フラグ（hiddenに保存）
        contant += '<input type="hidden" value="' + shift_data_ary[key]['yesterday_midnight_flg'] + '" id="yesterday_midnight_flg_' + current_date + '" data-target-userid="' + shift_data_ary[key]['tdbc_user_id']  + '">';
        //最終更新日（hiddenに保存）
        contant += '<input type="hidden" value="' + shift_data_ary[key]['tdbc_update_date'] + '" id="tdbc_update_date_gh' + current_date + '">';
        contant += '</td>';
    })		
    
    $('#maintable_by_user_graph').html(contant);

}

//タブイベント
$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

	activated_tab = e.target; // 現在のタブ
	previous_tab = e.relatedTarget; // 以前のタブ
	var tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/tsr_shift_by_user.php#" , "");
	//フォーム⇒グラフへのタブ遷移
	if(tab_name == 'graph_show'){

        if(user_authority == 9){

            if(chk_section_form() == false){
                return false;
            }
    
            save_tsr_shift_for_form_by_user();
            set_tsr_shift_for_graph_by_user();
            //30分登録ボタンを表示させる
            $('#graph_min30').css('display','block');
        }
	
	//グラフ⇒フォームへのタブ遷移
	}else if(tab_name == 'form_show'){

        if(user_authority == 9){

            if(chk_section_graph() == false){
                alert("3区間以上の勤務時間が設定されています");
                return false;
            }

            save_tsr_shift_for_graph_by_user();
            set_form_by_user();
            //30分登録ボタンを非表示に
            $('#graph_min30').css('display','none');
        }

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

function set_shift_color(start_time,end_time,target_id){

    if(String(start_time).length == 4 && String(end_time).length == 4){

        var start_hour = String(start_time).substring(0,2);
        var start_min = String(start_time).substring(2);
        var end_hour = String(end_time).substring(0,2);
        var end_min = String(end_time).substring(2);

        for (let i = start_hour; i < end_hour; i++){
            $("#op-col" + zeroPadding(i,2) + "_" + target_id).addClass("op_shift_1");
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
    //ダブルクリックされたセルの日付を取得
    var target_date = $(this).data('target-date'); 

	//クラス名取得
	var class_name = $("#" + idname).attr("class");
    //30分登録モード
    var status_min30 = $("#graph_min30").val();

	if(class_name === undefined || class_name == ""){
		$("#" + idname).addClass("op_shift_1");
        //30分登録モード時には、30分表記
        if(status_min30 == 1){
            $(this).text("30分");
            $(this).css('font-size','13px');
            $(this).attr("data-min","30");
        }
        
	}else if(class_name === "op_shift_1"){
		$("#" + idname).removeClass("op_shift_1");
        $(this).text("");
        $(this).attr("data-min","00");
	}

});

//グラフ上での休日セット
$(document).on("click","[id^=graph_holiday_set_]", function() {

	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 
	//value値を取得
	var status_value = $(this).attr("value"); 

	//ターゲットのOPIDを取得
	var target_opid = idname.replace("graph_holiday_set_" , "");

	//valueが0のときは休日にセットする
	if(status_value == 0){
		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).removeClass("op_shift_1");
			$("#op-col" + zeroPadding(i,2) + "_" + target_opid).addClass("op_shift_holiday");           
		}
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
    //日付を取得
    var target_date = $(this).data('target-date-fm'); 
    
    holiday_init(target_date,check_val);

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
    //日付を取得
    var target_date = $(this).data('target-date-fm'); 
    
    holiday_init(target_date,check_val);

    //休日欄もチェックを付ける
    if(check_val == 1){
        $("#holiday_" + target_date).prop('checked',true);
    }else if(check_val == 0){
        $("#holiday_" + target_date).prop('checked',false);
    }

});

//グラフ上での夜勤セット
$(document).on("click","[id^=graph_midnight_set_]", function() {

	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 
	//value値を取得
	var status_value = $(this).attr("value"); 
	//ターゲットの日付を取得
	var target_date = idname.replace("graph_midnight_set_" , "");
    //前日夜勤フラグ
    var yesterday_midnight_flg =  $("#yesterday_midnight_flg_" + target_date).val();
    //翌日の日付
    var next_date = get_next_day(target_date);    

	if(status_value == 0){

        //当日のシフトは22時と23時のセルに色をつける
        //前日夜勤のときは8時台から色を除外して22と23時台に黄色
        if(yesterday_midnight_flg == 1){
            for(let i = 8; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_holiday");  
                if(i > 21) {   
                    $("#op-col" + zeroPadding(i,2) + "_" + target_date).addClass("op_shift_1");
                }
            }

        //前日夜勤ではないときは、0時から色を除外して22と23時台に黄色
        }else{
            for(let i = 0; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_holiday");  
                if(i > 21) {   
                    $("#op-col" + zeroPadding(i,2) + "_" + target_date).addClass("op_shift_1");
                }
            }
        }

        //さらに翌日の0～8時に色をつける
        for(let i = 0; i < 8; i++){
            $("#op-col" + zeroPadding(i,2) + "_" + next_date).removeClass("op_shift_holiday");  
            $("#op-col" + zeroPadding(i,2) + "_" + next_date).addClass("op_shift_1");
        }
        //8時以降は色は除外する
        for(let i = 8; i < 24; i++){
            $("#op-col" + zeroPadding(i,2) + "_" + next_date).removeClass("op_shift_holiday");  
            if(i > 21 && $("#graph_midnight_set_" + next_date).attr("value") == 1) {   
                $("#op-col" + zeroPadding(i,2) + "_" + next_date).removeClass("op_shift_holiday");  
                $("#op-col" + zeroPadding(i,2) + "_" + next_date).addClass("op_shift_1");
            }
        }

        $("#graph_midnight_set_" + target_date).val(1);
        $("#graph_midnight_set_" + target_date).text('解除');
        $("#graph_midnight_set_" + target_date).removeClass("btn-primary");
        $("#graph_midnight_set_" + target_date).addClass("btn-danger");
    
    //夜勤解除のとき    
	}else if(status_value == 1){

        //とりあえず22時と23時の色は除外
		for(let i = 22; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_1");           
		}
        //さらに翌日の0～8時に色も除外する
        for(let i = 0; i < 8; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + next_date).removeClass("op_shift_1");           
        }
        
        $("#graph_midnight_set_" + target_date).val(0);
        $("#graph_midnight_set_" + target_date).text('夜勤');
        $("#graph_midnight_set_" + target_date).removeClass("btn-danger");
        $("#graph_midnight_set_" + target_date).addClass("btn-primary");
        
    }
    
});

//夜勤チェック時の保存
$(document).on("click","[id^=midnight_]", function() {

	//値を取得
	var check_val = $(this).prop("checked");
    //チェックされたセルのidを取得
    var idname = $(this).attr("id");
    //日付を取得
    var target_date = $(this).data('target-date-fm'); 
    //昨日の日付
    var date_y = new Date(target_date);
    date_y = new Date(date_y.setDate(date_y.getDate() - 1));
    var before_date = date_y.getFullYear() + "-" + zeroPadding(date_y.getMonth() + 1,2) + "-" + zeroPadding(date_y.getDate(),2);
    //当該日の翌日の日付を取得
    var next_date = get_next_day(target_date);

    //夜勤チェック時
    if(check_val == true){

        //前日の夜勤フラグチェック
        if($("#midnight_" + before_date).prop("checked") == true){

            //前日が夜勤であれば、第2区間に22時から24時をセット
            $("#bc_second_hour_sta_" + target_date).val('22');
            $("#bc_second_min_sta_" + target_date).val('00');
            $("#bc_second_hour_end_" + target_date).val('24');
            $("#bc_second_min_end_" + target_date).val('00');
            $("#bc_second_hour_sta_" + target_date).prop('disabled',true);
            $("#bc_second_min_sta_" + target_date).prop('disabled',true);
            $("#bc_second_hour_end_" + target_date).prop('disabled',true);
            $("#bc_second_min_end_" + target_date).prop('disabled',true);
    
        }else{

            //前日が夜勤でなければ当該日の第1区間を22時から24時とする
            $("#bc_first_hour_sta_" + target_date).val('22');
            $("#bc_first_min_sta_" + target_date).val('00');
            $("#bc_first_hour_end_" + target_date).val('24');
            $("#bc_first_min_end_" + target_date).val('00');
            $("#bc_first_hour_sta_" + target_date).prop('disabled',true);
            $("#bc_first_min_sta_" + target_date).prop('disabled',true);
            $("#bc_first_hour_end_" + target_date).prop('disabled',true);
            $("#bc_first_min_end_" + target_date).prop('disabled',true);

        }

        //当該日の翌日の第1区間を0時から8時とする
        $("#bc_first_hour_sta_" + next_date).val('0');
        $("#bc_first_min_sta_" + next_date).val('00');
        $("#bc_first_hour_end_" + next_date).val('8');
        $("#bc_first_min_end_" + next_date).val('00');
        $("#bc_first_hour_sta_" + next_date).prop('disabled',true);
        $("#bc_first_min_sta_" + next_date).prop('disabled',true);
        $("#bc_first_hour_end_" + next_date).prop('disabled',true);
        $("#bc_first_min_end_" + next_date).prop('disabled',true);

        //当該日の翌日の休日および有休チェックを非活性に
        $("#holiday_" + next_date).prop('disabled',true);
        $("#paid_holiday_" + next_date).prop('disabled',true);
               
        //console.log(shift_data_ary);
    
    //夜勤解除時
    }else{

        //前日の夜勤フラグチェック
        if($("#midnight_" + before_date).prop("checked") == true){

            //前日が夜勤であれば、第2区間の22時から24時をリセット
            $("#bc_second_hour_sta_" + target_date).val('');
            $("#bc_second_min_sta_" + target_date).val('00');
            $("#bc_second_hour_end_" + target_date).val('');
            $("#bc_second_min_end_" + target_date).val('00');
            $("#bc_second_hour_sta_" + target_date).prop('disabled',false);
            $("#bc_second_min_sta_" + target_date).prop('disabled',false);
            $("#bc_second_hour_end_" + target_date).prop('disabled',false);
            $("#bc_second_min_end_" + target_date).prop('disabled',false);            

        }else{

            //前日が夜勤でなければ、当該日の第1区間をリセットする
            $("#bc_first_hour_sta_" + target_date).val('');
            $("#bc_first_min_sta_" + target_date).val('00');
            $("#bc_first_hour_end_" + target_date).val('');
            $("#bc_first_min_end_" + target_date).val('00');
            $("#bc_first_hour_sta_" + target_date).prop('disabled',false);
            $("#bc_first_min_sta_" + target_date).prop('disabled',false);
            $("#bc_first_hour_end_" + target_date).prop('disabled',false);
            $("#bc_first_min_end_" + target_date).prop('disabled',false);

        }

        //当該日の翌日の第1区間を0時から8時とする
        $("#bc_first_hour_sta_" + next_date).val('');
        $("#bc_first_min_sta_" + next_date).val('00');
        $("#bc_first_hour_end_" + next_date).val('');
        $("#bc_first_min_end_" + next_date).val('00');
        $("#bc_first_hour_sta_" + next_date).prop('disabled',false);
        $("#bc_first_min_sta_" + next_date).prop('disabled',false);
        $("#bc_first_hour_end_" + next_date).prop('disabled',false);
        $("#bc_first_min_end_" + next_date).prop('disabled',false);

        //当該日の翌日の休日および有休チェックを非活性に
        $("#holiday_" + next_date).prop('disabled',false);
        $("#paid_holiday_" + next_date).prop('disabled',false);
               
    }

});

function holiday_init(target_date,check_val){
    //チェックされたときは、時刻入力欄は非活性
    if(check_val == 1){
        $("#bc_first_hour_sta_" + target_date).val('');
        $("#bc_first_min_sta_" + target_date).val('00');
        $("#bc_first_hour_end_" + target_date).val('');
        $("#bc_first_min_end_" + target_date).val('00');
        $("#bc_second_hour_sta_" + target_date).val('');
        $("#bc_second_min_sta_" + target_date).val('00');
        $("#bc_second_hour_end_" + target_date).val('');
        $("#bc_second_min_end_" + target_date).val('00');
        $("#midnight_" + target_date).prop('checked',false);

        $("#bc_first_hour_sta_" + target_date).prop('disabled',true);
        $("#bc_first_min_sta_" + target_date).prop('disabled',true);
        $("#bc_first_hour_end_" + target_date).prop('disabled',true);
        $("#bc_first_min_end_" + target_date).prop('disabled',true);
        $("#bc_second_hour_sta_" + target_date).prop('disabled',true);
        $("#bc_second_min_sta_" + target_date).prop('disabled',true);
        $("#bc_second_hour_end_" + target_date).prop('disabled',true);
        $("#bc_second_min_end_" + target_date).prop('disabled',true);

    //チェック解除時は時刻入力欄を活性化させる
    }else if(check_val == 0){
        $("#bc_first_hour_sta_" + target_date).val('');
        $("#bc_first_min_sta_" + target_date).val('00');
        $("#bc_first_hour_end_" + target_date).val('');
        $("#bc_first_min_end_" + target_date).val('00');
        $("#bc_second_hour_sta_" + target_date).val('');
        $("#bc_second_min_sta_" + target_date).val('00');
        $("#bc_second_hour_end_" + target_date).val('');
        $("#bc_second_min_end_" + target_date).val('00');

        $("#bc_first_hour_sta_" + target_date).prop('disabled',false);
        $("#bc_first_min_sta_" + target_date).prop('disabled',false);
        $("#bc_first_hour_end_" + target_date).prop('disabled',false);
        $("#bc_first_min_end_" + target_date).prop('disabled',false);
        $("#bc_second_hour_sta_" + target_date).prop('disabled',false);
        $("#bc_second_min_sta_" + target_date).prop('disabled',false);
        $("#bc_second_hour_end_" + target_date).prop('disabled',false);
        $("#bc_second_min_end_" + target_date).prop('disabled',false);
    }
}

//メモ欄モーダル
$('#shift_by_user_memo').on('show.bs.modal', function (event) {

    //モーダルを取得
    var modal = $(this);
    
    var button = $(event.relatedTarget);
    var target_date = button.data('target-date');

    $("#shift_by_user_memo_target_date").val(target_date);
    
    //保存されているメモ情報をフォームに表示
    var memo = $("#tdbc_memo_gh" + target_date).val();
    modal.find('#hs_memo').val(memo);
  
});

//メモ情報保存（hiddenに保存)
$(document).on("click","#shift_by_user_memo_regist", function() {

    var target_date = $("#shift_by_user_memo_target_date").val();

    //入力されたメモ情報を取得
    var memo = $("#hs_memo").val();
    $("#tdbc_memo_gh" + target_date).val(memo);

    //メモ情報が空白ならアイコンを非表示
    if(memo != ""){
        $("#memo_icn_" + target_date).attr("src","../img/memo_act.png");
    }else{
        $("#memo_icn_" + target_date).attr("src","../img/memo.png");
    }
});

$('#shift_by_user_memo_regist').on('hidden.bs.modal', function (event) {
    $("#hs_memo").val("");

});

//フォームクリア
$(document).on("click","#graph_clear", function() {

	var tab_name = "";

	//現在のタブ名取得
	if(activated_tab === undefined){
		tab_name = "";
	}else{
		tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/before_confirm_by_user.php#" , "");
	}

	if(tab_name == "graph_show"){
		graph_clear();

	}else if(tab_name == "form_show" || tab_name == ""){
		form_clear();
	}

});

function graph_clear(){

	$("[id^=op-col]").removeClass("op_shift_holiday");
	$("[id^=op-col]").removeClass("op_shift_1");
	$("[id^=op-col]").text('');
	$("[id^=graph_holiday_set]").text('休日');
	$("[id^=graph_holiday_set]").val(0);
	$("[id^=graph_holiday_set]").removeClass("btn-danger");
	$("[id^=graph_holiday_set]").addClass("btn-primary");
	$("[id^=graph_paid_holiday_set]").text('有休');
	$("[id^=graph_paid_holiday_set]").val(0);
	$("[id^=graph_paid_holiday_set]").removeClass("btn-danger");
	$("[id^=graph_paid_holiday_set]").addClass("btn-primary");
	$("[id^=graph_midnight_set]").text('夜勤');
	$("[id^=graph_midnight_set]").val(0);
	$("[id^=graph_midnight_set]").removeClass("btn-danger");
	$("[id^=graph_midnight_set]").addClass("btn-primary");
	$("[id^=memo_icn]").css('display',"none");
	$("[id^=hope_shift_memo]").val('');
	$("[id^=tdbc_update_date_gh]").val('');

}

function form_clear(){

	$("[id^=first_hope_hour_sta").val("");
	$("[id^=first_hope_min_sta").val(0);
	$("[id^=first_hope_hour_end").val("");
	$("[id^=first_hope_min_end").val(0);
	$("[id^=second_hope_hour_sta").val("");
	$("[id^=second_hope_min_sta").val(0);
	$("[id^=second_hope_hour_end").val("");
	$("[id^=second_hope_min_end").val(0);
	$("[id^=midnight").prop('checked', false);
	$("[id^=holiday").prop('checked', false);
	$("[id^=paid_holiday").prop('checked', false);
	$("[id^=memo").val("");
	$("[id^=tdbc_update_date_").val("");
}

//全タブデータクリア
function all_tab_clear(){
	graph_clear();
	form_clear();
}


//表示ボタン押下
$(document).on("click","#show_list", function() {
    by_user_kensaku();
});

//日付リンク押下
$(document).on("click",".shift_by_user_gh", function() {
    var showen_date =  $(this).data('target-date-gh');
    var section_sta = $("#section_sta").val();
    var section_end = $("#section_end").val();
    var url = "before_confirm_by_date.php";
    var param_ary = new Object();
    param_ary['showen_date'] = showen_date;
    param_ary['section_sta'] = section_sta;
    param_ary['section_end'] = section_end;
    
    post(url,param_ary);
});

$(document).on("click",".shift_by_user_fm", function() {
    var showen_date =  $(this).data('target-date-fm');
    
    var section_sta = $("#section_sta").val();
    var section_end = $("#section_end").val();
    //var url = "before_confirm_by_date.php";
    var url = "tsr_shift_by_date.php";
    var param_ary = new Object();
    param_ary['showen_date'] = showen_date;
    param_ary['section_sta'] = section_sta;
    param_ary['section_end'] = section_end;
    
    post(url,param_ary);
    
});

//グラフの区間チェック
//3回勤務はNGとする
function chk_section_graph(){

	//期間の始端
	var section_sta = $("#section_sta").val();
    //期間の終端
	var section_end = $("#section_end").val();

	var current_section_date = section_sta;

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

		//0時のシフトで色の変化回数の制御を分ける
		var zero_hour_class = "";
		zero_hour_class = $("#op-col00_" + current_section_date).attr("class"); 
		//制御回数
		var limit_cnt = 0;

		var current_class_name = "";
		var change_cnt = 0;

		for(let i = 0; i < 24; i++){
			var class_name = $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).attr("class"); 
			if(class_name === undefined){
				class_name = "";
			}
			if(current_class_name != class_name){
				change_cnt ++;
			}

			if(change_cnt > 5){
				return false;
			}

			current_class_name = class_name;

		}

		//日にちを1日加える
		current_section_date = date_s.setDate(date_s.getDate() + 1);

	}

	return true;

}

function chk_section_form(){

	//期間の始端
	var section_sta = $("#section_sta").val();
    //期間の終端
	var section_end = $("#section_end").val();

	var current_section_date = section_sta;

	//エラーフラグ
	var err_form_depli = 0;
	var err_validate_mes = "";

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		//console.log("date_s:" + date_s);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

		//重複チェック
		if(chk_time(current_section_date) == false){
			err_form_depli = 1;
		}

		//半角数字チェック
		//第1区間
		var first_hour_sta = $("#bc_first_hour_sta_" + current_section_date).val();
		var first_hour_end = $("#bc_first_hour_end_" + current_section_date).val();

		//第2区間
		var second_hour_sta = $("#bc_second_hour_sta_" + current_section_date).val();
		var second_hour_end = $("#bc_second_hour_end_" + current_section_date).val();

		if(first_hour_sta != "") {
			if(isNumber(first_hour_sta) == false){
				err_validate_mes = err_validate_mes + current_section_date + "の第1区間の開始時刻の入力値が不正です" + "\n";
			}else{
				if(Number(first_hour_sta) > 24){
					err_validate_mes = err_validate_mes + current_section_date + "の第1区間の開始時刻の入力値が不正です!" + "\n";
				}
			}
		}

		if(first_hour_end != ""){
		if(isNumber(first_hour_end) == false){
				err_validate_mes = err_validate_mes + current_section_date + "の第1区間の終了時刻の入力値が不正です" + "\n";
			}else{
				if(Number(first_hour_end) > 24){
					err_validate_mes = err_validate_mes + current_section_date + "の第1区間の終了時刻の入力値が不正です!" + "\n";
				}
			}
		}

		if(second_hour_sta != ""){
			if(isNumber(second_hour_sta) == false){
				err_validate_mes = err_validate_mes + current_section_date + "の第2区間の入力値が不正です" + "\n";
			}else{
				if(Number(second_hour_sta) > 24){
					err_validate_mes = err_validate_mes + current_section_date + "の第2区間の入力値が不正です" + "\n";
				}
			}
		}

		if(second_hour_end != ""){
			if(isNumber(second_hour_end) == false){
			err_validate_mes = err_validate_mes + current_section_date + "の第2区間の入力値が不正です" + "\n";
			}else{
				if(Number(second_hour_end) > 24){
					err_validate_mes = err_validate_mes + current_section_date + "の第2区間の入力値が不正です" + "\n";
				}
			}
		}

		//次の日付へ移動
		current_section_date = date_s.setDate(date_s.getDate() + 1);

	}

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
function chk_time(target_date){

    if($("#bc_first_hour_sta_" + target_date).val() == ""){
        return true;
    }
    if($("#bc_first_hour_end_" + target_date).val() == "" ){
        return true;
    }
    //第2区間が全てブランクならばチェック対象外
    if($("#bc_second_hour_sta_" + target_date).val() == "" &&  $("#bc_second_hour_end_" + target_date).val() == "" ){
        return true;
    }
    
    //まず第1区間を配列に入れる
    var first_hour_sta = String(zeroPadding($("#bc_first_hour_sta_" + target_date).val(),2));
    var first_min_sta = String(zeroPadding($("#bc_first_min_sta_" + target_date).val(),2));
    var first_hour_end = String(zeroPadding($("#bc_first_hour_end_" + target_date).val(),2));
    var first_min_end = String(zeroPadding($("#bc_first_min_end_" + target_date).val(),2));

    //第2区間のシフトを配列に入れる
    var second_hour_sta = String(zeroPadding($("#bc_second_hour_sta_" + target_date).val(),2));
    var second_min_sta = String(zeroPadding($("#bc_second_min_sta_" + target_date).val(),2));
    var second_hour_end = String(zeroPadding($("#bc_second_hour_end_" + target_date).val(),2));
    var second_min_end = String(zeroPadding($("#bc_second_min_end_" + target_date).val(),2));

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
		tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/tsr_shift_by_user.php#" , "");
	}

    //console.log(tab_name);
	//フォーム⇒グラフへのタブ遷移
	if(tab_name == 'graph_show'){
        //save_before_confirm_for_form_by_user();
        save_tsr_shift_for_graph_by_user();
        set_tsr_shift_for_graph_by_user();
	//グラフ⇒フォームへのタブ遷移
	}else if(tab_name == 'form_show'){
        // /save_before_confirm_for_graph_by_user();
        save_tsr_shift_for_form_by_user();
		set_form_by_user();
	}else if(tab_name == ""){
		save_tsr_shift_for_form_by_user();
	}
    
    console.log(shift_data_ary);
	//対象OPID
	var tmur_user_id = $("#tmur_user_id").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/tsr_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'tsr_shift_regist_by_user',
						'token'       : $("#csrf_token").val(),
						'tmur_user_id':tmur_user_id,
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