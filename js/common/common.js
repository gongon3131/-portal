//数値に3桁区切りカンマをつける
function add_comma(num_val){

    num_val = String(num_val).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return num_val;

}

//数値の3桁区切りのカンマを外す
function remove_comma(num_val){
    num_val = String(num_val).replace(/,/g, '');
    return num_val;
}

//0埋め NUM=値 LEN=桁数
function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

function toHalfWidth(str) {
	// 全角英数字を半角に変換
	str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
	  return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
	return str;
  }

//今日の日付取得
function get_today_date_ymd(){

	//今日の日時を表示
	var date = new Date()
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()
	
	var toTwoDigits = function (num, digit) {
		num += ''
		if (num.length < digit) {
		num = '0' + num
		}
		return num
	}
	
	var yyyy = toTwoDigits(year, 4)
	var mm = toTwoDigits(month, 2)
	var dd = toTwoDigits(day, 2)
	var ymd = yyyy + "-" + mm + "-" + dd;	

	return ymd;

}

//指定日の翌日の日付を取得
function get_next_day(target_date){
	//当該日の翌日の日付を取得
	var date_s = new Date(target_date);
	date_s = new Date(date_s.setDate(date_s.getDate() + 1));
	var year = date_s.getFullYear();
	var month = date_s.getMonth() + 1;
	var day = date_s.getDate();		
	var next_date = year + "-" + zeroPadding(month,2) + "-" + zeroPadding(day,2);
	return next_date;
}


 function isNumber(numVal){
	// チェック条件パターン
	var pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
	// 数値チェック
	return pattern.test(numVal);
  }

  function post(path, params, method='post') {

	// The rest of this code assumes you are not using a library.
	// It can be made less wordy if you use one.
	const form = document.createElement('form');
	form.method = method;
	form.action = path;
  
	for (const key in params) {
	  if (params.hasOwnProperty(key)) {
		const hiddenField = document.createElement('input');
		hiddenField.type = 'hidden';
		hiddenField.name = key;
		hiddenField.value = params[key];
  
		form.appendChild(hiddenField);
	  }
	}
  
	document.body.appendChild(form);
	form.submit();
  }

  function isEmpty(obj){
	return !Object.keys(obj).length;
  }