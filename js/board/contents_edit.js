//記事編集
$('#contents_edit').on('click', function(event) { 	

	//記事本文取得
	var html = $(".ql-editor").html();
	//subject
	var subject = $("#subject").val();
	//カテゴリー
	var category = $("#category").val();
	//記事番号
	var id = $("#contents_id").val();

	//エラーメッセ維持
	var err_mes = "";
	/**入力値チェック */
	//件名
	if(subject == ''){
		if (!confirm('件名が未入力ですが、このまま投稿しますか？')) {
			return false;
		} 
	}
	//カテゴリー
	if(subject == 0 || subject == ''){
		err_mes += "カテゴリーが選択されていません。\n"
	}
	//本文
	if(html == '<p><br></p>' || html == ''){
		err_mes += "本文が入力されていません。\n"
	}	
	//エラーメッセージ送出
	if(err_mes != ''){
		alert(err_mes);
		return false;
	}

	$.ajax({
		type:          'post',
		url:		   "contents_post.php?action=edit", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						'id'		   : id,
						'subject'	   : subject,
						'category'	   : category,
						'post_contents': html
						},	

		//200 OK
		success: function(json_data) {   

			//登録成功
			if(json_data == "ok"){
				alert("記事編集しました");
				location.href = "contents_summary.php";
			//登録失敗
			}else{
				alert("編集に失敗しました");
			}

		},

		//HTTPエラー
		error: function(XMLHttpRequest, textStatus, errorThrown) {         
			alert("エラーが発生しました。システム管理者にお問い合わせください。");
			console.log("XMLHttpRequest : " + XMLHttpRequest.status);
			console.log("textStatus     : " + textStatus);
			console.log("errorThrown    : " + errorThrown.message);	
		},

		//成功・失敗に関わらず通信が終了した際の処理
		complete: function() {     

		}

	})	

});

//記事削除
$('#contents_delete').on('click', function(event) { 	

	// もしキャンセルをクリックしたら
	if (!confirm('本当に削除しますか？')) {
		// submitボタンの効果をキャンセルし、クリックしても何も起きない
		return false;
	// 「OK」をクリックした際の処理を記述
	} else {
		//記事番号
		var id = $("#contents_id").val();

		$.ajax({
			type:          'post',
			url:		   "contents_post.php?action=delete", 
			//受信データ形式（jsonもしくはtextを選択する)
			//dataType:      'json',
			//contentType:   'application/json',
			scriptCharset: 'utf-8',
			data: 			{
							'id'		   : id
							},	

			//200 OK
			success: function(json_data) {   

				//登録成功
				if(json_data == "ok"){
					alert("記事削除しました");
					location.href = "contents_summary.php";
				//登録失敗
				}else{
					alert("削除に失敗しました");
				}

			},

			//HTTPエラー
			error: function(XMLHttpRequest, textStatus, errorThrown) {         
				alert("エラーが発生しました。システム管理者にお問い合わせください。");
				console.log("XMLHttpRequest : " + XMLHttpRequest.status);
				console.log("textStatus     : " + textStatus);
				console.log("errorThrown    : " + errorThrown.message);	
			},

			//成功・失敗に関わらず通信が終了した際の処理
			complete: function() {     

			}

	})	

	}

});


// ファイルアップロード
function upload_file_with_ajax(file){
    var formData = new FormData();
    formData.append('file', file);

    $.ajax('/include/upload_img' , {
      type: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      error: function() {
        // アップロードエラー処理
      },
      success: function(res) {
        // アップロード成功処理 res.fileName
      }
    });
}

