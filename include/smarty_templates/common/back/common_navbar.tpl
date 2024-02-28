<nav class="navbar navbar-expand-sm navbar-dark bg-dark mt-3 mb-3">
	<a class="navbar-brand" href="#"></a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
		<!--<img id="logo_img" src="{$base_url}img/logo9.png" width="626" height="143" alt="logo9.png">-->
		<ul class="navbar-nav">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu_uriage" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					売上管理
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_uriage">
					<a class="dropdown-item" href="{$base_url}uriage/uriage_regist">売上伝票入力</a>
					<a class="dropdown-item" href="{$base_url}uriage/uriage_summary">売上伝票検索</a>
					<a class="dropdown-item" href="{$base_url}uriage/gross_profit_summary">損益管理表</a>
					<a class="dropdown-item" href="{$base_url}uriage/unit_price">得意先別単価</a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu_syobunryou" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					処分料管理
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_syobunryou">
					<a class="dropdown-item" href="{$base_url}syobunryo/syobunryo_regist">処分料入力</a>
					<a class="dropdown-item" href="{$base_url}syobunryo/syobunryo_summary">処分料情報検索</a>
					<a class="dropdown-item" href="{$base_url}syobunryo/syobunryo_payment_schedule">処分料支払予定</a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu_nyukin" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					入金管理
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_nyukin">
					<a class="dropdown-item" href="{$base_url}nyukin/nyukin_regist">入金管理</a>
					<a class="dropdown-item" href="{$base_url}nyukin/nyukin_summary">入金情報検索</a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu_seikyu" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					請求管理
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_seikyu">
					<a class="dropdown-item" href="{$base_url}seikyu/seikyu_shime">請求締処理</a>
					<a class="dropdown-item" href="{$base_url}seikyu/seikyu_hakkou">請求書発行</a>
					<a class="dropdown-item" href="{$base_url}seikyu/seikyu_kaijo">請求締解除</a>
					<a class="dropdown-item" href="{$base_url}seikyu/urikake_zandaka">売掛残高一覧</a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu_mitsumori" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					見積作成
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_mitsumori">
					<a class="dropdown-item" href="#">見積作成</a>
					<a class="dropdown-item" href="#">作成済見積一覧</a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu_cyouhyou" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					帳票作成
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_cyouhyou">
					<a class="dropdown-item" href="#">得意先別商品別売上高</a>
					<a class="dropdown-item" href="#">処分先別処分料</a>
					<a class="dropdown-item" href="#">月別売上高</a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu_master" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					マスタ管理
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenu_master">
					<a class="dropdown-item" href="{$base_url}master/tokuisaki_summary">得意先管理</a>
					<a class="dropdown-item" href="{$base_url}master/syouhin_summary">商品管理</a>
					<a class="dropdown-item" href="{$base_url}master/syobunsaki_summary">処分先管理</a>
					<a class="dropdown-item" href="{$base_url}master/user_summary">ユーザー管理</a>
				</div>
			</li>
		</ul>
		<ul class="navbar-nav">
			<li class="nav-item">
				<a class="nav-link" href="{$base_url}index.php?action=logout">ログアウト</a>
			</li>
		</ul>
		<nav class="navbar navbar-dark bg-dark ml-auto">
			<span class="navbar-text login_user_show">ユーザー名：{$smarty.session.login_info.user_name}</span>
		</nav>	
	</div>
</nav>

