{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-5 px-md-4">
				<div class="form-inline ml-2 mt-2 mb-2">
					<h5 class="mt-2">シフト確定画面</h5>
					<button type="button" class="btn btn-primary ml-3" id="shift_confirm" onclick="return false" >確定</button>
					<button type="button" class="btn btn-primary ml-3" id="all_shift_confirm" >期間内一括確定</button>
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" id="section_sta" value="{$section_sta}" ><!--希望シフト登録期間sta-->
				<input type="hidden" id="section_end" value="{$section_end}" ><!--希望シフト登録期間end-->
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />
				<div class="table-responsive">
					<!--一覧表示部分-->
					<input type="hidden" id="setting_displayrows" value="{$displayrows}" ><!--1ページ表示件数-->
						<table class="table table-striped table-condensed table-sm table-hover shift_confirm_summary">
							<thead class="thead-dark">
								<tr>
									<th class="center-block w10">確定</th>
									<th class="center-block w45">日付</th>
									<th class="center-block w25">ステータス</th>
									<th class="center-block w20">未登録人数</th>
								</tr>
							</thead>
							<tbody id="maintable"></tbody>
						</table>

				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	<script type="text/javascript" src="{$base_url}js/shift/shift_confirm.js"> </script>
	
</body>
</html>