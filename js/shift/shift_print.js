//表示用json
var json;
//シフト保存用配列
let shift_data_ary = new Object();
//業務別カラー情報
let business_color_ary = new Object();
//業務振分情報
let business_assign_ary = new Object();
//合計人数カウント用配列
let shift_count_by_time = new Object();
var activated_tab; // 現在のタブ
var previous_tab; // 以前のタブ

/**印刷用css */
var print_css;


/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
//$(window).on('load', business_shift_kensaku);
$(window).on('load', business_shift_kensaku);

//日付変更時イベント
$(document).on("change","#showen_date", function() {
    //business_shift_kensaku();
    business_shift_kensaku();
});

//業務別カラーをcssへ登録する
function init_business_color(){

    //業務別カラーを取得
	$.ajax({
		type:          'post',
		url:		   "../api/shift/business_assign_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
        async:false,
		scriptCharset: 'utf-8',
		data:          {
						'action'	      : 'get_business_color'
						},
		
		// 200 OK
		success: function(json_data) {   
            //console.log(json_data);
            business_color_ary = json_data;
            var style = document.createElement("style");
            document.head.appendChild( style );
        
            var sheet = style.sheet;
            Object.keys(json_data).forEach(function(key) {
                var css_str = "";
                css_str += '.business_color' + json_data[key]['tmbc_business_id'] + ' {';
                css_str += 'background-color: ' + json_data[key]['tmbc_color_code'] + ';}';
                sheet.insertRule( css_str, key );
                print_css = print_css + css_str;
            })
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

function business_shift_kensaku(){

    //業務別カラーcss作成
    init_business_color();
    //console.log(business_color_ary);
    //人数保存用配列初期化
    //init_shift_count_ary();
	//期間の始端と終端  
	var shown_date = $("#showen_date").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/tsr_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
        async:false,
		data:          {
						'action'	      : 'summary_by_date',
						'showen_date'	  : shown_date
						},
		
		// 200 OK
		success: function(json_data) {   

			shift_data_ary = json_data;
            //console.log(json_data);
            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                paging_graph();
                set_graph_by_date();
                set_business_color();

                save_file();
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

//グラフ描写処理
function paging_graph(){
	//テーブルの内容を削除
	$('#maintable').empty();
    var shift_date = $("#showen_date").val();
    let contant = '';
    var last_key = 0;
    //合計人数表示"business_color" + input_val
    Object.keys(business_color_ary).forEach(function(key2) {
        contant += '<tr class="by_date_shift_height">';
        contant += '<td class="form_v_middle business_color' + business_color_ary[key2]['tmbc_business_id'] + '">' + business_color_ary[key2]['tmbc_business_name'] + ' 合計</td>';
        contant += '<td id="total_00_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_01_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_02_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_03_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_04_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_05_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_06_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_07_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_08_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_09_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_10_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_11_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_12_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_13_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_14_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_15_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_16_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_17_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_18_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_19_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_20_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_21_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_22_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_23_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '</tr>';
        //last_key = business_color_ary[key2]['tmbc_business_id'];
    })		

    Object.keys(shift_data_ary).forEach(function(key) {
        contant += '<tr class="by_date_shift_height">';
        contant += '<td class="form_v_middle"><a href="#" class="shift_by_user" data-userid="' + shift_data_ary[key]['tdbc_user_id'] + '">' + shift_data_ary[key]['tdbc_user_id'] + '：' + shift_data_ary[key]['tmur_user_name'] + '</a>';
        contant += '</td>';
        contant += '<td contenteditable="false" id="op-col00_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="0" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col01_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="1" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col02_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="2" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col03_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="3" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col04_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="4" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col05_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="5" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col06_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="6" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col07_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="7" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col08_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="8" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col09_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="9" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col10_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="10" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col11_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="11" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col12_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="12" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col13_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="13" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col14_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="14" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col15_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="15" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col16_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="16" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col17_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="17" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col18_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="18" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col19_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="19" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col20_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="20" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col21_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="21" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col22_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="22" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col23_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="23" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<input type="hidden" value="' + shift_data_ary[key]['tdbc_memo'] + '" id="tdbc_memo_' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-userid="' + shift_data_ary[key]['tdbc_user_id']  + '">';
        //前日夜勤フラグ（hiddenに保存）
        contant += '<input type="hidden" value="' + shift_data_ary[key]['yesterday_midnight_flg'] + '" id="yesterday_midnight_flg_' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-userid="' + shift_data_ary[key]['tdbc_user_id']  + '">';
        contant += '</td>';
    })		
    
    $('#maintable').html(contant);

}

//contenteditable改行禁止処理
/*
$(document).on("input keydown keyup keypress change","[id^=op-col]", function(e){
		
    // 改行の入力を禁止
    if (e.which == 13) {
        return false;
    }
   
    // 改行のペーストを禁止
    var txt = $(this).text();
    var replace2 = txt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
    $(this).text(replace2);

})
*/

function set_graph_by_date(){

    Object.keys(shift_data_ary).forEach(function(key) {

        var start_time_first = shift_data_ary[key]['tdbc_start_time_first'];
        var end_time_first = shift_data_ary[key]['tdbc_end_time_first'];
        var start_time_second = shift_data_ary[key]['tdbc_start_time_second'];
        var end_time_second = shift_data_ary[key]['tdbc_end_time_second'];
        var midnight = shift_data_ary[key]['tdbc_midnight_flg'];
        var holiday = shift_data_ary[key]['tdbc_holiday_flg'];
        var paid_holiday = shift_data_ary[key]['tdbc_paid_holiday_flg'];
        var memo = shift_data_ary[key]['tdbc_memo'];
        var yesterday_midnight_flg = shift_data_ary[key]['yesterday_midnight_flg'];
        
        //メモ情報の反映
        $("#tdbc_memo_" + shift_data_ary[key]['tdbc_user_id']).val(memo);
        if(memo != ""){
            $("#memo_icn_" + shift_data_ary[key]['tdbc_user_id']).attr("src","../img/memo_act.png");
        }else{
            $("#memo_icn_" + shift_data_ary[key]['tdbc_user_id']).attr("src","../img/memo.png");
        }
            
        //前日が夜勤のときは、0時から7時のセルを黄色にする
        if(yesterday_midnight_flg == 1){
            for (let i = 0; i < 8; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).addClass("op_shift_1");
                //$("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).attr("contenteditable","true");
            }
        }

        //休日設定（当該日のすべてのセルを休日色に）
        if(holiday == true || paid_holiday == true){

            for (let i = 0; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).removeClass("op_shift_1");
                $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).addClass("op_shift_holiday");
            }
            //休日ボタンを変更
			$("#graph_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).val(1);
			$("#graph_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).text('解除');
            $("#graph_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).removeClass("btn-primary");
            $("#graph_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).addClass("btn-danger");
            //さらに有休設定されているときは、有休ボタンも変更
            if(paid_holiday == true){
                $("#graph_paid_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).val(1);
                $("#graph_paid_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).text('解除');
                $("#graph_paid_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).removeClass("btn-primary");
                $("#graph_paid_holiday_set_" + shift_data_ary[key]['tdbc_user_id']).addClass("btn-danger");
            }

            return;
        }       
        
        //夜勤フラグ（当該日の22時と23時のセルのみ黄色にし、当該日の翌日の0時～7時のセルを黄色にする）
        if(midnight == true){
            for (let i = 22; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).addClass("op_shift_1");
                //$("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).attr("contenteditable","true");
            }
			$("#graph_midnight_set_" + shift_data_ary[key]['tdbc_user_id']).val(1);
			$("#graph_midnight_set_" + shift_data_ary[key]['tdbc_user_id']).text('解除');
            $("#graph_midnight_set_" + shift_data_ary[key]['tdbc_user_id']).removeClass("btn-primary");
            $("#graph_midnight_set_" + shift_data_ary[key]['tdbc_user_id']).addClass("btn-danger");
            
            return;

        }

        //第1区間の始端と終端がセットされていなければ当該日の処理終了
        if(start_time_first == "" || end_time_first == ""){
            return;
        }else{
            //第2区間がセットされていなければ、第1区間の情報のみグラフ表示
            if(start_time_second == "" || end_time_second == ""){
                set_shift_color(start_time_first,end_time_first,shift_data_ary[key]['tdbc_user_id']);
                return;
            }else{
                //第1区間のセット
                set_shift_color(start_time_first,end_time_first,shift_data_ary[key]['tdbc_user_id']);
                //第2区間のセット
                set_shift_color(start_time_second,end_time_second,shift_data_ary[key]['tdbc_user_id']);               
                return;
            }
        }
        
    })
    
    //set_total();
}

function set_shift_color(start_time,end_time,target_id){

    if(String(start_time).length == 4 && String(end_time).length == 4){

        var start_hour = String(start_time).substring(0,2);
        var start_min = String(start_time).substring(2);
        var end_hour = String(end_time).substring(0,2);
        var end_min = String(end_time).substring(2);

        for (let i = start_hour; i < end_hour; i++){
            $("#op-col" + zeroPadding(i,2) + "_" + target_id).addClass("op_shift_1");
            //$("#op-col" + zeroPadding(i,2) + "_" + target_id).attr("contenteditable","true");
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

function set_business_color(){

	//期間の始端と終端  
	var shown_date = $("#showen_date").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/business_assign_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
        async:false,
		data:          {
						'action'	      : 'business_summary',
						'showen_date'	  : shown_date
						},
		
		// 200 OK
		success: function(json_data) {   

			//shift_data_ary = json_data;
            //console.log(json_data);
            business_assign_ary = json_data;
            shift_count_by_time = json_data['color_info'];
            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                
                //データ表示描写用HTML生成	
                Object.keys(business_assign_ary).forEach(function(key) {

                    var w_bisiness_ary = json_data[key];
                    //console.log(w_bisiness_ary);

                    Object.keys(w_bisiness_ary).forEach(function(key2) {
                        
                        //色情報が保存されていないとき
                        if(w_bisiness_ary[key2]['tdsb_shift_hour'] == ""){
                            
                            if(w_bisiness_ary[key2]['tdsb_business_id'] == "" && w_bisiness_ary[key2]['tmur_authority'] == 2){

                                for(i = 0; i < 24; i++){
                                    //クラス名を見て、色付き（黄色）のセルは優先業務の色をセットする
                                    var class_name = $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr("class");
                                    if(class_name.indexOf('op_shift_1') > -1){
                                        $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("business_color" + w_bisiness_ary[key2]['business_enable_priority']);  
                                        $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-bcno',w_bisiness_ary[key2]['business_enable_priority']);       
                                        $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text(w_bisiness_ary[key2]['business_enable_priority']);       
                                    }

                                }

                            }
                            
                            return;

                        //色情報が保存されているとき
                        }else{

                            //休憩フラグのとき
                            if(w_bisiness_ary[key2]['tdsb_rest_flg'] == 1){

                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text("休憩");  
                                //セル色は黄色
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).removeClass();
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("bc_text");
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("op_shift_1");
                                
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).css('font-size','15px');

                            //研修フラグ
                            }else if(w_bisiness_ary[key2]['tdsb_training_flg'] == 1){
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text("研修");  
                                //セルに色をつける
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).removeClass("op_shift_1");  
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("business_color" + w_bisiness_ary[key2]['tdsb_business_id']);  
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-bcno',w_bisiness_ary[key2]['tdsb_business_id']);       
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).css('font-size','15px');
                            }else{

                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).removeClass(function(index, className) {
                                    return (className.match(/\bbusiness_color\S+/g) || []).join(' ');
                                });
    
                                //セルに色をつける
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).removeClass("op_shift_1");  
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("business_color" + w_bisiness_ary[key2]['tdsb_business_id']);  
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-bcno',w_bisiness_ary[key2]['tdsb_business_id']);       
                                
                                //自由記述欄に文言がセットされているときは、こちらを優先させる
                                var free_description = w_bisiness_ary[key2]['tdsb_free_description'];
                                //console.log(free_description);
                                if(free_description === undefined){
                                    free_description = "";
                                }
    
                                if(free_description == ""){
                                    //console.log(w_bisiness_ary[key2]['tdsb_user_id']);
                                    //console.log(w_bisiness_ary[key2]['tdsb_business_id']);
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text(w_bisiness_ary[key2]['tdsb_business_id']);  
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).css('font-size','');  
                                }else{
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text(free_description);  
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).css('font-size','17px');  
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-free-des',free_description);
                                }
    

                            }


                        }

                    })// end of foreach()
                    /*
                    if(key != "color_info"){

                        if(business_assign_ary[key][0]['tmur_authority'] == 2){
                            
                            for(i = 0; i < 24; i++){
                                
                                //クラス名を見て、色付き（黄色）のセルは優先業務の色をセットする
                                var class_name = $("#op-col" + zeroPadding(i,2) + "_" + key).attr("class");
                                if(class_name.indexOf('op_shift_1') > -1){
                                    $("#op-col" + zeroPadding(i,2) + "_" + key).addClass("business_color" + business_assign_ary[key][0]['business_enable_priority']);
                                    $("#op-col" + zeroPadding(i,2) + "_" + key).attr('data-bcno',business_assign_ary[key][0]['business_enable_priority']);
                                    $("#op-col" + zeroPadding(i,2) + "_" + key).text(business_assign_ary[key][0]['business_enable_priority']);
                                }
                                
                            }
                            
                        }
                    }
                    */
                })//end of foreach()

            }

            disp_total();
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
//業務別合計表示処理
function disp_total(){

    Object.keys(shift_count_by_time).forEach(function(key) {
        var w_per_time = shift_count_by_time[key];
        Object.keys(w_per_time).forEach(function(key2) {
            $("#total_" + zeroPadding(key2,2) + "_bno_" + key).text(w_per_time[key2]);
        })	
    })	

}

//業務カラーセット
$(document).on("blur","[id^=op-col]", function() {
    //入力前の業務番号
    var before_business_no = $(this).data('bcno');
    //入力された業務番号
    var input_val = $(this).text();
    //入力された場所時間
    var tdsb_shift_hour =  $(this).data('hour');
    //対象ユーザータイプ
    var user_type = $(this).data('usertype');
    //未登録入力チェックフラグ
    var chk_flg = 0;

    if(input_val == ""){
        return false;
    }

    Object.keys(business_color_ary).forEach(function(key2) {
        if(input_val == business_color_ary[key2]['tmbc_business_id']){
            chk_flg = 1;
        }
    })

    if(chk_flg == 0){
        alert("入力された業務番号は、未登録の番号です");
        $(this).text("");
        $(this).attr('data-bcno','');
        return false; 
    }

    $(this).removeClass(function(index, className) {
        return (className.match(/\bbusiness_color\S+/g) || []).join(' ');
    });
    $(this).addClass("business_color" + input_val);  

    //合計集計用配列に保存
    if(user_type == 1){
        if(before_business_no != ""){
            shift_count_by_time[before_business_no][tdsb_shift_hour] = shift_count_by_time[before_business_no][tdsb_shift_hour] - 1;
        }
        shift_count_by_time[input_val][tdsb_shift_hour] = shift_count_by_time[input_val][tdsb_shift_hour] + 1;
    }
    disp_total();
});

function save_file(){

    //日付
    var target_date = $("#showen_date").val();

    $.ajax({
		type:          'post',
		url:		   "../shift/shift_print.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						'action'                   : 'shift_print',
                        'target_date'              : target_date,
                        'shift_count_by_time'      : JSON.stringify(shift_count_by_time),
						'business_assign_ary'      : JSON.stringify(business_assign_ary),
						'shift_data_ary'           : JSON.stringify(shift_data_ary)
						},	

		// 200 OK
		success: function(json_data) {   
            if(json_data == "ok"){
                alert("OK");
                //ファイル名を格納
                
            }else if(json_data == "ng"){
                alert("NG");
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

//印刷アクション
/*
$(document).on("click","#shift_print", function() {

    //日付
    var target_date = $("#showen_date").val();

    $.ajax({
		type:          'post',
		url:		   "../shift/shift_print.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						'action'                   : 'shift_print',
                        'target_date'              : target_date,
                        'shift_count_by_time'      : JSON.stringify(shift_count_by_time),
						'business_assign_ary'      : JSON.stringify(business_assign_ary),
						'shift_data_ary'           : JSON.stringify(shift_data_ary)
						},	

		// 200 OK
		success: function(json_data) {   
            if(json_data == "ok"){
                alert("OK");
            }else if(json_data == "ng"){
                alert("NG");
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
*/
//印刷用HTML作成
function make_shift_html(){
    let contant = '';
    contant += '<table>';
    contant += '<thead>';
    contant += '<tr>';
    contant += '<th>氏名</th>';
    contant += '<th>0</th>';
    contant += '<th>1</th>';
    contant += '<th>2</th>';
    contant += '<th>3</th>';
    contant += '<th>4</th>';
    contant += '<th>5</th>';
    contant += '<th>6</th>';
    contant += '<th>7</th>';
    contant += '<th>8</th>';
    contant += '<th>9</th>';
    contant += '<th>10</th>';
    contant += '<th>11</th>';
    contant += '<th>12</th>';
    contant += '<th>13</th>';
    contant += '<th>14</th>';
    contant += '<th>15</th>';
    contant += '<th>16</th>';
    contant += '<th>17</th>';
    contant += '<th>18</th>';
    contant += '<th>19</th>';
    contant += '<th>20</th>';
    contant += '<th>21</th>';
    contant += '<th>22</th>';
    contant += '<th>23</th>';
    contant += '</tr>';
    contant += '</thead>';
    

    Object.keys(shift_data_ary).forEach(function(key) {

        if(shift_data_ary[key]['tdbc_holiday_flg'] != 1){
            contant += '<tr class="by_date_shift_height">';
            contant += '<td class="form_v_middle"><a href="#" class="shift_by_user" data-userid="' + shift_data_ary[key]['tdbc_user_id'] + '">' + shift_data_ary[key]['tdbc_user_id'] + '：' + shift_data_ary[key]['tmur_user_name'] + '</a>';
            contant += '</td>';
            contant += '<td contenteditable="false" id="op-col00_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="0" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col01_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="1" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col02_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="2" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col03_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="3" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col04_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="4" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col05_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="5" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col06_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="6" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col07_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="7" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col08_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="8" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col09_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="9" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col10_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="10" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col11_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="11" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col12_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="12" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col13_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="13" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col14_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="14" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col15_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="15" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col16_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="16" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col17_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="17" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col18_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="18" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col19_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="19" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col20_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="20" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col21_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="21" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col22_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="22" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '<td contenteditable="false" id="op-col23_' + shift_data_ary[key]['tdbc_user_id'] + '" data-min="00" data-hour="23" data-bcno="" class="bc_text" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
            contant += '</td>';
            contant += '</tr>';
        }
    })		

    //合計人数表示"business_color" + input_val
    Object.keys(business_color_ary).forEach(function(key2) {
        contant += '<tr class="by_date_shift_height">';
        contant += '<td class="form_v_middle business_color' + business_color_ary[key2]['tmbc_business_id'] + '">' + business_color_ary[key2]['tmbc_business_name'] + ' 合計</td>';
        contant += '<td id="total_00_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_01_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_02_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_03_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_04_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_05_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_06_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_07_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_08_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_09_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_10_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_11_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_12_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_13_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_14_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_15_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_16_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_17_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_18_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_19_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_20_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_21_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_22_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '<td id="total_23_bno_' + business_color_ary[key2]['tmbc_business_id'] + '" class="by_date_shift_total_cell"></td>';
        contant += '</tr>';
        //last_key = business_color_ary[key2]['tmbc_business_id'];
    })		
    contant += '</table>';
    return contant;
}