{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 col-lg-12 px-md-4">
				<div class="form-inline ">
					<h3 class="section-title">勤務シフト表</h3>
					<div class="ml-5">
						{if $smarty.session.login_info.user_authority == 1}
							{html_options class=form-control name=tmur_user_id id=tmur_user_id options=$user_ary_kbn selected=$tmur_user_id disabled=$disabled}
						{else}
							{html_options class=form-control name=tmur_user_id id=tmur_user_id options=$user_ary_kbn selected=$tmur_user_id}
						{/if}
						<input id="section_sta" type="date" class="form-control ml-5 mr-2 date_pk" name="section_sta" value="{$section_sta}"  />～
						<input id="section_end" type="date" class="form-control ml-2 mr-2 date_pk" name="section_end" value="{$section_end}"  />
						<button type="button" class="btn btn-primary ml-3" id="show_list">表示</button>
						{if $smarty.session.login_info.user_authority == 1}
							<button type="button" class="btn btn-primary ml-3" id="show_usage_list" data-toggle="modal" data-target="#usage_guide_modal" data-backdrop="static">業務色分け表</button>
						{/if}
					</div>
					{if $smarty.session.login_info.user_authority == 9}
						<button type="button" class="btn btn-primary ml-3" id="tsr_shift_regist">登録</button>
						<button type="button" class="btn btn-secondary ml-3" id="graph_clear">クリア</button>
						<button type="button" class="btn btn-success ml-3" id="graph_min30" value="0">30分設定</button>
					{/if}
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id"><!--OPID-->
				<input type="hidden" value="{$smarty.session.login_info.user_authority}" id="user_authority"><!--操作権限フラグ-->
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />
				<input type="hidden" value="1" id="shift_by_date">
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
									<tbody id="maintable_by_user_form"></tbody>
								</thead>
							</table>
						</div>
						<!--グラフ表示-->
						<div id="graph_show" class="tab-pane">
							<div class="fixed-box-yoko">
								<table class="table table-condensed table-sm table-hover table-bordered">
									<thead class="thead-dark">
										<tr>
											<th class="by_user_shift_date_cell fixed01">日付</th>
											{if $smarty.session.login_info.user_authority == 9}
											<th class="by_user_shift_time_cell fixed01">休日</th>
											<th class="by_user_shift_time_cell fixed01">有休</th>
											<th class="by_user_shift_time_cell fixed01">夜勤</th>
											{/if}
											<th class="by_user_shift_time_cell fixed01">0</th>
											<th class="by_user_shift_time_cell fixed01">1</th>
											<th class="by_user_shift_time_cell fixed01">2</th>
											<th class="by_user_shift_time_cell fixed01">3</th>
											<th class="by_user_shift_time_cell fixed01">4</th>
											<th class="by_user_shift_time_cell fixed01">5</th>
											<th class="by_user_shift_time_cell fixed01">6</th>
											<th class="by_user_shift_time_cell fixed01">7</th>
											<th class="by_user_shift_time_cell fixed01">8</th>
											<th class="by_user_shift_time_cell fixed01">9</th>
											<th class="by_user_shift_time_cell fixed01">10</th>
											<th class="by_user_shift_time_cell fixed01">11</th>
											<th class="by_user_shift_time_cell fixed01">12</th>
											<th class="by_user_shift_time_cell fixed01">13</th>
											<th class="by_user_shift_time_cell fixed01">14</th>
											<th class="by_user_shift_time_cell fixed01">15</th>
											<th class="by_user_shift_time_cell fixed01">16</th>
											<th class="by_user_shift_time_cell fixed01">17</th>
											<th class="by_user_shift_time_cell fixed01">18</th>
											<th class="by_user_shift_time_cell fixed01">19</th>
											<th class="by_user_shift_time_cell fixed01">20</th>
											<th class="by_user_shift_time_cell fixed01">21</th>
											<th class="by_user_shift_time_cell fixed01">22</th>
											<th class="by_user_shift_time_cell fixed01">23</th>
										</tr>
									</thead>
									<tbody id="maintable_by_user_graph"></tbody>
								</table>
							</div>
						</div>
					</div>		
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	{include file="modal/modal_shift_by_user_memo.tpl"}
	{include file="modal/modal_hope_shift_detail.tpl"}
	{include file="modal/modal_conflict.tpl"}
	{include file="modal/modal_usage_guide.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/tsr_shift_by_user.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/tsr_shift_save.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/tsr_shift_set.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_hope_shift_detail.js?v={$ver}"> </script>

</body>
</html>