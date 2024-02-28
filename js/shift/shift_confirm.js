//表示用json
var json;

/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', before_confirm_shift_kensaku);


function before_confirm_shift_kensaku(){

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

    if(section_sta == "" && section_end == ""){
        alert("有効なシフト登録期間はありません");
        return false;
    }

	$.ajax({
		type:          'post',
		url:		   "../api/shift/before_confirm_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'before_confirm_summary',
						'section_sta'	  : section_sta,
						'section_end'	  : section_end
						},
		
		// 200 OK
		success: function(json_data) {   

			json = json_data;
            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                paging();
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

function paging(){

	//テーブルの内容を削除
	$('#maintable').empty();

    let contant = '';

    Object.keys(json).forEach(function(key) {
        contant += '<tr >';
		//確定前
		if(json[key]['tdbc_release_flg'] == 0){
			contant += '<td><input type="checkbox" name="confirm_' + json[key]['tdbc_shift_date'] + '" id="confirm_' + json[key]['tdbc_shift_date'] + '" value="1" class="form-control"></td>';
		//確定済み
		}else if(json[key]['tdbc_release_flg'] == 1){
			contant += '<td><input type="checkbox" name="confirm_' + json[key]['tdbc_shift_date'] + '" id="confirm_' + json[key]['tdbc_shift_date'] + '" value="1" class="form-control" checked></td>';
		}
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['tdbc_shift_date'] + '</td>';
		if(json[key]['tdbc_release_flg'] == 0){
			contant += '<td class="confirm_status_text0">' + json[key]['tdbc_release_text'] + '</td>';
		}else if(json[key]['tdbc_release_flg'] == 1){
			contant += '<td class="confirm_status_text1">' + json[key]['tdbc_release_text'] + '</td>';
		}
        contant += '<td class="non_regist_confirm">' + json[key]['non_regist_num'] + '</td>';
        contant += '</tr>';
    })					

    $('#maintable').html(contant);

}

//期間内一括確定
$(document).on("click","#all_shift_confirm", function() {
	$('[id^=confirm_]').prop('checked', true);
});

//確定ボタン押下
$(document).on("click","#shift_confirm", function() {

	var shift_data_ary = json;

	var non_regist_flg = 0;

	//未登録者が存在する場合は登録不可
    Object.keys(shift_data_ary).forEach(function(key) {
		if($("#confirm_" + shift_data_ary[key]['tdbc_shift_date']).prop("checked") == true){
			if(Number(json[key]['non_regist_num']) > 0){
				non_regist_flg = 1;
			}
		}
    })	

	if(non_regist_flg == 1){
		alert("登録されていないOPがいるので確定できません");
	}else{

		//対象シフトの数
		var target_date_num = 0;

		Object.keys(shift_data_ary).forEach(function(key) {
			if($("#confirm_" + shift_data_ary[key]['tdbc_shift_date']).prop("checked") == true){
				if(shift_data_ary[key]['tdbc_release_flg'] == 1){
					delete shift_data_ary[key];
				}else{
					json[key]['confirm_check'] = 1;
					target_date_num ++;
				}
			}else{
				json[key]['confirm_check'] = 0;
			}
		})	

		json = json.filter(Boolean);

		if(target_date_num < 1){
			alert("選択されている日付がありません");
		}else{

			$.ajax({
				type:          'post',
				url:		   "../api/shift/before_confirm_api.php", 
				//受信データ形式（jsonもしくはtextを選択する)
				//dataType:      'json',
				//contentType:   'application/json',
				scriptCharset: 'utf-8',
				data:          {
								'action'	  : 'shift_confirm_release',
								'token'       : $("#csrf_token").val(),
								'shift_data_ary':JSON.stringify(json)
								},
				
				// 200 OK
				success: function(json_data) {   
	
					var err_mes = "";
	
					//登録成功
					if(json_data == "ok"){
						alert("選択日のシフトが公開されました");
						location.reload();
					//登録失敗
					}else if(json_data == "ng"){
						alert("公開に失敗しました");
					}else if(json_data == "ng_token"){
						alert("トークンエラー");
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
				
		}

	}

});