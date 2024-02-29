{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<!--ナビゲーションバー-->
	{include file="common/common_navbar.tpl"}
	<div class="container-fluid">
		<div class="row">
			<!--メインコンテンツ-->
			<main role="main" class="col-md-9 px-md-4">
				<div class="form-inline ml-2 mt-2 mb-2">
					<h4>従業員情報</h4>&emsp;<h4 id="target_user"></h4>
					<div class="ml-auto">
						<button type="button" class="btn btn-primary ml-3 mb-1" id="user_regist" onclick="return false" >登録</button>
						<button type="button" class="btn btn-secondary ml-3 mb-1" id="regist_cancel" onclick="return false" >戻る</button>
					</div>
				</div>
				<form id="user_regist_form">

					<!--hidden-->
					<input type="hidden" id="action" name="action" value="user_regist">
					<input type="hidden" id= "tmur_id" name= "tmur_id" value="{$tmur_id}">
					<input type="hidden" id="csrf_token" value="{$csrf_token}" />
					<input type="hidden" id="action" name="action" value="user_regist">
					<div class="table-responsive">
						<table class="table table-bordered table-sm table-condensed blockContainer showInlineTable equalSplit master_table">
							<thead>
								<tr>
									<th colspan="4" class="user_detail_section">基本情報</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label "> ID</label>
									</th>
									<td class="fieldValue medium">
										<div class="col-md-6">
											<input type="text" class="form-control col-form-body" id="tmur_user_id" name="tmur_user_id" value="{$SY_form.safe.tmur_user_id}" placeholder="半角英数" />
										</div>
									</td>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">パスワード</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-6">
											<input type="text" class="form-control col-form-body" id="tmur_password" name="tmur_password" value="{$SY_form.safe.tmur_password}" placeholder="半角英数6文字" />
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> 氏名</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-8">
											<input type="text" class="form-control col-form-body" id="tmur_user_name" name="tmur_user_name" value="{$SY_form.safe.tmur_user_name}" placeholder=""/>
										</div>
									</td>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> 氏名カナ</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-8">
											<input type="text" class="form-control col-form-body" id="tmur_user_name_kana" name="tmur_user_name_kana" value="{$SY_form.safe.tmur_user_name_kana}" placeholder=""/>
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> 郵便番号</label>
									</th>
									<td class="fieldValue medium" colspan="3" >
										<div class="col-md-2">
											<input type="text" class="form-control input-small col-form-body" id="tmur_zipcode" name="tmur_zipcode" value="{$SY_form.safe.tmur_zipcode}" placeholder="ハイフンつき"/>
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">住所</label>
									</th>
									<td class="fieldValue medium" colspan="3">
										<div class="col-md-12">
											<input type="text" class="form-control col-form-body" id="tmur_address" name="tmur_address" value="{$SY_form.safe.tmur_address}" placeholder="全角500文字まで"/>
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">建物名</label>
									</th>
									<td class="fieldValue medium" colspan="3">
										<div class="col-md-10">
											<input type="text" class="form-control col-form-body" id="tmur_apart" name="tmur_apart" value="{$SY_form.safe.tmur_apart}" placeholder="全角500文字まで"/>
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">電話番号</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-10">
											<input type="text" class="form-control col-form-body" id="tmur_tel" name="tmur_tel" value="{$SY_form.safe.tmur_tel}" placeholder="ハイフンつき"/>
										</div>
									</td>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">携帯電話番号</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-10">
											<input type="text" class="form-control col-form-body" id="tmur_mobile_phone" name="tmur_mobile_phone" value="{$SY_form.safe.tmur_mobile_phone}" placeholder="ハイフンつき" />
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">生年月日</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-8">
											<input id="tmur_birthday" type="date" class="form-control col-form-body" name="tmur_birthday" value="{$SY_form.safe.tmur_birthday}"  />
										</div>
									</td>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">メールアドレス</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-6">
											<input type="text" class="form-control col-form-body" id="tmur_mail" name="tmur_mail" value="{$SY_form.safe.tmur_mail}" placeholder="" />
										</div>
									</td>
								</tr>
							</tbody>
						</table>

						<table class="table table-bordered table-sm table-condensed blockContainer showInlineTable equalSplit master_table">
							<thead>
								<tr>
									<th colspan="4" class="user_detail_section">業務情報関連</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> 入社日</label>
									</th>
									<td class="fieldValue medium">
										<div class="col-md-8">
											<input id="tmur_hire_date" type="date" class="form-control col-form-body" name="tmur_hire_date" value="{$SY_form.safe.tmur_hire_date}"  />
										</div>
									</td>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label">操作権限</label>
									</th>
									<td class="fieldValue medium" >
										<div class="col-md-8">
											{html_options name=tmur_authority id=tmur_authority class=form-control options=$SY_define.user_type selected=$SY_form.safe.tmur_authority}
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> 在籍状況　　</label>
									</th>
									<td class="fieldValue medium"  >
										<div class="col-md-6">
											{html_options name=tmur_is_used id=tmur_is_used class=form-control options=$SY_define.enroll_status selected=$SY_form.safe.tmur_is_used}
										</div>
									</td>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label holiday_manage_selected">休日管理</label>
									</th>
									<td class="fieldValue medium " >
										<div class="col-md-8 holiday_manage_selected">
											{html_options name=tmur_holiday_manage id=tmur_holiday_manage class=form-control options=$SY_define.holiday_manage selected=$SY_form.safe.tmur_holiday_manage}
										</div>
									</td>
								</tr>
								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> 雇用形態</label>
									</th>
									<td class="fieldValue medium"  >
										<div class="col-md-8">
											{html_options name=tmur_employment_status id=tmur_employment_status class=form-control options=$SY_define.employment_status selected=$SY_form.safe.tmur_employment_status}
										</div>
									</td>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> インポート</label>
									</th>
									<td class="fieldValue medium"  >
										<div class="col-md-8">
											{html_options name=tmur_import_status id=tmur_import_status class=form-control options=$SY_define.import_target selected=$SY_form.safe.tmur_import_status}
										</div>
									</td>
								</tr>

								<tr>
									<th class="fieldLabel medium">
										<label class="col-sm-12 col-form-label"> 備考</label>
									</th>
									<td class="fieldValue medium" colspan="3" >
										<div class="col-md-12">
											<input type="text" class="form-control col-form-body" id="tmur_memo" name="tmur_memo" value="{$SY_form.safe.tmur_memo}" placeholder="" />
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<div class="row">
							<div class="col-6">
								<table class="table table-bordered table-sm table-condensed blockContainer showInlineTable equalSplit master_table">
									<thead>
										<tr>
											<th colspan="4" class="user_detail_section">保有スキル</th>
										</tr>
									</thead>
									<tbody class="skill_possesion_area">
										<tr>
											<th class="fieldLabel medium">
												<label class="col-sm-12 col-form-label">業務１</label>
											</th>
											<td class="fieldValue medium">
												<div class="col-md-6 skill_select">
													{html_options name=tdsp_skill_possesion id=tdsp_skill_possesion class=form-control options=$SY_define.skill_assgin selected=$SY_form.safe.tdsp_skill_possesion}
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="col-6 business_possesion">
								<table class="table table-bordered table-sm table-condensed blockContainer showInlineTable equalSplit master_table">
									<thead>
										<tr>
											<th colspan="4" class="user_detail_section">担当可能業務</th>
										</tr>
									</thead>
									<tbody class="business_possesion_area">
										<tr>
											<th class="fieldLabel medium">
												<label class="col-sm-12 col-form-label">業務１</label>
											</th>
											<td class="fieldValue medium">
												<div class="col-md-6 business_select">
													{html_options name=tdbp_business_possesion id=tdbp_business_possesion class=form-control options=$SY_define.business_enable selected=$SY_form.safe.tdbp_business_possesion}
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>						
						</div>

						
					</div><!-- /.table-responsive -->
				</form>
			</main>
		</div>
	</div>
	<script type="text/javascript" src="{$base_url}js/user/user_regist.js"> </script>
</body>
</html>