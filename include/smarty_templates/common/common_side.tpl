<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse h100">
  <div class="sidebar-sticky pt-3">
    <ul class="nav flex-column">
      <li class="nav-item">
        <a class="nav-link" href="#">
          <span data-feather="home"></span>
          <p class="side-menu-text">ダッシュボード</p> 
        </a>
      </li>
      {if $c_flg == 1}
        <li class="nav-item">
          <a class="nav-link" onclick="get_contents(0);return false;">
            <!--<span data-feather="file"></span>-->
            <p class="side-menu-text">新着記事一覧</p>
          </a>
        </li>
        {foreach from=$category_ary item=var key=keyname}
          <li class="nav-item">
            <a class="nav-link" onclick="get_contents({$keyname});return false;">
              <!--<span data-feather="file"></span>-->
              <p class="side-menu-text">{$var}</p>
            </a>
          </li>
        {/foreach}
      {else}
        <li class="nav-item">
          <a class="nav-link" href="contents_summary.php">
            <!--<span data-feather="file"></span>-->
            <p class="side-menu-text">新着記事一覧</p>
          </a>
        </li>
      {/if}
    </ul>
  </div>
</nav>