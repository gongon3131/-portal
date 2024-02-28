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
					<h3 class="section-title">勤務シフト表　時間帯別人数</h3>
					<input id="date_sta" type="date" class="form-control ml-5 mr-2" name="date_sta" value="{$date_sta}"  />
					～
					<input id="date_end" type="date" class="form-control ml-2" name="date_end" value="{$date_end}"  />
					<button type="button" class="btn btn-primary ml-3" id="by_timezone_show">表示</button>
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<div class="table-responsive">
					<!--一覧表示部分-->
					<div id="maintable_sumarry"></div>	
					<table class="table table-striped table-condensed table-sm table-hover table-bordered">
						<thead class="thead-dark">
							<tr>
								<th class="op_shift_date_cell">日付</th>
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
						<tbody id="maintable_by_timezone"></tbody>
					</table>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<script type="text/javascript" src="{$base_url}js/shift/tsr_shift_by_timezone.js"> </script>
	{include file="modal/modal_contents_detail.tpl"}

</body>
</html>