//修正ボタン押下
$(document).on("click","#login_confirm", function() {
    //ID
    var user_id = $("#user_id").val();
    //PASS
    var user_pass = $("#user_pass").val();

	$.ajax({
		type:          'post',
		url:		   "index.php", 
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
    


    var tmur_user_id =  $(this).data('userid');
    var url = "hope_shift_regist.php";
    var param_ary = new Object();
    param_ary['tmur_user_id'] = tmur_user_id;
    post(url,param_ary);
});
