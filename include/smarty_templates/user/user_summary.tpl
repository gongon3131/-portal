{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 px-md-4">
				<div class="form-inline ml-5 mt-5 mb-2">
					<h5>ユーザー一覧</h5>
					<button type="button" class="btn btn-primary ml-3" id="shift_confirm" onclick='window.location.href="user_regist.php"' >新規登録</button>
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" value="{$ses_flg}" id="ses_flg">
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />

				<button class="btn btn-primary btn-block uriage_search_btn mb-3" type="button" data-toggle="collapse" data-target="#uriage_search_condition" aria-expanded="false" aria-controls="uriage_search_condition">検索条件</button>
				<!--検索条件-->
				<div class="collapse search_form_area mb-3" id="uriage_search_condition">
					<div class="card card-body">
						<!--編集画面からの遷移時は検索条件は保持する-->
						<input type="hidden" value="{$ses_flg}" id="ses_flg">
						<form class="form-inline">
							<div class="form-group search_form_contents">
								<label for="InputName">氏名：</label>
									<input type="text" id="tmur_user_name" class="col-md-12 form-control" value="{$tmur_user_name}" />
							</div>
							<div class="form-group search_form_contents">
								<label for="InputName">住所：</label>
									<input type="text" id="tmur_address" class="col-md-12 form-control" value="{$tmur_address}" />
							</div>
							<div class="form-group search_form_contents">
								<label for="InputName">操作権限：</label>
								{html_options class=form-control name=tmur_authority id=tmur_authority options=$SY_define.user_type selected=$tmur_authority}
							</div>
						</form>
						<form class="form-inline">

						<button type="button" class="btn btn-primary mt-3" id="user_kensaku_start"><strong>検索実行</strong></button>
						<button type="button" class="btn btn-primary ml-3 mt-3" id="user_kensaku_clear"><strong>検索条件のクリア</strong></button>
						</form>
					</div>
				</div>		
		
				<div class="table-responsive">
					<!--一覧表示部分-->
					<input type="hidden" id="setting_displayrows" value="{$displayrows}" ><!--1ページ表示件数-->
						<table class="table table-striped table-condensed table-sm table-hover shift_confirm_summary">
							<thead class="thead-dark">
								<tr>
									<th class="center-block w15">ID</th>
									<th class="center-block w25">氏名</th>
									<th class="center-block w25">氏名カナ</th>
									<th class="center-block w10">操作権限</th>
									<th class="center-block w10">在籍状況</th>
									<th class="center-block w15">アクション</th>
								</tr>
							</thead>
							<tbody id="maintable"></tbody>
						</table>
						<!--ページネーション-->
						<nav aria-label="Page navigation">
							<ul class="pagination">
								<li class="page-item"><a class="page-link" id="prevbtn" href="javascript:void(0);" onclick="prev_page();">Prev</a></li>
								<li class="page-item"><a class="page-link" id="nextbtn" href="javascript:void(0);" onclick="next_page();" >Next</a></li>						
							</ul>
						</nav>

				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<script type="text/javascript" src="{$base_url}js/user/user_summary.js"> </script>
</body>
</html>