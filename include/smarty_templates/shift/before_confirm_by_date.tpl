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
					<h3 class="section-title before-contents">確定前シフト表</h3>
					<input id="showen_date" type="date" class="form-control ml-5 mr-2 date_pk" name="showen_date" value="{$showen_date}"  />
					<button type="button" class="btn btn-primary ml-3" id="bofore_confirm_regist">登録</button>
					<button type="button" class="btn btn-success ml-3" id="graph_min30" value="0">30分設定</button>
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" value="{$smarty.session.login_info.user_authority}" id="user_authority"><!--操作権限フラグ-->
				<input type="hidden" value="1" id="target"><!--表示ターゲット-->
				<input type="hidden" value="{$showen_date}" id="showen_date">
				<input type="hidden" value="{$section_sta}" id="section_sta">
				<input type="hidden" value="{$section_end}" id="section_end">
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />
				<div class="table-responsive">
					<!--タブ-->
					<ul class="nav nav-tabs nav-pills ml-3 mb-3 mt-3">
						<li class="nav-item">
							<a href="#form_show" class="nav-link active" data-toggle="tab">フォーム表示</a>
						</li>
						<li class="nav-item">
							<a href="#graph_show" class="nav-link" data-toggle="tab">グラフ表示</a>
						</li>
					</ul>
					<div class="tab-content">
						<!--フォーム表示-->
						<div id="form_show" class="tab-pane active">
							<div class="fixed-box-yoko">
								<table class="table table-striped table-condensed table-sm table-hover hope_shift_form">
									<thead class="thead-dark">
										<tr>
											<th class="center-block w15 fixed01">氏名</th>
											<th class="center-block w25 fixed01">第1区間</th>
											<th class="center-block w25 fixed01">第2区間</th>
											<th class="center-block w5 fixed01">夜勤</th>
											<th class="center-block w5 fixed01">休日</th>
											<th class="center-block w5 fixed01">有休</th>
											<th class="center-block w20 fixed01">メモ</th>
										</tr>
										<tbody id="maintable_by_date_form"></tbody>
									</thead>
								</table>
							</div>
						</div>
						<!--グラフ表示-->
						<div id="graph_show" class="tab-pane">
							<div class="fixed-box-yoko">
								<table class="table table-condensed table-sm table-hover table-bordered">
									<thead class="thead-dark">
										<tr>
											<th class="by_date_shift_date_cell fixed01">氏名</th>
											<th class="by_date_shift_time_cell fixed01">休日</th>
											<th class="by_date_shift_time_cell fixed01">有休</th>
											<th class="by_date_shift_time_cell fixed01">夜勤</th>
											<th class="by_date_shift_time_cell fixed01">0</th>
											<th class="by_date_shift_time_cell fixed01">1</th>
											<th class="by_date_shift_time_cell fixed01">2</th>
											<th class="by_date_shift_time_cell fixed01">3</th>
											<th class="by_date_shift_time_cell fixed01">4</th>
											<th class="by_date_shift_time_cell fixed01">5</th>
											<th class="by_date_shift_time_cell fixed01">6</th>
											<th class="by_date_shift_time_cell fixed01">7</th>
											<th class="by_date_shift_time_cell fixed01">8</th>
											<th class="by_date_shift_time_cell fixed01">9</th>
											<th class="by_date_shift_time_cell fixed01">10</th>
											<th class="by_date_shift_time_cell fixed01">11</th>
											<th class="by_date_shift_time_cell fixed01">12</th>
											<th class="by_date_shift_time_cell fixed01">13</th>
											<th class="by_date_shift_time_cell fixed01">14</th>
											<th class="by_date_shift_time_cell fixed01">15</th>
											<th class="by_date_shift_time_cell fixed01">16</th>
											<th class="by_date_shift_time_cell fixed01">17</th>
											<th class="by_date_shift_time_cell fixed01">18</th>
											<th class="by_date_shift_time_cell fixed01">19</th>
											<th class="by_date_shift_time_cell fixed01">20</th>
											<th class="by_date_shift_time_cell fixed01">21</th>
											<th class="by_date_shift_time_cell fixed01">22</th>
											<th class="by_date_shift_time_cell fixed01">23</th>
										</tr>
									</thead>
									<tbody id="maintable_by_date_graph"></tbody>
								</table>
							</div>
						</div>
					</div>		

					</table>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	{include file="modal/modal_shift_by_date_memo.tpl"}
	{include file="modal/modal_hope_shift_detail.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/before_confirm_by_date.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/before_confirm_shift_save.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/before_confirm_shift_set.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_hope_shift_detail.js?v={$ver}"> </script>
</body>
</html>