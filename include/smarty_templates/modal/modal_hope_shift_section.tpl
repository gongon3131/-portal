<div class="modal fade" id="hope_shift_section" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-dialog-fluid-hope-shift-section ">
		<div class="modal-content">
			<div class="modal-header"></div>
			<!--モーダルフォーム本体-->
			<div class="modal-body">
				<h5>希望シフト期間管理</h5>
				<table class="table table-striped table-condensed table-sm table-hover hope_shift_section">
					<thead class="thead-dark">
						<tr>
							<th class="center-block w10">受付</th>
							<th class="center-block w10">登録</th>
							<th class="center-block w20">開始日</th>
							<th class="center-block w20">終了日</th>
							<th class="center-block w20">登録締切日</th>
							<th class="center-block w20">データ消去日</th>
						</tr>
						<!--
						<tr>
						<td></td>
						<td class="hope_shift_summary_cell1"><button type="button" class="btn btn-success hope_shift_section_regist" data-id="">登録</button></td>
						<td><input type="date" class="form-control" value="" id="tshs_start_date"></td>
						<td><input type="date" class="form-control" value="" id="tshs_end_date"></td>
						<td><input type="date" class="form-control" value="" id="tshs_dead_line"></td>
						<td><input type="date" class="form-control" value="" id="tshs_delete_date"></td>
						</tr>
						-->

						<tbody id="maintable_section"></tbody>
					</thead>
				</table>
				<input type="hidden" id="hope_shift_memo_target_date" value="">
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
			</div>
		</div>
	</div>
</div>
