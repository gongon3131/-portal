function save_tsr_shift_for_form(){
    var json = shift_data_ary;

    Object.keys(json).forEach(function(key) {
        //console.log(shift_data_ary);
        //第1区間
        var first_hope_hour_sta = $("#bc_first_hour_sta_" + json[key]['tdbc_user_id']).val();
        var first_hope_min_sta = $("#bc_first_min_sta_" + json[key]['tdbc_user_id']).val();
        var first_hope_hour_end = $("#bc_first_hour_end_" + json[key]['tdbc_user_id']).val();
        var first_hope_min_end = $("#bc_first_min_end_" + json[key]['tdbc_user_id']).val();
        //第2区間
        var second_hope_hour_sta = $("#bc_second_hour_sta_" + json[key]['tdbc_user_id']).val();
        var second_hope_min_sta = $("#bc_second_min_sta_" + json[key]['tdbc_user_id']).val();
        var second_hope_hour_end = $("#bc_second_hour_end_" + json[key]['tdbc_user_id']).val();
        var second_hope_min_end = $("#bc_second_min_end_" + json[key]['tdbc_user_id']).val();

		//シフト保存用配列作成
		var one_shift_ary = new Object();
        if(first_hope_hour_sta != "" && first_hope_min_sta != ""){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = String(zeroPadding(first_hope_hour_sta,2)) + String(zeroPadding(first_hope_min_sta,2));
            shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(first_hope_hour_sta,2)) + String(zeroPadding(first_hope_min_sta,2));
        }else{
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = "";
            shift_data_ary[key]['tdbc_start_time_first'] = "";
        }
        if(first_hope_hour_end != "" && first_hope_min_end != ""){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = String(zeroPadding(first_hope_hour_end,2)) + String(zeroPadding(first_hope_min_end,2));
            shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(first_hope_hour_end,2)) + String(zeroPadding(first_hope_min_end,2));
        }else{
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = "";
            shift_data_ary[key]['tdbc_end_time_first'] = "";
        }

        if(second_hope_hour_sta != "" && second_hope_min_sta != ""){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = String(zeroPadding(second_hope_hour_sta,2)) + String(zeroPadding(second_hope_min_sta,2));
            shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(second_hope_hour_sta,2)) + String(zeroPadding(second_hope_min_sta,2));
        }else{
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = "";
            shift_data_ary[key]['tdbc_start_time_second'] = "";
        }
        if(second_hope_hour_end != "" && second_hope_min_end != ""){       
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = String(zeroPadding(second_hope_hour_end,2)) + String(zeroPadding(second_hope_min_end,2));
            shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(second_hope_hour_end,2)) + String(zeroPadding(second_hope_min_end,2));
        }else{
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = "";
            shift_data_ary[key]['tdbc_end_time_second'] = "";
        }

        if($("#holiday_" + json[key]['tdbc_user_id']).prop("checked") == true){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_holiday_flg'] = 1;
            shift_data_ary[key]['tdbc_holiday_flg'] = 1;
        }else if($("#holiday_" + json[key]['tdbc_user_id']).prop("checked") == false){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_holiday_flg'] = 0;
            shift_data_ary[key]['tdbc_holiday_flg'] = 0;
        }
        if($("#paid_holiday_" + json[key]['tdbc_user_id']).prop("checked") == true){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_paid_holiday_flg'] = 1;
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 1;
        }else if($("#paid_holiday_" + json[key]['tdbc_user_id']).prop("checked") == false){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_paid_holiday_flg'] = 0;
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 0;
        }
        if($("#midnight_" + json[key]['tdbc_user_id']).prop("checked") == true){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_midnight_flg'] = 1;
            shift_data_ary[key]['tdbc_midnight_flg'] = 1;
        }else if($("#midnight_" + json[key]['tdbc_user_id']).prop("checked") == false){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_midnight_flg'] = 0;
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
        }
                
        //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_memo'] = $("#tdbc_memo_" + json[key]['tdbc_user_id']).val();
        shift_data_ary[key]['tdbc_memo'] = $("#tdbc_memo_" + json[key]['tdbc_user_id']).val();
        shift_data_ary[key]['tdbc_update_date'] = $("#tdbc_update_date_" + json[key]['tdbc_user_id']).val();
       
    })//end of foreach()					
    //console.log(shift_data_ary);
}

//フォーム⇒グラフ遷移時のデータ保存処理（OP別表示）
function save_tsr_shift_for_form_by_user(){
    //console.log(shift_data_ary);
    var json = shift_data_ary;
    Object.keys(json).forEach(function(key) {

        var current_date = json[key]['tdbc_shift_date'];

        //第1区間
        var first_hope_hour_sta = $("#bc_first_hour_sta_" + current_date).val();
        var first_hope_min_sta = $("#bc_first_min_sta_" + current_date).val();
        var first_hope_hour_end = $("#bc_first_hour_end_" + current_date).val();
        var first_hope_min_end = $("#bc_first_min_end_" + current_date).val();
        //第2区間
        var second_hope_hour_sta = $("#bc_second_hour_sta_" + current_date).val();
        var second_hope_min_sta = $("#bc_second_min_sta_" + current_date).val();
        var second_hope_hour_end = $("#bc_second_hour_end_" + current_date).val();
        var second_hope_min_end = $("#bc_second_min_end_" + current_date).val();

        if(first_hope_hour_sta != "" && first_hope_min_sta != ""){
            shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(first_hope_hour_sta,2)) + String(zeroPadding(first_hope_min_sta,2));
        }else{
            shift_data_ary[key]['tdbc_start_time_first'] = "";
        }
        if(first_hope_hour_end != "" && first_hope_min_end != ""){
            shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(first_hope_hour_end,2)) + String(zeroPadding(first_hope_min_end,2));
        }else{
            shift_data_ary[key]['tdbc_end_time_first'] = "";
        }

        if(second_hope_hour_sta != "" && second_hope_min_sta != ""){
            shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(second_hope_hour_sta,2)) + String(zeroPadding(second_hope_min_sta,2));
        }else{
            shift_data_ary[key]['tdbc_start_time_second'] = "";
        }
        if(second_hope_hour_end != "" && second_hope_min_end != ""){       
            shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(second_hope_hour_end,2)) + String(zeroPadding(second_hope_min_end,2));
        }else{
            shift_data_ary[key]['tdbc_end_time_second'] = "";
        }

        if($("#holiday_" + json[key]['tdbc_shift_date']).prop("checked") == true){
            shift_data_ary[key]['tdbc_holiday_flg'] = 1;
        }else if($("#holiday_" + json[key]['tdbc_shift_date']).prop("checked") == false){
            shift_data_ary[key]['tdbc_holiday_flg'] = 0;
        }
        if($("#paid_holiday_" + json[key]['tdbc_shift_date']).prop("checked") == true){
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 1;
        }else if($("#paid_holiday_" + json[key]['tdbc_shift_date']).prop("checked") == false){
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 0;
        }
        if($("#midnight_" + json[key]['tdbc_shift_date']).prop("checked") == true){
            shift_data_ary[key]['tdbc_midnight_flg'] = 1;
        }else if($("#midnight_" + json[key]['tdbc_shift_date']).prop("checked") == false){
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
        }
                
        shift_data_ary[key]['tdbc_memo'] = $("#tdbc_memo_" + json[key]['tdbc_shift_date']).val();
        shift_data_ary[key]['tdbc_update_date'] = $("#tdbc_update_date_" + json[key]['tdbc_shift_date']).val();
        
    })//end of foreach()					
    //console.log(shift_data_ary);
}

function save_tsr_shift_for_graph(){
    var json = shift_data_ary;

    Object.keys(json).forEach(function(key) {
        
        //まず、メモ欄に記述があれば保存
        //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_memo'] = $("#tdbc_memo_" + json[key]['tdbc_user_id']).val();
        shift_data_ary[key]['tdbc_memo'] = $("#tdbc_memo_" + json[key]['tdbc_user_id']).val();

        //最終更新日
        shift_data_ary[key]['tdbc_update_date'] = $("#tdbc_update_date_" + json[key]['tdbc_user_id']).val();
        
        //休日フラグのセット
        var holiday_flg = $("#graph_holiday_set_" + json[key]['tdbc_user_id']).val();
        if(holiday_flg == 0){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_holiday_flg'] = 0;
            shift_data_ary[key]['tdbc_holiday_flg'] = 0;
        }else if(holiday_flg == 1){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_holiday_flg'] = 1;
            shift_data_ary[key]['tdbc_holiday_flg'] = 1;
            //休日フラグが立っているときは、時間帯部分は全てブランクにする
            /*
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_midnight_flg'] = 0;
            */
            shift_data_ary[key]['tdbc_start_time_first'] = "";
            shift_data_ary[key]['tdbc_end_time_first'] = "";
            shift_data_ary[key]['tdbc_start_time_second'] = "";
            shift_data_ary[key]['tdbc_end_time_second'] = "";
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
            
        }

        //有休フラグのセット
        var paid_holiday_flg = $("#graph_paid_holiday_set_" + json[key]['tdbc_user_id']).val();
        if(paid_holiday_flg == 0){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_paid_holiday_flg'] = 0;
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 0;
        }else if(paid_holiday_flg == 1){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_paid_holiday_flg'] = 1;
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 1;
            //休日フラグが立っているときは、時間帯部分は全てブランクに
            /*
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_midnight_flg'] = 0;
            */
            shift_data_ary[key]['tdbc_start_time_first'] = "";
            shift_data_ary[key]['tdbc_end_time_first'] = "";
            shift_data_ary[key]['tdbc_start_time_second'] = "";
            shift_data_ary[key]['tdbc_end_time_second'] = "";
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
            
        }

        //夜勤フラグのセット
        var midnight_flg = $("#graph_midnight_set_" + json[key]['tdbc_user_id']).val();
        if(midnight_flg == 0){
            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_midnight_flg'] = 0;
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
        }else if(midnight_flg == 1){
            shift_data_ary[key]['tdbc_midnight_flg'] = 1;
        }

        //休日フラグ（有休フラグ）が立っているときは、処理終了
        if(holiday_flg == 1 || paid_holiday_flg == 1){
            return;
        }

        //シフトグラフ部分の保存
        //現在の色
        let current_class_name = "";
        //直前の色
        let before_class_name = "";
        //シフト時間の始端
        let start_hour_cell = 0;
        //シフト区間の数
        let shift_section_num = 0;
        //30分終了フラグ
        let half_min_end_flg = 0;
        
        //0時のセル色の取得
        var zero_class_name = $("#op-col00_" + json[key]['tdbc_user_id']).attr("class");
        if(zero_class_name === undefined){
            zero_class_name = "";
        }

        //時刻欄の初期化
        /*
        shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = "";
        shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = "";
        shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = "";
        shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = "";
        */
        shift_data_ary[key]['tdbc_start_time_first'] = "";
        shift_data_ary[key]['tdbc_end_time_first'] = "";
        shift_data_ary[key]['tdbc_start_time_second'] = "";
        shift_data_ary[key]['tdbc_end_time_second'] = "";

        for(let i = 0; i < 24 ; i ++){
   
            //0時のセル色のチェック
            //0時にセル色がついているときは、区間１の始まりとする
            if(i == 0){
                before_class_name = zero_class_name;
                if(zero_class_name != "" ){
                    start_hour_cell = 0;
                    shift_section_num ++;
                }
                continue;
            }

            //01時～23時までのセル色を取得
            current_class_name =  $("#op-col" + zeroPadding(i,2) + "_" + json[key]['tdbc_user_id']).attr("class");
            if(current_class_name === undefined){
                current_class_name = "";
            }

            //現在のセル色と直前のセル色をチェック
            //現在の色と直前の色で切り替わったかをチェック
            if(current_class_name != before_class_name){
                //無色⇒黄色に変化したとき、シフト時間の始端のセルをセットする
                if(current_class_name != ""){
                    start_hour_cell = i;
                    //区間数を増加
                    shift_section_num ++;
                //黄色⇒無色に変化したとき、シフト時間の終端を意味するので、具体的な時間をセットする
                }else{

                    //30分終了フラグが立っているときは、スルー
                    if(half_min_end_flg == 1){
                        half_min_end_flg = 0;
                        before_class_name = current_class_name;
                        continue;
                    }
                                       
                    //第1区間
                    if(shift_section_num == 1){

                        var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + json[key]['tdbc_user_id']).attr("data-min");
                        var min_harf_end = $("#op-col" + zeroPadding(i-1,2) + "_" + json[key]['tdbc_user_id']).attr("data-min");

                        if(min_harf_sta == "30"){
                            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                            shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                        }else if(min_harf_sta == "00"){
                            // /shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                        }

                        if(min_harf_end == "30"){
                            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = String(zeroPadding(i-1,2)) + "30";
                            shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i-1,2)) + "30";
                        }else if(min_harf_end == "00"){
                            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "00";
                            shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "00";
                        }

                        start_hour_cell = 0;

                    //第2区間
                    }else if(shift_section_num == 2){

                        var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + shift_data_ary[key]['tdbc_user_id']).attr("data-min");
                        var min_harf_end = $("#op-col" + zeroPadding(i-1,2) + "_" + json[key]['tdbc_user_id']).attr("data-min");
                        
                        if(min_harf_sta == "30"){
                            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                            shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                        }else if(min_harf_sta == "00"){
                            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                        }

                        if(min_harf_end == "30"){
                            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = String(zeroPadding(i-1,2)) + "30";
                            shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i-1,2)) + "30";
                        }else if(min_harf_end == "00"){
                            //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "00";
                            shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "00";
                        }

                        start_hour_cell = 0;

                    }

                }

            }else{
                //30分登録のチェック
                if($("#op-col" + zeroPadding(i,2) + "_" + json[key]['tdbc_user_id']).attr("data-min") == "30"){

                    if(start_hour_cell == 0){
                        start_hour_cell = i;
                        shift_section_num ++;
                    }else{

                        //30分登録の次のセルの色をチェックして、色がついていたら1区間終了
                        //第1区間
                        if(shift_section_num == 1){
                            var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + json[key]['tdbc_user_id']).attr("data-min");
                            var min_harf_end = $("#op-col" + zeroPadding(i,2) + "_" + shift_data_ary[key]['tdbc_user_id']).attr("data-min");

                            if(min_harf_sta == "30"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                                shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                            }else if(min_harf_sta == "00"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                                shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            }

                            if(min_harf_end == "30"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "30";
                                shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "30";
                            }else if(min_harf_end == "00"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "00";
                                shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "00";
                            }

                            half_min_end_flg = 1;

                            start_hour_cell = 0;

                        //第2区間
                        }else if(shift_section_num == 2){

                            var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + json[key]['tdbc_user_id']).attr("data-min");
                            var min_harf_end = $("#op-col" + zeroPadding(i,2) + "_" + json[key]['tdbc_user_id']).attr("data-min");
                            
                            if(min_harf_sta == "30"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                                shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                            }else if(min_harf_sta == "00"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                                shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            }

                            if(min_harf_end == "30"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "30";
                                shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "30";
                            }else if(min_harf_end == "00"){
                                //shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "00";
                                shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "00";
                            }

                            half_min_end_flg = 1;

                            start_hour_cell = 0;

                        }
                    }

                }
            }
            
            //現在のセル色を直前のセル色に保存
            before_class_name = current_class_name;

            //23時セルの色のチェック
            if(i == 23 && current_class_name != ""){
                //第1区間
                if(shift_section_num == 1){
                    /*
                    shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = "2400";
                    */
                    shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[key]['tdbc_end_time_first'] = "2400";
                    
                    start_hour_cell = 0;
                }else if(shift_section_num == 2){
                    /*
                    shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = "2400";
                    */
                    shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[key]['tdbc_end_time_second'] = "2400";
                    
                }
            }

        }//end of for()

        //１つも色がついていないときの時刻は全てブランクとする
        if(shift_section_num == 0){
            /*
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_first'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_first'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_start_time_second'] = "";
            shift_data_ary[json[key]['tdbc_user_id']]['tdbc_end_time_second'] = "";
            */
            shift_data_ary[key]['tdbc_start_time_first'] = "";
            shift_data_ary[key]['tdbc_end_time_first'] = "";
            shift_data_ary[key]['tdbc_start_time_second'] = "";
            shift_data_ary[key]['tdbc_end_time_second'] = "";
            
        }

    })//end of foreach()					
    //console.log(shift_data_ary);
}

//グラフ⇒フォーム遷移時のデータ保存処理（OP別表示）
function save_tsr_shift_for_graph_by_user(){
    var json = shift_data_ary;

    Object.keys(json).forEach(function(key) {

        var current_date = json[key]['tdbc_shift_date'];
        
        //まず、メモ欄に記述があれば保存
        shift_data_ary[key]['tdbc_memo'] = $("#tdbc_memo_gh" + current_date).val();

        //最終更新日の保存
        shift_data_ary[key]['tdbc_update_date'] = $("#tdbc_update_date_gh" + current_date).val();
        
        //休日フラグのセット
        var holiday_flg = $("#graph_holiday_set_" + current_date).val();

        if(holiday_flg == 0){
            shift_data_ary[key]['tdbc_holiday_flg'] = 0;
        }else if(holiday_flg == 1){
            shift_data_ary[key]['tdbc_holiday_flg'] = 1;
            //休日フラグが立っているときは、時間帯部分は全てブランクに
            shift_data_ary[key]['tdbc_start_time_first'] = "";
            shift_data_ary[key]['tdbc_end_time_first'] = "";
            shift_data_ary[key]['tdbc_start_time_second'] = "";
            shift_data_ary[key]['tdbc_end_time_second'] = "";
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
        }

        //有休フラグのセット
        var paid_holiday_flg = $("#graph_paid_holiday_set_" + current_date).val();

        if(paid_holiday_flg == 0){
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 0;
        }else if(paid_holiday_flg == 1){
            shift_data_ary[key]['tdbc_paid_holiday_flg'] = 1;
            //休日フラグが立っているときは、時間帯部分は全てブランクに
            shift_data_ary[key]['tdbc_start_time_first'] = "";
            shift_data_ary[key]['tdbc_end_time_first'] = "";
            shift_data_ary[key]['tdbc_start_time_second'] = "";
            shift_data_ary[key]['tdbc_end_time_second'] = "";
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
        }

        //夜勤フラグのセット
        var midnight_flg = $("#graph_midnight_set_" + current_date).val();

        if(midnight_flg == 0){
            shift_data_ary[key]['tdbc_midnight_flg'] = 0;
        }else if(midnight_flg == 1){
            shift_data_ary[key]['tdbc_midnight_flg'] = 1;
        }

        //休日フラグ（有休フラグ）が立っているときは、処理終了
        if(holiday_flg == 1 || paid_holiday_flg == 1){
            return;
        }

        //シフトグラフ部分の保存
        //現在の色
        let current_class_name = "";
        //直前の色
        let before_class_name = "";
        //シフト時間の始端
        let start_hour_cell = 0;
        //シフト区間の数
        let shift_section_num = 0;
        //30分終了フラグ
        let half_min_end_flg = 0;
        //0時のセル色の取得
        var zero_class_name = $("#op-col00_" + current_date).attr("class");
        if(zero_class_name === undefined){
            zero_class_name = "";
        }

        //時刻欄の初期化
        shift_data_ary[key]['tdbc_start_time_first'] = "";
        shift_data_ary[key]['tdbc_end_time_first'] = "";
        shift_data_ary[key]['tdbc_start_time_second'] = "";
        shift_data_ary[key]['tdbc_end_time_second'] = "";

        for(let i = 0; i < 24 ; i ++){
   
            //0時のセル色のチェック
            //0時にセル色がついているときは、区間１の始まりとする
            if(i == 0){
                before_class_name = zero_class_name;
                if(zero_class_name != "" ){
                    start_hour_cell = 0;
                    shift_section_num ++;
                }
                continue;
            }

            //01時～23時までのセル色を取得
            current_class_name =  $("#op-col" + zeroPadding(i,2) + "_" + current_date).attr("class");
            if(current_class_name === undefined){
                current_class_name = "";
            }

            //現在のセル色と直前のセル色をチェック
            //現在の色と直前の色で切り替わったかをチェック
            if(current_class_name != before_class_name){
                //無色⇒黄色に変化したとき、シフト時間の始端のセルをセットする
                if(current_class_name != ""){
                    start_hour_cell = i;
                    //区間数を増加
                    shift_section_num ++;
                //黄色⇒無色に変化したとき、シフト時間の終端を意味するので、具体的な時間をセットする
                }else{

                    console.log(i+":"+half_min_end_flg);
                    //30分終了フラグが立っているときは、スルー
                    if(half_min_end_flg == 1){
                        half_min_end_flg = 0;
                        before_class_name = current_class_name;
                        continue;
                    }

                    //第1区間
                    if(shift_section_num == 1){

                        var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_date).attr("data-min");
                        var min_harf_end = $("#op-col" + zeroPadding(i-1,2) + "_" + current_date).attr("data-min");

                        if(min_harf_sta == "30"){
                            shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                        }else if(min_harf_sta == "00"){
                            shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                        }

                        if(min_harf_end == "30"){
                            shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i-1,2)) + "30";
                        }else if(min_harf_end == "00"){
                            shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "00";
                        }


                        start_hour_cell = 0;

                    //第2区間
                    }else if(shift_section_num == 2){

                        var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_date).attr("data-min");
                        var min_harf_end = $("#op-col" + zeroPadding(i-1,2) + "_" + current_date).attr("data-min");
                        
                        if(min_harf_sta == "30"){
                            shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                        }else if(min_harf_sta == "00"){
                            shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                        }

                        if(min_harf_end == "30"){
                            shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i-1,2)) + "30";
                        }else if(min_harf_end == "00"){
                            shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "00";
                        }


                        start_hour_cell = 0;

                    }

                }

            }else{
                //30分登録のチェック
                if($("#op-col" + zeroPadding(i,2) + "_" + current_date).attr("data-min") == "30"){

                    if(start_hour_cell == 0){
                        start_hour_cell = i;
                        shift_section_num ++;
                    }else{

                        //30分登録の次のセルの色をチェックして、色がついていたら1区間終了
                        //第1区間
                        if(shift_section_num == 1){
                            var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_date).attr("data-min");
                            var min_harf_end = $("#op-col" + zeroPadding(i,2) + "_" + current_date).attr("data-min");

                            if(min_harf_sta == "30"){
                                shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                            }else if(min_harf_sta == "00"){
                                shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            }

                            if(min_harf_end == "30"){
                                shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "30";
                            }else if(min_harf_end == "00"){
                                shift_data_ary[key]['tdbc_end_time_first'] = String(zeroPadding(i,2)) + "00";
                            }
                            half_min_end_flg = 1;

                            start_hour_cell = 0;

                        //第2区間
                        }else if(shift_section_num == 2){

                            var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_date).attr("data-min");
                            var min_harf_end = $("#op-col" + zeroPadding(i,2) + "_" + current_date).attr("data-min");
                            
                            if(min_harf_sta == "30"){
                                shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                            }else if(min_harf_sta == "00"){
                                shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            }

                            if(min_harf_end == "30"){
                                shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "30";
                            }else if(min_harf_end == "00"){
                                shift_data_ary[key]['tdbc_end_time_second'] = String(zeroPadding(i,2)) + "00";
                            }

                            half_min_end_flg = 1;

                            start_hour_cell = 0;

                        }
                    }

                }
            }
            
            //現在のセル色を直前のセル色に保存
            before_class_name = current_class_name;

            //23時セルの色のチェック
            if(i == 23 && current_class_name != ""){
                //第1区間
                if(shift_section_num == 1){
                    shift_data_ary[key]['tdbc_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[key]['tdbc_end_time_first'] = "2400";
                    start_hour_cell = 0;
                }else if(shift_section_num == 2){
                    shift_data_ary[key]['tdbc_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[key]['tdbc_end_time_second'] = "2400";
                }
            }

        }//end of for()

        //１つも色がついていないときの時刻は全てブランクとする
        if(shift_section_num == 0){
            shift_data_ary[key]['tdbc_start_time_first'] = "";
            shift_data_ary[key]['tdbc_end_time_first'] = "";
            shift_data_ary[key]['tdbc_start_time_second'] = "";
            shift_data_ary[key]['tdbc_end_time_second'] = "";
        }

    })//end of foreach()					
    //console.log(shift_data_ary);
}
