//表示用json
var json;
//シフト保存用配列
let shift_data_ary = new Object();
//残休日数保存用配列
let remaining_holiday_ary = new Object();
//合計人数カウント用配列
let shift_count_by_time = new Object();
var activated_tab; // 現在のタブ
var previous_tab; // 以前のタブ

var shift_select_html; //シフト時間セレクトボックスHTML
var shift_data_list_html; //シフト時間セレクトボックスHTML
/**シフトセレクトボックスイベント用 */
var selected_user_id;
var selected_shift_date;
var g_current_shift_num;

const more = $('[id^=shift_cell_]');

/**イベントハンドラ */
//ロード時（デフォルトでは請求前データ全件出力）
$(window).on('load', sv_shift_kensaku);

//日付変更時イベント
$(document).on("change","#section_list", function() {

    by_date_kensaku();
});

function sv_shift_kensaku(){

    //シフト期間表示コンボボックスのcss
    $("#section_list").addClass('ml-5');
    //シフト期間選択リストのid値取得
    var tshs_id = $("#section_list").val();

    //シフト時間のセレクトボックスHTMLを保存しておく
    shift_select_html = $('.shift_number_select').html();
    //シフト時間のデータリストHTMLを保尊しておく
    shift_data_list_html = $('.shift_data_list').html();
    //保存したらテンプレートは削除しておく
    $('.shift_number_select').empty();
    $('.shift_data_list').empty();
    
    var sv_user_num = $("#sv_col_num").val();
    sv_user_num = Number(sv_user_num)  + 1;
    var width = 100 / Number(sv_user_num) 
    //$('.before_sv_cell').css('width',width + '%');
    //$('.before_sv_cell_date').css('width',width + '%');
    //$('.before_sv_cell').css('width', '40vw');
    //$('.before_sv_cell_date').css('width', '40vw');
    //$('.before_sv_cell').css('width', '40vw');
    //$('.before_sv_cell_date').css('width', '40vw');

	//期間の始端と終端  
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
    
    if(section_sta == "" && section_end == ""){
        alert("有効なシフト登録期間はありません");
        return false;
    }
    
	$.ajax({
		type:          'post',
		url:		   "../api/shift/sv_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	      : 'summary_sv',
                        'tshs_id'       :tshs_id,
						'date_sta'	  : section_sta,
						'date_end'	  : section_end
						},
		
		// 200 OK
		success: function(json_data) {   
			shift_data_ary = json_data;

            if(json_data == ""){
                alert("対象データがありません");
            }else if(json_data == "ng"){
                alert("エラーが発生しました。システム管理者にお問い合わせください。");
            }else{
                //データ表示描写用HTML生成	
                //console.log(shift_data_ary);
                paging_form();

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

function paging_form(){

	//テーブルの内容を削除
	$('#maintable').empty();

    let contant = '';

    Object.keys(shift_data_ary).forEach(function(key) {

        contant += '<tr>';
        //日付
        contant += '<th class="sticky_row">' + key + '</th>';
        //console.log(shift_data_ary[key]);
        Object.keys(shift_data_ary[key]).forEach(function(key2) {

            var tdbs_user_id = shift_data_ary[key][key2]['tdbs_user_id'];//ユーザーID
            var tdbs_shift_time = shift_data_ary[key][key2]['tdbs_shift_time'];//シフト時間
            if(tdbs_shift_time == null){
                tdbs_shift_time = "";
            }
            var tdbs_shift_time_text = shift_data_ary[key][key2]['tdbs_shift_time_text'];//シフト時間（テキスト）
            var tdbs_fixed_flg = shift_data_ary[key][key2]['tdbs_fixed_flg'];//変更なしフラグ
            var tdbs_memo = shift_data_ary[key][key2]['tdbs_memo'];//メモ

            //シフト時間が99その他のときは、テキスト表示は自由記述欄の文言とする
            if(tdbs_shift_time == 99){
                tdbs_shift_time_text = shift_data_ary[key][key2]['tdbs_free_descripsion'];
            }   

            //console.log(shift_data_ary[key][key2]);
            //変更なしの場合はセル色は黄色に
            if(tdbs_fixed_flg == 1){
                if(tdbs_memo == ""){
                    contant += '<td class="shift_' + tdbs_user_id + ' non_chenge" id="shift_cell_' + tdbs_user_id + '_' + key + '" data-memo="' + tdbs_memo + '" data-disp-mode="0" data-fixed="' + tdbs_fixed_flg + '" data-shift-val="' + tdbs_shift_time + '" data-user-id="' + tdbs_user_id + '" data-shift-date="' + key + '">' + tdbs_shift_time_text + '<a hre="#" data-toggle="modal" data-target="#sv_shift_memo" data-backdrop="static" data-target-memo-userid="' + tdbs_user_id + '" data-target-memo-shift-date="' + key + '"><img src="../img/memo.png" class="sv_shift_memo_icn_no" id="memo_icn_' + tdbs_user_id + '_' + key + '"></a></td>';
                }else{
                    contant += '<td class="shift_' + tdbs_user_id + ' non_chenge" id="shift_cell_' + tdbs_user_id + '_' + key + '" data-memo="' + tdbs_memo + '" data-disp-mode="0" data-fixed="' + tdbs_fixed_flg + '" data-shift-val="' + tdbs_shift_time + '" data-user-id="' + tdbs_user_id + '" data-shift-date="' + key + '">' + tdbs_shift_time_text + '<a hre="#" data-toggle="modal" data-target="#sv_shift_memo" data-backdrop="static" data-target-memo-userid="' + tdbs_user_id + '" data-target-memo-shift-date="' + key + '"><img src="../img/memo.png" class="sv_shift_memo_icn" id="memo_icn_' + tdbs_user_id + '_' + key + '"></a></td>';
                }
            }else{
                if(tdbs_memo == ""){
                    contant += '<td class="shift_' + tdbs_user_id + ' " id="shift_cell_' + tdbs_user_id + '_' + key + '" data-memo="' + tdbs_memo + '" data-disp-mode="0" data-fixed="' + tdbs_fixed_flg + '" data-shift-val="' + tdbs_shift_time + '" data-user-id="' + tdbs_user_id + '" data-shift-date="' + key + '">' + tdbs_shift_time_text + '<a hre="#" data-toggle="modal" data-target="#sv_shift_memo" data-backdrop="static" data-target-memo-userid="' + tdbs_user_id + '" data-target-memo-shift-date="' + key + '"><img src="../img/memo.png" class="sv_shift_memo_icn_no" id="memo_icn_' + tdbs_user_id + '_' + key + '"></a></td>';
                }else{
                    contant += '<td class="shift_' + tdbs_user_id + ' " id="shift_cell_' + tdbs_user_id + '_' + key + '" data-memo="' + tdbs_memo + '" data-disp-mode="0" data-fixed="' + tdbs_fixed_flg + '" data-shift-val="' + tdbs_shift_time + '" data-user-id="' + tdbs_user_id + '" data-shift-date="' + key + '">' + tdbs_shift_time_text + '<a hre="#" data-toggle="modal" data-target="#sv_shift_memo" data-backdrop="static" data-target-memo-userid="' + tdbs_user_id + '" data-target-memo-shift-date="' + key + '"><img src="../img/memo.png" class="sv_shift_memo_icn" id="memo_icn_' + tdbs_user_id + '_' + key + '"></a></td>';
                }
            }

            //休日管理設定がないときは、休日欄を非表示に
            /*
            if(){

            }
            $("#scheduled_holiday_" + tdbs_user_id).text('');
            $("#carry_over_holiday_" + tdbs_user_id).text('');
            $("#holiday_" + tdbs_user_id).text('');
            $("#half_holiday_" + tdbs_user_id).text('');
            $("#paid_holiday_" + tdbs_user_id).text('');
            $("#remaining_holiday_" + tdbs_user_id).text('');
            */


        })

        contant += '</tr>';

    })					

    $('#maintable').html(contant);

    //所定休日の設定
    $(".shol").text($("#carry_over_holiday").val());

    //管理者ユーザーのみ前月繰越の数を編集可とする
    if($("#user_authority").val() == 9){
        $(".chol").attr("contenteditable","true");
    }

    set_holiday_total();

}

//contenteditable改行禁止処理
$(document).on("input keydown keyup keypress change","[id^=carry_over_holiday]", function(e){
		
    // 改行の入力を禁止
    if (e.which == 13) {
        return false;
    }
   
    // 改行のペーストを禁止
    var txt = $(this).text();
    var replace2 = txt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
    $(this).text(replace2);

})

//休日数集計処理
function set_holiday_total(){

    var holiday_num = 0;
    var holiday_half_num = 0;
    var paid_holiday_num = 0;

    let user_ary = new Object();

    //対象ユーザーID取得
    $(".target_user_id").each(function(index, element) {
        user_ary[index] = $(element).val();
    });
    
    //console.log(user_ary);
    Object.keys(user_ary).forEach(function(key) {
        //console.log(user_ary[key]);
        if($("#holiday_manage_" + user_ary[key]).val() == 1){
            console.log(user_ary[key]);
            var key_id = user_ary[key];

            holiday_num = 0;
            holiday_half_num = 0;
            paid_holiday_num = 0;
        
            $(".shift_" + key_id).each(function(index, element) {
                var shift = $(element).text();
                var shift_number = $(element).attr('data-shift-val');
                //半休の判定を文字列から取得する
                let monthAry = shift.split('-');
                var start_hour = Number(zeroPadding(monthAry[0],2));
                var end_hour = Number(zeroPadding(monthAry[1],2));
                var hour_diff = end_hour - start_hour
                //console.log(shift_number);
    
                //休日の判定
                if(shift_number == 20){
                    holiday_num = holiday_num + 1;
                //半休の判定
                }else if(hour_diff == 4 || hour_diff == 5){
                    holiday_half_num = holiday_half_num + 1;
                //有休の判定
                }else if(shift_number == 30){
                    paid_holiday_num = paid_holiday_num + 1;
                }
    
            });
    
            //集計した休日情報を表に反映させる
            //休日数
            $("#holiday_" + key_id).text(holiday_num);
            //半休数
            $("#half_holiday_" + key_id).text(holiday_half_num);
            //有休数
            $("#paid_holiday_" + key_id).text(paid_holiday_num);
            //残休数の計算（所定休日＋前月繰越）－（休日数＋半休数／２）
            var scheduled_holiday = Number($("#scheduled_holiday_" + key_id).text()) ;
            var carry_over_holiday = Number($("#carry_over_holiday_" + key_id).text()) ;
            var remaining_holiday = (scheduled_holiday + carry_over_holiday) - (holiday_num + holiday_half_num / 2);
    
            $("#remaining_holiday_" + key_id).text(remaining_holiday);

        }else{

            $("#scheduled_holiday_" + user_ary[key]).text('');
            $("#carry_over_holiday_" + user_ary[key]).text('');
            $("#holiday_" + user_ary[key]).text('');
            $("#half_holiday_" + user_ary[key]).text('');
            $("#paid_holiday_" + user_ary[key]).text('');
            $("#remaining_holiday_" + user_ary[key]).text('');
            $("#carry_over_holiday_" + user_ary[key]).attr("contenteditable","false");
        }

    })					

}

$(document).on("input","[id^=carry_over_holiday_]", function() {
    set_holiday_total();
});

$(document).on("click","body", function() {
    //選択された値を取得
    //var selected_shift_number = $("#tdbs_shift_time_" + selected_user_id + "_" + selected_shift_date).val();
    /*
    //当該セルに選択値をセット
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).empty();
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).html("希望なし");
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).attr('data-shift-val',0);
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).attr('data-disp-mode',0);
    //グローバル変数の初期化
    selected_user_id = "";
    selected_shift_date = "";
    */
});

//シフト編集（ダブルクリックで発火させる）
$(document).on("dblclick","[id^=shift_cell_]", function() {
    //表示モード（0：テキスト表示 1：セレクトボックス表示）
    var disp_mode = $(this).attr('data-disp-mode');
    if(disp_mode == 1){
        return false;
    }
    //対象ユーザーID
    var user_id = $(this).data('user-id');
    //グローバル変数へ保存
    selected_user_id = user_id;
    //対象シフト日付
    var shift_date =  $(this).data('shift-date');
    //グローバル変数へ保存
    selected_shift_date = shift_date;
    //初期値を取得
    var current_shift_num = $(this).attr('data-shift-val');
    //初期値が99その他のときはモーダルウインドウを表示させる
    if(current_shift_num == 99){
        //ダミーのボタンのclickイベントを発火させてモーダルフォーム表示させる
        $('#dummy_button').trigger('click');
        //モーダルウインドウの入力欄に値をセット
        $("#free_description").val($(this).text());
        return false;
    }

    //console.log(current_shift_num);
    //セレクトボックスのidを再設定
    var replace_text = 'id="tdbs_shift_time_' + user_id + '_' + shift_date + '"';
    var shift_select_html_after = shift_select_html.replace('id="tdbs_shift_time"' , replace_text);
    //当該セルをセレクトボックスに
    $('#shift_cell_' + user_id + "_" + shift_date).empty();
    //「希望なし」は除外
    shift_select_html_after = shift_select_html_after.replace('<option label="希望なし" value="0">希望なし</option>' , '');
    $('#shift_cell_' + user_id + "_" + shift_date).html(shift_select_html_after);
    $('#tdbs_shift_time_' + user_id + "_" + shift_date).val(current_shift_num);
    
    g_current_shift_num = current_shift_num;

    //表示モードを1へ変更
    $(this).attr('data-disp-mode','1');
    
});

//シフトセレクトボックス変更処理
$(document).on("change","[id^=tdbs_shift_time]", function() {

    //表示モード（0：テキスト表示 1：セレクトボックス表示）
    var disp_mode = $(this).attr('data-disp-mode');
    if(disp_mode == 0){
        return false;
    }
    //対象ユーザーID
    var user_id = $(this).data('user-id');
    //対象シフト日付
    var shift_date =  $(this).data('shift-date');
    //選択された値を取得
    var selected_shift_number = $("#tdbs_shift_time_" + selected_user_id + "_" + selected_shift_date).val();
    //選択された表示文字列を取得
    var selected_shift_text = $("#tdbs_shift_time_" + selected_user_id + "_" + selected_shift_date + " option:selected").text();

    //選択された値が99「その他」のときは、モーダルフォーム表示（自由記述）
    if(selected_shift_number == 99){
        //ダミーのボタンのclickイベントを発火させてモーダルフォーム表示させる
        $('#dummy_button').trigger('click');
        //ターゲットデータをセット
        $("#target_free_description_userid").val(selected_user_id);
        $("#target_free_description_shift_date").val(selected_shift_date);
        //自由記述欄モーダルのデータリストを表示させる
        $('#free_description_area').empty();
        $('#free_description_area').html(shift_data_list_html);

    }

    //console.log(selected_shift_number);
    //当該セルに選択値をセット
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).empty();
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).html(selected_shift_text);
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).attr('data-shift-val',selected_shift_number);
    $('#shift_cell_' + selected_user_id + "_" + selected_shift_date).attr('data-disp-mode',0);
    //グローバル変数の初期化
    selected_user_id = "";
    selected_shift_date = "";
    //休日数再計算
    set_holiday_total();

});

//変更不可処理
$(document).on("contextmenu","[id^=shift_cell_]", function(e) {
    //console.log("hogehoge");
    var fixed_flg = $(this).attr('data-fixed');
    if(fixed_flg == 1){
        $("#non_chenge_text").text("変更なし設定解除");
    }else{
        $("#non_chenge_text").text("変更なし設定");
    }
    $("#fixed_flg").val(fixed_flg);
    //ターゲットセル
    $("#terget_user_id").val($(this).attr('data-user-id'));
    $("#target_shift_date").val($(this).attr('data-shift-date'));
    $("#modal_memo_show").attr('data-target_userid' , $(this).attr('data-user-id'));
    $("#modal_memo_show").attr('data-target_shift-date' , $(this).attr('data-shift-date'));

    document.getElementById('contextmenu').style.left=e.pageX+"px";
    document.getElementById('contextmenu').style.top=e.pageY+"px";
    document.getElementById('contextmenu').style.display="block";

    return false;

});

//変更なしシフト設定処理
function non_change(){

    var fixed_flg = $("#fixed_flg").val();
    //ターゲットセル取得
    var terget_user_id = $("#terget_user_id").val();
    var target_shift_date = $("#target_shift_date").val();
    //変更なし設定を解除する
    if(fixed_flg == 1){
        $("#shift_cell_" + terget_user_id + "_" + target_shift_date).removeClass("non_chenge");
        $("#shift_cell_" + terget_user_id + "_" + target_shift_date).attr('data-fixed','0');
    //変更なし設定
    }else{
        $("#shift_cell_" + terget_user_id + "_" + target_shift_date).addClass("non_chenge");
        $("#shift_cell_" + terget_user_id + "_" + target_shift_date).attr('data-fixed','1');
    }

    //メニューを非表示
    document.getElementById('contextmenu').style.display="none";

    $("#fixed_flg").val("");
    $("#terget_user_id").val("");
    $("#target_shift_date").val("");

}

//要素クリックで右クリックメニューを閉じる
document.body.addEventListener('click',function (e){

    document.getElementById('contextmenu').style.display="none";
    $("#fixed_flg").val("");
    $("#terget_user_id").val("");
    $("#target_shift_date").val("");

});

$(document).on("change","#free_description", function() {

    //選択された値を取得（undefined時は自由記述のためその他になる）
    var shift_time = $("#shift_time option[value='" + $(this).val() + "']").attr('data-list-shift-val');
    $("#selected_shift_time").val(shift_time);

});


//自由記述欄登録処理
$(document).on("click","#free_description_regist", function() {

    //選択された値を取得
    var selected_shift_time = $("#selected_shift_time").val();
    //console.log(selected_shift_time);
    if(selected_shift_time == ""){
        selected_shift_time = 99;
    }
    //入力値を取得
    var free_descripsion = $("#free_description").val();
    free_descripsion = toHalfWidth(free_descripsion);
    //形式チェック
    var format_chk = 0;
    //エラーメッセージ
    var err_mes = "";

    if(free_descripsion == ""){
        err_mes = err_mes + "自由記述欄の入力は必須です" + "\n";
        //alert("希望シフト「その他」を選択したときは、自由記述欄の入力は必須です");
        format_chk = 1;
    //自由記述欄の形式チェック⇐ここから
    }else{
        var pattern = /^\d{1,2}-\d{1,2}$/;

        if(pattern.test(free_descripsion) == false){
            format_chk = 1;
            err_mes = err_mes + "自由記述欄の入力値の形式が不正です" + "\n";
        }else{
            //ハイフンを区切り文字として分割
            var hour_ary = free_descripsion.split('-');
            var start_hour = hour_ary[0];
            var end_hour = hour_ary[1];
            //開始時間は0から23の間で
            if(start_hour > 23){
                format_chk = 1;
                err_mes = err_mes + "自由記述欄の開始時刻は0時～23時の間で設定してください" + "\n";
            }
            //終了時間は1から24の間で
            if(end_hour > 0 && end_hour > 24){
                format_chk = 1;
                err_mes = err_mes + "自由記述欄の終了時刻は0時～23時の間で設定してください" + "\n";
            }
            //開始時刻と終了時刻の整合性
            if(Number(start_hour) >= Number(end_hour)){
                format_chk = 1;
                err_mes = err_mes + "自由記述欄の開始時刻は終了時刻より前にする必要があります" + "\n";
            }

        }

    }

    if(format_chk == 1){
        alert(err_mes);
    }else{

        //ターゲットデータ取得
        var target_user_id = $("#target_free_description_userid").val();
        var target_shift_date = $("#target_free_description_shift_date").val();
        //入力値をシフト表にセット
        var free_descripsion = $("#free_description").val();
        $('#shift_cell_' + target_user_id + '_' + target_shift_date).text(free_descripsion);
        $('#shift_cell_' + target_user_id + '_' + target_shift_date).attr('data-shift-val' , selected_shift_time);
        //休日数カウント
        set_holiday_total();
        
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('#sv_shift_free_description').modal('hide');
        //入力欄初期化
        $("#free_description").val("");
        $("#target_free_description_userid").val("");
        $("#target_free_description_shift_date").val("");
    }

});


//自由記述欄モーダルウインドウ閉じる
$('#sv_shift_free_description').on('hidden.bs.modal', function () {
    //シフト表上のセルは選択前の値に戻す
    var target_userid = $("#target_free_description_userid").val();
    var targer_shift_date = $("#target_free_description_shift_date").val();
    var w_val_ary = shift_data_ary[targer_shift_date][target_userid];
    $("#shift_cell_" + target_userid + "_" + targer_shift_date).text(w_val_ary['tdbs_shift_time_text']);
    $("#shift_cell_" + target_userid + "_" + targer_shift_date).attr("data-shift-val" , w_val_ary['tdbs_shift_time']);
    //入力欄初期化
    $("#free_description").val("");
    $("#target_free_description_userid").val("");
    $("#target_free_description_shift_date").val("");
})

//メモ欄モーダルウインドウOPEN
$('#sv_shift_memo').on('show.bs.modal', function (event) {

    var button = $(event.relatedTarget);
    //ターゲットデータ
    var user_id = button.attr('data-target-memo-userid');
    var shift_date = button.attr('data-target-memo-shift-date');
    //右クリックメニューからの遷移時
    var user_id_as_rc = button.attr('data-target_userid');
    var shift_date_as_rc = button.attr('data-target_shift-date');

    if(user_id !== undefined){
        $("#target_memo_userid").val(user_id);
    }else if(user_id_as_rc != ""){
        $("#target_memo_userid").val(user_id_as_rc);
    }

    if(shift_date !== undefined){
        $("#target_memo_shift_date").val(shift_date);
    }else if(shift_date_as_rc != ""){
        $("#target_memo_shift_date").val(shift_date_as_rc);
    }
    
    //メモ欄文言取得
    var memo = $('#shift_cell_' + user_id + '_' + shift_date).attr("data-memo");
    $("#modal_memo").val(memo);
    //console.log(memo);

})

//右クリックメニューからメモ欄モーダルウインドウOPEN
$(document).on("click","#modal_memo_show", function() {

});


//メモ欄登録処理
$(document).on("click","#sv_shift_memo_regist", function() {
    //ターゲットデータ取得
    var target_user_id = $("#target_memo_userid").val();
    var target_shift_date = $("#target_memo_shift_date").val();
    //メモ欄文言取得
    var memo = $("#modal_memo").val();
    //メモ欄文言セット
    $("#shift_cell_" + target_user_id + "_" + target_shift_date).attr("data-memo" , memo);

    if(memo == ""){
        $("#memo_icn_" + target_user_id + "_" + target_shift_date).removeClass();
        $("#memo_icn_" + target_user_id + "_" + target_shift_date).addClass("sv_shift_memo_icn_no");
    }else{
        $("#memo_icn_" + target_user_id + "_" + target_shift_date).removeClass();
        $("#memo_icn_" + target_user_id + "_" + target_shift_date).addClass("sv_shift_memo_icn");
    }

    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#sv_shift_memo').modal('hide');

    //入力欄初期化
    $("#modal_memo").val("");
    $("#target_memo_userid").val("");
    $("#target_memo_shift_date").val("");

});

//メモ欄モーダルウインドウ閉じる
$('#sv_shift_memo').on('hidden.bs.modal', function () {
    //入力欄初期化
    $("#modal_memo").val("");
    $("#target_memo_userid").val("");
    $("#target_memo_shift_date").val("");
    
})

/* フォーム保存
   identification ：押下ボタンの識別（1：登録 2：公開） */
function save_sv_shift(identification){

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();
	var current_section_date = section_sta;
    let user_ary = new Object();

    //対象ユーザーID取得
    $(".target_user_id").each(function(index, element) {
        user_ary[index] = $(element).val();
    });

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

        //エラーメッセージ
        var err_mes = "";

        $("[id^=header_ ]").each(function(i,e){

            var header_userid = $(this).attr('data-header-userid');

            //シフト時間
            var tdbs_shift_time = $("#shift_cell_" + header_userid + "_" + current_section_date).attr("data-shift-val");
            //console.log(tdbs_shift_time);
            //console.log(typeof(tdbs_shift_time));

            if(identification == 1){
                if(tdbs_shift_time === undefined || tdbs_shift_time == null){
                    //tdbs_shift_time = "";
                    tdbs_shift_time = null;
                }
            }else if(identification == 2){
                if(tdbs_shift_time === undefined || tdbs_shift_time == null || tdbs_shift_time == 0 || tdbs_shift_time == ""){
                    err_mes = err_mes + header_userid + "：" + current_section_date + "のシフト登録がされていません";
                }
            }


            //変更なしフラグ
            var tdbs_fixed_flg = $("#shift_cell_" + header_userid + "_" + current_section_date).attr("data-fixed");
            if(tdbs_fixed_flg === undefined){
                tdbs_fixed_flg = "";
            }

            //自由記述
            var tdbs_free_descripsion = "";
            if(tdbs_shift_time == 99){
                tdbs_free_descripsion = $("#shift_cell_" + header_userid + "_" + current_section_date).text();
            }else if(tdbs_free_descripsion === undefined){
                tdbs_free_descripsion = "";
            }

            //メモ
            var tdbs_memo = $("#shift_cell_" + header_userid + "_" + current_section_date).attr('data-memo');
            if(tdbs_memo === undefined){
                tdbs_memo = "";
            }
            
            //シフト時間のテキスト表示
            var tdbs_shift_time_text = $("#shift_cell_" + header_userid + "_" + current_section_date).text();
            //console.log(header_userid);
            if(tdbs_shift_time_text === undefined){
                tdbs_shift_time_text = "";
            }
            
            shift_data_ary[current_section_date][header_userid]['tdbs_user_id'] = header_userid;
            shift_data_ary[current_section_date][header_userid]['tdbs_shift_date'] = current_section_date;
            shift_data_ary[current_section_date][header_userid]['tdbs_shift_time'] = tdbs_shift_time;
            shift_data_ary[current_section_date][header_userid]['tdbs_fixed_flg'] = tdbs_fixed_flg;
            shift_data_ary[current_section_date][header_userid]['tdbs_free_descripsion'] = tdbs_free_descripsion;
            shift_data_ary[current_section_date][header_userid]['tdbs_memo'] = tdbs_memo;
            shift_data_ary[current_section_date][header_userid]['tdbs_shift_time_text'] = tdbs_shift_time_text;

        });			
    
        //次の日付へ移動
        current_section_date = date_s.setDate(date_s.getDate() + 1);
		
	}

    return err_mes;

}

function save_remaining_holiday(){

    $("[id^=header_ ]").each(function(i,e){

        var header_userid = $(this).attr('data-header-userid');
        //残休日数取得
        var remainig_holiday = $("#carry_over_holiday_" + header_userid).text();

        if($("#holiday_manage_" + header_userid).val() == 1){
            remaining_holiday_ary[header_userid] = remainig_holiday;
        }

    });			

}

//登録ボタン押下
$(document).on("click","#before_confirm_regist", function() {

    save_sv_shift(1);
    //console.log(shift_data_ary);
    save_remaining_holiday();

    //シフト期間
    var section_sta = $("#section_sta").val();
    var section_end = $("#section_end").val();
    
	$.ajax({
		type:          'post',
		url:		   "../api/shift/sv_shift_api.php", 
		//受信データ形式（jsonもしくはtextを選択する)
		//dataType:      'json',
		//contentType:   'application/json',
		scriptCharset: 'utf-8',
		data:          {
						'action'	         : 'before_confirm_shift_sv_regist',
						'token'              : $("#csrf_token").val(),
                        'tdbs_release_flg'   : "1",
                        'section_sta'        : section_sta,
                        'section_end'        : section_end,
                        'remaining_holiday_ary': JSON.stringify(remaining_holiday_ary),
						'shift_data_ary'     :JSON.stringify(shift_data_ary)
						},
		
		// 200 OK
		success: function(json_data) {   

			var err_mes = "";

			//登録成功
			if(json_data == "ok"){
				alert("確定前シフト登録しました");
                location.reload();
			//登録失敗
			}else if(json_data == "ng"){
				alert("登録に失敗しました");
            }else  if(json_data == "token_ng"){
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

