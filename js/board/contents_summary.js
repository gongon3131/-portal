/**グローバル変数初期化 */
//表示用json
var json;
//1ページ当たり表示する行の数
var displayrows = 0;
//現在ページ
var page = 0;
//選択カテゴリ
var select_category = 0;
//カテゴリー名
var tmct_category_name = "";

//**ブラウザバック禁止処理 */
$(function(){
	/*
	history.pushState(null, null, null); //ブラウザバック無効化
	//ブラウザバックボタン押下時
	$(window).on("popstate", function (event) {
	  history.pushState(null, null, null);
	  //アラートメッセージ
	  window.alert('前のページに戻る場合、前に戻るボタンから戻ってください。');
	});
	*/
});

/**検索結果表示処理 */
//$(function() {

	/**検索アクション */
	function get_contents(category){
		//console.log("hoge");
		select_category = category;
		//現在ページ数
		page = 0;	
		//1ページ表示件数
		displayrows = $('#setting_displayrows').val();

		$.ajax({
			type:          'post',
			url:		   "contents_summary.php?action=get_contents", 
			scriptCharset: 'utf-8',
			data: 			{
							'category': category
							},	

			// 200 OK時
			success: function(json_data) {   

				json = json_data;
				
				//データ表示描写用HTML生成	
				paging(page,displayrows,json);

				//新着表示のときのみ、タイトル部分の表記処理を入れる
				if(category == 0){
					$('#category_title').html("新着記事一覧");
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

	}//end of function get_contents

	//ページ進む
	$(document).on('click', '#nextbtn', function(){
		if (page < json.length /displayrows - 1 ) {// １ページ前進
			//console.log(page);
			page++;
			paging(page,displayrows,json);
		}
	});
	//ページ戻る
	$(document).on('click', '#prevbtn', function(){
		if (page > 0 ) {// １ページ前進
			page--;
			paging(page,displayrows,json);
		}
	});

	$(document).on('click', '#hogefuga', function(){
		console.log("hogehoge2");
		location.href = "contents_post.php";
	});

	/**イベントハンドラ */
	//ロード時
	$(window).load(get_contents(0));

	//検索実行ボタン押下時
	//$("#uriage_kensaku_start").click(get_contents(select_category));

	/**一覧表示用HTML生成処理 */
	function paging(page,displayrows,json) {

		//投稿者取得
		var post_user = $('#user_id').val();
		//console.log(post_user);

		//テーブルの内容を削除
		$('#maintable_sumarry table').remove();

		let contant = '';

		//次ページ最終行の判定
		if ((page+1)*displayrows < json.length) {
			lastrows = (page+1)*displayrows;
		}else{
			lastrows = json.length;
		}

		contant += '<table class="table table-striped table-hover table-condensed contents_summary_table">';
		contant += '<thead>';
		contant += '<tr>';
		contant += '<th class="w50">標題</th>';
		contant += '<th class="w15">カテゴリ</th>';
		contant += '<th class="w20">投稿者</th>';
		contant += '<th class="w15">更新日時</th>';		
		contant += '</tr>';
		contant += '</thead>';
		contant += '<tbody>';


		// データ行を作成
		for (var i = page*displayrows; i < lastrows; i++)  {

			contant += '<tr>';

			//td要素を生成
			//標題
			contant += '<td class="">';
			contant += '<a href="" data-toggle="modal" data-target="#contents_detail" data-backdrop="static" onclick="contents_detail(' + json[i]["tdbr_id"] + '); return false;">';
			contant += json[i]["tdbr_subject"];
			contant += '</a>';
			if(json[i]["tdbr_post_user"] == post_user){
				contant += '&nbsp&nbsp<button onclick="contents_edit(' + json[i]["tdbr_id"] + '); return false;" class="btn btn-success btn-sm" id="contents_edit" type="button"><strong>編集</strong></button>';
			}
			contant += '</td>';
			//カテゴリ
			contant += '<td>';
			contant += json[i]["tdbr_category_name"];
			contant += '</td>';
			//投稿者
			contant += '<td>';
			contant += json[i]["tdur_post_user_name"];
			contant += '</td>';
			//更新日時
			contant += '<td>';
			contant += json[i]["tdbr_update_date"];
			contant += '</td>';

			contant += '</tr>';
		}
		
		contant += '</table>';
		//console.log(contant);
		$('#maintable_sumarry').html(contant);

		//カテゴリ名の表記部分
		get_category_name();

		//全件数
		//$('#all_row').html(json.length);
		//1ページあたり件数
		$('#displayrows1').html(displayrows);
		$('#displayrows2').html(displayrows);
		//件数表示（form）
		//$('#row_from').html(page*displayrows+1);
		//件数表示（to）
		//$('#row_to').html(lastrows);

		//「前のN件へ」の表示切り替え
		if(page > 0){
			$('#prevbtn').show();
			$('#prevbtn_bar').show();
		}else{
			$('#prevbtn').hide();
			$('#prevbtn_bar').hide();
		}
		//「次のN件へ」の表示切り替え
		if (page < json.length /displayrows - 1 ) {
			$('#nextbtn').show();
			$('#nextbtn_bar').show();
		}else{
			$('#nextbtn').hide();
			$('#nextbtn_bar').hide();
		}

	};// end of function paging

//});// end of function 

function get_category_name(){

	$.ajax({
		type:          'post',
		url:		   "contents_summary.php?action=get_category", 
		scriptCharset: 'utf-8',
		data: 			{
						'category_id': select_category
						},	

		// 200 OK時
		success: function(json_data) {   
			if (json_data['tmct_category_name'] == null) {

			}else{	
				$('#category_title').html(json_data['tmct_category_name']);
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

function contents_detail(id){

	$.ajax({
		type:          'post',
		url:		   "contents_post.php?action=detail", 
		scriptCharset: 'utf-8',
		data: 			{
						'contents_id': id
						},	

		// 200 OK時
		success: function(json_data) {   

			//データ表示描写用HTML生成	
			paging_detail(json_data);

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

//記事表示用HTML作成
function paging_detail(json){

	$('#maintable table').remove();
	$('.modal-header').empty();

	let contant = '<table class="multicol" width="100%">';
	contant += '<tr valign="top">';
	contant += '<td>';
	contant += '<div class="vr_viewTitle clearfix">';
	contant += '<div class="marginFull">';
	contant += '<table width="100%">';
	contant += '<tr>';
	contant += '<td class="vr_viewTitleAreaCategory">';
	contant += '<span class="vr_viewTitleAreaSubject"><img src="../../portal_74/img/bulletin16.png" align=absmiddle>';
	contant += '</span>';
	contant += '件名：' + json['tdbr_subject'];
	contant += '</td>';
	contant += '<td align="right" nowrap>';
	contant += '<table>';
	contant += '<tr>';
	contant += '<td nowrap>';
	contant += '</td>';
	contant += '<td nowrap>';
	contant += '</td>';
	contant += '</tr>';
	contant += '</table>';
	contant += '</td>';
	contant += '</tr>';
	contant += '</table>';
	contant += '</div>';
	contant += '<hr>';
	contant += '<div>';
	contant += '<table class="vr_viewTitleSub">';
	contant += '<tr>';
	contant += '<td>投稿者</td>';
	contant += '<td>：</td>';
	contant += '<td>';
	contant += '<b><img class="profileImage" src="../../portal_74/img/user20.png" style="width: 20px; height: 20px;" align=absmiddle>';
	contant += json['tmur_user_name'] + '';
	contant += '</b>　　　　　';
	contant += '投稿日時：' + json['tdbr_create_date'] + '&nbsp;&nbsp;最終更新日：' + json['tdbr_update_date'] ;
	contant += '</td>';
	contant += '</tr>';
	contant += '</table>';
	contant += '</div>';
	contant += '<hr>';
	contant += '</div>';
	contant += '</td>';
	contant += '</tr>';
	contant += '</table>';
	$('.modal-header').html(contant);
	contant = "";
	contant += '<div class="modal-min-height">';
	contant += json['tdbr_contents'];
	contant += '</div>';
	contant += '';
	$('#maintable').html(contant);

}

//投稿画面表示
$(document).on('click', '#contents_post', function(){
	console.log("hogehoge2");
	location.href = "contents_post.php";
});

//編集画面表示
function contents_edit(id){
	location.href = "contents_post.php?action=edit_show&id="+id;
}

