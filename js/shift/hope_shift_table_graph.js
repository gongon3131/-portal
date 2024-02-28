//希望シフトグラフ表示HTML作成
function make_hope_shift_graph(shift_date){

	let contant = '<tr>';
	contant += '<td class="form_v_middle shift_form_text"><a href="#" data-toggle="modal" data-target="#hope_shift_memo" data-backdrop="static" data-target-date="' + shift_date + '">' + shift_date + '</a><img src="../img/memo.png" class="graph_memo_icn" id="memo_icn_' + shift_date + '"></td>';
    contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_holiday_set_' + shift_date + '">休日</button>';
	contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_paid_holiday_set_' + shift_date + '">有休</button>';
	contant += '<td><button type="button" value="0" class="btn btn-primary btn-sm" id="graph_midnight_set_' + shift_date + '">夜勤</button>';
	contant += '<td id="op-col00_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col01_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col02_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col03_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col04_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col05_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col06_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col07_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col08_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col09_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col10_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col11_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col12_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col13_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col14_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col15_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col16_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col17_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col18_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col19_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col20_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col21_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col22_' + shift_date + '" data-min="00"></td>';
	contant += '<td id="op-col23_' + shift_date + '" data-min="00"></td>';
    contant += '<input type="hidden" value="" id="hope_shift_memo_' + shift_date + '" data-target-date="' + shift_date + '">';
	contant += '</td>';

	return contant;

}

//タブ遷移時に保存されているシフト情報をグラフに反映させる
function set_hope_shift_for_graph(){
    console.log(shift_data_ary);
	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
	var current_section_date = section_sta;
    //前日夜勤フラグ
    var yesterday_midnight_flg = 0;
    //console.log(shift_data_ary);
    //シフト保存用配列を始端日から終端日までループさせる
	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);
        var next_date = get_next_day(current_section_date);
        var start_time_first = shift_data_ary[current_section_date]['tdsh_start_time_first'];
        var end_time_first = shift_data_ary[current_section_date]['tdsh_end_time_first'];
        var start_time_second = shift_data_ary[current_section_date]['tdsh_start_time_second'];
        var end_time_second = shift_data_ary[current_section_date]['tdsh_end_time_second'];
        var midnight = shift_data_ary[current_section_date]['tdsh_midnight_flg'];
        var holiday = shift_data_ary[current_section_date]['tdsh_holiday_flg'];
        var paid_holiday = shift_data_ary[current_section_date]['tdsh_paid_holiday_flg'];
        var memo = shift_data_ary[current_section_date]['tdsh_memo'];

        //console.log(current_section_date);
        //console.log(start_time_first);
        //console.log(end_time_first);

        //メモ情報の反映
        $("#hope_shift_memo_" + current_section_date).val(memo);
        //メモ情報が入っているときは、アイコンを出す
        if(memo != ""){
            $("#memo_icn_" + current_section_date).css("display" , "block");
        }else{
            $("#memo_icn_" + current_section_date).css("display" , "none");
        }

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
            
            continue;
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
            
            continue;

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
            
            continue;
        }else{
            //第2区間がセットされていなければ、第1区間の情報のみグラフ表示
            if(start_time_second == "" || end_time_second == ""){
                
                set_shift_color(start_time_first,end_time_first,current_section_date);

                //次の日付へ移動
                current_section_date = date_s.setDate(date_s.getDate() + 1);

                continue;

            }else{
                //第1区間のセット
                set_shift_color(start_time_first,end_time_first,current_section_date);
                //第2区間のセット
                set_shift_color(start_time_second,end_time_second,current_section_date);
                //次の日付へ移動
                current_section_date = date_s.setDate(date_s.getDate() + 1);
                
                continue;

            }

        }

    }

}

function set_shift_color(start_time,end_time,target_date){

    if(String(start_time).length == 4 && String(end_time).length == 4){

        var start_hour = String(start_time).substring(0,2);
        var start_min = String(start_time).substring(2);
        var end_hour = String(end_time).substring(0,2);
        var end_min = String(end_time).substring(2);

        for (let i = start_hour; i < end_hour; i++){
            $("#op-col" + zeroPadding(i,2) + "_" + target_date).addClass("op_shift_1");
        }

        //開始時刻が30分のとき
        if(start_min == "30"){
            $("#op-col" + zeroPadding(start_hour,2) + "_" + target_date).text("30分");
            $("#op-col" + zeroPadding(start_hour,2) + "_" + target_date).attr("data-min","30");
        }

        //終了時刻が30分のとき       
        if(end_min == "30"){
            $("#op-col" + zeroPadding(end_hour,2) + "_" + target_date).addClass("op_shift_1");
            $("#op-col" + zeroPadding(end_hour,2) + "_" + target_date).text("30分");
            $("#op-col" + zeroPadding(end_hour,2) + "_" + target_date).attr("data-min","30");
        }

    }

}

//シフト色切り替え
$(document).on("dblclick","[id^=op-col]", function() {
	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 
	//クラス名取得
	var class_name = $("#" + idname).attr("class");
    //30分登録モード
    var status_min30 = $("#graph_min30").val();

	if(class_name === undefined || class_name == ""){
		$("#" + idname).addClass("op_shift_1");
        //30分登録モード時には、30分表記
        if(status_min30 == 1){
            $(this).text("30分");
            $(this).attr("data-min","30");
        }
        
	}else if(class_name === "op_shift_1"){
		$("#" + idname).removeClass("op_shift_1");
        $(this).text("");
        $(this).attr("data-min","00");
	}

    //シフト保存
    var target_date = idname.substring(-10);

});

//グラフ上での休日セット
$(document).on("click","[id^=graph_holiday_set_]", function() {

	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 
	//value値を取得
	var status_value = $(this).attr("value"); 

	//ターゲットの日付を取得
	var target_date = idname.replace("graph_holiday_set_" , "");

	//valueが0のときは休日にセットする
	if(status_value == 0){
		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_1");
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).addClass("op_shift_holiday");           
		}
        $("#"+idname).val(1);
        $("#"+idname).text('解除');
        $("#"+idname).removeClass("btn-primary");
        $("#"+idname).addClass("btn-danger");
    
	//valueが1のときは休日解除
	}else if(status_value == 1){

		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_holiday");
		}

        $("#"+idname).val(0);
        $("#"+idname).text('休日');
        $("#"+idname).removeClass("btn-danger");
        $("#"+idname).addClass("btn-primary");
        //有休がセットされているときは、有休も同時に解除する
        $("#graph_paid_holiday_set_" + target_date).val(0);
        $("#graph_paid_holiday_set_" + target_date).text('有休');
        $("#graph_paid_holiday_set_"+target_date).removeClass("btn-danger");
        $("#graph_paid_holiday_set_"+target_date).addClass("btn-primary");
    }

});

//グラフ上での有休セット
$(document).on("click","[id^=graph_paid_holiday_set_]", function() {

	//ダブルクリックされたセルのidを取得
	var idname = $(this).attr("id"); 

	//ターゲットの日付を取得
	var target_date = idname.replace("graph_paid_holiday_set_" , "");
	//休日ボタンのvalue値を取得
	var status_value = $("#graph_holiday_set_" + target_date).attr("value");     

	//valueが0のときは休日にセットする
	if(status_value == 0){

		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_1");
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).addClass("op_shift_holiday");
		}

        $("#"+idname).val(1);
        $("#graph_holiday_set_" + target_date).val(1);
        $("#"+idname).text('解除');
        $("#graph_holiday_set_" + target_date).text('解除');
        $("#"+idname).removeClass("btn-primary");
        $("#"+idname).addClass("btn-danger");
        $("#graph_holiday_set_" + target_date).removeClass("btn-primary");
        $("#graph_holiday_set_" + target_date).addClass("btn-danger");
    
	//valueが1のときは休日解除
	}else if(status_value == 1){

		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_holiday");
		}

        $("#"+idname).val(0);
        $("#graph_holiday_set_" + target_date).val(0);
        $("#"+idname).text('有休');
        $("#graph_holiday_set_" + target_date).text('休日');
        $("#"+idname).removeClass("btn-danger");
        $("#"+idname).addClass("btn-primary");
        $("#graph_holiday_set_" + target_date).removeClass("btn-danger");
        $("#graph_holiday_set_" + target_date).addClass("btn-primary");
    
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

    var date_s = new Date(target_date);
    date_s = new Date(date_s.setDate(date_s.getDate() + 1));
    var date_y = new Date(target_date);
    date_y = new Date(date_y.setDate(date_y.getDate() - 1));
    var year = date_s.getFullYear();
    var month = date_s.getMonth() + 1;
    var day = date_s.getDate();
    var next_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);
    var before_date = date_y.getFullYear() + "-" + zeroPadding(date_y.getMonth() + 1,2) + "-" + zeroPadding(date_y.getDate(),2);
    //console.log(before_date);
	if(status_value == 0){
        //当日のシフトは22時と23時のセルに色をつける
        //まずは当日分のシフト
        //前日に夜勤フラグが立っているときは除外
        if($("#graph_midnight_set_" + before_date).attr("value") != 1){
            for(let i = 0; i < 24; i++){
                $("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_holiday");  
                if(i < 22) {   
                    $("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_1");
                }
            }
        }

		for(let i = 22; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).addClass("op_shift_1");           
		}

        //翌日分のシフト
		for(let i = 0; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + next_date).removeClass("op_shift_holiday"); 
			//$("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_1");       
		}
		for(let i = 0; i < 8; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + next_date).addClass("op_shift_1");           
		}
        $("#graph_holiday_set_" + next_date).prop('disabled',true);
        $("#graph_holiday_set_" + next_date).val(0);
        $("#graph_holiday_set_" + next_date).removeClass("btn-danger");
        $("#graph_holiday_set_" + next_date).addClass("btn-primary");

        $("#graph_paid_holiday_set_" + next_date).prop('disabled',true);
        $("#graph_paid_holiday_set_" + next_date).val(0);
        $("#graph_paid_holiday_set_" + next_date).removeClass("btn-danger");
        $("#graph_paid_holiday_set_" + next_date).addClass("btn-primary");
    
        $("#"+idname).val(1);
        $("#graph_midnight_set_" + target_date).text('解除');
        $("#"+idname).removeClass("btn-primary");
        $("#graph_midnight_set_" + target_date).addClass("btn-danger");

	}else if(status_value == 1){

		for(let i = 22; i < 24; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + target_date).removeClass("op_shift_1");           
		}
		for(let i = 0; i < 8; i++){
			$("#op-col" + zeroPadding(i,2) + "_" + next_date).removeClass("op_shift_1");           
		}
        $("#graph_holiday_set_" + next_date).prop('disabled',false);
        $("#graph_paid_holiday_set_" + next_date).prop('disabled',false);
    
        $("#"+idname).val(0);
        $("#graph_midnight_set_" + target_date).text('夜勤');
        $("#"+idname).removeClass("btn-danger");
        $("#graph_midnight_set_" + target_date).addClass("btn-primary");
        
    }
    
});

//グラフの区間チェック
//3回勤務はNGとする
function chk_section(){

	//期間の始端
	var section_sta = $("#section_sta").val();
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

		/*
		if(zero_hour_class === undefined){
			limit_cnt = 5;
		}else if(zero_hour_class == "op_shift_holiday"){
			limit_cnt = 4;
		}
		*/

		var current_class_name = "";
		var change_cnt = 0;

		for(let i = 0; i < 24; i++){
			var class_name = $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).attr("class"); 
			//console.log(class_name);
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

//メモ情報保存（hiddenに保存)
$(document).on("click","#hope_shift_memo_regist", function() {

    var target_date = $("#hope_shift_memo_target_date").val();

    //入力されたメモ情報を取得
    var memo = $("#hs_memo").val();
    $("#hope_shift_memo_" + target_date).val(memo);

    //メモ情報が空白ならアイコンを非表示
    if(memo != ""){
        $("#memo_icn_" + target_date).css("display" , "block");
    }else{
        $("#memo_icn_" + target_date).css("display" , "none");
    }
});

$('#hope_shift_memo').on('show.bs.modal', function (event) {

    //モーダルを取得
    var modal = $(this);
    
    var button = $(event.relatedTarget);
    var target_date = button.data('target-date');
	$('#shift_memo_target_date').empty();
	$('#shift_memo_target_date').html(target_date);
    //hiddenに保存
    $("#hope_shift_memo_target_date").val(target_date);

    //保存されているメモ情報をフォームに表示
    var memo = $("#hope_shift_memo_" + target_date).val();
    modal.find('#hs_memo').val(memo);
  
});

$('#hope_shift_memo').on('hidden.bs.modal', function (event) {
    $("#hs_memo").val("");

});


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
