KindEditor.plugin("plainpaste",function(e){var a=this,t="plainpaste";a.clickToolbar(t,function(){var i=a.lang(t+"."),n='<div style="padding:10px 20px;"><div style="margin-bottom:10px;">'+i.comment+'</div><textarea class="ke-textarea" style="width:408px;height:260px;"></textarea></div>',l=a.createDialog({name:t,width:450,title:a.lang(t),body:n,yesBtn:{name:a.lang("yes"),click:function(){var t=p.val();t=e.escape(t),t=t.replace(/ {2}/g," &nbsp;"),t="p"==a.newlineTag?t.replace(/^/,"<p>").replace(/$/,"</p>").replace(/\n/g,"</p><p>"):t.replace(/\n/g,"<br />$&"),a.insertHtml(t).hideDialog().focus()}}}),p=e("textarea",l.div);p[0].focus()})});