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
//コピーデータ
var copy_data;
var copy_free_des;
var copy_rest_flg;
var copy_training_flg;
//ペーストフラグ
var paste_flg;

var beforeData = "";

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
        contant += '<td class="form_v_middle business_color' + business_color_ary[key2]['tmbc_business_id'] + '" data-bcno="' + business_color_ary[key2]['tmbc_business_id'] + '" id="selected_color_' + business_color_ary[key2]['tmbc_business_id'] + '">' + business_color_ary[key2]['tmbc_business_name'] + ' 合計</td>';
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

    $('#maintable').html(contant);

    contant = "";
    $('#maintable_b').empty();
    Object.keys(shift_data_ary).forEach(function(key) {
        contant += '<tr class="by_date_shift_height">';
        contant += '<td class="form_v_middle"><a href="#" class="shift_by_user" data-userid="' + shift_data_ary[key]['tdbc_user_id'] + '">' + shift_data_ary[key]['tdbc_user_id'] + '：' + shift_data_ary[key]['tmur_user_name'] + '</a>';
        contant += '</td>';
        contant += '<td contenteditable="false" id="op-col00_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="00" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col01_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="01" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col02_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="02" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col03_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="03" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col04_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="04" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col05_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="05" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col06_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="06" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col07_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="07" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col08_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="08" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col09_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="09" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col10_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="10" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col11_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="11" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col12_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="12" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col13_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="13" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col14_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="14" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col15_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="15" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col16_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="16" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col17_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="17" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col18_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="18" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col19_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="19" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col20_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="20" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col21_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="21" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col22_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="22" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<td contenteditable="false" id="op-col23_' + shift_data_ary[key]['tdbc_user_id'] + '" data-opid="' + shift_data_ary[key]['tdbc_user_id'] + '" data-hour="23" data-min="00" data-bcno="" data-free-des="" data-rest-flg="0" data-training-flg="0" class="bc_text" data-update-time="" data-usertype="' + shift_data_ary[key]['user_type'] + '"></td>';
        contant += '<input type="hidden" value="' + shift_data_ary[key]['tdbc_memo'] + '" id="tdbc_memo_' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-userid="' + shift_data_ary[key]['tdbc_user_id']  + '">';
        //前日夜勤フラグ（hiddenに保存）
        contant += '<input type="hidden" value="' + shift_data_ary[key]['yesterday_midnight_flg'] + '" id="yesterday_midnight_flg_' + shift_data_ary[key]['tdbc_user_id'] + '" data-target-userid="' + shift_data_ary[key]['tdbc_user_id']  + '">';
        contant += '</td>';
    })		
    
    $('#maintable_b').html(contant);

}

//自治体取り込み
/*
$(document).on("click","#lg_import", function() {
    console.log("hogehoge");




});
*/

//合計人数非表示処理
$("#total_area_show").on('change', function(){

    //非表示にチェック
    if($(this).prop('checked')){
        $(".total_area").css('display','none');
    }else{
        $(".total_area").css('display','block');
    }

});

$(document).on("click","[id^=op-col]", function(e){

    var target_hour = $(this).attr("data-hour");
    var target_opid = $(this).attr("data-opid");
    //console.log(target_hour);
	//console.log(target_opid);
    console.log(/(^|\s)business_color\S*/g.test($(this).prop('class')));


    if(/(^|\s)business_color\S*/g.test($(this).prop('class')) == true){
        console.log("色付きセル");

    }


})

$("[id^=selected_color_]").on('click', function(){

    console.log("hoge");

});


//contenteditable改行禁止処理
$(document).on("input keydown keyup keypress change","[id^=op-col]", function(e){
//$(document).on("input  keyup  change","[id^=op-col]", function(e){
    console.log(e.type);
	console.log($(this).text());
	//console.log("keycode:"+e.which);

    //入力前の値を取得しておく
    var before_data = "";
    if(e.type == "keydown"){
        before_data = $(this).text();
    }

    // 改行の入力を禁止
    if (e.which == 13) {
        return false;
    }
    //全角文字の入力を禁止
    if (e.which == 229) {
        $(this).text(before_data);
        $(this).text("");
        return false;
    }

    if (e.which == 46 || e.which == 8) {
        $(this).text("");
        return false;
    }

    if (e.which == 0) {
        return false;
    }
   
    // 改行のペーストを禁止
    var txt = $(this).text();
    var replace2 = txt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
    $(this).text(replace2);

    //キャレットを文末に移動させる
    const selection = window.getSelection();
    const range = document.createRange();
    const offset = this.innerText.length;
    range.setStart(this.firstChild, offset);
    range.setEnd(this.firstChild, offset);
    selection.removeAllRanges();
    selection.addRange(range);


})

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
                //$("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).addClass("business_color0");
                //$("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).text("0");                
                $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).attr("contenteditable","true");
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
                //$("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).addClass("business_color0");
                //$("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).text("0");
                $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).attr("contenteditable","true");
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
            //$("#op-col" + zeroPadding(i,2) + "_" + target_id).addClass("business_color0");
            //$("#op-col" + zeroPadding(i,2) + "_" + target_id).text("0");
            $("#op-col" + zeroPadding(i,2) + "_" + target_id).attr("contenteditable","true");
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
                    console.log(w_bisiness_ary);

                    Object.keys(w_bisiness_ary).forEach(function(key2) {
                        
                        //色情報が保存されていないとき
                        if(w_bisiness_ary[key2]['tdsb_shift_hour'] == ""){
                            
                            if(w_bisiness_ary[key2]['tdsb_business_id'] == "" && w_bisiness_ary[key2]['tmur_authority'] == 2){

                                for(i = 0; i < 24; i++){
                                    //クラス名を見て、色付き（黄色）のセルは優先業務の色をセットする
                                    var class_name = $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr("class");
                                    if(class_name.indexOf('op_shift_1') > -1){

                                        //優先業務が設定されているとき
                                        if(w_bisiness_ary[key2]['business_enable_priority'] != ""){
                                            $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("business_color" + w_bisiness_ary[key2]['business_enable_priority']);  
                                            $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-bcno',w_bisiness_ary[key2]['business_enable_priority']);       
                                            $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text(w_bisiness_ary[key2]['business_enable_priority']);          
                                        //優先業務が設定されていないとき
                                        }else{
                                            //色は業務未設定の色にする（0）
                                            $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("business_color0" );  
                                            $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-bcno',0);       
                                            $("#op-col" + zeroPadding(i,2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text(0);       
    
                                        }

                                    }

                                }

                            }
                            
                            return;

                        //色情報が保存されているとき
                        }else{

                            //色付けセルになっているかの判定
                            //console.log(w_bisiness_ary[key2]['tdsb_user_id']);
                            //console.log($("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).hasClass("[class$='business_color']"));

                            //休憩フラグのとき
                            if(w_bisiness_ary[key2]['tdsb_rest_flg'] == 1){

                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text("休憩");  
                                //セル色は黄色
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).removeClass();
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("bc_text");
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("op_shift_1");
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr("data-rest-flg",1);
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).css('font-size','15px');

                            //研修フラグ
                            }else if(w_bisiness_ary[key2]['tdsb_training_flg'] == 1){

                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).text("研修");  
                                //セルに色をつける
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).removeClass("op_shift_1");  
                                if(w_bisiness_ary[key2]['tdsb_business_id'] != ""){
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("business_color" + w_bisiness_ary[key2]['tdsb_business_id']);  
                                }else{
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).removeClass();
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("bc_text");
                                    $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("op_shift_1");
                                }
                                //$("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).addClass("business_color" + w_bisiness_ary[key2]['tdsb_business_id']);  
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-bcno',w_bisiness_ary[key2]['tdsb_business_id']);       
                                $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr("data-training-flg",1);
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

                            //最終更新日
                            $("#op-col" + zeroPadding(w_bisiness_ary[key2]['tdsb_shift_hour'],2) + "_" + w_bisiness_ary[key2]['tdsb_user_id']).attr('data-update-time',w_bisiness_ary[key2]['tdsb_update_date']);
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
    //console.log("blur");
    //入力前の業務番号
    //var before_business_no = $(this).data('bcno');
    var before_business_no = $(this).attr('data-bcno');
    //console.log("before_business_no:" + before_business_no);
    //入力前の自由記述欄 
    //var before_free_des = $(this).data('free-des'); 
    var before_free_des = $(this).attr('data-free-des');
    //console.log("before_free_des:" + before_free_des);
    //入力された業務番号
    var input_val = $(this).text();
    //console.log("input_val:" + input_val);
    //入力された場所時間
    var tdsb_shift_hour =  $(this).data('hour');
    //対象ユーザータイプ
    var user_type = $(this).data('usertype');
    //未登録入力チェックフラグ
    var chk_flg = 0;

    //データ未入力のときは、黄色セルにして処理終了
    if(input_val == "" && before_free_des ==""){
        $(this).removeClass();
        $(this).addClass("bc_text");
        $(this).addClass("op_shift_1");
        $(this).text("");
        $(this).attr('data-bcno',input_val);
        return false;
    }

    //休憩や研修も処理終了
    if($(this).attr('data-rest-flg') == 1 || $(this).attr('data-training-flg') == 1){
        return false;
    }

    //自由記述欄はリセットする
    //$(this).attr('data-free-des','');
    //$(this).css('font-size','');

    //業務番号がマスタ登録されているものかどうかのチェック
    //ただし、自由記述欄に文言がセットされているときはスルー
    //console.log($(this).attr('data-free-des'));
    Object.keys(business_color_ary).forEach(function(key2) {
        if(input_val == business_color_ary[key2]['tmbc_business_id']){
            chk_flg = 1;
        }
    })

    //console.log(chk_flg);
    //登録外の番号が入力されたとき
    if(chk_flg == 0){

        //自由記述欄に文言がセットされているときはスキップする
        var data_free_des = $(this).attr('data-free-des');
        //if(data_free_des == "" || input_val == ""){
        if(before_free_des == "" || input_val == ""){

            if(input_val == ""){
                //alert("業務番号が入力されていません");
            }else{
                if(before_free_des != ""){
                    alert("入力された業務番号は、未登録の番号です");
                }
            }

            //console.log(input_val);
            //$(this).attr('data-bcno',before_business_no);
            $(this).attr('data-bcno',before_business_no);
            $(this).attr('data-free-des',before_free_des);

            if(before_free_des == ""){
                $(this).text(before_business_no);
            }else{
                $(this).text(before_free_des);
                $(this).css('font-size','17px');
            }
            
            return false; 
        }
    }

    //$(this).attr('data-bcno',input_val);
    //console.log("hogehoge");
    //自由記述欄用にセットしたcssを削除する
    if($(this).attr('data-free-des') == ""){
        $(this).css('font-size','');
    }
    /*
    $(this).removeClass(function(index, className) {
        return (className.match(/\bbusiness_color\S+/g) || []).join(' ');
    });
    */
    //業務番号未登録のときはセル色は黄色に
    if(input_val == ""){
        //return false;
        //$(this).addClass("op_shift_1");
        //$(this).attr('data-bcno',input_val);
    }else{
        if(before_free_des == ""){

            $(this).removeClass();
            $(this).addClass("bc_text");
            $(this).addClass("business_color" + input_val);
            $(this).attr('data-bcno',input_val);

        }
    }
    
    //合計集計用配列に保存
    if(paste_flg != 1){
        if(user_type == 1){
            if(before_business_no != ""){
                shift_count_by_time[Number(before_business_no)][Number(tdsb_shift_hour)] = shift_count_by_time[Number(before_business_no)][Number(tdsb_shift_hour)] - 1;
            }
            shift_count_by_time[Number(input_val)][Number(tdsb_shift_hour)] = shift_count_by_time[Number(input_val)][Number(tdsb_shift_hour)] + 1;
        }
    }
    disp_total();
});

//文言追加処理
$(document).on("contextmenu","[id^=op-col]", function(e) {
    
    //対象OPID
    var opid = $(this).attr('data-opid');
    $("#terget_user_id").val(opid);
    //対象時間帯
    var target_hour = $(this).attr('data-hour');
    $("#target_hour").val(target_hour);
    //業務番号取得（コピー用）
    var target_bcno = $(this).attr('data-bcno');
    $("#copy_bcno").val(target_bcno);
    //自由記述欄の文言取得（コピー用）
    var target_free_des = $(this).attr('data-free-des');
    $("#copy_free_des").val(target_free_des);
    //休憩フラグ取得（コピー用）
    var rest_flg = $(this).attr('data-rest-flg');
    $("#copy_rest_flg").val(rest_flg);
    //研修フラグ取得（コピー用）
    var training_flg = $(this).attr('data-training-flg');
    $("#copy_training_flg").val(training_flg);

    //休憩解除処理のとき
    //var rest_flg = $("#rest_flg").val();
    var rest_flg = $("#op-col" + zeroPadding(target_hour,2) + "_" + opid).attr("data-rest-flg");

    if(rest_flg == 1){
        //右クリックメニューの文言を「休憩解除」に
        $("#cell_rest").text("休憩解除");
    }else if(rest_flg == 0){
        $("#cell_rest").text("休憩");
    }

    //研修解除処理のとき
    //var traingin_flg = $("#training_flg").val();
    var traingin_flg = $("#op-col" + zeroPadding(target_hour,2) + "_" + opid).attr("data-training-flg");
    if(traingin_flg == 1){
            //右クリックメニューの文言を「休憩解除」に
        $("#cell_training").text("研修解除");
    }else if(traingin_flg == 0){
        $("#cell_training").text("研修");
    }
    
    //対象セルのクラス名取得
    var target_class_name = $("#op-col" + target_hour + "_" + opid).attr("class");
    //各セル共通の「bc_text」を削除
    target_class_name = target_class_name.replace("bc_text","");
    //空白削除
    target_class_name = target_class_name.trim();

    //空白セルもしくは休日セルの右クリックメニューは無効とする
    if(target_class_name == "" || target_class_name == "op_shift_holiday"){
        return false;
    }

    document.getElementById('contextmenu').style.left=e.pageX+"px";
    document.getElementById('contextmenu').style.top=e.pageY+"px";
    document.getElementById('contextmenu').style.display="block";

    return false;

});

//自由記述欄モーダルウインドウOPEN
$('#business_assign_free_description').on('shown.bs.modal', function (event) {

    var opid = $("#terget_user_id").val();
    var hour = $("#target_hour").val();
    $("#target_free_description_userid").val(opid);
    $("#target_free_description_hour").val(hour);
    //自由記述欄にすでに文言がセットされているときは、フォームに文言をセットしておく
    var free_description = $("#op-col" + hour + "_" + opid).attr("data-free-des");
    $("#modal_free_description").val(free_description);

})

//自由記述欄モーダルウインドウCLOSE
$('#business_assign_free_description').on('hidden.bs.modal', function (event) {

    $("#modal_free_description").val("");
    $("#target_free_description_userid").val("");
    $("#target_free_description_hour").val("");
    //右クリックメニュー上のhidden項目
    $("#terget_user_id").val("");
    $("#target_hour").val("");

})

//要素クリックで右クリックメニューを閉じる
document.body.addEventListener('click',function (e){
    document.getElementById('contextmenu').style.display="none";
});

//自由記述欄登録処理
$(document).on("click","#business_assgin_free_description_regist", function() {

    //ターゲットデータ取得
    var target_user_id = $("#target_free_description_userid").val();
    var target_hour = $("#target_free_description_hour").val();
    //自由記述欄文言取得
    var description = $("#modal_free_description").val();
    //自由記述欄文言セット
    $("#op-col" + target_hour + "_" + target_user_id).text(description);
    //css追加
    $("#op-col" + target_hour + "_" + target_user_id).css('font-size','15px');
    //dataにも追加
    $("#op-col" + target_hour + "_" + target_user_id).attr("data-free-des",description);
    //業務番号については削除
    //$("#op-col" + target_hour + "_" + target_user_id).attr("data-bcno","");

    //自由文言が空欄のときは、色は黄色にする
    if(description == ""){
        //ただし元色があるときは、黄色にしない
        if($("#op-col" + target_hour + "_" + target_user_id).attr("data-bcno") == ""){
            $("#op-col" + target_hour + "_" + target_user_id).removeClass();
            $("#op-col" + target_hour + "_" + target_user_id).addClass("bc_text");
            $("#op-col" + target_hour + "_" + target_user_id).addClass("op_shift_1");
        }else{
            $("#op-col" + target_hour + "_" + target_user_id).text($("#op-col" + target_hour + "_" + target_user_id).attr("data-bcno"));
            $("#op-col" + target_hour + "_" + target_user_id).css('font-size','');
        }
    }
    
    //モーダル閉じる
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#business_assign_free_description').modal('hide');

    //入力欄初期化
    $("#modal_free_description").val("");
    $("#target_free_description_userid").val("");
    $("#target_free_description_hour").val("");

});

//休憩セット
$(document).on("click","#cell_rest", function() {

    //ターゲットセル
    var target_hour = $("#target_hour").val();
    var terget_opid = $("#terget_user_id").val();

    $(this).removeClass(function(index, className) {
        return (className.match(/\bbusiness_color\S+/g) || []).join(' ');
    });

    $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass();
    $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("bc_text");

    var rest_flg = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-rest-flg");

    //休憩解除
    if(rest_flg == 1){
        //console.log("休憩解除");
        var bcno = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno");
        //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + bcno);
        //業務番号が保存されていないときは、セル色は黄色
        if(bcno == ""){
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass();
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("bc_text");
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("op_shift_1");
        }else{
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass();
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("bc_text");
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + bcno);            
        }
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text(bcno);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','');
        //$("#rest_flg").val(0);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr('data-rest-flg',0);
    //休憩セット    
    }else if(rest_flg == 0){
        //console.log("休憩");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("op_shift_1");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text("休憩");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','15px');
        //$("#rest_flg").val(1);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr('data-rest-flg',1);
        //研修がセットされているときは、研修は解除する
        //if($("#training_flg").val() == 1) {
        if($("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-training-flg") == 1) {
            //var bcno = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno");
            //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + bcno);
            //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text(bcno);
            //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','');
            //$("#training_flg").val(0);    
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr('data-training-flg',1);
        }   
    }

});

//研修セット
$(document).on("click","#cell_training", function() {

    //ターゲットセル
    var target_hour = $("#target_hour").val();
    var terget_opid = $("#terget_user_id").val();
    /*
    $(this).removeClass(function(index, className) {
        return (className.match(/\bbusiness_color\S+/g) || []).join(' ');
    });
    */
    //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass();
    //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("bc_text");

    //休憩解除のときは、元の色に戻す

    //var trainging_flg = $("#training_flg").val();
    var trainging_flg = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-training-flg");

    if(trainging_flg == 1){
        //console.log("休憩解除");
        var bcno = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno");
        //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + bcno);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text(bcno);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','');
        //$("#training_flg").val(0);  
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr('data-training-flg',0);
    //研修セット      
    }else if(trainging_flg == 0){
        //console.log("休憩");
        //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("op_shift_1");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text("研修");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','15px');
        //$("#training_flg").val(1);  
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr('data-training-flg',1);
        
        //休憩がセットされているときは、休憩は解除する
        //if($("#rest_flg").val() == 1) {
        if($("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-rest-flg") == 1) {
            var bcno = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno");
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + bcno);
            //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text(bcno);
            //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','');
            //$("#rest_flg").val(0);  
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr('data-rest-flg',0);
        }   

    }

});

//セルコピー
$(document).on("click","#cell_copy", function() {
    copy_data = $("#copy_bcno").val();
    //自由記述欄もコピーしておく
    copy_free_des = $("#copy_free_des").val();
    //休憩フラグもコピーしておく
    copy_rest_flg = $("#copy_rest_flg").val();
    //研修フラグもコピー
    copy_training_flg = $("#copy_training_flg").val();

    //hiddenの値は削除しておく
    $("#copy_bcno").val("");
    $("#copy_free_des").val("");
    $("#copy_rest_flg").val("");
    $("#copy_training_flg").val("");

});

//セルペースト
$(document).on("click","#cell_paste", function() {

    paste_flg = 1;
    //ターゲットセル
    var target_hour = $("#target_hour").val();
    var terget_opid = $("#terget_user_id").val();
    //ペースト対象のセルのuser_typeを取得
    var user_type = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-usertype");
    //ペースト前の業務番号取得
    var before_business_no = $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno");

    //console.log("copy_rest_flg:" + copy_rest_flg);
    //console.log("copy_training_flg:" + copy_training_flg);
    //console.log("copy_free_des:" + copy_free_des);
    //console.log("copy_data:" + copy_data);
    

    //休憩フラグと研修フラグが立っているときは、こちらをペースト
    if(copy_rest_flg == 1){
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text("休憩");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','15px');
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-rest-flg",1);
        //もし研修フラグが立っているときは研修フラグは0に戻す
        if($("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-training-flg") == 1){
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-training-flg",0);
            //$("#training_flg").val(0);    

        }
        //セル色は黄色に
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass();
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("bc_text");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("op_shift_1");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno",copy_data);
    }

    if(copy_training_flg == 1){
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text("研修");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','15px');
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-training-flg",1);
        //もし休憩フラグが立っているときは休憩フラグは0に戻す
        if($("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-rest-flg") == 1){
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-rest-flg",0);
            //$("#rest_flg").val(0);    

        }
        //セル色はコピーした色
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass();
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("bc_text");
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + copy_data);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + copy_data);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno",copy_data);
    }

    //コピーされている業務番号をセットする
    //自由記述欄の文言があるときは、そちらをセット
    if(copy_free_des == "" || copy_free_des === undefined){
        if(copy_rest_flg == 0 && copy_training_flg == 0){
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text(copy_data);
        }
    //自由記述欄の文言がないときは、業務番号をセット
    }else{
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).text(copy_free_des);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-free-des",copy_free_des);
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','15px');
    }
    
    //業務番号がコピーされているときは、当該業務の色をセット
    if(copy_rest_flg == 0 && copy_training_flg == 0){
        if(copy_data != ""){
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass("op_shift_1");
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("business_color" + copy_data);
        //業務番号がコピーされていないときは、デフォルトの黄色をセット
        }else{
            //business_colorではじまるclassを一括削除
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).removeClass(function(index, className) {
                return (className.match(/\bbusiness_color\S+/g) || []).join(' ');
            });
            //黄色（デフォルト）色をつける
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).addClass("op_shift_1");
            //自由記述欄の文言も削除
            $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-free-des","");
        }
        //$("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).css('font-size','17px');
        $("#op-col" + zeroPadding(target_hour,2) + "_" + terget_opid).attr("data-bcno",copy_data);
    }

    //合計集計用配列に保存
    if(user_type == 1){

        if(before_business_no != ""){
            //セルのblurイベントが先に走ってしまって、カウントが重複してしまうので、ここではあえて2を引くことにしている
            //shift_count_by_time[Number(before_business_no)][Number(target_hour)] = shift_count_by_time[Number(before_business_no)][Number(target_hour)] - 1;
            shift_count_by_time[Number(before_business_no)][Number(target_hour)] = shift_count_by_time[Number(before_business_no)][Number(target_hour)] - 2;
        }
        if(copy_data != ""){
            shift_count_by_time[Number(copy_data)][Number(target_hour)] = Number(shift_count_by_time[Number(copy_data)][Number(target_hour)]) + 1;
        }
    }
    
    disp_total();

    paste_flg = 0;
    
});

//登録アクション
$(document).on("click","#business_color_regist", function() {
       
    Object.keys(business_assign_ary).forEach(function(key) {
        //console.log(business_assign_ary[key][0]['tmur_user_name']);
        var op_name = "";
        //氏名
        if(key != "color_info"){
            //配列初期化
            if(business_assign_ary[key].length > 0){
                for(var j = 0; j < business_assign_ary[key].length;j++){
                    if(j == 0){
                        business_assign_ary[key][j]['business_enable_priority'] = "";
                        business_assign_ary[key][j]['tdsb_business_id'] = "";
                        business_assign_ary[key][j]['tdsb_free_description'] = "";
                        business_assign_ary[key][j]['tdsb_rest_flg'] = "";
                        business_assign_ary[key][j]['tdsb_shift_hour'] = "";
                        business_assign_ary[key][j]['tdsb_training_flg'] = "";
                        business_assign_ary[key][j]['tdsb_update_date'] = "";
                        business_assign_ary[key][j]['tmbc_business_name'] = "";
                        business_assign_ary[key][j]['tmbc_color_code'] = "";
                    }else{
                        //business_assign_ary[key][j] = null;
                        business_assign_ary[key].pop();
                    }

                }

            }
            if(business_assign_ary[key].length > 1){
                business_assign_ary[key].pop();
            }
            
            //console.log(business_assign_ary[key]);
            //console.log(business_assign_ary[key][0]);
            var op_name = business_assign_ary[key][0]['tmur_user_name'];
            var index = 0;
            for(var i = 0; i< 24; i++){
                
                //クラス名
                var class_name = $("#op-col" + zeroPadding(i,2) + "_" + key).attr("class");
                //自由記述欄
                var free_description = $("#op-col" + zeroPadding(i,2) + "_" + key).attr("data-free-des");
                //業務番号
                var business_no = $("#op-col" + zeroPadding(i,2) + "_" + key).attr("data-bcno");
                //休憩フラグ
                var rest_flg = $("#op-col" + zeroPadding(i,2) + "_" + key).attr("data-rest-flg");
                //研修フラグ
                var training_flg = $("#op-col" + zeroPadding(i,2) + "_" + key).attr("data-training-flg");
                //最終更新日
                var last_update_time = $("#op-col" + zeroPadding(i,2) + "_" + key).attr("data-update-time");

                if(class_name === undefined){
                    class_name = "";
                }

                //if ( class_name.indexOf('business_color') != -1 || rest_flg == 1) {
                if ( class_name.indexOf('business_color') != -1 || rest_flg == 1 || training_flg == 1) {
                    
                    let brank_ary = new Object();
                    brank_ary['tdsb_user_id'] = "";
                    brank_ary['tdsb_user_name'] = "";
                    brank_ary['tdsb_shift_hour'] = "";
                    brank_ary['tdsb_business_id'] = "";
                    brank_ary['tdsb_business_name'] = "";
                    brank_ary['tmbc_color_code'] = "";
                    brank_ary['tdsb_free_description'] = "";
                    brank_ary['tdsb_rest_flg'] = "";
                    brank_ary['tdsb_training_flg'] = "";
                    brank_ary['tdsb_update_date'] = last_update_time;
                    brank_ary['tdsb_user_id'] = key;
                    brank_ary['tdsb_user_name'] = op_name;
                    brank_ary['tdsb_shift_hour'] = i;
                    brank_ary['tdsb_free_description'] = free_description;

                    if(rest_flg == 1){
                        //brank_ary['tdsb_business_id'] = 0;
                        brank_ary['tdsb_business_id'] = "";
                    }else{
                        brank_ary['tdsb_business_id'] = business_no;
                    }

                    brank_ary['tdsb_rest_flg'] = rest_flg;
                    brank_ary['tdsb_training_flg'] = training_flg;

                    business_assign_ary[key][index] = brank_ary;

                    index ++;
                }else{
                    //console.log(key);
                }

            }

        }

    })		

    //console.log(business_assign_ary);

	//期間の始端と終端  
	var shown_date = $("#showen_date").val();
    //合計用の要素については、送信前に削除しておく
    delete business_assign_ary['color_info'];

	$.ajax({
		type:          'post',
		url:		   "../api/shift/business_assign_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	          : 'business_color_regist',
						'token'               : $("#csrf_token").val(),
						'tdbc_shift_date'	  : shown_date,
                        'business_assign_ary' : JSON.stringify(business_assign_ary)
						},
		
		// 200 OK
		success: function(json_data) {   
			//登録成功
			if(json_data == "ok"){
				alert("シフト登録しました");

                var showen_date =  $("#showen_date").val();
                var url = "business_assign.php";
                var param_ary = new Object();
                param_ary['showen_date'] = showen_date;
                //post(url,param_ary);

			//登録失敗
			}else if(json_data == "ng"){
				alert("登録に失敗しました");
            }else if(json_data == "token_ng"){
				alert("トークンエラー");
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