<nav class="navbar navbar-expand-sm navbar-dark bg-dark mt-3 mb-3">
	<a class="navbar-brand" href="#"></a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
		<!--<img id="logo_img" src="{$base_url}img/logo9.png" width="626" height="143" alt="logo9.png">-->
		<ul class="navbar-nav">
			<li class="nav-item ml-3">
				<a class="nav-link nav-menu-font" href="{$base_url}dashboard/dashboard.php">ダッシュボード</a>
			</li>
		</ul>		
		<ul class="navbar-nav">
			<li class="nav-item dropdown ml-3">
				<a class="nav-link dropdown-toggle nav-menu-font" href="#" id="navbarDropdownMenu_uriage" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					伝達掲示板
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_uriage">
					<a class="dropdown-item" href="{$base_url}board/contents_summary.php">新着記事一覧</a>
				</div>
			</li>
			<li class="nav-item dropdown ml-3">
				<a class="nav-link dropdown-toggle nav-menu-font" href="#" id="navbarDropdownMenu_uriage" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					シフト希望管理
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_uriage">
				{if $smarty.session.login_info.user_authority == 9}
					<a class="dropdown-item" href="{$base_url}shift/hope_shift_regist.php?target=1">OP希望シフト登録</a>
					<a class="dropdown-item" href="{$base_url}shift/hope_shift_summary.php?target=1">OP登録状況一覧</a>
					<a class="dropdown-item" href="{$base_url}shift/hope_shift_regist.php?target=2">SV希望シフト登録</a>
					<a class="dropdown-item" href="{$base_url}shift/hope_shift_summary.php?target=2">SV登録状況一覧</a>							
				{else}
					<a class="dropdown-item" href="{$base_url}shift/hope_shift_regist.php">希望シフト登録</a>
					<a class="dropdown-item" href="{$base_url}shift/hope_shift_summary.php">登録状況一覧</a>	
				{/if}				
				</div>
			</li>
			{if $smarty.session.login_info.user_authority == 9}
				<li class="nav-item dropdown ml-3">
					<a class="nav-link dropdown-toggle nav-menu-font" href="#" id="navbarDropdownMenu_uriage" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						確定前シフト表
					</a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_uriage">
						<a class="dropdown-item" href="{$base_url}shift/before_confirm_by_timezone.php">時間帯別人数</a>
						<a class="dropdown-item" href="{$base_url}shift/before_confirm_by_user.php">オペレーター別シフト</a>
						<a class="dropdown-item" href="{$base_url}shift/shift_confirm.php">OPシフト確定</a>
						<a class="dropdown-item" href="{$base_url}shift/before_confirm_sv.php">確定前SVシフト</a>
					</div>
				</li>
			{/if}
			<li class="nav-item dropdown ml-3">
				<a class="nav-link dropdown-toggle nav-menu-font" href="#" id="navbarDropdownMenu_uriage" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					勤務シフト表
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_uriage">
					{if $smarty.session.login_info.user_authority != 1}
						<a class="dropdown-item" href="{$base_url}shift/tsr_shift_by_timezone.php">時間帯別人数</a>
						<a class="dropdown-item" href="{$base_url}shift/tsr_shift_by_user.php">オペレーター別シフト</a>
						<a class="dropdown-item" href="{$base_url}shift/sv_shift.php">SV・リーダーシフト</a>
						<a class="dropdown-item" href="{$base_url}shift/business_assign.php">業務振分登録</a>
						<a class="dropdown-item" href="{$base_url}shift/shift_print.php">シフト表印刷</a>
					{else}
						<a class="dropdown-item" href="{$base_url}shift/tsr_shift_by_user.php">勤務シフト表</a>
					{/if}
				</div>
			</li>	
			{if $smarty.session.login_info.user_authority != 1}
				<li class="nav-item dropdown ml-3">
					<a class="nav-link dropdown-toggle nav-menu-font" href="#" id="navbarDropdownMenu_uriage" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						オペレータ管理
					</a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_uriage">
						<a class="dropdown-item" href="{$base_url}user/user_summary.php">オペレータ情報一覧</a>
					</div>
				</li>
			{/if}
		</ul>
		<ul class="navbar-nav">
			<li class="nav-item ml-3">
				<a class="nav-link nav-menu-font" href="{$base_url}index.php?action=logout">ログアウト</a>
			</li>
		</ul>
		<nav class="navbar navbar-dark bg-dark ml-auto">
		<span class="navbar-text login_user_show">ユーザー名：{$smarty.session.login_info.user_name}</span>
	</div>
</nav>

