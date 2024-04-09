{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
	<div class = "container">
	<!--
		<div class="wrapper">
			<form method="post" name="Login_Form" class="form-signin">       
				<h3 class="form-signin-heading">網走CCシフト管理　ログイン</h3>
				<hr class="colorgraph"><br>
				
				<input type="text" class="form-control" name="user_id" placeholder="ID" required="" autofocus="" />
				<input type="password" class="form-control" name="user_pass" placeholder="パスワード" required=""/>     		  
				
				<button class="btn btn-lg btn-primary btn-block"  name="Submit" value="Login" type="submit" id="login_confirm">ログイン</button>  
				
				{$err_mes}
			</form>			
		</div>
	-->
	<div class="form-wrapper">
	<h1>勤務シフト管理</h1>
	{$err_mes}
	<form method="post" name="Login_Form">
	  <div class="form-item">
		<label for="email"></label>
		<input type="text" name="user_id" required="required" placeholder="ID"></input>
	  </div>
	  <div class="form-item">
		<label for="password"></label>
		<input type="password" name="user_pass" required="required" placeholder="パスワード"></input>
	  </div>
	  <div class="button-panel">
		<input type="submit" class="button" title="ログイン" value="ログイン" id="login_confirm" name="Submit"></input>
	  </div>
	</form>
	<div class="form-footer">
	  <p><a href="#">Ver.1.0.0 ©2024 網走CC</a></p>
	  <p><a href="#">ログインにお困りの方</a></p>
	</div>
  </div>




	</div>
</body>
</html>