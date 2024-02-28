//表示用json
var json;
//1ページ当たり表示する行の数
var displayrows = 20;
//現在ページ
var page = 0;

/**検索条件保存 */
var user_name = "";
var address = "";
var authority = "";


/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', user_kensaku);
//検索実行ボタン押下時
$("#user_kensaku_start").click(1,user_kensaku);

//売上情報取得アクション
function user_kensaku(s_flg){

	page = 0;

	//編集画面から遷移してきたときのフラグ
	var ses_flg = $("#ses_flg").val();

	//検索条件取得
	if(s_flg.data == 1){
		
		user_name = $('#search_user_name').val();
		address = $('#search_address').val();
		authority = $('#search_authority').val();
		
	//初期表示
	}else{
		//編集画面からの遷移のときは、初期化はしない
		if(ses_flg != 1){
			$('#user_kensaku_clear').trigger('click');
		}

	}

	//検索ボタ押下時には、セッション保持は解除する
	if(s_flg.data == 1){
		ses_flg = "";
	}

	$.ajax({
		type:          'post',
		url:		   "../api/user/user_summary_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						//'ses_flg'				: $('#ses_flg').val(),
						'ses_flg'				: ses_flg,
						'action'				:'user_summary',
						'search_user_name'      : user_name,
						'search_address'        : address,
						'search_authority'      : authority				
						},

		// 200 OK
		success: function(json_data) {   
            console.log(json_data);
			json = json_data;
			//データ表示描写用HTML生成	
			paging(page,displayrows,json);
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
			
			// URLを取得
			var url = new URL(window.location.href);
			// URLSearchParamsオブジェクトを取得
			var params = url.searchParams;
			params.delete('ses_flg');

			// アドレスバーのURLからGETパラメータを削除
			history.replaceState('', '', url.pathname);	
			
		}
	})
}

//データ表示部分HTML
function paging(page,displayrows,json) {

	//テーブルの内容を削除
	$('#maintable').empty();

	let contant = '';

	//次ページ最終行の判定
	if ((page+1)*displayrows < json.length) {
		lastrows = (page+1)*displayrows;
	}else{
		lastrows = json.length;
	}

	// データ行を作成
	for (var i = page*displayrows; i < lastrows; i++)  {
		contant += '<tr>';
		contant += '<td>' + json[i]["tmur_user_id"] + '</td>';
		contant += '<td>' + json[i]["tmur_user_name"] + '</td>';
		contant += '<td>' + json[i]["tmur_user_name_kana"] + '</td>';
		contant += '<td>' + json[i]["tmur_authority"] + '</td>';
		contant += '<td>' + json[i]["tmur_is_used"] + '</td>';
		//アクション
		contant += '<td><div class="text-center"><a href="user_regist.php?tmur_id=' + json[i]["tmur_id"] + '" class="btn btn-outline-primary btn-sm action_btn">編集</a>';
		contant += '<button class="delete-action btn btn-outline-danger btn-sm action_btn ml-2" type="button" onclick="user_delete(' + json[i]["tmur_id"] + ');return false;">削除</button>';
		contant += '</div>';
		contant += '</td>';
		contant += '</tr>';
	}
	$('#maintable').html(contant);

	//最初のページに戻ったときは、prevボタンは無効化
	if(page == 0){
		$('.page-item:nth-child(1)').removeClass("page-show");
		$('.page-item:nth-child(1)').addClass("page-hide");
		
	}else{
		$('.page-item:nth-child(1)').removeClass("page-hide");
		$('.page-item:nth-child(1)').addClass("page-show");
		
	}

	//最後のページのときは、nextボタンは無効化
	if(page >= Math.ceil(json.length /displayrows) - 1){
		$('.page-item:nth-child(2)').removeClass("page-show");
		$('.page-item:nth-child(2)').addClass("page-hide");
	}else{
		$('.page-item:nth-child(2)').removeClass("page-hide");
		$('.page-item:nth-child(2)').addClass("page-show");
	}
}

/**ページネーション */
function next_page(){
	if (page < json.length /displayrows - 1 ) {// １ページ前進
		page++;
		paging(page,displayrows,json);
	}		
}

function prev_page(){
	if (page > 0 ) {// １ページ前進
		page--;
		paging(page,displayrows,json);
	}
}

//売上削除処理
function user_delete(tmur_id){

	$.ajax({
		type:          'post',
		url:		   "../api/user/user_regist_api", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						'action' : 'uriage_delete',
						'tdur_id': tdur_id
						},

		// 200 OK
		success: function(json_data) {   
			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("1件削除しました");
				//location.reload();
				location.href = "uriage_summary?ses_flg=1";
			//登録失敗
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

//検索条件のクリア
$('#uriage_kensaku_clear').on('click', function() { 

	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	month = month.toString().padStart( 2, '0');
	var day = today.getDate();
	uriage_date_to = year + "-" + month + "-" + day;
	
	$('#search_uriage_date_from').val("");
	$('#search_uriage_date_to').val(uriage_date_to);
	$('#search_tokuisaki_code').val("");
	$('#search_tokuisaki_name').val("");
	$('#search_shime_date').val("");
	$("input[name='search_seikyu_kbn']:eq(2)").prop('checked', true);

});

function user_delete(tmur_id){

	if(!window.confirm('1件削除します、よろしいですか？')){
		return false;
	}

	$.ajax({
		type:          'post',
		url:		   "../api/user/user_regist_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						'action': 'user_delete',
						'tmur_id': tmur_id
						},

		// 200 OK
		success: function(json_data) {   
			//削除成功
			if(json_data == "ok"){
				alert("1件削除しました");
				location.href = "user_summary.php";
			//削除失敗
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
