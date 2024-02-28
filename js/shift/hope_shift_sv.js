var activated_tab; // 現在のタブ
var previous_tab; // 以前のタブ
var user_authority; //操作権限

//シフト保存用配列
let shift_data_ary = new Object();

//入力フォーム表示
$(window).on('load',function(){

	//テーブルの内容を削除
	$('#maintable').empty();

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

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

		contant_form += make_hope_shift_form(current_section_date);

		//シフト保存用配列作成
		var one_shift_ary = new Object();
		one_shift_ary['tdsv_shift_time'] = "";
		one_shift_ary['tdsv_free_descripsion'] = "";
		one_shift_ary['tdsv_memo'] = "";
		one_shift_ary['tdsv_fixed_flg'] = 0;
		shift_data_ary[current_section_date] = one_shift_ary;

		//次の日付へ移動
		current_section_date = date_s.setDate(date_s.getDate() + 1);
	}

	$('#maintable').html(contant_form);
	$('#shift_select_list').empty();

	//ID氏名欄は管理者以外のユーザーは非活性に
	if(user_authority == "1" || user_authority == "2"){
		$("#tmur_user_id").val($("#user_id").val());
        $("#tmur_user_name").val($("#user_name").val());
		$("#tmur_user_id").prop('disabled',true);
        $("#tmur_user_name").prop('disabled',true);
		
	}
	if($("#tmur_user_id").val() != ""){
		get_op_name($("#tmur_user_id").val());
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
					url:		   "../api/shift/hope_shift_sv_api.php", 
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
							//console.log(json_data_shift);
							shift_data_ary = json_data_shift;
							set_hope_shift();
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

//希望シフト入力フォームHTML作成（フォーム）
function make_hope_shift_form(shift_date){

	let shift_list_html = $("#shift_select_list").html();
	shift_list_html = shift_list_html.replace('name="tdsv_shift_time"', 'name="tdsv_shift_time_' + shift_date + '"');
	shift_list_html = shift_list_html.replace('id="tdsv_shift_time"', 'id="tdsv_shift_time_' + shift_date + '"' + 'data-shift_date="' + shift_date + '"');
	//shift_list_html = shift_list_html.replace('value="0"', 'value="0" selected');

	let contant = '';
	contant += '<tr>';
	contant += '<td class="align-middle">' + shift_date + '</td>';
	contant += '<td>';
	contant += '<div class="form-inline">';
	//contant += '<div class="form_center">';
	contant += shift_list_html;
	//contant += '&nbsp;～&nbsp;';
	//contant += '</div>';
	contant += '</div>';
	contant += '</td>';
	contant += '<td><input type="text" name="tssv_free_descripsion_' + shift_date + '" value="" id="tdsv_free_descripsion_' + shift_date + '" class="form-control"></td>';
	contant += '<td><input type="checkbox" name="tdsv_fixed_flg_' + shift_date + '" id="tdsv_fixed_flg_' + shift_date + '" value="1" class="form-control"></td>';
	contant += '<td><input type="text" name="tdsv_memo_' + shift_date + '" value="" id="tdsv_memo_' + shift_date + '" class="form-control"></td>';
	contant += '</tr>';

	return contant;

}

$(document).on("change","[id^=tdsv_shift_time_]", function() {

	console.log($(this).val());

	var target_shift_date = $(this).attr('data-shift_date');
	if($(this).val() == 99){
		$("#tdsv_free_descripsion_" + target_shift_date).attr('placeholder','シフト時間をXX-XXの形式で入力してください');
	}

});


//登録ボタン押下
$(document).on("click","#hope_shift_regist", function() {

	var chk = hope_shift_save();
	//console.log(shift_data_ary);
	if(chk == false){
		return false;
	}

	//対象OPID
	var tmur_user_id = $("#tmur_user_id").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_sv_api.php", 
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

				if(user_authority == "9"){
					$("#tmur_user_id").prop('disabled',true);
					$("#tmur_user_name").prop('disabled',true);
					$("#tmur_user_id").val("");
					$("#tmur_user_name").val("");	
					all_tab_clear();
				}else{
					location.reload();
				}


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

function all_tab_clear(){
	
	$("[id^=tdsv_shift_time_]").val(0);
	$("[id^=tdsv_free_descripsion_]").val("");
	$("[id^=tdsv_fixed_flg_]").prop('checked',"false");
	$("[id^=tdsv_memo_]").val("");

}

function set_hope_shift(){

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
	var current_section_date = section_sta;
	
	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);		

		if(shift_data_ary[current_section_date]['tdsv_shift_time'] != ""){
			var tdsv_shift_time = shift_data_ary[current_section_date]['tdsv_shift_time'];
		}else{
			var tdsv_shift_time = 0;
		}

		if(shift_data_ary[current_section_date]['tdsv_shift_time'] == 99){
			$("#tdsv_free_descripsion_" + current_section_date).attr('placeholder','シフト時間をXX-XXの形式で入力してください');
		}

        var tdsv_free_descripsion = shift_data_ary[current_section_date]['tdsv_free_descripsion'];
        var tdsv_fixed_flg = shift_data_ary[current_section_date]['tdsv_fixed_flg'];
        var tdsv_memo = shift_data_ary[current_section_date]['tdsv_memo'];

        $("#tdsv_shift_time_" + current_section_date).val(tdsv_shift_time);
        $("#tdsv_free_descripsion_" + current_section_date).val(tdsv_free_descripsion);
		if(tdsv_fixed_flg == 1){
			$("#tdsv_fixed_flg_" + current_section_date).prop('checked', true);
		}else if(tdsv_fixed_flg == 0){
			$("#tdsv_fixed_flg_" + current_section_date).prop('checked', false);
		}
        $("#tdsv_memo_" + current_section_date).val(tdsv_memo);

        //次の日付へ移動
        current_section_date = date_s.setDate(date_s.getDate() + 1);
		
	}
	
}

function hope_shift_save(){
	//console.log(shift_data_ary);
	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
	var current_section_date = section_sta;
	//形式チェックエラーメッセージ
	var err_mes = "";

	//シフト「その他」のときは自由記述欄がブランクだとエラーに
	while(new Date(current_section_date) <= new Date(section_end)){
		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

		if($("#tdsv_shift_time_" + current_section_date).val() == 99){
			//console.log(current_section_date);
			//自由記述
			var free_descripsion = $("#tdsv_free_descripsion_" + current_section_date).val();
			free_descripsion = toHalfWidth(free_descripsion);
			//形式チェック
			var format_chk = 0;
			if($("#tdsv_free_descripsion_" + current_section_date).val() == ""){
				alert("希望シフト「その他」を選択したときは、自由記述欄の入力は必須です");
				return false;
			//自由記述欄の形式チェック⇐ここから
			}else{
				var pattern = /^\d{1,2}-\d{1,2}$/;

				if(pattern.test(free_descripsion) == false){
					format_chk = 1;
					err_mes = err_mes + current_section_date + "の自由記述欄の入力値の形式が不正です" + "\n";
				}else{
					//ハイフンを区切り文字として分割
					var hour_ary = free_descripsion.split('-');
					var start_hour = hour_ary[0];
					var end_hour = hour_ary[1];
					//開始時間は0から23の間で
					if(start_hour > 23){
						format_chk = 1;
						err_mes = err_mes + current_section_date + "の自由記述欄の開始時刻は0時～23時の間で設定してください" + "\n";
					}
					//終了時間は1から24の間で
					if(end_hour > 0 && end_hour > 24){
						format_chk = 1;
						err_mes = err_mes + current_section_date + "の自由記述欄の終了時刻は0時～23時の間で設定してください" + "\n";
					}
					//開始時刻と終了時刻の整合性
					if(Number(start_hour) >= Number(end_hour)){
						format_chk = 1;
						err_mes = err_mes + current_section_date + "の自由記述欄の開始時刻は終了時刻より前にする必要があります" + "\n";
					}

				}

			}

		}

		//次の日付へ移動
		current_section_date = date_s.setDate(date_s.getDate() + 1);

	}

	if(format_chk == 1){
		alert(err_mes);
		return false;
	}

	current_section_date = section_sta;

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

		shift_data_ary[current_section_date]['tdsv_shift_time'] = $("#tdsv_shift_time_" + current_section_date).val();
		shift_data_ary[current_section_date]['tdsv_free_descripsion'] = $("#tdsv_free_descripsion_" + current_section_date).val();
		if($("#tdsv_fixed_flg_" + current_section_date).prop('checked') == true){
			shift_data_ary[current_section_date]['tdsv_fixed_flg'] = 1;
		}else{
			shift_data_ary[current_section_date]['tdsv_fixed_flg'] = 0;
		}

		shift_data_ary[current_section_date]['tdsv_memo'] = $("#tdsv_memo_" + current_section_date).val();

		//次の日付へ移動
		current_section_date = date_s.setDate(date_s.getDate() + 1);
	}
	
	//console.log(shift_data_ary);
	return true;
}

//登録削除
$(document).on("click","#hope_shift_delete", function() {

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

    if(section_sta == "" && section_end == ""){
        return false;
    }

	if(!window.confirm('希望シフトの登録削除します。よろしいですか？')){
		return false;
	}

	//対象OP
	var tmur_user_id = $("#tmur_user_id").val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_sv_api.php", 
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
