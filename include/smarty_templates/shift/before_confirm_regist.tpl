{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 col-lg-12 px-md-4">
				<div class="form-inline ml-5 mt-5">
					<h3 class="section-title before-contents">確定前シフト表</h3>
					<div class="ml-5">
					ID：<input id="tmur_user_id" type="text" class="form-control" name="tmur_user_id" value="{$tmur_user_id}"  />
					氏名：<input id="tmur_user_name" type="text" class="form-control" name="tmur_user_name" value="{$tmur_user_name}"  />
					</div>
					<button type="button" class="btn btn-primary ml-3" id="hope_shift_regist">登録</button>
					<button type="button" class="btn btn-secondary ml-3" id="graph_clear">クリア</button>
					<!--<button type="button" class="btn btn-danger ml-3" id="hope_shift_delete">登録削除</button>-->
					<button type="button" class="btn btn-success ml-3" id="graph_min30" value="0">30分登録</button>
					<!--<button type="button" class="btn btn-secondary ml-3" id="hope_shift_summary">登録状況一覧</button>-->
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id"><!--OPID-->

				<div class="table-responsive">
					<!--一覧表示部分-->
					<input type="hidden" id="setting_displayrows" value="{$displayrows}" ><!--1ページ表示件数-->
					<input type="hidden" id="section_sta" value="{$section_sta}" ><!--希望シフト登録期間sta-->
					<input type="hidden" id="section_end" value="{$section_end}" ><!--希望シフト登録期間end-->
					<div id="maintable_sumarry"></div>	

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
							<table class="table table-striped table-condensed table-sm table-hover hope_shift_form">
								<thead class="thead-dark">
									<tr>
										<th class="center-block w10">日付</th>
										<th class="center-block w25">第1区間</th>
										<th class="center-block w25">第2区間</th>
										<th class="center-block w5">夜勤</th>
										<th class="center-block w5">休日</th>
										<th class="center-block w5">有休</th>
										<th class="center-block w25">メモ</th>
									</tr>
									<tbody id="maintable"></tbody>
								</thead>
							</table>
						</div>
						<!--グラフ表示-->
						<div id="graph_show" class="tab-pane">
							<table class="table table-condensed table-sm table-hover table-bordered">
								<thead class="thead-dark">
									<tr>
										<th class="op_shift_date_cell">日付</th>
										<th class="op_shift_time_cell">休日</th>
										<th class="op_shift_time_cell">有休</th>
										<th class="op_shift_time_cell">夜勤</th>
										<th class="op_shift_time_cell">0</th>
										<th class="op_shift_time_cell">1</th>
										<th class="op_shift_time_cell">2</th>
										<th class="op_shift_time_cell">3</th>
										<th class="op_shift_time_cell">4</th>
										<th class="op_shift_time_cell">5</th>
										<th class="op_shift_time_cell">6</th>
										<th class="op_shift_time_cell">7</th>
										<th class="op_shift_time_cell">8</th>
										<th class="op_shift_time_cell">9</th>
										<th class="op_shift_time_cell">10</th>
										<th class="op_shift_time_cell">11</th>
										<th class="op_shift_time_cell">12</th>
										<th class="op_shift_time_cell">13</th>
										<th class="op_shift_time_cell">14</th>
										<th class="op_shift_time_cell">15</th>
										<th class="op_shift_time_cell">16</th>
										<th class="op_shift_time_cell">17</th>
										<th class="op_shift_time_cell">18</th>
										<th class="op_shift_time_cell">19</th>
										<th class="op_shift_time_cell">20</th>
										<th class="op_shift_time_cell">21</th>
										<th class="op_shift_time_cell">22</th>
										<th class="op_shift_time_cell">23</th>
									</tr>
								</thead>
								<tbody id="maintable_graph"></tbody>
							</table>
						</div>
					</div>		
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	{include file="modal/modal_hope_shift_memo.tpl"}

	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_show.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_form.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_graph.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_save.js?v={$ver}"> </script>
	
	{include file="modal/modal_contents_detail.tpl"}

</body>
</html>