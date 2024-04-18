{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 px-md-4">
				<div class="form-inline ml-3 mb-3">
					{if $section_sta == "" && $section_end == ""}
						{if $target == 1}						
							<h4 class="section-title">OP希望シフト登録状況</h4>
						{elseif $target == 2}
							<h4 class="section-title">SV希望シフト登録状況</h4>
						{/if}
					{else}
						{if $target == 1}
							<h4 class="section-title">OP希望シフト登録状況　{$section_sta|date_format:"%Y年%m月%d日"}～{$section_end|date_format:"%Y年%m月%d日"}</h4>
						{elseif $target == 2}
							<h4 class="section-title">SV希望シフト登録状況　{$section_sta|date_format:"%Y年%m月%d日"}～{$section_end|date_format:"%Y年%m月%d日"}</h4>
						{/if}
					{/if}
					<button type="button" class="btn btn-primary ml-3" id="shift_section" data-toggle="modal" data-target="#hope_shift_section" data-backdrop="static">希望シフト期間管理</button>
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" id="section_sta" value="{$section_sta}" ><!--希望シフト登録期間sta-->
				<input type="hidden" id="section_end" value="{$section_end}" ><!--希望シフト登録期間end-->
				<input type="hidden" id="target" value="{$target}" ><!--表示対象（OP/SV）-->
				<input type="hidden" value="{$smarty.session.login_info.user_authority}" id="user_authority"><!--操作権限フラグ-->
				<div class="table-responsive">
					<!--一覧表示部分-->
					<input type="hidden" id="setting_displayrows" value="{$displayrows}" ><!--1ページ表示件数-->
						<table class="table table-striped table-condensed table-sm table-hover hope_shift_summary">
							<thead class="thead-dark">
								<tr>
									<th class="center-block w10">ID</th>
									<th class="center-block w30">氏名</th>
									<th class="center-block w10">登録状況</th>
									<th class="center-block w20">最終更新日時</th>
									<th class="center-block w10">詳細</th>
									<th class="center-block w10">登録</th>
									<th class="center-block w10">反映</th>
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
	{include file="modal/modal_hope_shift_section.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_summary.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_hope_shift_section.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_hope_shift_detail.js?v={$ver}"> </script>
	
</body>
</html>