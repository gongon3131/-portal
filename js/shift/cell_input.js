    /* 入力できるテーブル<table>セルの初期設定 */
var flg=0; // 入力値判定フラッグ
window.onload = function(){
	console.log("hoghoge");
	var myTbl = document.getElementById('editTbl');//ID名から要素を参照<table id="ID名">
	var len=editTbl.rows[1].cells.length; //列数, セルへの参照はrowsのcellsコレクション
	var Td = myTbl.getElementsByTagName('td'); // myTbl内の td要素のリスト(NodeList)

	for(var i=0; i<Td.length; i++){ // <td>をループ
		Td[i].setAttribute('id','td'+i); // ID名を設定
		Td[i].onclick =function(){
			if(flg==1){return} // 半角数値でなければ
			eDit(this.id); // onclickで 'eDit'を実行
		}
	}
	function eDit(id){  // クリックしたセルに 入力,編集 領域作成

		cellNum=document.getElementById(id).cellIndex; // 何列目か
		if(len-1==cellNum){
			alert('この列は入力できません。'); 
			return
		} // もし最後の列なら
		var Td = document.getElementsByTagName('td');
		var Spn = document.createElement('span'); // span要素 生成
		Spn.setAttribute('contenteditable','true');// contenteditable属性を付加
		Spn.setAttribute('id','Spn' + id); //ID名を付加
		Td[id].innerHTML=""; // Td[id]の中を空に
		Td[id].appendChild(Spn); // SpnをTd[id]に追加 これで入力可能になる
		Spn.focus(); // カーソルを合わせる 
		Spn.onblur = function(){ 
			bLur(id);  // フォーカスが外れたら
		}
	}
	function bLur(id){
		var Spn = document.getElementById('Spn' + id);
		var str=Spn.innerText;str=Spn.textContent; // Spn のテキスト
		if(str.match(/[^0-9 . -]|[¥s]+/)||str==""){ flg=1; // 入力チェック
		alert("半角数値を入れてください。"); 
			eDit(id); return;} // 半角数値でなければ 再入力
		flg=0; Td[id].innerHTML=str; // Td[id]にテキストを入れる
	}
}