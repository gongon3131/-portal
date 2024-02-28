//表示用json
var json;

/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', hope_shift_kensaku_personal);


function hope_shift_kensaku_personal(){

	//操作権限
	var authority = $("#user_authority").val();
	var post_url = "";
	//OP
	if(authority == 1){
		post_url = "../api/shift/hope_shift_api.php";
	//SV
	}else if(authority == 2){
		post_url = "../api/shift/hope_shift_sv_api.php";
	}

	//OPID取得
	var tdsh_user_id = $("#user_id").val();

	$.ajax({
		type:          'post',
		//url:		   "../api/shift/hope_shift_api.php", 
		url:		   post_url, 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'hope_shift_summary_personal',
						'tdsh_user_id'	  : tdsh_user_id
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

	//ユーザー情報
	var user_id = $("#user_id").val();
	var user_name = $("#user_name").val();

    Object.keys(json).forEach(function(key) {
        contant += '<tr >';
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['section'] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['reception_status_text'] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['dead_line'] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['last_update'] + '</td>';
		if(json[key]['reception_status'] == 1){
			contant += '<td class="hope_shift_summary_cell1"><button type="button" data-toggle="modal" data-target="#hope_shift_detail" data-backdrop="static" data-target-username="' + user_name + '" data-target-userid="' + user_id + '" class="btn btn-primary" id="hope_shift_detail' + user_id +'">詳細</button></td>';
		}else{
			contant += '<td></td>';
		}
		if(json[key]['reception_status'] == 0){
			contant += '<td class="hope_shift_summary_cell1"></td>';
		}else if(json[key]['reception_status'] == 1){
			contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_regist" data-userid="' + user_id + '">修正</button></td>';
		}
        contant += '<input type="hidden" id="section_sta" value="' + json[key]['section_sta'] + '">';
        contant += '<input type="hidden" id="section_end" value="' + json[key]['section_end'] + '">';
		contant += '</tr>';
    })					

    $('#maintable').html(contant);

}

//修正ボタン押下
$(document).on("click",".hope_shift_regist", function() {
    var tmur_user_id =  $(this).data('userid');
    var url = "hope_shift_regist.php";
    var param_ary = new Object();
    param_ary['tmur_user_id'] = tmur_user_id;
    post(url,param_ary);
});

