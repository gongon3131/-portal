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
				<div class="form-inline">
					<h2 class="section-title">伝達掲示板</h2>
					{if $smarty.session.login_info.user_authority == 9 or $smarty.session.login_info.user_authority == 1}
						<button class="btn btn-success" id="hogefuga" type="button" style="margin-left:30px;"><strong>新規投稿</strong></button>
					{/if}
				</div>
				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">

				<div class="table-responsive">
					<!--一覧表示部分-->
					<input type="hidden" id="setting_displayrows" value="{$displayrows}" ><!--1ページ表示件数-->
					<div id="maintable_sumarry"></div>	
					<div class="vr_nNavi" style="margin-top:4px">
						<!--<span class="fontDisable">先頭へ</span>--> | 
						<span class="fontDisable" id="prevbtn" style="cursor: pointer;">&lt;&lt; 前の <span id="displayrows1"></span> 件へ</span> 
						<span id="prevbtn_bar">|</span> 
						<span class="fontDisable" id="nextbtn" style="cursor: pointer;">次の <span id="displayrows2"></span> 件へ &gt;&gt;</span>
						<span id="nextbtn_bar">|</span> 
						<!--<span class="fontDisable">末尾へ</span>-->
					</div>					
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<script type="text/javascript" src="{$base_url}js/board/contents_summary.js"> </script>
	{include file="modal/modal_contents_detail.tpl"}

</body>
</html>