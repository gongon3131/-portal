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
					<h3 class="section-title">勤務シフト印刷</h3>
					<input id="showen_date" type="date" class="form-control ml-5 mr-2 date_pk" name="showen_date" value="{$showen_date}"  />
					{if $smarty.session.login_info.user_authority != 1}
						<a href="{$base_url}shift/sample.php"><button type="button" class="btn btn-primary ml-3" id="shift_print">印刷</button></a>
						<a href="{$base_url}excel/{$file_name}" download="{$file_name}"><button type="button" class="btn btn-primary ml-3" id="shift_print">印刷2</button></a>
						<!--<a href="{$base_url}shift/sample.php">印刷2</a>-->
					{/if}
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" value="{$showen_date}" id="showen_date">
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />
				<div class="table-responsive">
					<!--グラフ表示-->
					<div id="graph_show" class="tab-pane">
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
								<tbody id="maintable"></tbody>
							</table>
						</div>
					</div>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	{include file="modal/modal_business_color_edit.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/shift_print.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_business_color_edit.js?v={$ver}"> </script>
</body>
</html>