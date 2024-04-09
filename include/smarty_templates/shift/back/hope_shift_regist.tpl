{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 col-lg-12 px-md-4">
				<div class="form-inline ml-5">
					<h4 class="section-title">OP希望シフト登録</h4>
					<div class="ml-3 hope_shift_field1">
					ID：<input id="tmur_user_id" type="text" class="form-control shift_form_text col-md-3" name="tmur_user_id" value="{$tmur_user_id}"  />
					氏名：<input id="tmur_user_name" type="text" class="form-control shift_form_text" name="tmur_user_name" value="{$tmur_user_name}"  />
					</div>
					<button type="button" class="btn btn-primary ml-3" id="hope_shift_regist">登録</button>
					<button type="button" class="btn btn-secondary ml-3" id="graph_clear">クリア</button>
					<button type="button" class="btn btn-danger ml-3" id="hope_shift_delete">登録削除</button>
					<button type="button" class="btn btn-success ml-3" id="graph_min30" value="0">30分設定</button>
					{if $smarty.session.login_info.user_id == 9}
					<button type="button" class="btn btn-secondary ml-3" id="hope_shift_summary">登録状況一覧</button>
					{/if}
				</div>
				<input type="hidden" id="section_sta" value="{$section_sta}" ><!--希望シフト登録期間sta-->
				<input type="hidden" id="section_end" value="{$section_end}" ><!--希望シフト登録期間end-->			
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id"><!--OPID-->
				<input type="hidden" value="{$smarty.session.login_info.user_name}" id="user_name"><!--氏名-->
				<input type="hidden" value="{$smarty.session.login_info.user_authority}" id="user_authority"><!--操作権限フラグ-->
				<input type="hidden" id="csrf_token" value="{$csrf_token}" /><!--トークン-->
				<div class="table-responsive">
					<!--一覧表示部分-->
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
						<!--グラフ表示-->
						<div id="form_show" class="tab-pane active">
							<div class="fixed-box-yoko">
								<table class="table table-striped table-condensed table-sm table-hover hope_shift_form">
									<thead class="thead-dark">
										<tr>
											<th class="center-block w10 fixed01">日付</th>
											<th class="center-block w25 fixed01">第1区間</th>
											<th class="center-block w25 fixed01">第2区間</th>
											<th class="center-block w5 fixed01">夜勤</th>
											<th class="center-block w5 fixed01">休日</th>
											<th class="center-block w5 fixed01">有休</th>
											<th class="center-block w25 fixed01">メモ</th>
										</tr>
										<tbody id="maintable"></tbody>
									</thead>
								</table>
							</div>
						</div>
						<!--フォーム表示-->
						<div id="graph_show" class="tab-pane">
							<div class="fixed-box-yoko">
								<table class="table table-condensed table-sm table-hover table-bordered">
									<thead class="thead-dark">
										<tr>
											<th class="op_shift_date_cell fixed01">日付</th>
											<th class="op_shift_time_cell fixed01">休日</th>
											<th class="op_shift_time_cell fixed01">有休</th>
											<th class="op_shift_time_cell fixed01">夜勤</th>
											<th class="op_shift_time_cell fixed01">0</th>
											<th class="op_shift_time_cell fixed01">1</th>
											<th class="op_shift_time_cell fixed01">2</th>
											<th class="op_shift_time_cell fixed01">3</th>
											<th class="op_shift_time_cell fixed01">4</th>
											<th class="op_shift_time_cell fixed01">5</th>
											<th class="op_shift_time_cell fixed01">6</th>
											<th class="op_shift_time_cell fixed01">7</th>
											<th class="op_shift_time_cell fixed01">8</th>
											<th class="op_shift_time_cell fixed01">9</th>
											<th class="op_shift_time_cell fixed01">10</th>
											<th class="op_shift_time_cell fixed01">11</th>
											<th class="op_shift_time_cell fixed01">12</th>
											<th class="op_shift_time_cell fixed01">13</th>
											<th class="op_shift_time_cell fixed01">14</th>
											<th class="op_shift_time_cell fixed01">15</th>
											<th class="op_shift_time_cell fixed01">16</th>
											<th class="op_shift_time_cell fixed01">17</th>
											<th class="op_shift_time_cell fixed01">18</th>
											<th class="op_shift_time_cell fixed01">19</th>
											<th class="op_shift_time_cell fixed01">20</th>
											<th class="op_shift_time_cell fixed01">21</th>
											<th class="op_shift_time_cell fixed01">22</th>
											<th class="op_shift_time_cell fixed01">23</th>
										</tr>
									</thead>
									<tbody id="maintable_graph"></tbody>
								</table>
							</div>
						</div>
					</div>		
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	{include file="modal/modal_hope_shift_memo.tpl"}

	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_show.js"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_form.js"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_graph.js"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_save.js"> </script>
	
	{include file="modal/modal_contents_detail.tpl"}

</body>
</html>