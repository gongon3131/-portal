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
					<h3 class="section-title before-contents">確定前SVシフト表</h3>
					<button type="button" class="btn btn-primary ml-3" id="before_confirm_regist">登録</button>
					<button type="button" class="btn btn-success ml-3" id="sv_shift_release">公開</button>
				</div>

				<input type="hidden" value="{$smarty.session.login_info.user_id}" id="user_id">
				<input type="hidden" value="{$smarty.session.login_info.user_authority}" id="user_authority"><!--操作権限フラグ-->
				<input type="hidden" value="2" id="target"><!--表示ターゲット-->
				<input type="hidden" value="{$showen_date}" id="showen_date">
				<input type="hidden" value="{$section_sta}" id="section_sta">
				<input type="hidden" value="{$section_end}" id="section_end">
				<input type="hidden" id="csrf_token" value="{$csrf_token}" />
				<input type="hidden" id="sv_col_num" value="{$sv_col_num}" />
				<input type="hidden" id="carry_over_holiday" value="{$carry_over_holiday}" /><!--所定休日数-->

				<!--ユーザーIDの配列-->
				{foreach from=$sv_user_ary item=val key=keyname }
					<input type="hidden"  class="target_user_id" value="{$val.tmur_user_id}">
				{/foreach}
				<!--シフト登録用セレクトボックス-->
				<div class="shift_number_select">
					{html_options class=form-control-sm name=tdbs_shift_time id=tdbs_shift_time options=$SY_define.hope_shift_sv selected=$tdbs_shift_time}
				</div>
				<!--シフト登録用データリスト-->
				<div class="shift_data_list">
					<input type="text"  class="form-control" id="free_description" value="" list="shift_time" placeholder="テキスト入力または選択" autocomplete="off">
					<datalist id="shift_time">
						{foreach from=$SY_define.hope_shift_sv item=val key=keyname }
							{if $keyname != 99 and $keyname != 0}
								<option value="{$val}" data-list-shift-val="{$keyname}">
							{/if}
						{/foreach}
					</datalist>
				</div>
				<!--右クリックメニュー-->
				<div id="contextmenu">
					<ul>
						<li onClick="non_change()" id="non_chenge_text" class="mt-2">変更なしに設定</li>
						<li  id="modal_memo_show" class="mt-2" data-toggle="modal" data-target="#sv_shift_memo" data-backdrop="static" data-target_userid="" data-target_shift-date="">メモ登録</li>
						<input type="hidden" id="fixed_flg" val="">
						<input type="hidden" id="terget_user_id" val="">
						<input type="hidden" id="target_shift_date" val="">
					</ul>
				</div>

				<div class="table-responsive">
					<div class="table_box_sv_shift">
						<table class="table table-condensed table-sm table-hover table-bordered sv-shift">
							<thead class="thead-dark">
								<tr>
									<th class="before_sv_cell_date sticky_cross">日付</td>
									{foreach from=$sv_user_ary item=val key=keyname }
									<th class="before_sv_cell sticky_col" id="header_{$val.tmur_user_id}" data-header-userid="{$val.tmur_user_id}" data-toggle="modal" data-target="#hope_shift_detail" data-backdrop="static" data-target-username="{$val.tmur_user_name}" data-target-userid="{$val.tmur_user_id}" >{$val.tmur_user_id}<br>{$val.tmur_user_name}</th>
									<input type="hidden" id="holiday_manage_{$val.tmur_user_id}" value="{$val.tmur_holiday_manage}">
									{/foreach}
								</tr>
							</thead>
							<tbody id="maintable"></tbody>
						</table>
						<table class="table table-condensed table-sm table-hover table-bordered sv-shift">
							<tr>
								<th class="before_sv_cell  sticky_row">所定休日</td> 
								{foreach from=$sv_user_ary item=val key=keyname }
								<td class="before_sv_cell_holiday  shol" id="scheduled_holiday_{$val.tmur_user_id}">0</td>
								{/foreach}
							</tr>						
							<tr>
								<th class="before_sv_cell  sticky_row">前月繰越</td> 
								{foreach from=$carry_over_holiday_ary item=val key=keyname }
									<td contenteditable="false" class="before_sv_cell_holiday  chol"  id="carry_over_holiday_{$val.tmur_user_id}">{$val.tsch_carry_over_holiday}</td>
								{/foreach}
							</tr>					

							<tr>
								<th class="before_sv_cell  sticky_row">休日数</td> 
								{foreach from=$sv_user_ary item=val key=keyname }
								<td class="before_sv_cell_holiday "  id="holiday_{$val.tmur_user_id}">0</td>
								{/foreach}
							</tr>
							<tr>
								<th class="before_sv_cell  sticky_row">半休数</td> 
								{foreach from=$sv_user_ary item=val key=keyname }
								<td class="before_sv_cell_holiday "  id="half_holiday_{$val.tmur_user_id}">0</td>
								{/foreach}
							</tr>
							<tr>
								<th class="before_sv_cell  sticky_row">有休数</td> 
								{foreach from=$sv_user_ary item=val key=keyname }
								<td class="before_sv_cell_holiday "  id="paid_holiday_{$val.tmur_user_id}">0</td>
								{/foreach}
							</tr>		
							<tr>
								<th class="before_sv_cell  sticky_row">残休数</td> 
								{foreach from=$sv_user_ary item=val key=keyname }
								<td class="before_sv_cell_holiday "  id="remaining_holiday_{$val.tmur_user_id}">0</td>
								{/foreach}
							</tr>
						</table>
					</div>				
				</div><!-- /.table-responsive -->
			</main>
		</div>
	</div>
	<!--自由記述欄のモーダルフォーム表示用ボタン（非表示）-->
	<button type="button" id="dummy_button" class="btn btn-primary" data-toggle="modal" data-target="#sv_shift_free_description" style="display:none;">
		非表示のボタン
	</button>	

	<!--モーダルフォーム-->
	{include file="modal/modal_sv_shift_memo.tpl"}
	{include file="modal/modal_hope_shift_detail.tpl"}
	{include file="modal/modal_sv_shift_free_description.tpl"}
	<script type="text/javascript" src="{$base_url}js/shift/before_confirm_sv.js?v={$ver}"> </script>
	<script type="text/javascript" src="{$base_url}js/modal/modal_hope_shift_detail.js"> </script>

</body>
</html>