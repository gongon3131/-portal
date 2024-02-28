<div class="modal fade" id="hope_shift_detail" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-dialog-fluid-hope-shift-detail ">
		<div class="modal-content">
			<div class="modal-header"></div>
			<!--モーダルフォーム本体-->
			<div class="modal-body">
				<div class="form-inline ml-5 mt-2 hope_shift_modal_header">	
					<p id="hope_shift_detail_user_id"></p>&emsp;<p id="hope_shift_detail_user_name"></p><p class="ml-5">登録希望シフト詳細</p>
				</div>
				<table class="table table-striped table-condensed table-sm table-hover hope_shift_detail">
					<thead class="thead-dark">
						<tbody id="maintable_detail"></tbody>
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
