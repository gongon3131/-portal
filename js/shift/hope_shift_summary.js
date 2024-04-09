//表示用json
var json;

/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', hope_shift_kensaku);


function hope_shift_kensaku(){

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

    if(section_sta == "" && section_end == ""){
        alert("有効なシフト登録期間はありません");
        return false;
    }

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'hope_shift_summary',
						'target'     	  : $("#target").val(),
						'section_sta'	  : section_sta,
						'section_end'	  : section_end
						},
		
		// 200 OK
		success: function(json_data) {   

			json = json_data;
            if(json_data == ""){
                //alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
				if($("#target").val() == 1){
					paging();
				}else if($("#target").val() == 2){
					paging_sv();
				}
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
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['tmur_user_id'] + '</td>';
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['tmur_user_name'] + '</td>';
        if(json[key]['tdsh_shift_date'] == 0){
            contant += '<td class="hope_shift_summary_unregistered hope_shift_summary_cell1">未登録</td>';
        }else if(json[key]['tdsh_shift_date'] == 1){
            contant += '<td class="hope_shift_summary_registered hope_shift_summary_cell1">登録済</td>';
        }
        if(json[key]['tdsh_update_date'] == null){
            contant += '<td class="hope_shift_summary_cell1"></td>';
            contant += '<td class="hope_shift_summary_cell1"></td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_regist" data-userid="' + json[key]['tmur_user_id'] + '" data-target="1">登録</button></td>';
            contant += '<td class="hope_shift_summary_cell1"></td>';
        }else{
            contant += '<td class="hope_shift_summary_cell1">' + json[key]['tdsh_update_date'] + '</td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" data-toggle="modal" data-target="#hope_shift_detail" data-backdrop="static" data-target-username="' + json[key]['tmur_user_name'] + '" data-target-userid="' + json[key]['tmur_user_id'] + '" class="btn btn-primary" id="hope_shift_detail' + json[key]['tmur_user_id'] +'">詳細</button></td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_regist" data-userid="' + json[key]['tmur_user_id'] + '" data-target="1">修正</button></td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-info hope_shift_reflection" data-userid="' + json[key]['tmur_user_id'] + '">反映</button></td>';
        }
        contant += '</tr>';
    })					

    $('#maintable').html(contant);

}

function paging_sv(){

	//テーブルの内容を削除
	$('#maintable').empty();

    let contant = '';

    Object.keys(json).forEach(function(key) {
        contant += '<tr >';
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['tmur_user_id'] + '</td>';
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['tmur_user_name'] + '</td>';
        if(json[key]['tdsv_shift_date'] == 0){
            contant += '<td class="hope_shift_summary_unregistered hope_shift_summary_cell1">未登録</td>';
        }else if(json[key]['tdsv_shift_date'] == 1){
            contant += '<td class="hope_shift_summary_registered hope_shift_summary_cell1">登録済</td>';
        }
        if(json[key]['tdsv_update_date'] == null){
            contant += '<td class="hope_shift_summary_cell1"></td>';
            contant += '<td class="hope_shift_summary_cell1"></td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_regist" data-userid="' + json[key]['tmur_user_id'] + '" data-target="2">登録</button></td>';
            contant += '<td class="hope_shift_summary_cell1"></td>';
        }else{
            contant += '<td class="hope_shift_summary_cell1">' + json[key]['tdsv_update_date'] + '</td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" data-toggle="modal" data-target="#hope_shift_detail" data-backdrop="static" data-target-username="' + json[key]['tmur_user_name'] + '" data-target-userid="' + json[key]['tmur_user_id'] + '" class="btn btn-primary" id="hope_shift_detail' + json[key]['tmur_user_id'] +'">詳細</button></td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_regist" data-userid="' + json[key]['tmur_user_id'] + '" data-target="2">修正</button></td>';
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-info hope_shift_reflection_sv" data-userid="' + json[key]['tmur_user_id'] + '">反映</button></td>';
        }
        contant += '</tr>';
    })					

    $('#maintable').html(contant);

}

//修正ボタン押下
$(document).on("click",".hope_shift_regist", function() {
    var tmur_user_id =  $(this).data('userid');
	console.log(tmur_user_id);
	//画面ターゲット
	var target = $(this).data('target');
    var url = "hope_shift_regist.php";
    var param_ary = new Object();
    param_ary['tmur_user_id'] = tmur_user_id;
    param_ary['target'] = target;
    post(url,param_ary);
});

//反映ボタン押下（OP）
$(document).on("click",".hope_shift_reflection", function() {

    var tmur_user_id =  $(this).data('userid');
	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
    
	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'hope_shift_reflection',
						'section_sta'	  : section_sta,
						'section_end'	  : section_end,
						'tmur_user_id'	  : tmur_user_id
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("確定前シフト表に反映されました");
			//登録失敗
			}else if(json_data == "ng"){
				alert("反映に失敗しました");
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

//反映ボタン押下（SV）
$(document).on("click",".hope_shift_reflection_sv", function() {

    var tmur_user_id =  $(this).data('userid');
	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
    
	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'hope_shift_reflection_sv',
						'section_sta'	  : section_sta,
						'section_end'	  : section_end,
						'tmur_user_id'	  : tmur_user_id
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("確定前シフト表に反映されました");
			//登録失敗
			}else if(json_data == "ng"){
				alert("反映に失敗しました");
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