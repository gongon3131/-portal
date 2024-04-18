<div class="modal fade" id="lg_import_modal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-dialog-fluid-hope-shift-detail ">
		<div class="modal-content">
			<div class="modal-header"></div>
			<!--モーダルフォーム本体-->
			<div class="modal-body">
				<div class="form-inline mt-2 hope_shift_modal_header">	
					<p class="ml-5">自治体シフト取り込み</p>
				</div>

				<form id="upd_form" action="{$base_url}shift/lg_import.php" method="POST" enctype="multipart/form-data">
				自体シフトのエクセルファイルを選択してください：
				<input type="file" class="ml-3" id="lg_file_upload2" name="lg_file_upload">
				<input type="submit" class="btn btn-primary ml-3" value="取り込み" />
				</form>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
			</div>
		</div>
	</div>
</div>
