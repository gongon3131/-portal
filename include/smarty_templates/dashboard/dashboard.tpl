{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 col-lg-12 px-md-4">
				<div class="form-inline">
					<h3 class="section-title">ダッシュボード</h3>
				</div>
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<div class="table-responsive">
					<div class="row">
						<div class="col-6">
							<h4 class="section-title">更新履歴</h4>
							<div class="fixed-box-yoko2">
								<table class="table table-striped table-condensed table-sm table-hover shift_history">
									<thead class="thead-dark">
										<tr>
											<th class="center-block w25 fixed01">日付</th>
											<th class="center-block w50 fixed01">更新内容</th>
											<th class="center-block w25 fixed01">更新者</th>
										</tr>
									</thead>
									<tbody id="maintable_by_date_form">
										{foreach from=$operation_log_ary item=val key=keyname }
											<tr>
											<td>{$val.update_date}</td>
											<td>{$val.contents}</td>
											<td>{$val.update_user}</td>
											</tr>
										{/foreach}
									</tbody>
								</table>
							</div>
						</div>
						<div class="col-6">
							<div class="form-inline">
								<h4 class="section-title">メッセージ管理</h4>
								{if $smarty.session.login_info.user_authority != 1}
								<button type="button" class="btn btn-success ml-3 " data-toggle="modal" data-target="#modal_make_message" data-backdrop="static">メッセージ作成</button>
								<button type="button" class="btn btn-success ml-3 " data-toggle="modal" data-target="#modal_post_message_history" data-backdrop="static" id="post_history_show">送信履歴</button>
								{/if}
								<div class="custom-control custom-checkbox ml-5">
									<input type="checkbox" class="custom-control-input" id="non_confirm_only" value="" >
									<label class="custom-control-label" for="non_confirm_only">未開封のみ表示
								</div>
							</div>
							<table class="table table-striped table-condensed table-sm table-hover shift_history">
								<thead class="thead-dark">
									<tr>
										<th class="center-block w25 fixed01">日付</th>
										<th class="center-block w50 fixed01">タイトル</th>
										<th class="center-block w25 fixed01">送信者</th>
									</tr>
								</thead>
								<tbody id="maintable_message">
									{foreach from=$message_ary item=val key=keyname }
										<tr>
											<td>{$val.post_date}</td>
											<td>
												{if $val.post_open_confirm == 0 }
													<img class="message_icn" src="{$base_url}img/message_non_open.png" alt="未開封">
												{else}
													<img class="message_icn" src="{$base_url}img/message_open.png" alt="開封済">
												{/if}
												<a href="#" id="message_detail" data-id="{$val.id}" data-toggle="modal" data-target="#modal_message_detail" data-backdrop="static">{$val.post_title}</a>
											</td>
											<td>{$val.post_user}</td>
										</tr>
									{/foreach}
								</tbody>
							</table>
						</div>
						
					</div>
					<div class="row">

					{if $smarty.session.login_info.user_authority != 1}
						<div class="col-12">
							<h4 class="section-title">勤務シフト変更履歴</h4>
							<div class="fixed-box-yoko3">
								<table class="table table-striped table-condensed table-sm table-hover shift_history">
									<thead class="thead-dark">
										<tr>
											<th class="center-block w5 fixed01">対象</th>
											<th class="center-block w5 fixed01">OPID</th>
											<th class="center-block w10 fixed01">氏名</th>
											<th class="center-block w10 fixed01">シフト日付</th>
											<th class="center-block w20 fixed01">変更前</th>
											<th class="center-block w20 fixed01">変更後</th>
											<th class="center-block w15 fixed01">更新日</th>
											<th class="center-block w15 fixed01">更新者</th>
										</tr>
										<tbody id="maintable_by_date_form">
										{foreach from=$shift_histry_ary item=val key=keyname }
											<tr>
											<td>{$val.target}</td>
											<td>{$val.opid}</td>
											<td>{$val.name}</td>
											<td>{$val.shift_date}</td>
											<td>{$val.change_before}</td>
											<td>{$val.change_after}</td>
											<td>{$val.update_time}</td>
											<td>{$val.update_user}</td>
											</tr>
										{/foreach}
										</tbody>
									</thead>
								</table>
							</div>
						</div>
					{else}
						<div class="col-8">
							<h4 class="section-title">勤務シフト変更履歴</h4>
							<table class="table table-striped table-condensed table-sm table-hover shift_history">
								<thead class="thead-dark">
									<tr>
										<th class="center-block w5 fixed01">対象</th>
										<th class="center-block w15 fixed01">シフト日付</th>
										<th class="center-block w20 fixed01">変更前</th>
										<th class="center-block w20 fixed01">変更後</th>
										<th class="center-block w20 fixed01">更新日</th>
										<th class="center-block w20 fixed01">更新者</th>
									</tr>
									<tbody id="maintable_by_date_form">
										{foreach from=$shift_histry_ary_op item=val key=keyname }
											<tr>
											<td>{$val.target}</td>
											<td>{$val.shift_date}</td>
											<td>{$val.change_before}</td>
											<td>{$val.change_after}</td>
											<td>{$val.update_time}</td>
											<td>{$val.update_user}</td>
											</tr>
										{/foreach}
									</tbody>
								</thead>
							</table>
						</div>
					{/if}
					</div>
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>

	{include file="modal/modal_make_message.tpl"}
	{include file="modal/modal_message_detail.tpl"}
	{include file="modal/modal_post_message_history.tpl"}
	<script type="text/javascript" src="{$base_url}js/modal/modal_make_message.js"></script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_post_message_history.js"></script>
	<script type="text/javascript" src="{$base_url}js/dashboard/dashboard.js"></script>
	
</body>
</html>