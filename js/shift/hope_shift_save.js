function save_hope_shift_for_form(){

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

	var current_section_date = section_sta;

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		//console.log("date_s:" + date_s);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

        //第1区間
        var first_hope_hour_sta = $("#first_hope_hour_sta_" + current_section_date).val();
        var first_hope_min_sta = $("#first_hope_min_sta_" + current_section_date).val();
        var first_hope_hour_end = $("#first_hope_hour_end_" + current_section_date).val();
        var first_hope_min_end = $("#first_hope_min_end_" + current_section_date).val();
        //第2区間
        var second_hope_hour_sta = $("#second_hope_hour_sta_" + current_section_date).val();
        var second_hope_min_sta = $("#second_hope_min_sta_" + current_section_date).val();
        var second_hope_hour_end = $("#second_hope_hour_end_" + current_section_date).val();
        var second_hope_min_end = $("#second_hope_min_end_" + current_section_date).val();

		//シフト保存用配列作成
		var one_shift_ary = new Object();
        if(first_hope_hour_sta != "" && first_hope_min_sta != ""){
            one_shift_ary['tdsh_start_time_first'] = String(zeroPadding(first_hope_hour_sta,2)) + String(zeroPadding(first_hope_min_sta,2));
        }else{
            one_shift_ary['tdsh_start_time_first'] = "";
        }
        if(first_hope_hour_end != "" && first_hope_min_end != ""){
            one_shift_ary['tdsh_end_time_first'] = String(zeroPadding(first_hope_hour_end,2)) + String(zeroPadding(first_hope_min_end,2));
        }else{
            one_shift_ary['tdsh_end_time_first'] = "";
        }

        if(second_hope_hour_sta != "" && second_hope_min_sta != ""){
            one_shift_ary['tdsh_start_time_second'] = String(zeroPadding(second_hope_hour_sta,2)) + String(zeroPadding(second_hope_min_sta,2));
        }else{
            one_shift_ary['tdsh_start_time_second'] = "";
        }
        if(second_hope_hour_end != "" && second_hope_min_end != ""){       
		    one_shift_ary['tdsh_end_time_second'] = String(zeroPadding(second_hope_hour_end,2)) + String(zeroPadding(second_hope_min_end,2));
        }else{
            one_shift_ary['tdsh_end_time_second'] = "";
        }

        if($("#holiday_" + current_section_date).prop("checked") == true){
            one_shift_ary['tdsh_holiday_flg'] = 1;
        }else if($("#holiday_" + current_section_date).prop("checked") == false){
            one_shift_ary['tdsh_holiday_flg'] = 0;
        }
        if($("#paid_holiday_" + current_section_date).prop("checked") == true){
            one_shift_ary['tdsh_paid_holiday_flg'] = 1;
        }else if($("#paid_holiday_" + current_section_date).prop("checked") == false){
            one_shift_ary['tdsh_paid_holiday_flg'] = 0;
        }
        if($("#midnight_" + current_section_date).prop("checked") == true){
            one_shift_ary['tdsh_midnight_flg'] = 1;
        }else if($("#midnight_" + current_section_date).prop("checked") == false){
            one_shift_ary['tdsh_midnight_flg'] = 0;
        }
                
		one_shift_ary['tdsh_memo'] = $("#memo_" + current_section_date).val();

		shift_data_ary[current_section_date] = one_shift_ary;

		//次の日付へ移動
		current_section_date = date_s.setDate(date_s.getDate() + 1);
        
    }

    console.log(shift_data_ary);
    
}

function save_hope_shift_for_graph(){

	//期間の始端と終端
	var section_sta = $("#section_sta").val();
	var section_end = $("#section_end").val();

	var current_section_date = section_sta;

	while(new Date(current_section_date) <= new Date(section_end)){

		var date_s = new Date(current_section_date);
		var year = date_s.getFullYear();
		var month = date_s.getMonth() + 1;
		var day = date_s.getDate();		
		current_section_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);

        //まず、メモ欄に記述があれば保存
        shift_data_ary[current_section_date]['tdsh_memo'] = $("#hope_shift_memo_" + current_section_date).val();

        //休日フラグのセット
        var holiday_flg = $("#graph_holiday_set_" + current_section_date).val();

        if(holiday_flg == 0){
            shift_data_ary[current_section_date]['tdsh_holiday_flg'] = false;
        }else if(holiday_flg == 1){
            shift_data_ary[current_section_date]['tdsh_holiday_flg'] = true;
            //休日フラグが立っているときは、時間帯部分は全てブランクに
            shift_data_ary[current_section_date]['tdsh_start_time_first'] = "";
            shift_data_ary[current_section_date]['tdsh_end_time_first'] = "";
            shift_data_ary[current_section_date]['tdsh_start_time_second'] = "";
            shift_data_ary[current_section_date]['tdsh_end_time_second'] = "";
            shift_data_ary[current_section_date]['tdsh_midnight_flg'] = false;

        }

        //有休フラグのセット
        var paid_holiday_flg = $("#graph_paid_holiday_set_" + current_section_date).val();

        if(paid_holiday_flg == 0){
            shift_data_ary[current_section_date]['tdsh_paid_holiday_flg'] = false;
        }else if(paid_holiday_flg == 1){
            shift_data_ary[current_section_date]['tdsh_paid_holiday_flg'] = true;
            //休日フラグが立っているときは、時間帯部分は全てブランクに
            shift_data_ary[current_section_date]['tdsh_start_time_first'] = "";
            shift_data_ary[current_section_date]['tdsh_end_time_first'] = "";
            shift_data_ary[current_section_date]['tdsh_start_time_second'] = "";
            shift_data_ary[current_section_date]['tdsh_end_time_second'] = "";
            shift_data_ary[current_section_date]['tdsh_midnight_flg'] = false;

        }

        //夜勤フラグのセット
        var midnight_flg = $("#graph_midnight_set_" + current_section_date).val();

        if(midnight_flg == 0){
            shift_data_ary[current_section_date]['tdsh_midnight_flg'] = false;
        }else if(midnight_flg == 1){
            shift_data_ary[current_section_date]['tdsh_midnight_flg'] = true;
        }

        //休日フラグ（有休フラグ）が立っているときは、処理終了
        if(holiday_flg == 1 || paid_holiday_flg == 1){
            //次の日付へ移動
            current_section_date = date_s.setDate(date_s.getDate() + 1);
            continue;
        }

        //シフトグラフ部分の保存
        //現在の色
        let current_class_name = "";
        let before_class_name = "";
        //シフト時間の始端
        let start_hour_cell = 0;
        //シフト区間の数
        let shift_section_num = 0;
        //0時のセル色の取得
        var zero_class_name = $("#op-col00_" + current_section_date).attr("class");
        if(zero_class_name === undefined){
            zero_class_name = "";
        }

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
            current_class_name =  $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).attr("class");
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
                                       
                    //第1区間
                    if(shift_section_num == 1){

                        var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_section_date).attr("data-min");
                        var min_harf_end = $("#op-col" + zeroPadding(i-1,2) + "_" + current_section_date).attr("data-min");

                        if(min_harf_sta == "30"){
                            shift_data_ary[current_section_date]['tdsh_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                        }else if(min_harf_sta == "00"){
                            shift_data_ary[current_section_date]['tdsh_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                        }

                        if(min_harf_end == "30"){
                            shift_data_ary[current_section_date]['tdsh_end_time_first'] = String(zeroPadding(i-1,2)) + "30";
                        }else if(min_harf_end == "00"){
                            shift_data_ary[current_section_date]['tdsh_end_time_first'] = String(zeroPadding(i,2)) + "00";
                        }

                        start_hour_cell = 0;

                    //第2区間
                    }else if(shift_section_num == 2){

                        var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_section_date).attr("data-min");
                        var min_harf_end = $("#op-col" + zeroPadding(i-1,2) + "_" + current_section_date).attr("data-min");
                        
                        if(min_harf_sta == "30"){
                            shift_data_ary[current_section_date]['tdsh_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                        }else if(min_harf_sta == "00"){
                            shift_data_ary[current_section_date]['tdsh_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                        }

                        if(min_harf_end == "30"){
                            shift_data_ary[current_section_date]['tdsh_end_time_second'] = String(zeroPadding(i-1,2)) + "30";
                        }else if(min_harf_end == "00"){
                            shift_data_ary[current_section_date]['tdsh_end_time_second'] = String(zeroPadding(i,2)) + "00";
                        }

                        start_hour_cell = 0;

                    }

                }

            }else{
                //30分登録のチェック
                if($("#op-col" + zeroPadding(i,2) + "_" + current_section_date).attr("data-min") == "30"){

                    if(start_hour_cell == 0){
                        start_hour_cell = i;
                        shift_section_num ++;
                    }else{

                        //30分登録の次のセルの色をチェックして、色がついていたら1区間終了
                        //第1区間
                        if(shift_section_num == 1){
                            var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_section_date).attr("data-min");
                            var min_harf_end = $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).attr("data-min");

                            if(min_harf_sta == "30"){
                                shift_data_ary[current_section_date]['tdsh_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "30";
                            }else if(min_harf_sta == "00"){
                                shift_data_ary[current_section_date]['tdsh_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            }

                            if(min_harf_end == "30"){
                                shift_data_ary[current_section_date]['tdsh_end_time_first'] = String(zeroPadding(i,2)) + "30";
                            }else if(min_harf_end == "00"){
                                shift_data_ary[current_section_date]['tdsh_end_time_first'] = String(zeroPadding(i,2)) + "00";
                            }

                            start_hour_cell = 0;

                        //第2区間
                        }else if(shift_section_num == 2){

                            var min_harf_sta = $("#op-col" + zeroPadding(start_hour_cell,2) + "_" + current_section_date).attr("data-min");
                            var min_harf_end = $("#op-col" + zeroPadding(i,2) + "_" + current_section_date).attr("data-min");
                            
                            if(min_harf_sta == "30"){
                                //console.log("hogehoge");
                                shift_data_ary[current_section_date]['tdsh_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "30";
                                console.log(String(zeroPadding(start_hour_cell,2)) + "30");
                                console.log(shift_data_ary[current_section_date]);
                                console.log(shift_data_ary[current_section_date]['tdsh_start_time_second']);
                            }else if(min_harf_sta == "00"){
                                shift_data_ary[current_section_date]['tdsh_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                            }

                            if(min_harf_end == "30"){
                                shift_data_ary[current_section_date]['tdsh_end_time_second'] = String(zeroPadding(i,2)) + "30";
                            }else if(min_harf_end == "00"){
                                shift_data_ary[current_section_date]['tdsh_end_time_second'] = String(zeroPadding(i,2)) + "00";
                            }

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
                    shift_data_ary[current_section_date]['tdsh_start_time_first'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[current_section_date]['tdsh_end_time_first'] = "2400";
                    start_hour_cell = 0;
                }else if(shift_section_num == 2){
                    shift_data_ary[current_section_date]['tdsh_start_time_second'] = String(zeroPadding(start_hour_cell,2)) + "00";
                    shift_data_ary[current_section_date]['tdsh_end_time_second'] = "2400";
                }
            }

        }

        //１つも色がついていないときの時刻は全てブランクとする
        if(shift_section_num == 0){
            shift_data_ary[current_section_date]['tdsh_start_time_first'] = "";
            shift_data_ary[current_section_date]['tdsh_end_time_first'] = "";
            shift_data_ary[current_section_date]['tdsh_start_time_second'] = "";
            shift_data_ary[current_section_date]['tdsh_end_time_second'] = "";
        }

		//次の日付へ移動
		current_section_date = date_s.setDate(date_s.getDate() + 1);
	}

}
