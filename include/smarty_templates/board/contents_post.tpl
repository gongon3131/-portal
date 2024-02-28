{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--サイドバー-->
			{include file="common/common_side.tpl"}
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
				<h3 class="section-title">新規記事投稿</h3>

				<table class="vr_contentArea" width="100%">
					<tr>
						<td class="vr_contentAreaTd">
							<table class="table" width="100%">
								<tr valign="top">
									<td>
										<div class="vr_viewTitle clearfix">
											<!-- 標題 -->
											<div class="marginFull">
												<table width="100%" class="table">
													<tr>
														<td class="vr_viewTitleAreaCategory">
															<div class="form-inline">
																<!--<div class="form-group">-->
																	<label for="subject">件名：</label>
																	<div class="ml-2 mr-4 w40">
																		<input type="text" id="subject" class="form-control w100" value="">
																	</div>
																<!--</div>-->
																<!--<div class="form-group">-->
																	<label for="contents_insert">カテゴリー：</label>
																	<div class="ml-2 mr-4">
																		{html_options name=tdbr_category_id class=form-control id=category options=$category_ary}
																	</div>
																<!--</div>-->
																<button class="btn btn-success" id="contents_insert" type="button" style="margin-left:30px;"><strong>登録</strong></button>
																<button class="btn btn-success" data-toggle="modal" data-target="#board_category" data-backdrop="static" id="category_summary" type="button" style="margin-left:30px;"><strong>カテゴリー編集</strong></button>
																</div>	
														</td>
													</tr>
												</table>
											</div>
											<hr>
											<!-- 差出人 -->
											<!--
											<div>
												<table class="vr_viewTitleSub">
													<tr>
														<td>差出人</td>
														<td>：</td>
														<td>
															<b><img class="profileImage" src="https://static.cybozu.com/o/10.8.4_20.3_804/image/user20.png" style="width: 20px; height: 20px;" align=absmiddle>{$smarty.session.login_info.user_name}</b>
														</td>
														<td>
															<button class="btn btn-success" id="category-summary" type="button" style="margin-left:30px;"><strong>カテゴリー編集</strong></button>
														</td>
													</tr>
												</table>
											</div>
											<hr>
											-->
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				<!-- テキストエディタ「Quilljs」のライブラリ -->
				<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
				<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
				<link href="https://cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">
				<!-- Quillカスタマイズjs -->
				<script type="text/javascript" src="{$base_url}js/quill/quillcustom.js"></script>
				<div id="quill-editor_1"></div>
				<div id ="post_contents_show"></div>
				<script>
				{literal}
				// 通常のエディタ
				var quill_1 = QuillEditorMake("quill-editor_1");
				//console.log(quill_1);
				// 通常のエディタ（文章あり）
				var quill_2 = QuillUpdateEditorMake("quill-editor_2" ,quill_1.getContent);
				// 編集不可エディタ（記事表示用）
				//var quill_3 = QuillPageMake("quill-editor_1" ,quill_1.getContent);
				{/literal}
				</script>											
			</main>
		</div>
	</div>
	<script type="text/javascript" src="{$base_url}js/board/contents_post.js"> </script>
	<script type="text/javascript" src="{$base_url}js/board/contents_summary.js"> </script>
	{include file="modal/modal_board_category.tpl"}

</body>
</html>