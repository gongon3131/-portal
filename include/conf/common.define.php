<?php
/*******************************************************
 Optional Setting
********************************************************/
//require_once '../common.php';
////////////////////////////////////////////////
// ユーザー種類
////////////////////////////////////////////////
$SY_define['user_type'][0]="";
$SY_define['user_type'][1]="OP";
$SY_define['user_type'][2]="SV";
$SY_define['user_type'][3]="看護師";
$SY_define['user_type'][4]="SE";
$SY_define['user_type'][9]="管理者";

////////////////////////////////////////////////
// 区分コード
////////////////////////////////////////////////
$SY_define['import_kbn'][1]="あいおい";
$SY_define['import_kbn'][2]="自治体";
$SY_define['import_kbn'][3]="大塚商会";
$SY_define['import_kbn'][99]="区分なし";

////////////////////////////////////////////////
// 在籍状況
////////////////////////////////////////////////
$SY_define['enroll_status'][1]="在籍中";
$SY_define['enroll_status'][0]="非在籍";

////////////////////////////////////////////////
// 保有スキル
////////////////////////////////////////////////
$SY_define['skill_assgin'][0]="不可";
$SY_define['skill_assgin'][1]="可能";
$SY_define['skill_assgin'][9]="未登録";

////////////////////////////////////////////////
// 担当可能業務（SV）
////////////////////////////////////////////////
$SY_define['business_enable'][0]="優先担当";
$SY_define['business_enable'][1]="可能";
$SY_define['business_enable'][2]="不可";
$SY_define['business_enable'][9]="未登録";

////////////////////////////////////////////////
// 雇用形態
////////////////////////////////////////////////
$SY_define['employment_status'][0]="";
$SY_define['employment_status'][1]="直雇用";
$SY_define['employment_status'][2]="スターライン";
$SY_define['employment_status'][3]="オープンループ";
$SY_define['employment_status'][4]="アウトソーシング";

////////////////////////////////////////////////
// インポート対象
////////////////////////////////////////////////
$SY_define['import_target'][1]="対象";
$SY_define['import_target'][0]="対象外";

////////////////////////////////////////////////
// SV希望シフト
////////////////////////////////////////////////
$SY_define['hope_shift_sv'][0]="希望なし";
$SY_define['hope_shift_sv'][20]="休み";
$SY_define['hope_shift_sv'][30]="有休";
$SY_define['hope_shift_sv'][1]="8-16";
$SY_define['hope_shift_sv'][2]="8-17";
$SY_define['hope_shift_sv'][3]="9-17";
$SY_define['hope_shift_sv'][4]="9-18";
$SY_define['hope_shift_sv'][5]="10-19";
$SY_define['hope_shift_sv'][6]="13-22";
$SY_define['hope_shift_sv'][7]="14-22";
$SY_define['hope_shift_sv'][8]="8-13";
$SY_define['hope_shift_sv'][9]="9-13";
$SY_define['hope_shift_sv'][10]="13-17";
$SY_define['hope_shift_sv'][11]="17-22";
$SY_define['hope_shift_sv'][12]="22-8";
$SY_define['hope_shift_sv'][40]="出張";
$SY_define['hope_shift_sv'][50]="健診";
$SY_define['hope_shift_sv'][99]="その他";

////////////////////////////////////////////////
// 休日管理
////////////////////////////////////////////////
$SY_define['holiday_manage'][1]="する";
$SY_define['holiday_manage'][0]="しない";

////////////////////////////////////////////////
// 都道府県の定義
////////////////////////////////////////////////
$SY_define['pref'][0]='未選択';
$SY_define['pref'][1]='北海道';
$SY_define['pref'][2]='青森県';
$SY_define['pref'][3]='岩手県';
$SY_define['pref'][4]='宮城県';
$SY_define['pref'][5]='秋田県';
$SY_define['pref'][6]='山形県';
$SY_define['pref'][7]='福島県';
$SY_define['pref'][8]='茨城県';
$SY_define['pref'][9]='栃木県';
$SY_define['pref'][10]='群馬県';
$SY_define['pref'][11]='埼玉県';
$SY_define['pref'][12]='千葉県';
$SY_define['pref'][13]='東京都';
$SY_define['pref'][14]='神奈川県';
$SY_define['pref'][15]='新潟県';
$SY_define['pref'][16]='富山県';
$SY_define['pref'][17]='石川県';
$SY_define['pref'][18]='福井県';
$SY_define['pref'][19]='山梨県';
$SY_define['pref'][20]='長野県';
$SY_define['pref'][21]='岐阜県';
$SY_define['pref'][22]='静岡県';
$SY_define['pref'][23]='愛知県';
$SY_define['pref'][24]='三重県';
$SY_define['pref'][25]='滋賀県';
$SY_define['pref'][26]='京都府';
$SY_define['pref'][27]='大阪府';
$SY_define['pref'][28]='兵庫県';
$SY_define['pref'][29]='奈良県';
$SY_define['pref'][30]='和歌山県';
$SY_define['pref'][31]='鳥取県';
$SY_define['pref'][32]='島根県';
$SY_define['pref'][33]='岡山県';
$SY_define['pref'][34]='広島県';
$SY_define['pref'][35]='山口県';
$SY_define['pref'][36]='徳島県';
$SY_define['pref'][37]='香川県';
$SY_define['pref'][38]='愛媛県';
$SY_define['pref'][39]='高知県';
$SY_define['pref'][40]='福岡県';
$SY_define['pref'][41]='佐賀県';
$SY_define['pref'][42]='長崎県';
$SY_define['pref'][43]='熊本県';
$SY_define['pref'][44]='大分県';
$SY_define['pref'][45]='宮崎県';
$SY_define['pref'][46]='鹿児島県';
$SY_define['pref'][47]='沖縄県';

?>
