<div class="modal fade" id="modal_message_detail" tabindex="-1"
      role="dialog" aria-labelledby="label1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-fluid2" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="label1">受信メッセージ</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-inline mb-3">
          <label for="subject">差出人：</label>
          <div class="ml-2 mr-4 w40" id="post_user_detail"></div>
        </div>
        <div class="form-inline mb-3">
          <label for="subject">件名：</label>
          <div class="ml-2 mr-4 w80" id="post_title_detail"></div>
        </div>
        <div class="form-inline mb-3">
          <label for="subject">本文：</label>
          <div class="ml-2 mr-4 w80" id="post_contents_detail"></div>

          <div class="ml-2 mr-4 w80" id="message_post_area">
            <textarea  id="post_contents_reply" class="form-control w100" value="" rows="14" cols="150"></textarea>
          </div>

        </div>
        
        <input type="hidden" id="post_id" value="">
        <input type="hidden" id="post_open_confirm" value="">
        <input type="hidden" id="post_user_id" value="">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" id="message_open">確認しました</button>
        <button type="button" class="btn btn-primary"  id="message_reply">返信する</button>
      </div>
    </div>
  </div>
</div>
