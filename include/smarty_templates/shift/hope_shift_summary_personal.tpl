{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-12 px-md-4">
				<div class="form-inline ml-5">
					<h3 class="section-title">希望シフト登録状況</h3>
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" value="{$smarty.session.login_info.user_name}" id="user_name">
				<input type="hidden" value="{$smarty.session.login_info.user_authority}" id="user_authority"><!--操作権限フラグ-->
				<input type="hidden" id="section_sta" value="{$section_sta}" ><!--希望シフト登録期間sta-->
				<input type="hidden" id="section_end" value="{$section_end}" ><!--希望シフト登録期間end-->
				
				<div class="table-responsive">
					<!--一覧表示部分-->
					<input type="hidden" id="setting_displayrows" value="{$displayrows}" ><!--1ページ表示件数-->
						<table class="table table-striped table-condensed table-sm table-hover hope_shift_summary_personal">
						<thead class="thead-dark">
							<tr>
								<th class="center-block w30">希望登録期間</th>
								<th class="center-block w10">登録状況</th>
								<th class="center-block w20">登録締切日</th>
								<th class="center-block w20">最終更新日時</th>
								<th class="center-block w10">詳細</th>
								<th class="center-block w10">修正</th>
							</tr>
						</thead>
						<tbody id="maintable"></tbody>
					</table>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	{include file="modal/modal_hope_shift_detail.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_summary_personal.js"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_hope_shift_detail.js"> </script>
</body>
</html>