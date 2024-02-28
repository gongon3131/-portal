//希望シフト詳細
$('#hope_shift_detail').on('show.bs.modal', function (event) {

    //モーダルを取得
    var modal = $(this);
    
    var button = $(event.relatedTarget);
    var tmur_user_id = button.data('target-userid');
    $('#hope_shift_detail_user_id').html(tmur_user_id);
    var tmur_user_name = button.data('target-username');
    $('#hope_shift_detail_user_name').html(tmur_user_name);

    //シフト詳細取得
	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

	//操作権限
	var authority = $("#user_authority").val();
	var post_url = "";
    var target = $("#target").val();
	//OP
	if(authority == 1){
		post_url = "../api/shift/hope_shift_api.php";
	//SV
	}else if(authority == 2){
        //ただし、勤務シフト表画面からの遷移時はpost_urlは変える
        if($("#shift_by_date").val() == 1){
            post_url = "../api/shift/hope_shift_api.php";
        }else{
            post_url = "../api/shift/hope_shift_sv_api.php";
        }
	}else if(authority == 9){
        if(target == 1){
            post_url = "../api/shift/hope_shift_api.php";
        }else if(target == 2){
            post_url = "../api/shift/hope_shift_sv_api.php";
        }
    }

    console.log("authority:"+authority);
    console.log("shift_by_date:"+$("#shift_by_date").val());
    console.log("target:"+target);

	$.ajax({
		type:          'post',
		//url:		   "../api/shift/hope_shift_api.php", 
		url:		   post_url, 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	  : 'get_one_detail',
						'tmur_user_id'	  : tmur_user_id,
                        'target'          : target,
						'section_sta'	  : section_sta,
						'section_end'	  : section_end
						},
		
		// 200 OK
		success: function(json_data) {   
			json = json_data;
            //console.log("hoge");
            console.log(json_data);
            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                if(authority == 1){
                    paging_detail(json_data);
                //SV
                }else if(authority == 2){

                    if($("#shift_by_date").val() == 1){
                        paging_detail(json_data);
                    }else{
                        paging_detail_sv(json_data);
                    }

                }else if(authority == 9){
                    paging_detail(json_data);
                    if(target == 1){
                        paging_detail(json_data);
                    }else if(target == 2){
                        paging_detail_sv(json_data);
                    }
            

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

$('#hope_shift_detail').on('hidden.bs.modal', function (event) {

});

function paging_detail(json){

	//テーブルの内容を削除
	$('#maintable_detail').empty();

    let contant = '';
    //見出し部分
    contant += '<tr>';
    contant += '<th class="center-block w20">日付</th>';
    contant += '<th class="center-block w25">第1区間</th>';
    contant += '<th class="center-block w25">第2区間</th>';
    contant += '<th class="center-block w30">メモ</th>';
    contant += '</tr>';

    Object.keys(json).forEach(function(key) {

        //第1区間
        var first_hour_sta = "";
        var first_min_sta = "";
        var first_time = "";
        var first_hour_end = "";
        var first_min_end = "";
    
        if(String(json[key]['tdsh_start_time_first']).length == 4 && String(json[key]['tdsh_end_time_first']).length == 4){
            first_hour_sta = String(json[key]['tdsh_start_time_first'] ).substring(0,2);
            first_min_sta = String(json[key]['tdsh_start_time_first'] ).substring(2);
            first_time = first_hour_sta + ":" + first_min_sta;
            first_hour_end = String(json[key]['tdsh_end_time_first'] ).substring(0,2);
            first_min_end = String(json[key]['tdsh_end_time_first'] ).substring(2);
            first_time = first_time + "～" + first_hour_end + ":" + first_min_end;
        }else{
            if(json[key]['tdsh_holiday_flg'] == 1){
                first_time = "休日希望";
            }else if(json[key]['tdsh_paid_holiday_flg'] == 1){
                first_time = "有休希望";
            }else if(String(json[key]['tdsh_start_time_first']).length == 4){
                first_hour_sta = String(json[key]['tdsh_start_time_first'] ).substring(0,2);
                first_min_sta = String(json[key]['tdsh_start_time_first'] ).substring(2);
                first_time = first_hour_sta + ":" + first_min_sta + "～";
            }else if(String(json[key]['tdsh_end_time_first']).length == 4){  
                first_hour_end = String(json[key]['tdsh_end_time_first'] ).substring(0,2);
                first_min_end = String(json[key]['tdsh_end_time_first'] ).substring(2);
                first_time = first_time + "～" + first_hour_end + ":" + first_min_end;
            }else{
                first_time = "希望なし";
            }
        }

        //第2区間
        var second_hour_sta = "";
        var second_min_sta = "";
        var second_time = "";
        var second_hour_end = "";
        var second_min_end = "";
    
        if(String(json[key]['tdsh_start_time_second']).length == 4 && String(json[key]['tdsh_end_time_second']).length == 4){
            var second_hour_sta = String(json[key]['tdsh_start_time_second'] ).substring(0,2);
            var second_min_sta = String(json[key]['tdsh_start_time_second'] ).substring(2);
            var second_time = second_hour_sta + ":" + second_min_sta;
            var second_hour_end = String(json[key]['tdsh_end_time_second'] ).substring(0,2);
            var second_min_end = String(json[key]['tdsh_end_time_second'] ).substring(2);
            second_time = second_time + "～" + second_hour_end + ":" + second_min_end;
        }else{
            if(String(json[key]['tdsh_start_time_second']).length == 4){
                second_hour_sta = String(json[key]['tdsh_start_time_second'] ).substring(0,2);
                second_min_sta = String(json[key]['tdsh_start_time_second'] ).substring(2);
                second_time = second_hour_sta + ":" + second_min_sta + "～";
            }else if(String(json[key]['tdsh_end_time_second']).length == 4){  
                second_hour_end = String(json[key]['tdsh_end_time_second'] ).substring(0,2);
                second_min_end = String(json[key]['tdsh_end_time_second'] ).substring(2);
                second_time = first_time + "～" + second_hour_end + ":" + second_min_end;
            }
        }
        
        contant += '<tr>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['tdsh_shift_date'] + '</td>';//日付
        contant += '<td class="hope_shift_summary_cell1">' + first_time + '</td>';//第1区間
        contant += '<td class="hope_shift_summary_cell1">' + second_time + '</td>';//第2区間
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['tdsh_memo'] + '</td>';//メモ
        contant += '</tr>';
    })					

    $('#maintable_detail').html(contant);

}

function paging_detail_sv(json){

	//テーブルの内容を削除
	$('#maintable_detail').empty();

    let contant = '';
    //見出し部分
    contant += '<tr>';
    contant += '<th class="center-block w15">日付</th>';
    contant += '<th class="center-block w15">希望時間</th>';
    contant += '<th class="center-block w30">自由記述</th>';
    contant += '<th class="center-block w5">固定</th>';
    contant += '<th class="center-block w35">メモ</th>';
    contant += '</tr>';

    Object.keys(json).forEach(function(key) {
        
        contant += '<tr>';
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['tdsv_shift_date'] + '</td>';//日付
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['shift_time_text']  + '</td>';//第1区間
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['tdsv_free_descripsion'] + '</td>';//第2区間
        contant += '<td class="hope_shift_summary_cell1">' + json[key]['tdsv_fixed_flg'] + '</td>';//メモ
        contant += '<td class="hope_shift_summary_cell2">' + json[key]['tdsv_memo'] + '</td>';//メモ
        contant += '</tr>';
    })					

    $('#maintable_detail').html(contant);

}

