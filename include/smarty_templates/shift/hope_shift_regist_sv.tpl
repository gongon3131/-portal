{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-10 px-md-4">
				<div class="form-inline ml-5 mb-3">
					<h4 class="section-title">SV希望シフト登録</h4>
					<div class="ml-5">
					{html_options name=tmur_user_id id=tmur_user_id class=form-control options=$all_user_ary selected=$tmur_user_id}
					</div>
					<button type="button" class="btn btn-primary ml-3" id="hope_shift_regist">登録</button>
					<button type="button" class="btn btn-secondary ml-3" id="graph_clear">クリア</button>
					<button type="button" class="btn btn-danger ml-3" id="hope_shift_delete">登録削除</button>
				</div>
				<input type="hidden" id="section_sta" value="{$section_sta}" ><!--希望シフト登録期間sta-->
				<input type="hidden" id="section_end" value="{$section_end}" ><!--希望シフト登録期間end-->			
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id"><!--OPID-->
				<input type="hidden" value="{$smarty.session.login_info.user_name}" id="user_name"><!--氏名-->
				<input type="hidden" value="{$smarty.session.login_info.user_authority}" id="user_authority"><!--操作権限フラグ-->
				<input type="hidden" id="csrf_token" value="{$csrf_token}" /><!--トークン-->
				<div class="table-responsive">
					<div class="fixed-box-yoko">
						<table class="table table-striped table-condensed table-sm table-hover shift_confirm_summary">
							<thead class="thead-dark">
								<tr>
									<th class="center-block w10 fixed01">日付</th>
									<th class="center-block w10 fixed01">希望シフト</th>
									<th class="center-block w10 fixed01">自由記述</th>
									<th class="center-block w5 fixed01">固定</th>
									<th class="center-block w65 fixed01">備考</th>
								</tr>
							</thead>
							<tbody id="maintable"></tbody>
							<div id="shift_select_list" style="display:none;">
								{html_options name=tdsv_shift_time id=tdsv_shift_time class=form-control  options=$SY_define.hope_shift_sv selected=$SY_form.safe.tdsv_shift_time}
							</div>
						</table>
					</div>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--モーダルフォーム-->
	{include file="modal/modal_hope_shift_memo.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_sv.js?v={$ver}"> </script>
	<!--
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_form.js"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_table_graph.js"> </script>
	<script type="text/javascript" src="{$base_url}js/shift/hope_shift_save.js"> </script>
	-->
	{include file="modal/modal_contents_detail.tpl"}

</body>
</html>