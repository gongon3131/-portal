//記事投稿
$('#contents_insert').on('click', function(event) { 	

	//記事本文取得
	var html = $(".ql-editor").html();
	//subject
	var subject = $("#subject").val();
	//カテゴリー
	var category = $("#category").val();

	//エラーメッセージ
	var err_mes = "";

	/**入力値チェック */
	//件名
	if(subject == ''){
		if (!confirm('件名が未入力ですが、このまま投稿しますか？')) {
			return false;
		} 
		subject = '(件名なし)';
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
		url:		   "contents_post.php?action=post", 
		scriptCharset: 'utf-8',
		data: 			{
						'subject'	   : subject,
						'category'	   : category,
						'post_contents': html
						},	

		//200 OK
		success: function(json_data) {   

			//登録成功
			if(json_data == "ok"){
				alert("記事投稿しました");
				location.href = "contents_post.php";
			//登録失敗
			}else{
				alert("登録に失敗しました");
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

//カテゴリー編集
$('#category_summary').click(function() {
	console.log("category-edit ");
	$.ajax({
		type:          'post',
		url:		   "contents_post.php?action=get_category", 
		scriptCharset: 'utf-8',
		data: 			{
						},	

		// 200 OK時
		success: function(json_data) {   
			//データ表示描写用HTML生成	
			paging(json_data);
		},

		// HTTPエラー時
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

//カテゴリー編集用TML作成
function paging(json){

	$('#maintable table').remove();

	let contant = '<table class="table table-striped table-hover table-condensed">';
	contant += '<tr>';
	contant += '<th class="w70" nowrap>カテゴリ</th>';
	contant += '<th class="w15" nowrap>編集</th>';
	contant += '<th class="w15" nowrap>削除</th>';
	contant += '</tr>';
	contant += '<tr>';
	contant += '<td>';
	contant += '<input type="text" class="form-control" id="tmct_category_name_0">';
	contant += '</td>';
	contant += '<td>';
	contant += '<button class="btn btn-success" id="category-edit_0" type="button" ><strong>追加</strong></button>';
	contant += '</td>';
	contant += '<td></td>';
	contant += '</tr>';
	
	for (let key in json) {
		contant += '<tr>';
		contant += '<td>';
		contant += '<input type="text" class="form-control" id="tmct_category_name_' + key + '" value="' + json[key] + '" >';
		contant += '</td>';
		contant += '<td>';
		contant += '<button class="btn btn-success" id="category-edit_' + key + '" type="button" ><strong>編集</strong></button>';
		contant += '</td>';
		contant += '<td>';
		contant += '<button class="btn btn-success" id="category-delete_' + key + '" type="button" ><strong>削除</strong></button>';
		contant += '</td>';
		contant += '</tr>';
	}

	contant += '';
	$('#maintable').html(contant);

}

//カテゴリー編集アクション
$(document).on("click","[id^=category-edit]", function() {

	var idname = $(this).attr("id"); 
	var idname_index = idname.replace('category-edit_','');

	//カテゴリー名取得
	var category_name = $('#tmct_category_name_'+idname_index).val();

	$.ajax({
		type:          'post',
		url:		   "contents_post.php?action=category_edit", 
		scriptCharset: 'utf-8',
		data: 			{
						'tmct_category_name':category_name,
						'tmct_id':idname_index
						},	

		// 200 OK時
		success: function(json_data) {   

			//登録成功
			if(json_data == "ok"){
				alert("登録に成功しました");
				location.href = "contents_post.php";
			//登録失敗
			}else{
				alert("登録に失敗しました");
			}
			
		},

		// HTTPエラー時
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

//カテゴリー削除アクション
$(document).on("click","[id^=category-delete]", function() {
	 /* キャンセルの時の処理 */
    if(!confirm('本当に削除しますか？\n（削除対象カテゴリーの記事も同時に削除されます）')){
		return false;
	/*　OKの時の処理 */
    }else{
        
		var idname = $(this).attr("id"); 
		var idname_index = idname.replace('category-delete_','');
		
		$.ajax({
			type:          'post',
			url:		   "contents_post.php?action=category_delete", 
			scriptCharset: 'utf-8',
			data: 			{
							'tmct_id':idname_index
							},	
	
			// 200 OK時
			success: function(json_data) {   
	
				//登録成功
				if(json_data == "ok"){
					alert("削除に成功しました");
					location.href = "contents_post.php";
				//登録失敗
				}else{
					alert("削除に失敗しました");
				}
				
			},
	
			// HTTPエラー時
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

