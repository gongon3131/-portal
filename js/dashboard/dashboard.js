$(document).on("change","#non_confirm_only", function() {

    var chk_confirm = 0;

    //未開封のみ表示にチェックが入っているとき
    if( $(this).prop('checked') == true){
        chk_confirm = 0;
    }else if( $(this).prop('checked') == false){
        chk_confirm = 1;
    }

	$.ajax({
		type:          'post',
		url:		   "../api/dashboard/post_message_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
							'action'	  			: 'get_message_list',
                            'tdms_open_confirm'     : chk_confirm,
							'tdms_address_user'		: $("#user_id").val()
						},
		
		// 200 OK
		success: function(json_data) {   

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                $("#maintable_message").empty();

                let contant = '';

                Object.keys(json_data).forEach(function(key) {
                    contant += '<tr>';
                    contant += '<td>' + json_data[key]['post_date'] + '</td>';
                    contant += '<td>';
					if(json_data[key]['post_open_confirm'] == 0){
						contant += '<img class="message_icn" src="http://192.168.4.233/new_portal/img/message_non_open.png" alt="未開封">';
					}else{
						contant += '<img class="message_icn" src="http://192.168.4.233/new_portal/img/message_open.png" alt="開封済">';
					}
					contant += '<a href="#" id="message_detail" data-id="' + json_data[key]['id'] + '" data-toggle="modal" data-target="#modal_message_detail" data-backdrop="static">' + json_data[key]['post_title'] + '</a></td>';
                    contant += '<td>' + json_data[key]['post_user'] + '</td>';
                    //contant += '<input type="hidden" id ="tdms_id" value="' + json_data[key]['id'] + '" >';
                    contant += '</tr>';
                })

                $('#maintable_message').html(contant);
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
