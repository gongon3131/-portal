//load
$(document).ready(function(){
	$('#message_post_area').css('display', 'none');
});

//モーダル閉じるウインドウ
$('#modal_message_detail').on('hidden.bs.modal', function (event) {
	location.reload();
});

//メッセージ返信
$(document).on("click","#message_reply", function() {

	$('#message_post_area').css('display', 'block');
	$('#post_contents_detail').css('display', 'none');
	//送信ボタンのデザイン変更
	$('#message_reply').removeClass('btn-primary');
	$('#message_reply').addClass('btn-danger');
	$('#message_reply').text('送信する');
	$('#message_reply').attr('id', "message_post_rep");

});

//メッセージ送信
$(document).on("click","#message_post", function() {

	//宛先
	var tdms_address_user = $("#tdms_address_user").val();
	//標題
	var tdms_title = $("#tdms_title").val();
	//本文
	var tdms_contents = $("#tdms_contents").val();

	$.ajax({
		type:          'post',
		url:		   "../api/dashboard/post_message_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	  			: 'post_message',
						'token'             	: $("#csrf_token").val(),
						//'tdms_address_user'		: tdms_address_user,
						'tdms_address_user'		: JSON.stringify(tdms_address_user),
						'tdms_title'			: tdms_title,
						'tdms_contents'			: tdms_contents
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else if(json_data == "ok"){
                alert("メッセージを送信しました");
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

//メッセージ返信
$(document).on("click","#message_post_rep", function() {

	//宛先
	var post_user_id = $("#post_user_id").val();
	var tdms_address_user = [post_user_id];
	//標題
	var tdms_title = $("#post_title_detail").text();
	//本文
	var tdms_contents = $("#post_contents_reply").val();

	$.ajax({
		type:          'post',
		url:		   "../api/dashboard/post_message_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	  			: 'post_message',
						'token'             	: $("#csrf_token").val(),
						//'tdms_address_user'		: tdms_address_user,
						'tdms_address_user'		: JSON.stringify(tdms_address_user),
						'tdms_title'			: tdms_title,
						'tdms_contents'			: tdms_contents
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else if(json_data == "ok"){
                alert("メッセージを送信しました");
				//開封確認処理
				$('#message_open').trigger('click');
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

//受信メッセージ詳細表示
$(document).on("click","#message_detail", function() {

	var tdms_id = $(this).attr("data-id");

	$.ajax({
		type:          'post',
		url:		   "../api/dashboard/post_message_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	  			: 'message_detail',
						'tdms_id'				: tdms_id
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{

				//メッセージ詳細をモーダル画面へ表示
				$("#post_user_detail").text(json_data['post_user']);
				$("#post_title_detail").text(json_data['post_title']);

				var post_contents = json_data['post_contents'];
				$("#post_contents_detail").html(post_contents);
				//hidden項目
				$("#post_id").val(json_data['post_id']);
				$("#post_open_confirm").val(json_data['post_open_confirm']);
				$("#post_user_id").val(json_data['post_user_id']);
				//multipleを選択状態に
				$("#tdms_address_user").val(json_data['post_user_id']);


				//開封済みの場合は、ボタン名称を変更する
				if(json_data['post_open_confirm'] == 1){
					$("#message_open").text("閉じる");
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

});

//開封確認処理
$(document).on("click","#message_open", function() {

	//すでに開封済みのメッセージのときはスキップ
	if($("#post_open_confirm").val() == 1){
		return false;
	}

	$.ajax({
		type:          'post',
		url:		   "../api/dashboard/post_message_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
							'action'	  			: 'message_open_confirm',
							'tdms_id'				: $("#post_id").val()
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else if(json_data == "ok"){
                //alert("メッセージ開封確認を送信しました");
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

