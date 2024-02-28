<div class="modal fade" id="modal_make_message" tabindex="-1"
      role="dialog" aria-labelledby="label1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-fluid2" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="label1">メッセージ送信</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-inline mb-3">
          <label for="subject">宛先：</label>
          <div class="ml-2 mr-4 w40">
            {html_options name=tdms_address_user id=tdms_address_user class=form-control options=$op_list_ary selected=$SY_form.safe.tdms_address_user multiple="multiple"}
          </div>
          <p>ctrlキーを押すと複数選択できます</p>
        </div>
        <div class="form-inline mb-3">
          <label for="subject">件名：</label>
          <div class="ml-2 mr-4 w80">
            <input type="text" id="tdms_title" class="form-control w100" value="">
          </div>
        </div>
        <div class="form-inline mb-3">
          <label for="subject">本文：</label>
          <div class="ml-2 mr-4 w80">
            <textarea  id="tdms_contents" class="form-control w100" value="" rows="14" cols="150"></textarea>
          </div>
        </div>
        
        <input type="hidden"  id="target_free_description_userid" value=""><!--user_id-->
        <input type="hidden"  id="target_free_description_hour" value=""><!--対象時刻-->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
        <button type="button" class="btn btn-primary"  id="message_post">送信する</button>
      </div>
    </div>
  </div>
</div>
