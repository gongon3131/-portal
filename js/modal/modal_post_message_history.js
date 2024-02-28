//モーダル閉じるウインドウ
$('#modal_post_message_history').on('hidden.bs.modal', function (event) {
	
});

//送信履歴表示ボタン押下
$(document).on("click","#post_history_show", function() {

	$.ajax({
		type:          'post',
		url:		   "../api/dashboard/post_message_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	  			: 'get_post_message_history',
						'tdms_post_user'		: $("#user_id").val()
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else if(json_data == "ok"){

            }else{

                $("#maintable_post_message_history").empty();

                let contant = '';

                Object.keys(json_data).forEach(function(key) {
                    contant += '<tr>';
                    contant += '<td>' + json_data[key]['post_date'] + '</td>';
                    contant += '<td><a href="#" id="message_detail" data-toggle="modal" data-target="#modal_message_detail" data-backdrop="static">' + json_data[key]['post_title'] + '</a></td>';
                    contant += '<td>' + json_data[key]['post_user'] + '</td>';
                    contant += '<td>' + json_data[key]['post_open_confirm'] + '</td>';
                    contant += '<input type="hidden" id ="tdms_id" value="' + json_data[key]['id'] + '" >';
                    contant += '</tr>';
                })

                $('#maintable_post_message_history').html(contant);

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
