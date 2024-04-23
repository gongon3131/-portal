//日付変更時イベント
$(document).on("click",".import_exec", function() {

    //インポート対象となる業務番号を取得
    var business_no = $(this).attr("data-bcno");
    //console.log(business_no);
    //インポート対象となる集計期間を取得
    var import_date_from = $("#import_date_from" + business_no).val();
    var import_date_to = $("#import_date_to" + business_no).val();

    const datetime_from = new Date(import_date_from);
    const date_from = new Date(datetime_from.getFullYear(), datetime_from.getMonth(), datetime_from.getDate());
    const dateStr_from = formatDate(date_from);
    const datetime_to = new Date(import_date_to);
    const date_to = new Date(datetime_to.getFullYear(), datetime_to.getMonth(), datetime_to.getDate());
    const dateStr_to = formatDate(date_to);

    //期間整合性チェック
    if(date_from > date_to){
        alert("集計期間の開始日と終了日の整合性が不正です");
        return false;
    }

    //月またぎエラー
    if(datetime_from.getMonth() != datetime_to.getMonth()){
        alert("月をまたぐ集計はできません");
        return false;
    }

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

            if(json_data == "ok"){

                var file_name = "http://192.168.4.233/new_portal/shift/import_download.php?target_filename=" + dateStr_from + "-" + dateStr_to + "_bno_" + business_no + ".xlsx";
                console.log(file_name);
                $("a#import_link").attr('href',file_name);
                //ボタンの非活性を解除する
                $("#btn_bno_" + business_no).prop("disabled", false);

                alert("出力完了しました");

            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
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

//モーダル画面閉じる
$('#modal_shift_import').on('hidden.bs.modal', function () {

    //フォーム初期化
    $("[id^=import_date_from]").val("");
    $("[id^=import_date_to]").val("");
    $("[id^=btn_bno_]").prop("disabled", true);

});

//モーダル画面閉じる
$('#modal_shift_import').on('shown.bs.modal', function () {

    var today = get_today_date_ymd();
    $("[id^=import_date_from]").val(today);
    $("[id^=import_date_to]").val(today);

});