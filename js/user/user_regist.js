//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', set_user);

//ユーザー登録処理
$('#user_regist').on('click', function() { 	

	//フォームの内容を取得
	var formData = $('#user_regist_form').serialize();
	
	$.ajax({
		type:          'post',
		url:		   "../api/user/user_regist_api.php",
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:			formData,
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("1件登録しました");
				location.href = "user_summary.php";
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
	
});

$('#tmur_authority').on('change', function() { 	

	console.log($(this).val());
	if($(this).val() == 2){
		$(".business_possesion").css("display","block");
		$(".holiday_manage_selected").css('display','block');

	}else{
		$(".business_possesion").css("display","none");
		$(".holiday_manage_selected").css('display','none');
	}

});



//ユーザー情報セット
function set_user(){

	//ID取得
	var tmur_id = $("#tmur_id").val();
	//IDがないときは新規作成なので、処理終了
	if(tmur_id == ""){
		set_skill_possesion();
		set_business_possesion();
		//標題部分の氏名表示（「新規登録」とする）
		$("#target_user").text("新規登録");
		
		return;
	}

	//ユーザー情報取得
	$.ajax({
		type:          'post',
		url:		   "../api/user/user_regist_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json', 
		scriptCharset: 'utf-8',
		data: 			{
						'action' : 'get_one_user',
						'tmur_id': tmur_id
						},

		// 200 OK
		success: function(json_data) {   
			//console.log(json_data);
			//取得した値をセット
			$("#tmur_id").val(json_data['tmur_id']);//ID
			$("#tmur_user_id").val(json_data['tmur_user_id']);//OPID
			$("#tmur_password").val(json_data['tmur_password']);//パスワード
			$("#tmur_user_name").val(json_data['tmur_user_name']);//氏名
			$("#tmur_user_name_kana").val(json_data['tmur_user_name_kana']);//氏名カナ
			$("#tmur_zipcode").val(json_data['tmur_zipcode']);//郵便番号
			$("#tmur_address").val(json_data['tmur_address']);//住所
			$("#tmur_apart").val(json_data['tmur_apart']);//建物名
			$("#tmur_tel").val(json_data['tmur_tel']);//電話番号
			$("#tmur_mobile_phone").val(json_data['tmur_mobile_phone']);//携帯電話
			$("#tmur_birthday").val(json_data['tmur_birthday']);//生年月日
			$("#tmur_mail").val(json_data['tmur_mail']);//メールアドレス
			$("#tmur_hire_date").val(json_data['tmur_hire_date']);//入社日
			$("#tmur_authority").val(json_data['tmur_authority']);//操作権限
			$("#tmur_authority").addClass("col-form-body");
			$("#tmur_is_used").val(json_data['tmur_is_used']);//在籍フラグ
			$("#tmur_is_used").addClass("col-form-body");
			$("#tmur_memo").val(json_data['tmur_memo']);//メモ
			set_skill_possesion(json_data['skill_posession']);
			console.log(json_data['skill_posession']);
			set_business_possesion(json_data['business_posession']);
			//休日管理
			if(json_data['tmur_authority'] == 1){
				$(".holiday_manage_selected").css('display','none');
			}else{
				$("#tmur_holiday_manage").val(json_data['tmur_holiday_manage']);
			}

			//標題部分の氏名表示
			$("#target_user").text(json_data['tmur_user_id'] + "：" + json_data['tmur_user_name']);
			//担当可能業務の表示・非表示
			if(json_data['tmur_authority'] == 2){
				$(".business_possesion").css("display","block");
			}else{
				$(".business_possesion").css("display","none");
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
			
			/**取得時のGETパラメータを削除 */
			// URLを取得
			var url = new URL(window.location.href);
			// URLSearchParamsオブジェクトを取得
			var params = url.searchParams;
			params.delete('tmts_id');
			// アドレスバーのURLからGETパラメータを削除
			history.replaceState('', '', url.pathname);	
			
		}
	})	
	
}

//保有スキルのセット
function set_skill_possesion(skill_ary){

	//スキル登録リストHTML
	var skill_html = $(".skill_select").html();
	let contant = '';

	if(skill_ary === undefined){
		init_skill_area();
		return false;
	}

	$('.skill_possesion_area').empty();

    Object.keys(skill_ary).forEach(function(key) {

		var skill_html_w = skill_html.replace('name="tdsp_skill_possesion"', 'name="tdsp_skill_possesion_' + skill_ary[key]['tmbc_business_id'] + '"');
		skill_html_w = skill_html_w.replace('id="tdsp_skill_possesion"', 'id="tdsp_skill_possesion_' + skill_ary[key]['tmbc_business_id'] + '"');
		
		contant += '<tr>';
		contant += '<th class="fieldLabel medium">';
		contant += '<label class="col-sm-12 col-form-label">' + skill_ary[key]['tmbc_business_name'] + '</label>';
		contant += '</th>';
		contant += '<td class="fieldValue medium">';
		contant += '<div class="col-md-12">';
		contant += skill_html_w;
		contant += '</div>';
		contant += '</td>';
		contant += '</tr>';
	})		

	$('.skill_possesion_area').html(contant);

	//値のセット
	Object.keys(skill_ary).forEach(function(key) {
		$("#tdsp_skill_possesion_" + skill_ary[key]['tmbc_business_id']).val(skill_ary[key]['tdsp_skill_possesion']);
		//class追加
		$("#tdsp_skill_possesion_" + skill_ary[key]['tmbc_business_id']).addClass("col-form-body");
	})		

}

//担当可能業務のセット
function set_business_possesion(skill_ary){
	console.log(skill_ary);
	//スキル登録リストHTML
	var skill_html = $(".business_select").html();
	let contant = '';

	if(skill_ary === undefined){
		init_business_area();
		return false;
	}

	$('.business_possesion_area').empty();

    Object.keys(skill_ary).forEach(function(key) {

		var skill_html_w = skill_html.replace('name="tdbp_business_possesion"', 'name="tdbp_business_possesion_' + skill_ary[key]['tmbc_business_id'] + '"');
		skill_html_w = skill_html_w.replace('id="tdbp_business_possesion"', 'id="tdbp_business_possesion_' + skill_ary[key]['tmbc_business_id'] + '"');
		
		contant += '<tr>';
		contant += '<th class="fieldLabel medium">';
		contant += '<label class="col-sm-12 col-form-label">' + skill_ary[key]['tmbc_business_name'] + '</label>';
		contant += '</th>';
		contant += '<td class="fieldValue medium">';
		contant += '<div class="col-md-12">';
		contant += skill_html_w;
		contant += '</div>';
		contant += '</td>';
		contant += '</tr>';
	})		

	$('.business_possesion_area').html(contant);

	//値のセット
	Object.keys(skill_ary).forEach(function(key) {
		$("#tdbp_business_possesion_" + skill_ary[key]['tmbc_business_id']).val(skill_ary[key]['tdbp_business_possesion']);
		//class追加
		$("#tdbp_business_possesion_" + skill_ary[key]['tmbc_business_id']).addClass("col-form-body");
	})		

}


function init_skill_area(){

	$.ajax({
		type:          'post',
		url:		   "../api/user/user_regist_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						'action' : 'get_all_business'
						},

		// 200 OK
		success: function(json_data) {   
			console.log(json_data);
			//スキル登録リストHTML
			var skill_html = $(".skill_select").html();
			let contant = '';

			$('.skill_possesion_area').empty();

			Object.keys(json_data).forEach(function(key) {

				var skill_html_w = skill_html.replace('id="tdsp_skill_possesion"', 'id="tdsp_skill_possesion_' + json_data[key]['tmbc_business_id'] + '"');
				skill_html_w = skill_html_w.replace('value="9"' , 'value="9" selected');
				contant += '<tr>';
				contant += '<th class="fieldLabel medium">';
				contant += '<label class="col-sm-12 col-form-label">' + json_data[key]['tmbc_business_name'] + '</label>';
				contant += '</th>';
				contant += '<td class="fieldValue medium">';
				contant += '<div class="col-md-12">';
				contant += skill_html_w;
				contant += '</div>';
				contant += '</td>';
				contant += '</tr>';
			})		

			$('.skill_possesion_area').html(contant);

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

function init_business_area(){

	$.ajax({
		type:          'post',
		url:		   "../api/user/user_regist_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data: 			{
						'action' : 'get_all_business'
						},

		// 200 OK
		success: function(json_data) {   
			console.log(json_data);
			//スキル登録リストHTML
			var skill_html = $(".business_select").html();
			let contant = '';

			$('.business_possesion_area').empty();

			Object.keys(json_data).forEach(function(key) {

				var skill_html_w = skill_html.replace('id="tdbp_business_possesion"', 'id="tdbp_business_possesion_' + json_data[key]['tmbc_business_id'] + '"');
				skill_html_w = skill_html_w.replace('value="9"' , 'value="9" selected');
				contant += '<tr>';
				contant += '<th class="fieldLabel medium">';
				contant += '<label class="col-sm-12 col-form-label">' + json_data[key]['tmbc_business_name'] + '</label>';
				contant += '</th>';
				contant += '<td class="fieldValue medium">';
				contant += '<div class="col-md-12">';
				contant += skill_html_w;
				contant += '</div>';
				contant += '</td>';
				contant += '</tr>';
			})		

			$('.business_possesion_area').html(contant);

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


//戻るボタン
$('#regist_cancel').on('click', function() { 	
	location.href = "user_summary.php";
});