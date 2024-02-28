{include file="common/common_header.tpl"}
<!--メイン部分-->
<body>
<div class = "container">
	<div class="wrapper">
		<form method="post" name="Login_Form" class="form-signin">       
		    <h3 class="form-signin-heading">網走CCポータル　ログイン</h3>
			  <hr class="colorgraph"><br>
			  
			  <input type="text" class="form-control" name="user_id" placeholder="ID" required="" autofocus="" />
			  <input type="password" class="form-control" name="user_pass" placeholder="パスワード" required=""/>     		  
			 
			  <button class="btn btn-lg btn-primary btn-block"  name="Submit" value="Login" type="submit" id="login_confirm">ログイン</button>  
			  
			  {$err_mes}
		</form>			
	</div>
</div>
</body>
</html>