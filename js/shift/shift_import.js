//日付変更時イベント
$(document).on("click",".import_exec", function() {

    //インポート対象となる業務番号を取得
    var business_no = $(this).attr("data-bcno");
    //console.log(business_no);
    //インポート対象となる集計期間を取得
    var import_date_from = $("#import_date_from" + business_no).val();
    var import_date_to = $("#import_date_to" + business_no).val();

    $.ajax({
        type:          'post',
        url:		   "../api/shift/shift_import_api.php", 
        //受信データ形式（jsonもしくはtextを選択する)
        //dataType:      'json',
        //contentType:   'application/json',
        scriptCharset: 'utf-8',
        data:          {
                        'action'	  : 'shift_import',
                        //'token'       : $("#csrf_token").val(),
                        'target_business_no':business_no,
                        'target_date_from':import_date_from,
                        'target_date_to':import_date_to
                        
                        },
        
        // 200 OK
        success: function(json_data) {   

            var err_mes = "";

            //登録成功
            if(json_data == "ok"){
                alert("選択日のシフトが公開されました");
                //location.reload();
            //登録失敗
            }else if(json_data == "ng"){
                alert("公開に失敗しました");
            }else if(json_data == "ng_token"){
                alert("トークンエラー");
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

