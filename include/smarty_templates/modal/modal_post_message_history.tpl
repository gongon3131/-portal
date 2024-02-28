<div class="modal fade" id="modal_post_message_history" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-dialog-fluid-hope-shift-section ">
		<div class="modal-content">
			<div class="modal-header"></div>
			<!--モーダルフォーム本体-->
			<div class="modal-body">
				<h5>メッセージ送信履歴</h5>
				<table class="table table-striped table-condensed table-sm table-hover hope_shift_section">
					<thead class="thead-dark">
						<tr>
							<th class="center-block w20">送信日</th>
							<th class="center-block w55">件名</th>
							<th class="center-block w15">宛先</th>
							<th class="center-block w10">開封状況</th>
						</tr>
						<tbody id="maintable_post_message_history"></tbody>
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
