<div class="modal fade" id="sv_shift_free_description" tabindex="-1"
      role="dialog" aria-labelledby="label1" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="label1">自由記述欄</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div id="free_description_area">
        <input type="text" class="form-control" id="free_description" value="">
      </div>
        <input type="hidden"  id="target_free_description_userid" value=""><!--user_id-->
        <input type="hidden"  id="target_free_description_shift_date" value=""><!--シフト日付-->
        <input type="hidden"  id="selected_shift_time" value=""><!--datalistから選択された値-->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
        <button type="button" class="btn btn-primary"  id="free_description_regist">登録</button>
      </div>
    </div>
  </div>
</div>
