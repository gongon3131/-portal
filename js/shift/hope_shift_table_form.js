//希望シフト入力フォームHTML作成（フォーム）
function make_hope_shift_form(shift_date){

	let contant = '';
	contant += '<tr>';
	contant += '<td class="align-middle shift_form_text">' + shift_date + '</td>';
	contant += '<td>';
	contant += '<div class="form-inline">';
	contant += '<div class="form_center">';
	contant += '<input type="text" id="first_hope_hour_sta_' + shift_date + '" name="first_hope_hour_sta_' + shift_date + '" value="" class="form-control w15 form_right shift_form_text" oninput="value = value.replace(/[^0-9]+/i,' + "'');" + '">';
	contant += '：';
	contant += '<select name="first_hope_min_sta_' + shift_date + '" class="form-control shift_form_text" id="first_hope_min_sta_' + shift_date + '">';
	contant += '<option label="" value="00" selected>00</option>';
	contant += '<option label="" value="30">30</option>';
	contant += '</select>';
	contant += '&nbsp;～&nbsp;';
	contant += '<input type="text" id="first_hope_hour_end_' + shift_date + '" name="first_hope_hour_end_' + shift_date + '" value="" class="form-control w15 form_right shift_form_text">';
	contant += '：';
	contant += '<select name="first_hope_min_end_' + shift_date + '" class="form-control shift_form_text" id="first_hope_min_end_' + shift_date + '">';
	contant += '<option label="" value="00" selected>00</option>';
	contant += '<option label="" value="30">30</option>';
	contant += '</select>';
	contant += '</div>';
	contant += '</div>';
	contant += '</td>';

	contant += '<td>';
	contant += '<div class="form-inline">';
	contant += '<div class="form_center">';
	contant += '<input type="text" id="second_hope_hour_sta_' + shift_date + '" name="second_hope_hour_sta_' + shift_date + '" value="" class="form-control w15 form_right shift_form_text">';
	contant += '：';
	contant += '<select name="second_hope_min_sta_' + shift_date + '" class="form-control shift_form_text" id="second_hope_min_sta_' + shift_date + '">';
	contant += '<option label="" value="00" selected>00</option>';
	contant += '<option label="" value="30">30</option>';
	contant += '</select>';
	contant += '&nbsp;～&nbsp;';
	contant += '<input type="text" id="second_hope_hour_end_' + shift_date + '" name="second_hope_hour_end_' + shift_date + '" value="" class="form-control w15 form_right shift_form_text">';
	contant += '：';
	contant += '<select name="second_hope_min_end_' + shift_date + '" class="form-control shift_form_text" id="second_hope_min_end_' + shift_date + '">';
	contant += '<option label="" value="00" selected>00</option>';
	contant += '<option label="" value="30">30</option>';
	contant += '</select>';
	contant += '</div>';
	contant += '</div>';
	contant += '</td>';

	contant += '<td><input type="checkbox" name="midnight_' + shift_date + '" id="midnight_' + shift_date + '" value="1" class="form-control"></td>';
	contant += '<td><input type="checkbox" name="holiday_' + shift_date + '" id="holiday_' + shift_date + '" value="1" class="form-control"></td>';
	contant += '<td><input type="checkbox" name="paid_holiday_' + shift_date + '" id="paid_holiday_' + shift_date + '" value="1" class="form-control"></td>';
	contant += '<td><input type="text" name="memo_' + shift_date + '" value="" id="memo_' + shift_date + '" class="form-control"></td>';
    contant += '<input type="hidden" name="yesterday_midnight_flg_' + shift_date + '" id="yesterday_midnight_flg_' + shift_date + '" value="">';
	contant += '</tr>';

	return contant;

}

//第1区間のシフト保存
$(document).on("blur","[id^=first_hope_hour_sta],[id^=first_hope_hour_end]", function() {
	//フォーカスの当たっていたフォームのidを取得
	var idname = $(this).attr("id");

	//入力値の取得
	var hour = "";
	var min = "";
	var target_date  = "";

	hour = $(this).val();

    if(hour == ""){
        return false;
    }

	if(idname.indexOf('first_hope_hour_sta_') != -1){
		target_date = idname.replace("first_hope_hour_sta_","");
		min = $("#first_hope_min_sta_" + target_date).val();
		shift_data_ary[target_date]['tdsh_start_time_first'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}
	if(idname.indexOf('first_hope_hour_end_') != -1){
		target_date = idname.replace("first_hope_hour_end_","");
		min = $("#first_hope_min_end_" + target_date).val();
		shift_data_ary[target_date]['tdsh_end_time_first'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}

	//console.log(shift_data_ary);

    if(chk_time(target_date) == false){
        alert("第1区間と第2区間で時間が重複しています");
    }

});

$(document).on("change","[id^=first_hope_min_sta_],[id^=first_hope_min_end_]", function() {

	//フォーカスの当たっていたフォームのidを取得
	var idname = $(this).attr("id");

	//入力値の取得
	var hour = "";
	var min = "";
	var target_date  = "";

	min = $(this).val();

	if(idname.indexOf('first_hope_min_sta_') != -1){
		target_date = idname.replace("first_hope_min_sta_","");
		hour = $("#first_hope_hour_sta_" + target_date).val();
		shift_data_ary[target_date]['tdsh_start_time_first'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}
	if(idname.indexOf('first_hope_min_end_') != -1){
		target_date = idname.replace("first_hope_min_end_","");
		hour = $("#first_hope_hour_end_" + target_date).val();
		shift_data_ary[target_date]['tdsh_end_time_first'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}

    if(chk_time(target_date) == false){
        alert("第1区間と第2区間で時間が重複しています");
    }

});

//第1区間と第2区間の重複チェック
function chk_time(target_date){

    if($("#first_hope_hour_sta_" + target_date).val() == ""){
        return true;
    }
    if($("#first_hope_hour_end_" + target_date).val() == "" ){
        return true;
    }
    //第2区間が全てブランクならばチェック対象外
    if($("#second_hope_hour_sta_" + target_date).val() == "" &&  $("#second_hope_hour_end_" + target_date).val() == "" ){
        return true;
    }
    
    //まず第1区間を配列に入れる
    var first_hour_sta = String(zeroPadding($("#first_hope_hour_sta_" + target_date).val(),2));
    var first_min_sta = String(zeroPadding($("#first_hope_min_sta_" + target_date).val(),2));
    var first_hour_end = String(zeroPadding($("#first_hope_hour_end_" + target_date).val(),2));
    var first_min_end = String(zeroPadding($("#first_hope_min_end_" + target_date).val(),2));

    //第2区間のシフトを配列に入れる
    var second_hour_sta = String(zeroPadding($("#second_hope_hour_sta_" + target_date).val(),2));
    var second_min_sta = String(zeroPadding($("#second_hope_min_sta_" + target_date).val(),2));
    var second_hour_end = String(zeroPadding($("#second_hope_hour_end_" + target_date).val(),2));
    var second_min_end = String(zeroPadding($("#second_hope_min_end_" + target_date).val(),2));

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

//第2区間のシフト保存
$(document).on("blur","[id^=second_hope_hour_sta],[id^=second_hope_hour_end]", function() {

	//フォーカスの当たっていたフォームのidを取得
	var idname = $(this).attr("id");

	//入力値の取得
	var hour = "";
	var min = "";
	var target_date  = "";

	hour = $(this).val();

	if(idname.indexOf('second_hope_hour_sta_') != -1){
		target_date = idname.replace("second_hope_hour_sta_","");
		min = $("#second_hope_min_sta_" + target_date).val();
		shift_data_ary[target_date]['tdsh_start_time_second'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}
	if(idname.indexOf('second_hope_hour_end_') != -1){
		target_date = idname.replace("second_hope_hour_end_","");
		min = $("#second_hope_min_end_" + target_date).val();
		shift_data_ary[target_date]['tdsh_end_time_second'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}

	//console.log(shift_data_ary);

});

$(document).on("change","[id^=second_hope_min_sta_],[id^=second_hope_min_end_]", function() {

	//フォーカスの当たっていたフォームのidを取得
	var idname = $(this).attr("id");

	//入力値の取得
	var hour = "";
	var min = "";
	var target_date  = "";

	min = $(this).val();

	if(idname.indexOf('second_hope_min_sta_') != -1){
		target_date = idname.replace("second_hope_min_sta_","");
		hour = $("#second_hope_hour_sta_" + target_date).val();
		shift_data_ary[target_date]['tdsh_start_time_second'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}
	if(idname.indexOf('second_hope_min_end_') != -1){
		target_date = idname.replace("second_hope_min_end_","");
		hour = $("#second_hope_hour_end_" + target_date).val();
		shift_data_ary[target_date]['tdsh_end_time_second'] = String(zeroPadding(hour,2)) + String(zeroPadding(min,2));
	}

	//console.log(shift_data_ary);

});

//メモ情報の保存
$(document).on("blur","[id^=memo_]", function() {

	//フォーカスの当たっていたフォームのidを取得
	var idname = $(this).attr("id");

	var memo = $(this).val();
    var target_date = idname.replace("memo_","");

    shift_data_ary[target_date]['tdsh_memo'] = memo;
    //console.log(shift_data_ary);
});


//フォーム上での休日・有休の制御
//休日・有休を選択したときは、フォームは非活性とする
$(document).on("click","[id^=holiday_],[id^=paid_holiday_]", function() {
	//チェックされたセルのidを取得
	var idname = $(this).attr("id");
	//日付を取得
	var target_date = "";

	if(idname.indexOf('paid_holiday') != -1){
		target_date = idname.replace("paid_holiday_","");
	}else{
		target_date = idname.replace("holiday_","");
	}

	//値を取得
	var check_val = $(this).prop("checked");

	if(check_val == true){

        //当該日のフォームをリセット
        $("#first_hope_hour_sta_" + target_date).val('');
        $("#first_hope_min_sta_" + target_date).val('00');
        $("#first_hope_hour_end_" + target_date).val('');
        $("#first_hope_min_end_" + target_date).val('00');
        $("#second_hope_hour_sta_" + target_date).val('');
        $("#second_hope_min_sta_" + target_date).val('00');
        $("#second_hope_hour_end_" + target_date).val('');
        $("#second_hope_min_end_" + target_date).val('00');

        shift_data_ary[target_date]['tdsh_start_time_first'] = "";
        shift_data_ary[target_date]['tdsh_end_time_first'] = "";
        shift_data_ary[target_date]['tdsh_start_time_second'] = "";
        shift_data_ary[target_date]['tdsh_end_time_second'] = "";

		$("#first_hope_hour_sta_" + target_date).prop('disabled', true);
		$("#first_hope_min_sta_" + target_date).prop('disabled', true);
		$("#first_hope_hour_end_" + target_date).prop('disabled', true);
		$("#first_hope_min_end_" + target_date).prop('disabled', true);
		$("#second_hope_hour_sta_" + target_date).prop('disabled', true);
		$("#second_hope_min_sta_" + target_date).prop('disabled', true);
		$("#second_hope_hour_end_" + target_date).prop('disabled', true);
		$("#second_hope_min_end_" + target_date).prop('disabled', true);

        //休日設定する日にすでに夜勤フラグにチェックが入っているときは、翌日のフォームもリセットする（非活性にはしない）
        if($("#midnight_" + target_date).prop("checked") == true){

            //当該日の翌日の日付を取得
            var date_s = new Date(target_date);
            date_s = new Date(date_s.setDate(date_s.getDate() + 1));
            var year = date_s.getFullYear();
            var month = date_s.getMonth() + 1;
            var day = date_s.getDate();		
            var next_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

            $("#first_hope_hour_sta_" + next_date).val('');
            $("#first_hope_min_sta_" + next_date).val('00');
            $("#first_hope_hour_end_" + next_date).val('');
            $("#first_hope_min_end_" + next_date).val('00');

            shift_data_ary[next_date]['tdsh_start_time_first'] = "";
            shift_data_ary[next_date]['tdsh_end_time_first'] = "";
    
        }

	}else{

		$("#first_hope_hour_sta_" + target_date).prop('disabled', false);
		$("#first_hope_min_sta_" + target_date).prop('disabled', false);
		$("#first_hope_hour_end_" + target_date).prop('disabled', false);
		$("#first_hope_min_end_" + target_date).prop('disabled', false);
		$("#second_hope_hour_sta_" + target_date).prop('disabled', false);
		$("#second_hope_min_sta_" + target_date).prop('disabled', false);
		$("#second_hope_hour_end_" + target_date).prop('disabled', false);
		$("#second_hope_min_end_" + target_date).prop('disabled', false);

	}

	//シフト配列に保存
	shift_data_ary[target_date]['tdsh_holiday_flg'] = $("#holiday_" + target_date).prop("checked");
	shift_data_ary[target_date]['tdsh_paid_holiday_flg'] = $("#paid_holiday_" + target_date).prop("checked");
	//console.log(shift_data_ary);

});

//夜勤チェック時の保存
$(document).on("click","[id^=midnight_]", function() {

	//値を取得
	var check_val = $(this).prop("checked");

    //チェックされたセルのidを取得
    var idname = $(this).attr("id");
    //日付を取得
    var target_date = "";
    target_date = idname.replace("midnight_","");
    //昨日の日付
    var date_y = new Date(target_date);
    date_y = new Date(date_y.setDate(date_y.getDate() - 1));
    var before_date = date_y.getFullYear() + "-" + zeroPadding(date_y.getMonth() + 1,2) + "-" + zeroPadding(date_y.getDate(),2);

    //夜勤チェック時
    if(check_val == true){

        //前日の夜勤フラグチェック
        if($("#midnight_" + before_date).prop("checked") == true){

            //前日が夜勤であれば、第2区間に22時から24時をセット
            $("#second_hope_hour_sta_" + target_date).val('22');
            $("#second_hope_min_sta_" + target_date).val('00');
            $("#second_hope_hour_end_" + target_date).val('24');
            $("#second_hope_min_end_" + target_date).val('00');
    
        }else{

            //前日が夜勤でなければ当該日の第1区間を22時から24時とする
            $("#first_hope_hour_sta_" + target_date).val('22');
            $("#first_hope_min_sta_" + target_date).val('00');
            $("#first_hope_hour_end_" + target_date).val('24');
            $("#first_hope_min_end_" + target_date).val('00');

        }

        //シフト配列に保存
        shift_data_ary[target_date]['tdsh_midnight_flg'] = $("#midnight_" + target_date).prop("checked");
        shift_data_ary[target_date]['tdsh_start_time_first'] = '2200';
        shift_data_ary[target_date]['tdsh_end_time_first'] = '2400';

        //当該日の翌日の日付を取得
        var date_s = new Date(target_date);
        date_s = new Date(date_s.setDate(date_s.getDate() + 1));
        var year = date_s.getFullYear();
        var month = date_s.getMonth() + 1;
        var day = date_s.getDate();
        var next_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

        //当該日の翌日の第1区間を0時から8時とする
        $("#first_hope_hour_sta_" + next_date).val('0');
        $("#first_hope_min_sta_" + next_date).val('00');
        $("#first_hope_hour_end_" + next_date).val('8');
        $("#first_hope_min_end_" + next_date).val('00');

        //翌日の夜勤フラグチェック
        if($("#midnight_" + next_date).prop("checked") == true){
            //さらに第2区間を22時から24時までのシフトとする
            $("#second_hope_hour_sta_" + next_date).val('22');
            $("#second_hope_min_sta_" + next_date).val('00');
            $("#second_hope_hour_end_" + next_date).val('24');
            $("#second_hope_min_end_" + next_date).val('00');

        }

        //当該日の翌日の休日および有休チェックを非活性に
        $("#holiday_" + next_date).prop('disabled',true);
        $("#holiday_" + next_date).prop('checked',false);
        $("#paid_holiday_" + next_date).prop('disabled',true);
        $("#paid_holiday_" + next_date).prop('checked',false);
        
        //シフト配列に保存
        shift_data_ary[next_date]['tdsh_start_time_first'] = '0000';
        shift_data_ary[next_date]['tdsh_end_time_first'] = '0800';
        
        //console.log(shift_data_ary);
    
    //夜勤解除時
    }else{

        //前日の夜勤フラグチェック
        if($("#midnight_" + before_date).prop("checked") == true){

            //前日が夜勤であれば、第2区間の22時から24時をリセット
            $("#second_hope_hour_sta_" + target_date).val('');
            $("#second_hope_min_sta_" + target_date).val('00');
            $("#second_hope_hour_end_" + target_date).val('');
            $("#second_hope_min_end_" + target_date).val('00');

        }else{

            //前日が夜勤でなければ、当該日の第1区間をリセットする
            $("#first_hope_hour_sta_" + target_date).val('');
            $("#first_hope_min_sta_" + target_date).val('00');
            $("#first_hope_hour_end_" + target_date).val('');
            $("#first_hope_min_end_" + target_date).val('00');

        }

        //シフト配列に保存
        shift_data_ary[target_date]['tdsh_midnight_flg'] = $("#midnight_" + target_date).prop("checked");
        shift_data_ary[target_date]['tdsh_start_time_first'] = '';
        shift_data_ary[target_date]['tdsh_end_time_first'] = '';

        //当該日の翌日の日付を取得
        var date_s = new Date(target_date);
        date_s = new Date(date_s.setDate(date_s.getDate() + 1));
        var year = date_s.getFullYear();
        var month = date_s.getMonth() + 1;
        var day = date_s.getDate();		
        var next_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

        //当該日の翌日の第1区間をクリアにする
        $("#first_hope_hour_sta_" + next_date).val('');
        $("#first_hope_min_sta_" + next_date).val('00');
        $("#first_hope_hour_end_" + next_date).val('');
        $("#first_hope_min_end_" + next_date).val('00');

        //翌日の夜勤フラグチェック
        if($("#midnight_" + next_date).prop("checked") == true){
            //さらに第1区間を22時から24時までのシフトとする
            $("#first_hope_hour_sta_" + next_date).val('22');
            $("#first_hope_min_sta_" + next_date).val('00');
            $("#first_hope_hour_end_" + next_date).val('24');
            $("#first_hope_min_end_" + next_date).val('00');
            //第2区間はクリア
            $("#second_hope_hour_sta_" + next_date).val('');
            $("#second_hope_min_sta_" + next_date).val('00');
            $("#second_hope_hour_end_" + next_date).val('');
            $("#second_hope_min_end_" + next_date).val('00');
        }

        //当該日の翌日の休日および有休チェックを非活性に
        $("#holiday_" + next_date).prop('disabled',false);
        $("#paid_holiday_" + next_date).prop('disabled',false);
        
        //シフト配列に保存
        shift_data_ary[next_date]['tdsh_start_time_first'] = '';
        shift_data_ary[next_date]['tdsh_end_time_first'] = '';
        
        //console.log(shift_data_ary);

    }

});

//グラフ⇒フォーム時のシフト情報のセット
function set_form_shift_for_form(){

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
	var current_section_date = section_sta;
    //前日夜勤フラグ
    var yesterday_midnight_flg = 0;
    console.log(shift_data_ary);
    //シフト保存用配列を始端日から終端日までループさせる
	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

        var start_time_first = shift_data_ary[current_section_date]['tdsh_start_time_first'];
        var end_time_first = shift_data_ary[current_section_date]['tdsh_end_time_first'];
        var start_time_second = shift_data_ary[current_section_date]['tdsh_start_time_second'];
        var end_time_second = shift_data_ary[current_section_date]['tdsh_end_time_second'];
        var midnight = shift_data_ary[current_section_date]['tdsh_midnight_flg'];
        var holiday = shift_data_ary[current_section_date]['tdsh_holiday_flg'];
        var paid_holiday = shift_data_ary[current_section_date]['tdsh_paid_holiday_flg'];
        var memo = shift_data_ary[current_section_date]['tdsh_memo'];
        var yesterday_midnight_flg = shift_data_ary[current_section_date]['yesterday_midnight_flg'];

        //メモ設定
        $("#memo_" + current_section_date).val(memo);
        //前日夜勤フラグ
        $("#yesterday_midnight_flg_" + current_section_date).val(yesterday_midnight_flg);
        
        //休日設定
        if(holiday == true){

            $("#holiday_" + current_section_date).prop('checked', true);
            //さらに有休設定
            if(paid_holiday == true){
                $("#paid_holiday_" + current_section_date).prop('checked', true);
            }
            //時刻欄の初期化
            $("#first_hope_hour_sta_" + current_section_date).val('');
            $("#first_hope_min_sta_" + current_section_date).val('00');
            $("#first_hope_hour_end_" + current_section_date).val('');
            $("#first_hope_min_end_" + current_section_date).val('00');
            $("#second_hope_hour_sta_" + current_section_date).val('');
            $("#second_hope_min_sta_" + current_section_date).val('00');
            $("#second_hope_hour_end_" + current_section_date).val('');
            $("#second_hope_min_end_" + current_section_date).val('00');            

            //時刻入力欄は非活性に
            $("#first_hope_hour_sta_" + current_section_date).prop('disabled', true);
            $("#first_hope_min_sta_" + current_section_date).prop('disabled', true);
            $("#first_hope_hour_end_" + current_section_date).prop('disabled', true);
            $("#first_hope_min_end_" + current_section_date).prop('disabled', true);
            $("#second_hope_hour_sta_" + current_section_date).prop('disabled', true);
            $("#second_hope_min_sta_" + current_section_date).prop('disabled', true);
            $("#second_hope_hour_end_" + current_section_date).prop('disabled', true);
            $("#second_hope_min_end_" + current_section_date).prop('disabled', true);
            
            //次の日付へ移動
            current_section_date = date_s.setDate(date_s.getDate() + 1);
            
            continue;

        }else{

            $("#holiday_" + current_section_date).prop('checked', false);
            $("#paid_holiday_" + current_section_date).prop('checked', false);

        }

        //有休設定
        if(paid_holiday == true){

            $("#paid_holiday_" + current_section_date).prop('checked', true);
            $("#holiday_" + current_section_date).prop('checked', true);
            //時刻欄の初期化
            $("#first_hope_hour_sta_" + current_section_date).val('');
            $("#first_hope_min_sta_" + current_section_date).val('00');
            $("#first_hope_hour_end_" + current_section_date).val('');
            $("#first_hope_min_end_" + current_section_date).val('00');
            $("#second_hope_hour_sta_" + current_section_date).val('');
            $("#second_hope_min_sta_" + current_section_date).val('00');
            $("#second_hope_hour_end_" + current_section_date).val('');
            $("#second_hope_min_end_" + current_section_date).val('00');            

            //時刻入力欄は非活性に
            $("#first_hope_hour_sta_" + current_section_date).prop('disabled', true);
            $("#first_hope_min_sta_" + current_section_date).prop('disabled', true);
            $("#first_hope_hour_end_" + current_section_date).prop('disabled', true);
            $("#first_hope_min_end_" + current_section_date).prop('disabled', true);
            $("#second_hope_hour_sta_" + current_section_date).prop('disabled', true);
            $("#second_hope_min_sta_" + current_section_date).prop('disabled', true);
            $("#second_hope_hour_end_" + current_section_date).prop('disabled', true);
            $("#second_hope_min_end_" + current_section_date).prop('disabled', true);


            //次の日付へ移動
            current_section_date = date_s.setDate(date_s.getDate() + 1);
            
            continue;
            
        }else{

            $("#holiday_" + current_section_date).prop('checked', false);
            $("#paid_holiday_" + current_section_date).prop('checked', false);
            
        }

        //夜勤設定
        if(midnight == true){
            $("#midnight_" + current_section_date).prop('checked', true);
            //当該日の翌日の休日および有休チェックを非活性に
            var next_date = get_next_day(current_section_date);
            $("#holiday_" + next_date).prop('disabled',true);
            $("#paid_holiday_" + next_date).prop('disabled',true);
        }

        //時刻設定
        //第1区間
        var first_hour_sta = "";
        var first_min_sta = "";
        if(String(start_time_first).length == 4){
            first_hour_sta = String(start_time_first).substring(0,2);
            first_hour_sta = Number(first_hour_sta);
            first_min_sta = String(start_time_first).substring(2);
            first_min_sta = Number(first_min_sta);
        }
        if(first_min_sta == ""){
            first_min_sta = "00";
        }

        var first_hour_end = "";
        var first_min_end = "";
        if(String(end_time_first).length == 4){
            first_hour_end = String(end_time_first).substring(0,2);
            first_hour_end = Number(first_hour_end);
            first_min_end = String(end_time_first).substring(2);
            first_min_end = Number(first_min_end);
        }

        if(first_min_end == ""){
            first_min_end = "00";
        }

        $("#first_hope_hour_sta_" + current_section_date).val(first_hour_sta);
        $("#first_hope_min_sta_" + current_section_date).val(first_min_sta);
        $("#first_hope_hour_end_" + current_section_date).val(first_hour_end);
        $("#first_hope_min_end_" + current_section_date).val(first_min_end);

        //第2区間
        var second_hour_sta = "";
        var second_min_sta = "";
        if(String(start_time_second).length == 4){
            second_hour_sta = String(start_time_second).substring(0,2);
            second_hour_sta = Number(second_hour_sta);
            second_min_sta = String(start_time_second).substring(2);
            second_min_sta = Number(second_min_sta);
        }

        if(second_min_sta == ""){
            second_min_sta = "00";
        }

        var second_hour_end = "";
        var second_min_end = "";
        if(String(end_time_second).length == 4){
            second_hour_end = String(end_time_second).substring(0,2);
            second_hour_end = Number(second_hour_end);
            second_min_end = String(end_time_second).substring(2);
            second_min_end = Number(second_min_end);
        }
        if(second_min_end == ""){
            second_min_end = "00";
        }

        $("#second_hope_hour_sta_" + current_section_date).val(second_hour_sta);
        $("#second_hope_min_sta_" + current_section_date).val(second_min_sta);
        $("#second_hope_hour_end_" + current_section_date).val(second_hour_end);
        $("#second_hope_min_end_" + current_section_date).val(second_min_end);

        //次の日付へ移動
        current_section_date = date_s.setDate(date_s.getDate() + 1);

    }
}
