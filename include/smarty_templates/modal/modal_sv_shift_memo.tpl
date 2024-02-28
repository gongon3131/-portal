<div class="modal fade" id="sv_shift_memo" tabindex="-1"
      role="dialog" aria-labelledby="label1" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="label1">メモ</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <input type="text" class="form-control" id="modal_memo" value="">
        <input type="hidden"  id="target_memo_userid" value=""><!--user_id-->
        <input type="hidden"  id="target_memo_shift_date" value=""><!--シフト日付-->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
        <button type="button" class="btn btn-primary"  id="sv_shift_memo_regist">登録</button>
      </div>
    </div>
  </div>
</div>
