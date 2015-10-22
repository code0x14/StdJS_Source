Std.ui.module("ToolBar",{parent:"widget",action:{children:"append"},option:{level:3,height:30,minHeight:28,items:null,styleType:"textBesideIcon",defaultClass:"StdUI_ToolBar"},extend:{render:function(){var e=this;e.items.each(function(e,t){t.render()})},height:function(e){var t=this;t.items.each(function(i,n){n.height(e-t.boxSize.height)})},remove:function(e){var t=this,i=t.items;if(void 0===e)t.clear();else if(isNumber(e))i[e].remove(),i.remove(e);else if(isWidget(e)){var n=i.indexOf(e);-1!==n&&(i[n].remove(),i.remove(n))}}},"protected":{createTool:function(e){var t=this,i=t.opts,n=null;return isWidget(e)?n=e:isString(e)?n=Std.ui("ToolButton",{text:e,styleType:i.styleType}):isObject(e)&&(e.styleType=i.styleType,n=Std.ui(e.ui||"ToolButton",e)),isWidget(n)&&n.parent(t),n}},"public":{append:Std.func(function(e){var t=this,i=t.createTool(e);null!==i&&(i.appendTo(t.D.buttons),t.renderState&&i.render(),t.items.push(i))},{each:[isArray]}),insert:function(e,t){var i=this,n=i.items.length;if(n>t){var r=i.createTool(e);null!==r&&(i.D.buttons.insertBefore(r,i.items[t]),i.items.insert(r,t))}else t===n&&i.append(e);return i},clear:function(){for(var e=this,t=e.items,i=0,n=t.length;n>i;i++)t[i].remove();return t.clear(),e}},main:function(e,t,i){e.D={buttons:newDiv("_buttons").appendTo(i)},e.items=[],t.items&&e.append(t.items)}});