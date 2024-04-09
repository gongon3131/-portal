{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 col-lg-12 px-md-4">
				<div class="form-inline">
					<h3 class="section-title">業務振分登録</h3>
					<input id="showen_date" type="date" class="form-control ml-5 mr-2 date_pk" name="showen_date" value="{$showen_date}"  />
					{if $smarty.session.login_info.user_authority != 1}
						<button type="button" class="btn btn-primary ml-3" id="business_color_regist">登録</button>
						<button type="button" class="btn btn-primary ml-3" data-toggle="modal" data-target="#business_category_edit_modal" data-backdrop="static" id="business_category_edit">業務編集</button>
						<!--<button type="button" class="btn btn-primary ml-3" data-toggle="modal" data-target="#make_import_file" data-backdrop="static" id="business_category_edit">業務編集</button>-->
					{/if}
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" value="{$showen_date}" id="showen_date">
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />
				<!--右クリックメニュー-->
				<div id="contextmenu">
					<ul class="contextmenu_box">
						<li id="modal_memo_show" class="mt-2" data-toggle="modal" data-target="#business_assign_free_description" data-backdrop="static" data-target_userid="" data-target_shift-date="">自由記述</li>
						<li id="cell_rest" class="mt-2" data-target_userid="" data-target_shift-date="" data-rest-flg="0">休憩</li>
						<li id="cell_training" class="mt-2" data-target_userid="" data-target_shift-date="">研修</li>
						<li id="cell_copy" class="mt-2" data-target_userid="" data-target_shift-date="">コピー</li>
						<li id="cell_paste" class="mt-2" data-target_userid="" data-target_shift-date="">貼り付け</li>
						<input type="hidden" id="fixed_flg" val="">
						<input type="hidden" id="terget_user_id" val="">
						<input type="hidden" id="target_hour" val="">
						<input type="hidden" id="copy_bcno" val="">
						<input type="hidden" id="copy_free_des" val="">
						<input type="hidden" id="copy_rest_flg" val="">
						<input type="hidden" id="copy_training_flg" val="">
						<input type="hidden" id="rest_flg" val="0">
						<input type="hidden" id="training_flg" val="0">
					</ul>
				</div>
				<div class="table-responsive">
					<div class="fixed-box-yoko4">
						<table class="table table-condensed table-sm table-hover table-bordered">
							<thead class="thead-dark">
								<tr>
									<th class="business_assign_date_cell fixed01">氏名</th>
									<th class="business_assign_time_cell fixed01">0</th>
									<th class="business_assign_time_cell fixed01">1</th>
									<th class="business_assign_time_cell fixed01">2</th>
									<th class="business_assign_time_cell fixed01">3</th>
									<th class="business_assign_time_cell fixed01">4</th>
									<th class="business_assign_time_cell fixed01">5</th>
									<th class="business_assign_time_cell fixed01">6</th>
									<th class="business_assign_time_cell fixed01">7</th>
									<th class="business_assign_time_cell fixed01">8</th>
									<th class="business_assign_time_cell fixed01">9</th>
									<th class="business_assign_time_cell fixed01">10</th>
									<th class="business_assign_time_cell fixed01">11</th>
									<th class="business_assign_time_cell fixed01">12</th>
									<th class="business_assign_time_cell fixed01">13</th>
									<th class="business_assign_time_cell fixed01">14</th>
									<th class="business_assign_time_cell fixed01">15</th>
									<th class="business_assign_time_cell fixed01">16</th>
									<th class="business_assign_time_cell fixed01">17</th>
									<th class="business_assign_time_cell fixed01">18</th>
									<th class="business_assign_time_cell fixed01">19</th>
									<th class="business_assign_time_cell fixed01">20</th>
									<th class="business_assign_time_cell fixed01">21</th>
									<th class="business_assign_time_cell fixed01">22</th>
									<th class="business_assign_time_cell fixed01">23</th>
								</tr>
							</thead>
							<tbody id="maintable"></tbody>
						</table>
					</div>
					<div class="fixed-box-yoko">
						<table class="table table-condensed table-sm table-hover table-bordered">
							<thead class="thead-dark">
								<tr>
									<th class="business_assign_date_cell fixed01">氏名</th>
									<th class="business_assign_time_cell fixed01">0</th>
									<th class="business_assign_time_cell fixed01">1</th>
									<th class="business_assign_time_cell fixed01">2</th>
									<th class="business_assign_time_cell fixed01">3</th>
									<th class="business_assign_time_cell fixed01">4</th>
									<th class="business_assign_time_cell fixed01">5</th>
									<th class="business_assign_time_cell fixed01">6</th>
									<th class="business_assign_time_cell fixed01">7</th>
									<th class="business_assign_time_cell fixed01">8</th>
									<th class="business_assign_time_cell fixed01">9</th>
									<th class="business_assign_time_cell fixed01">10</th>
									<th class="business_assign_time_cell fixed01">11</th>
									<th class="business_assign_time_cell fixed01">12</th>
									<th class="business_assign_time_cell fixed01">13</th>
									<th class="business_assign_time_cell fixed01">14</th>
									<th class="business_assign_time_cell fixed01">15</th>
									<th class="business_assign_time_cell fixed01">16</th>
									<th class="business_assign_time_cell fixed01">17</th>
									<th class="business_assign_time_cell fixed01">18</th>
									<th class="business_assign_time_cell fixed01">19</th>
									<th class="business_assign_time_cell fixed01">20</th>
									<th class="business_assign_time_cell fixed01">21</th>
									<th class="business_assign_time_cell fixed01">22</th>
									<th class="business_assign_time_cell fixed01">23</th>
								</tr>
							</thead>
							<tbody id="maintable_b"></tbody>
						</table>
					</div>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--自由記述欄のモーダルフォーム表示用ボタン（非表示）-->
	<button type="button" id="dummy_button" class="btn btn-primary" data-toggle="modal" data-target="#business_assign_free_description" style="display:none;">
		非表示のボタン
	</button>	
	<!--モーダルフォーム-->
	{include file="modal/modal_business_color_edit.tpl"}
	{include file="modal/modal_business_assign_free_description.tpl"}
	{include file="modal/modal_conflict.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/business_assign.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_business_color_edit.js?v={$ver}"> </script>
</body>
</html>