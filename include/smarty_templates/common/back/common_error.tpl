{if $SY_error.count > 0}
<ul class="error">
{foreach from=$SY_error.message item=line}
<li>{$line}</li>
{/foreach}
</ul>
{/if}
