//表示用json
var json;

/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', by_timezone_kensaku);

//日付変更時イベント
$(document).on("change","#date_sta,#date_end", function() {
    by_timezone_kensaku();
});

function by_timezone_kensaku(){

	//期間の始端と終端  
	var date_sta = $("#date_sta").val();
	var date_end = $("#date_end").val();
    
    if(date_sta == "" && date_end == ""){
        alert("有効なシフト登録期間はありません");
        return false;
    }
    
	$.ajax({
		type:          'post',
		url:		   "../api/shift/tsr_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	      : 'summary_by_timezone',
						'date_sta'	  : date_sta,
						'date_end'	  : date_end
						},
		
		// 200 OK
		success: function(json_data) {   

			json = json_data;
            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                paging();
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

function paging(){

	//テーブルの内容を削除
	$('#maintable_by_timezone').empty();

    let contant = '';

    Object.keys(json).forEach(function(key) {
        contant += '<tr >';
        contant += '<td class="hope_shift_summary_cell1"><a href="#" class="shift_by_date" data-target-date="' + key + '">' + key + '</a></td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][0] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][1] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][2] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][3] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][4] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][5] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][6] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][7] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][8] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][9] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][10] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][11] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][12] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][13] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][14] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][15] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][16] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][17] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][18] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][19] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][20] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][21] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][22] + '</td>';
        contant += '<td class="hope_shift_summary_cell1">' + json[key][23] + '</td>';
        contant += '</tr>';
    })					

    $('#maintable_by_timezone').html(contant);

}

//表示ボタン押下
$(document).on("click","#by_timezone_show", function() {
    by_timezone_kensaku();
});

//日付リンク押下
$(document).on("click",".shift_by_date", function() {
    var showen_date =  $(this).data('target-date');
    //var section_sta = $("#date_sta").val();
    //var section_end = $("#date_end").val();
    var section_sta = "";
    var section_end = "";  
    var url = "tsr_shift_by_date.php";
    var param_ary = new Object();
    param_ary['showen_date'] = showen_date;
    param_ary['section_sta'] = section_sta;
    param_ary['section_end'] = section_end;
    
    post(url,param_ary);
});
