<div class="modal fade" id="modal_shift_import" tabindex="-1"
      role="dialog" aria-labelledby="label1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-fluid2" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="label1">統合ツールインポート</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h5>統合ツールインポートファイル作成</h5>
        <table class="table table-striped table-condensed table-sm table-hover hope_shift_section">
          <thead class="thead-dark">
            <tr>
              <th class="center-block w20">種別</th>
              <th class="center-block w65">出力期間</th>
              <th class="center-block w15">インポート</th>
            </tr>
            {foreach from=$import_kbn item=val key=business_no }
              <tr>
                <td>{$val}</td>
                <td>
                  <div class="form-inline">
                    <input id="import_date_from{$business_no}" type="date" class="form-control ml-5 mr-2 date_pk" name="import_date_from{$business_no}" value=""  />
                    ～
                    <input id="import_date_to{$business_no}" type="date" class="form-control ml-5 mr-2 date_pk" name="import_date_to{$business_no}" value=""  />
                  </div>
                </td>
                <td>
                  <button type="button" class="btn btn-primary ml-3 import_exec" data-bcno="{$business_no}">インポート</button>
                </td>
              </tr>
            {/foreach}
            <tbody id="maintable_import_data"></tbody>
         </thead>
      </table>
      <input type="hidden" id="hope_shift_memo_target_date" value="">
    </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" id="message_open">閉じる</button>
       <!-- <button type="button" class="btn btn-primary"  id="message_post">送信する</button>-->
      </div>
    </div>
  </div>
</div>
