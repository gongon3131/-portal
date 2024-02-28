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
					<h3 class="section-title">〇〇〇〇〇〇</h3>
					<input id="tdur_uriage_date" type="date" class="form-control" name="tdur_uriage_date" value="{$tdur_uriage_date}"  />
					～
					<input id="tdur_uriage_date" type="date" class="form-control" name="tdur_uriage_date" value="{$tdur_uriage_date}"  />
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">

				<div class="table-responsive">
					<!--一覧表示部分-->
					<input type="hidden" id="setting_displayrows" value="{$displayrows}" ><!--1ページ表示件数-->
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
						<tbody id="maintable_graph">
							<!--
							<tr>
								<td>2023/11/01</td>
								<td id="op-row1-00"></td>
								<td id="op-row1-01"></td>
								<td id="op-row1-02"></td>
								<td id="op-row1-03"></td>
								<td id="op-row1-04"></td>
								<td id="op-row1-05"></td>
								<td id="op-row1-06"></td>
								<td id="op-row1-07"></td>
								<td id="op-row1-08"></td>
								<td id="op-row1-09"></td>
								<td id="op-row1-10"></td>
								<td id="op-row1-11"></td>
								<td id="op-row1-12"></td>
								<td id="op-row1-13"></td>
								<td id="op-row1-14"></td>
								<td id="op-row1-15"></td>
								<td id="op-row1-16"></td>
								<td id="op-row1-17"></td>
								<td id="op-row1-18"></td>
								<td id="op-row1-19"></td>
								<td id="op-row1-20"></td>
								<td id="op-row1-21"></td>
								<td id="op-row1-22"></td>
								<td id="op-row1-23"></td>
							</tr>
							<tr>
								<td>2023/11/02</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>4
							-->
					</table>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<script type="text/javascript" src="{$base_url}js/shift/shift_table_show.js"> </script>
	{include file="modal/modal_contents_detail.tpl"}

</body>
</html>