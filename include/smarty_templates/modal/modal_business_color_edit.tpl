<div class="modal fade" id="business_category_edit_modal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-dialog-fluid-hope-shift-detail ">
		<div class="modal-content">
			<div class="modal-header"></div>
			<!--モーダルフォーム本体-->
			<div class="modal-body">
				<div class="form-inline ml-5 mt-2 hope_shift_modal_header">	
					<p class="ml-5">業務別カラー編集</p>
				</div>
				<table class="table table-striped table-condensed table-sm table-hover hope_shift_detail">
					<thead class="thead-dark">
						<tr>
							<th class="center-block w5">削除</th>
							<th class="center-block w5">登録</th>
							<th class="center-block w10">業務番号</th>
							<th class="center-block w25">業務名</th>
							<th class="center-block w15">カラーコード</th>
							<th class="center-block w15">インポート分類</th>
							<th class="center-block w25">メモ</th>
						</tr>
						<tbody>
						<tr>
							<td></td>
							<td class="business_color_summary_cell1"><button type="button" class="btn btn-success business_category_regist" id="" data-id="0">登録</button></td>
							<td><input type="text" class="form-control" value="" id="tmbc_business_id_0"></td>
							<td><input type="text" class="form-control" value="" id="tmbc_business_name_0"></td>
							<td><input type="color" class="form-control" value="#ff0000" id="tmbc_color_code_0"></td>
							<td id="import_select">{html_options class=form-control name=tmbc_import_class id=tmbc_import_class_0 options=$import_kbn selected=$tmbc_import_class}</td>
							<td><input type="text" class="form-control" value="" id="tmbc_memo_0"></td>
						</tr>
						</tbody>
						<tbody id="maintable_business"></tbody>				

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
