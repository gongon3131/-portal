function set_form_by_date(){
    //console.log(shift_data_ary);
    form_clear();
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

        //時刻欄の初期化
        $("#bc_first_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).val('');
        $("#bc_first_min_sta_" + shift_data_ary[key]['tdbc_user_id']).val('00');
        $("#bc_first_hour_end_" + shift_data_ary[key]['tdbc_user_id']).val('');
        $("#bc_first_min_end_" + shift_data_ary[key]['tdbc_user_id']).val('00');
        $("#bc_second_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).val('');
        $("#bc_second_min_sta_" + shift_data_ary[key]['tdbc_user_id']).val('00');
        $("#bc_second_hour_end_" + shift_data_ary[key]['tdbc_user_id']).val('');
        $("#bc_second_min_end_" + shift_data_ary[key]['tdbc_user_id']).val('00');  
        //休日・夜勤関係欄の初期化
        $("#midnight_" + shift_data_ary[key]['tdbc_user_id']).prop('checked', false);
        $("#holiday_" + shift_data_ary[key]['tdbc_user_id']).prop('checked', false);
        $("#paid_holiday_" + shift_data_ary[key]['tdbc_user_id']).prop('checked', false);        

        //メモ設定
        $("#tdbc_memo_" + shift_data_ary[key]['tdbc_user_id']).val(memo);

        //休日設定
        if(holiday == true || paid_holiday == true){
            
            $("#holiday_" + shift_data_ary[key]['tdbc_user_id']).prop('checked', true);

            //時刻入力欄は非活性に
            $("#bc_first_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            $("#bc_first_min_sta_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            $("#bc_first_hour_end_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            $("#bc_first_min_end_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            $("#bc_second_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            $("#bc_second_min_sta_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            $("#bc_second_hour_end_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            $("#bc_second_min_end_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled', true);
            
            //さらに有休設定
            if(paid_holiday == true){
                $("#paid_holiday_" + shift_data_ary[key]['tdbc_user_id']).prop('checked', true);
            }
            
            return;
        }

        //夜勤設定
        if(midnight == true){
            $("#midnight_" + shift_data_ary[key]['tdbc_user_id']).prop('checked', true);
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

        $("#bc_first_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).val(first_hour_sta);
        $("#bc_first_min_sta_" + shift_data_ary[key]['tdbc_user_id']).val(first_min_sta);
        $("#bc_first_hour_end_" + shift_data_ary[key]['tdbc_user_id']).val(first_hour_end);
        $("#bc_first_min_end_" + shift_data_ary[key]['tdbc_user_id']).val(first_min_end);

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

        $("#bc_second_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).val(second_hour_sta);
        $("#bc_second_min_sta_" + shift_data_ary[key]['tdbc_user_id']).val(second_min_sta);
        $("#bc_second_hour_end_" + shift_data_ary[key]['tdbc_user_id']).val(second_hour_end);
        $("#bc_second_min_end_" + shift_data_ary[key]['tdbc_user_id']).val(second_min_end);

        //前日夜勤フラグが立っているときは、0~8時に第1区間をセット
        if(yesterday_midnight_flg == 1){
            $("#bc_first_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).val("0");
            $("#bc_first_min_sta_" + shift_data_ary[key]['tdbc_user_id']).val("00");
            $("#bc_first_hour_end_" + shift_data_ary[key]['tdbc_user_id']).val("8");
            $("#bc_first_min_end_" + shift_data_ary[key]['tdbc_user_id']).val("00");
            //夜勤フラグと第2区間以外は非活性
            $("#bc_first_hour_sta_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled',true);
            $("#bc_first_min_sta_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled',true);
            $("#bc_first_hour_end_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled',true);
            $("#bc_first_min_end_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled',true);
            $("#holiday_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled',true);
            $("#paid_holiday_" + shift_data_ary[key]['tdbc_user_id']).prop('disabled',true);
        }
    
    })//end of foreach()

}

function set_graph_by_date(){
    //console.log(shift_data_ary);
    graph_clear();
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
                //shift_count_by_time[i] = shift_count_by_time[i] + 1;
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
                shift_count_by_time[i] = shift_count_by_time[i] + 1;
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

                set_shift_color(start_time_first,end_time_first,shift_data_ary[key]['tdbc_user_id'],shift_data_ary[key]['user_type']);
                return;

            }else{
                //第1区間のセット
                set_shift_color(start_time_first,end_time_first,shift_data_ary[key]['tdbc_user_id'],shift_data_ary[key]['user_type']);
                //第2区間のセット
                set_shift_color(start_time_second,end_time_second,shift_data_ary[key]['tdbc_user_id'],shift_data_ary[key]['user_type']);               
                return;

            }

        }
        
    })
    
    set_total();
}

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
	//$("[id^=memo_icn]").css('display',"none");
    $("[id^=memo_icn]").attr("src","../img/memo.png");
	$("[id^=tdbc_memo_gh]").val('');

}

function form_clear(){

	$("[id^=bc_first_hour_sta_]").val("");
	$("[id^=bc_first_min_sta_]").val("00");
	$("[id^=bc_first_hour_end_]").val("");
	$("[id^=bc_first_min_end_]").val("00");
	$("[id^=bc_second_hour_sta_]").val("");
	$("[id^=bc_second_min_sta_]").val("00");
	$("[id^=bc_second_hour_end_]").val("");
	$("[id^=bc_second_min_end_]").val("00");

	$("[id^=bc_first_hour_sta_]").prop("disabled",false);
	$("[id^=bc_first_min_sta_]").prop("disabled",false);
	$("[id^=bc_first_hour_end_]").prop("disabled",false);
	$("[id^=bc_first_min_end_]").prop("disabled",false);
	$("[id^=bc_second_hour_sta_]").prop("disabled",false);
	$("[id^=bc_second_min_sta_]").prop("disabled",false);
	$("[id^=bc_second_hour_end_]").prop("disabled",false);
	$("[id^=bc_second_min_end_]").prop("disabled",false);
    
	$("[id^=midnight_]").prop("checked",false);
	$("[id^=midnight_]").prop("disabled",false);
	$("[id^=holiday_]").prop("checked",false);
	$("[id^=holiday_]").prop("disabled",false);
	$("[id^=paid_holiday_]").prop("checked",false);
	$("[id^=paid_holiday_]").prop("disabled",false);
    
}



//タブ遷移時に保存されているシフト情報をグラフに反映させる（OP別）
function set_tsr_shift_for_graph_by_user(){

    //console.log(shift_data_ary);
    graph_clear();
    //シフト保存用配列を始端日から終端日までループさせる
    Object.keys(shift_data_ary).forEach(function(key) {

        var current_section_date = shift_data_ary[key]['tdbc_shift_date'];

        //翌日の日付
		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);
        var next_date = get_next_day(current_section_date);

        var start_time_first = shift_data_ary[key]['tdbc_start_time_first'];
        var end_time_first = shift_data_ary[key]['tdbc_end_time_first'];
        var start_time_second = shift_data_ary[key]['tdbc_start_time_second'];
        var end_time_second = shift_data_ary[key]['tdbc_end_time_second'];
        var midnight = shift_data_ary[key]['tdbc_midnight_flg'];
        var holiday = shift_data_ary[key]['tdbc_holiday_flg'];
        var paid_holiday = shift_data_ary[key]['tdbc_paid_holiday_flg'];
        var memo = shift_data_ary[key]['tdbc_memo'];
        //前日夜勤フラグ
        var yesterday_midnight_flg = shift_data_ary[key]['yesterday_midnight_flg'];

        //メモ情報の反映
        $("#tdbc_memo_" + current_section_date).val(memo);

        //前日が夜勤のときは、0時から7時のセルを黄色にする
        if(yesterday_midnight_flg == 1){
            for (let i = 0; i < 8; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).addClass("op_shift_1");
            }
        }
        
        //休日設定（当該日のすべてのセルを休日色に）
        if(holiday == true || paid_holiday == true){
            for (let i = 0; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).removeClass("op_shift_1");
                $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).addClass("op_shift_holiday");
            }
            //休日ボタンを変更
			$("#graph_holiday_set_" + current_section_date).val(1);
			$("#graph_holiday_set_" + current_section_date).text('解除');
            $("#graph_holiday_set_" + current_section_date).removeClass("btn-primary");
            $("#graph_holiday_set_" + current_section_date).addClass("btn-danger");
            //さらに有休設定されているときは、有休ボタンも変更
            if(paid_holiday == true){
                $("#graph_paid_holiday_set_" + current_section_date).val(1);
                $("#graph_paid_holiday_set_" + current_section_date).text('解除');
                $("#graph_paid_holiday_set_" + current_section_date).removeClass("btn-primary");
                $("#graph_paid_holiday_set_" + current_section_date).addClass("btn-danger");
            }

            //次の日付へ移動
            current_section_date = date_s.setDate(date_s.getDate() + 1);
            
            return;
        }

        //夜勤フラグ（当該日の22時と23時のセルのみ黄色にし、当該日の翌日の0時～7時のセルを黄色にする）
        if(midnight == true){
            for (let i = 22; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).addClass("op_shift_1");
            }
			$("#graph_midnight_set_" + current_section_date).val(1);
			$("#graph_midnight_set_" + current_section_date).text('解除');
            $("#graph_midnight_set_" + current_section_date).removeClass("btn-primary");
            $("#graph_midnight_set_" + current_section_date).addClass("btn-danger");
            
            yesterday_midnight_flg = 1;
            //次の日付へ移動
            current_section_date = date_s.setDate(date_s.getDate() + 1);
            for (let i = 0; i < 8; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).addClass("op_shift_1");
            }
            //console.log(current_section_date);
            //次の日付の有休・有休チェックボックスは非活性に
            $("#graph_holiday_set_" + next_date).prop('disabled',true);
            $("#graph_paid_holiday_set_" + next_date).prop('disabled',true);
            
            return;

        }else{

            //次の日付の有休・有休チェックボックスの非活性を戻す
            $("#graph_holiday_set_" + next_date).prop('disabled',false);
            $("#graph_paid_holiday_set_" + next_date).prop('disabled',false);

            yesterday_midnight_flg = 0;
        }

        //第1区間の始端と終端がセットされていなければ当該日の処理終了
        if(start_time_first == "" || end_time_first == ""){
            //次の日付へ移動
            current_section_date = date_s.setDate(date_s.getDate() + 1);
            
            return;
        }else{
            //第2区間がセットされていなければ、第1区間の情報のみグラフ表示
            if(start_time_second == "" || end_time_second == ""){

                set_shift_color(start_time_first,end_time_first,current_section_date,shift_data_ary[key]['user_type']);

                //次の日付へ移動
                current_section_date = date_s.setDate(date_s.getDate() + 1);

                return;

            }else{
                //第1区間のセット
                set_shift_color(start_time_first,end_time_first,current_section_date,shift_data_ary[key]['user_type']);
                //第2区間のセット
                set_shift_color(start_time_second,end_time_second,current_section_date,shift_data_ary[key]['user_type']);
                //次の日付へ移動
                current_section_date = date_s.setDate(date_s.getDate() + 1);
                
                return;

            }

        }

    })//end of foreach()

}

function set_form_by_user(){
    //console.log(shift_data_ary);
    form_clear();
    Object.keys(shift_data_ary).forEach(function(key) {

        var current_date = shift_data_ary[key]['tdbc_shift_date'];

        var start_time_first = shift_data_ary[key]['tdbc_start_time_first'];
        var end_time_first = shift_data_ary[key]['tdbc_end_time_first'];
        var start_time_second = shift_data_ary[key]['tdbc_start_time_second'];
        var end_time_second = shift_data_ary[key]['tdbc_end_time_second'];
        var midnight = shift_data_ary[key]['tdbc_midnight_flg'];
        var holiday = shift_data_ary[key]['tdbc_holiday_flg'];
        var paid_holiday = shift_data_ary[key]['tdbc_paid_holiday_flg'];
        var memo = shift_data_ary[key]['tdbc_memo'];
        var yesterday_midnight_flg = shift_data_ary[key]['yesterday_midnight_flg'];

        //時刻欄の初期化
        $("#bc_first_hour_sta_" + current_date).val('');
        $("#bc_first_min_sta_" + current_date).val('00');
        $("#bc_first_hour_end_" + current_date).val('');
        $("#bc_first_min_end_" + current_date).val('00');
        $("#bc_second_hour_sta_" + current_date).val('');
        $("#bc_second_min_sta_" + current_date).val('00');
        $("#bc_second_hour_end_" + current_date).val('');
        $("#bc_second_min_end_" + current_date).val('00');  
        //休日・夜勤関係欄の初期化
        $("#midnight_" + current_date).prop('checked', false);
        $("#holiday_" + current_date).prop('checked', false);
        $("#paid_holiday_" + current_date).prop('checked', false);
        

        //メモ設定
        $("#tdbc_memo_" + current_date).val(memo);

        //休日設定
        if(holiday == true || paid_holiday == true){
            
            $("#holiday_" + current_date).prop('checked', true);

            //時刻入力欄は非活性に
            $("#bc_first_hour_sta_" + current_date).prop('disabled', true);
            $("#bc_first_min_sta_" + current_date).prop('disabled', true);
            $("#bc_first_hour_end_" + current_date).prop('disabled', true);
            $("#bc_first_min_end_" + current_date).prop('disabled', true);
            $("#bc_second_hour_sta_" + current_date).prop('disabled', true);
            $("#bc_second_min_sta_" + current_date).prop('disabled', true);
            $("#bc_second_hour_end_" + current_date).prop('disabled', true);
            $("#bc_second_min_end_" + current_date).prop('disabled', true);
            
            //さらに有休設定
            if(paid_holiday == true){
                $("#paid_holiday_" + current_date).prop('checked', true);
            }
            
            return;
        }

        //夜勤設定
        if(midnight == true){
            $("#midnight_" + current_date).prop('checked', true);
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

        $("#bc_first_hour_sta_" + current_date).val(first_hour_sta);
        $("#bc_first_min_sta_" + current_date).val(first_min_sta);
        $("#bc_first_hour_end_" + current_date).val(first_hour_end);
        $("#bc_first_min_end_" + current_date).val(first_min_end);

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

        $("#bc_second_hour_sta_" + current_date).val(second_hour_sta);
        $("#bc_second_min_sta_" + current_date).val(second_min_sta);
        $("#bc_second_hour_end_" + current_date).val(second_hour_end);
        $("#bc_second_min_end_" + current_date).val(second_min_end);
    
    })//end of foreach()

}
