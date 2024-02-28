//希望シフト期間管理
$('#business_category_edit_modal').on('show.bs.modal', function (event) {
	set_business();
});

function set_business(){

	$.ajax({
		type:          'post',
		url:		   "../api/shift/business_assign_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'get_business_color'
						},
		
		// 200 OK
		success: function(json_data) {   

			//json = json_data;
			//console.log(json);

            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                paging_business(json_data);
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

//モーダル閉じるウインドウ
$('#business_category_edit_modal').on('hidden.bs.modal', function (event) {
	//location.reload();

	$("#tmbc_business_id_0").val("");
	$("#tmbc_business_name_0").val("");
	$("#tmbc_color_code_0").val("#ff0000");
	$("#tmbc_import_class_0").val(99);
	$("#tmbc_memo_0").val("");

});

function paging_business(json){

	//テーブルの内容を削除
	$('#maintable_business').empty();
    let contant = '';

    Object.keys(json).forEach(function(key) {

		//インポート区分用HTML取得
		var import_html = "";
		import_html = $('#import_select').html();

        contant += '<tr>';
		contant += '<td class="business_color_summary_cell1"><button type="button" class="btn btn-success " id="business_color_delete" data-id="' + json[key]['tmbc_business_id'] + '">削除</button></td>';
		contant += '<td class="business_color_summary_cell1"><button type="button" class="btn btn-success business_category_regist" id="" data-id="' + json[key]['tmbc_business_id'] + '">修正</button></td>';
		contant += '<td><input type="text" class="form-control business_id" value="' + json[key]['tmbc_business_id'] + '" id="tmbc_business_id_' + json[key]['tmbc_business_id'] +  '" ></td>';
		contant += '<td><input type="text" class="form-control" value="' + json[key]['tmbc_business_name'] + '" id="tmbc_business_name_' + json[key]['tmbc_business_id'] + '"></td>';
		contant += '<td><input type="color" class="form-control" value="' + json[key]['tmbc_color_code'] + '" id="tmbc_color_code_' + json[key]['tmbc_business_id'] + '"></td>';
		//tmbc_import_classのid名を変更
		import_html = import_html.replace('id="tmbc_import_class_0"','id="tmbc_import_class_' + json[key]['tmbc_business_id']+'"')
		contant += '<td>' + import_html + '</td>';		
		contant += '<td><input type="text" class="form-control" value="' + json[key]['tmbc_memo'] + '" id="tmbc_memo_' + json[key]['tmbc_business_id'] + '"></td>';
        contant += '</tr>';

    })					

    $('#maintable_business').html(contant);

	//インポート区分のselect
    Object.keys(json).forEach(function(key) {
		$("#tmbc_import_class_" + json[key]['tmbc_business_id']).val(json[key]['tmbc_import_class']);
    })

}

//業務カラー登録
$(document).on("click",".business_category_regist", function() {

	let business_id_ary = [];
	$.each($('.business_id'), function(i, val){
		business_id_ary.push($(this).val());
	});

	//id取得
	var id = $(this).data('id');

	//業務番号
	var tmbc_business_id = $("#tmbc_business_id_" + id).val();
	//業務名
	var tmbc_business_name = $("#tmbc_business_name_" + id).val();
	//カラーコード
	var tmbc_color_code = $("#tmbc_color_code_" + id).val();
	//インポート区分
	var tmbc_import_class = $("#tmbc_import_class_" + id).val();
	//メモ
	var tmbc_memo = $("#tmbc_memo_" + id).val();
	//新規登録のときは重複チェックをする
	if(id == 0){
		if (business_id_ary.includes(tmbc_business_id)) {
			alert('入力された業務番号は既に存在します。');
			return false;
		}
	}

	$.ajax({
		type:          'post',
		url:		   "../api/shift/business_assign_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	  			: 'business_category_regist',
						'tmbc_business_id'		: tmbc_business_id,
						'tmbc_business_name'	: tmbc_business_name,
						'tmbc_color_code'		: tmbc_color_code,
						'tmbc_import_class'		: tmbc_import_class,
						'tmbc_memo'				: tmbc_memo,
						'token'					: $("#csrf_token").val()
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
			}else if(json_data == "token_ng"){
                alert("トークンエラーです");
            }else if(json_data == "ok"){
                alert("登録完了しました");
				//set_section_data();
				location.reload();
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

