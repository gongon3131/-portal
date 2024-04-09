//希望シフト期間管理
$('#hope_shift_section').on('show.bs.modal', function (event) {
	set_section_data();
});

function set_section_data(){

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'get_regist_reception_status'
						},
		
		// 200 OK
		success: function(json_data) {   

			json = json_data;
            if(json_data == ""){
                //alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                paging_section(json_data);
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
$('#hope_shift_section').on('hidden.bs.modal', function (event) {
	location.reload();
});

function paging_section(json){

	//テーブルの内容を削除
	$('#maintable_section').empty();

    let contant = '';
    contant += '<tr>';
	contant += '<td></td>';
    contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_section_regist" data-id="">登録</button></td>';
    contant += '<td><input type="date" class="form-control" value="" id="tshs_start_date"></td>';
    contant += '<td><input type="date" class="form-control" value="" id="tshs_end_date"></td>';
    contant += '<td><input type="date" class="form-control" value="" id="tshs_dead_line"></td>';
    contant += '<td><input type="date" class="form-control" value="" id="tshs_delete_date"></td>';
    contant += '</tr>';

    Object.keys(json).forEach(function(key) {
        
        contant += '<tr>';
        if(json[key]['tshs_reception_flg'] == 0){  
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_section_status" data-status="1" data-id="' + json[key]['tshs_id'] + '">受付</button></td>';
        }else if(json[key]['tshs_reception_flg'] == 1){ 
            contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_section_status" data-status="0" data-id="' + json[key]['tshs_id'] + '">解除</button></td>';
        }  
		contant += '<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_section_regist"  data-id="' + json[key]['tshs_id'] + '">修正</button></td>';
        contant += '<td><input type="date" class="form-control" value="' + json[key]['tshs_start_date'] + '" id="tshs_start_date' + json[key]['tshs_id'] + '"></td>';
        contant += '<td><input type="date" class="form-control" value="' + json[key]['tshs_end_date'] + '" id="tshs_end_date' + json[key]['tshs_id'] + '"></td>';
        contant += '<td><input type="date" class="form-control" value="' + json[key]['tshs_dead_line'] + '" id="tshs_dead_line' + json[key]['tshs_id'] + '"></td>';
        contant += '<td><input type="date" class="form-control" value="' + json[key]['tshs_delete_date'] + '" id="tshs_delete_date' + json[key]['tshs_id'] + '"></td>';
        contant += '</tr>';

    })					

    $('#maintable_section').html(contant);

}

//シフト期間登録
$(document).on("click",".hope_shift_section_regist", function() {

	//id取得
	var tshs_id = $(this).data('id');

	//開始日
	var tshs_start_date = $("#tshs_start_date" + tshs_id).val();
	//終了日
	var tshs_end_date = $("#tshs_end_date" + tshs_id).val();
	//締切日
	var tshs_dead_line = $("#tshs_dead_line" + tshs_id).val();
	//データ消去日
	var tshs_delete_date = $("#tshs_delete_date" + tshs_id).val();

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:           {
						'action'	  			: 'hope_shift_section_regist',
						'tshs_id'				: tshs_id,
						'tshs_start_date'		: tshs_start_date,
						'tshs_end_date'			: tshs_end_date,
						'tshs_dead_line'		: tshs_dead_line,
						'tshs_delete_date'		: tshs_delete_date
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else if(json_data == "ok"){
                alert("新規期間を登録しました");
				//$("#section_sta").val(tshs_start_date);
				//$("#section_end").val(tshs_end_date);
				set_section_data();
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

//受付中／解除切り替え
$(document).on("click",".hope_shift_section_status", function() {
	//対象データのID取得
    var tshs_id =  $(this).data('id');
	//現在のステータスを取得（0：解除中 1：受付中）
	var current_status = $(this).data('status');

	$.ajax({
		type:          'post',
		url:		   "../api/shift/hope_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'reception_status_update',
						'current_status': current_status,
						'tshs_id'		: tshs_id
						},
		
		// 200 OK
		success: function(json_data) {  
			
			var err_mes = "";

            if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else if(json_data == "ok"){
				set_section_data();
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