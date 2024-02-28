var activated_tab; // 現在のタブ
var previous_tab; // 以前のタブ
var user_authority; //操作権限

//シフト保存用配列
let shift_data_ary = new Object();

//入力フォーム表示
$(window).on('load',function(){

	//テーブルの内容を削除
	$('#maintable').empty();
	$('#maintable_graph').empty();

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

	//操作権限を保存
	user_authority = $("#user_authority").val();
	//保存したらhiddenの値は消去
	$("#user_authority").val("");

    if(section_sta == "" && section_end == ""){
        alert("有効なシフト登録期間はありません");
        return false;
    }
	
	var current_section_date = section_sta;

	//HTML
	let contant_form = "";
	let contant_graph = "";

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

		contant_form += make_hope_shift_form(current_section_date);
		contant_graph += make_hope_shift_graph(current_section_date);

		//シフト保存用配列作成
		var one_shift_ary = new Object();
		one_shift_ary['tdsh_start_time_first'] = "";
		one_shift_ary['tdsh_end_time_first'] = "";
		one_shift_ary['tdsh_start_time_second'] = "";
		one_shift_ary['tdsh_end_time_second'] = "";
		one_shift_ary['tdsh_holiday_flg'] = false;
		one_shift_ary['tdsh_paid_holiday_flg'] = false
		one_shift_ary['tdsh_midnight_flg'] = false;
		one_shift_ary['tdsh_memo'] = "";
		shift_data_ary[current_section_date] = one_shift_ary;

		//次の日付へ移動
		current_section_date = date_s.setDate(date_s.getDate() + 1);
	}

	$('#maintable').html(contant_form);
	$('#maintable_graph').html(contant_graph);

	//ロード時は30分登録ボタンを非表示に
	$('#graph_min30').css('display','none');
	if($("#tmur_user_id").val() != ""){
		get_op_name($("#tmur_user_id").val());
	}

	//ID氏名欄は管理者以外のユーザーは非活性に
	if(user_authority == "1"){
		$("#tmur_user_id").val($("#user_id").val());
        $("#tmur_user_name").val($("#user_name").val());
		$("#tmur_user_id").prop('disabled',true);
        $("#tmur_user_name").prop('disabled',true);
		
	}

});

//OP取得
$(document).on("blur","#tmur_user_id", function() {
	//入力されたユーザーID取得	
	var tmur_user_id = $(this).val();
	if(tmur_user_id != ""){
		get_op_name(tmur_user_id);
	}

});

function get_op_name(tmur_user_id){

	$.ajax({
		type:          'post',
		url:		   "../api/common/get_user_api.php", 
		scriptCharset: 'utf-8',
		data: 			{
						'action'				:'get_one_user',
						'tmur_user_id'			: tmur_user_id					
						},

		// 200 OK
		success: function(json_data) {   
			//console.log(json_data);
			if(json_data == "ng"){
				alert("エラーが発生しました。システム管理者にお問い合わせください。");
			//入力されたIDに該当者なし	
			}else if(json_data == "no"){
				$("#tmur_user_id").val("");
			}else if(json_data != ""){

				//取得したOP名のセット
				$("#tmur_user_name").val(json_data['tmur_user_name']);
				//当該OPの登録済みシフト情報取得
				//期間の始端と終端
				var section_sta = $("#section_sta").val();
				var section_end = $("#section_end").val();
				
				$.ajax({
					type:          'post',
					url:		   "../api/shift/hope_shift_api.php", 
					scriptCharset: 'utf-8',
					data: 			{
									'action'				:'get_hope_shift',
									'section_sta'			: section_sta,
									'section_end'			: section_end,
									'tmur_user_id'			: json_data['tmur_user_id']					
									},
			
					// 200 OK
					success: function(json_data_shift) {   
						if(json_data_shift == "ng"){
							alert("エラーが発生しました。システム管理者にお問い合わせください。");
						}else if(json_data_shift != ""){
							//取得したシフトデータをクライアント側の配列に保存
							shift_data_ary = json_data_shift;
							//フォームクリア
							all_tab_clear();
							//両方のタブにデータをセットする
							set_hope_shift_for_graph();
							set_form_shift_for_form();
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

//タブイベント
$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

	activated_tab = e.target; // 現在のタブ
	previous_tab = e.relatedTarget; // 以前のタブ

	//var tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/hope_shift_regist.php#" , "");
	var current_url = location.href;
	var tab_name = activated_tab.href.replace(current_url+"#" , "");
	//console.log(tab_name);
	//フォーム⇒グラフへのタブ遷移
	if(tab_name == 'graph_show'){

		$('[id^=first_hope_hour_sta]').trigger('blur');
		set_hope_shift_for_graph();
		//30分登録ボタンを表示させる
		$('#graph_min30').css('display','block');
	
	//グラフ⇒フォームへのタブ遷移
	}else if(tab_name == 'form_show'){

		save_hope_shift_for_graph();
		set_form_shift_for_form();
		//30分登録ボタンを非表示に
		$('#graph_min30').css('display','none');

	}

})

//フォームクリア
$(document).on("click","#graph_clear", function() {

	var tab_name = "";

	//現在のタブ名取得
	if(activated_tab === undefined){
		tab_name = "";
	}else{
		tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/hope_shift_regist.php#" , "");
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

	$("[id^=first_hope_hour_sta").prop("disabled",false);
	$("[id^=first_hope_min_sta").prop("disabled",false);
	$("[id^=first_hope_hour_end").prop("disabled",false);
	$("[id^=first_hope_min_end").prop("disabled",false);
	$("[id^=second_hope_hour_sta").prop("disabled",false);
	$("[id^=second_hope_min_sta").prop("disabled",false);
	$("[id^=second_hope_hour_end").prop("disabled",false);
	$("[id^=second_hope_min_end").prop("disabled",false);
}

//全タブデータクリア
function all_tab_clear(){
	graph_clear();
	form_clear();
}

//登録処理
$(document).on("click","#hope_shift_regist", function() {

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

    if(section_sta == "" && section_end == ""){
        return false;
    }
	
	//console.log(activated_tab);
	var tab_name = "";
	if(activated_tab !== undefined){
		tab_name = activated_tab.href.replace("http://192.168.4.233/new_portal/shift/hope_shift_regist.php#" , "");
	}

	//データを配列に保存
	if(tab_name == 'graph_show'){
		save_hope_shift_for_graph();
		set_form_shift_for_form();
	}else if(tab_name == 'form_show'){
		set_hope_shift_for_graph();
	}else if(tab_name == ""){
		save_hope_shift_for_form();
	}

	//グラフの区間チェック
	if(chk_section() == false){
		alert("3区間以上のシフト時間が設定されています");
		return false;
	}

	//エラーフラグ
	var err_form_depli = 0;
	var err_validate_mes = "";

	var current_section_date = section_sta;

	//フォーム上の区間重複チェック
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
		var first_hope_hour_sta = $("#first_hope_hour_sta_" + current_section_date).val();
		var first_hope_hour_end = $("#first_hope_hour_end_" + current_section_date).val();

		//第2区間
		var second_hope_hour_sta = $("#second_hope_hour_sta_" + current_section_date).val();
		var second_hope_hour_end = $("#second_hope_hour_end_" + current_section_date).val();

		if(first_hope_hour_sta != "") {
			if(isNumber(first_hope_hour_sta) == false){
				err_validate_mes = err_validate_mes + current_section_date + "の第1区間の開始時刻の入力値が不正です" + "\n";
			}else{
				if(Number(first_hope_hour_sta) > 24){
					err_validate_mes = err_validate_mes + current_section_date + "の第1区間の開始時刻の入力値が不正です!" + "\n";
				}
			}
		}

		if(first_hope_hour_end != ""){
		if(isNumber(first_hope_hour_end) == false){
				err_validate_mes = err_validate_mes + current_section_date + "の第1区間の終了時刻の入力値が不正です" + "\n";
			}else{
				if(Number(first_hope_hour_end) > 24){
					err_validate_mes = err_validate_mes + current_section_date + "の第1区間の終了時刻の入力値が不正です!" + "\n";
				}
			}
		}

		if(second_hope_hour_sta != ""){
			if(isNumber(second_hope_hour_sta) == false){
				err_validate_mes = err_validate_mes + current_section_date + "の第2区間の入力値が不正です" + "\n";
			}else{
				if($("#second_hope_hour_sta_" + current_section_date).val() > 24){
					err_validate_mes = err_validate_mes + current_section_date + "の第2区間の入力値が不正です" + "\n";
				}
			}
		}

		if(second_hope_hour_end != ""){
			if(isNumber(second_hope_hour_end) == false){
			err_validate_mes = err_validate_mes + current_section_date + "の第2区間の入力値が不正です" + "\n";
			}else{
				if($("#second_hope_hour_end_" + current_section_date).val() > 24){
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

	//対象OPID
	var tmur_user_id = $("#tmur_user_id").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'hope_shift_regist',
						'token'       : $("#csrf_token").val(),
						'tmur_user_id':tmur_user_id,
						'shift_data_ary':JSON.stringify(shift_data_ary)
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("希望シフト登録しました");

				if(user_authority != "9"){
					$("#tmur_user_id").prop('disabled',true);
					$("#tmur_user_name").prop('disabled',true);
				}
							
				$("#tmur_user_id").val("");
				$("#tmur_user_name").val("");
				all_tab_clear();
			//登録失敗
			}else if(json_data == "ng"){
				alert("登録に失敗しました");
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

//登録削除
$(document).on("click","#hope_shift_delete", function() {

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

    if(section_sta == "" && section_end == ""){
        return false;
    }

	if(!window.confirm('対象OPの希望シフトの登録削除します')){
		return false;
	}

	//対象OP
	var tmur_user_id = $("#tmur_user_id").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'hope_shift_delete',
						'section_sta'	  : section_sta,
						'section_end'	  : section_end,
						'tmur_user_id'	  : tmur_user_id
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("削除完了しました");
				$("#tmur_user_id").val("");
				$("#tmur_user_name").val("");
				all_tab_clear();
			//登録失敗
			}else if(json_data == "ng"){
				alert("削除に失敗しました");
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

$(document).on("click","#hope_shift_summary", function() {
	location.href = "hope_shift_summary.php";
});
