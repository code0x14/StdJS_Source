Std.ui.module("MenuBar",{parent:"widget",action:{children:"append"},option:{className:"StdUI_MenuBar",level:3,height:24,minHeight:16,items:null},"private":{state:0,selectedIndex:-1},extend:{render:function(){},height:function(){var e=this;e[1].lineHeight(e.height())},remove:function(e){var t=this;if(void 0===e)Std.dom(document).off({keydown:t._keydown,keyup:t._keyup,mousedown:t._mousedown}),Std.each(t.items,function(e,t){t.menu&&t.menu.remove()});else if(isNumber(e)){var n=t.items[e];n.menu&&n.menu.remove(),n.elem.remove()}}},"protected":{keyEvent:function(e){var t=this,n=t.items.length,i=t._selectedIndex;switch(e.keyCode){case 37:0>=i&&(i=n),t.select(i-1);break;case 39:i>=n-1&&(i=-1),t.select(i+1);break;case 40:var s=t.items[i],r=s.menu.focus();null==r._currentItem&&r.select(0)}},initKeyboard:function(){var e=this,t=!1,n=Std.dom(document);return n.on("mousedown",e._mousedown=function(t){var n=t.target;(e[1].is(n)||!e[1].contains(n))&&e.clearStates()}),n.on("keyup",e._keyup=function(){t===!0&&(e.updateLabels(),t=!1)}),n.on("keydown",e._keydown=function(n){var i=Std.dom(n.target),s=e[0].offsetParent();s&&(i.is(s)||s.contains(i))&&e[0].visible()&&(18===n.keyCode?(e.updateLabels(t=!0),n.preventDefault()):27===n.keyCode?e.clearStates():n.altKey&&(Std.each(e.items,function(t,i){return-1!==i.text.toUpperCase().indexOf("&"+String.fromCharCode(n.keyCode))?(t===e._selectedIndex?e.clearStates():e.select(t),e.focus(),!0):void 0}),n.preventDefault()))}),e[0].on("keydown",function(t){e.keyEvent(t)}),e},initEvents:function(){var e=this;return e[0].on("mouseenter","._item",function(t){var n=this.index();this.mouse({auto:!1,click:function(){n!==e._selectedIndex?e.select(n):e.clearStates()}},t),1==e._state&&e.select(n)}),e.initKeyboard()},showMenu:function(){var e=this,t=e.currentSelected();if(t){var n=t.elem.offset(),i=t.menu;i.show()[0].css({left:n.x,top:n.y+e.height()})}return e},createItem:function(e){var t=this,n=newDiv("_item").appendTo(t[1]),i=null,s=null;return(isString(e.icon)||isString(e.iconClass))&&(i=newDiv(e.iconClass||"").appendTo(n)),isString(e.icon)&&i.append(newDom("img").src(e.icon)),isString(e.text)&&(s=newDiv("_text").html(e.text.replace("&","")).appendTo(n)),{elem:n,iconElem:i,textElem:s,name:e.name,text:e.text,items:e.items}},formatLabel:function(e){var t=e.indexOf("&"),n="";if(-1==t)return e;for(var i=0,s=e.length;s>i;i++){var r=e.charAt(i);n+="&"===r&&s>i+1?"<span style='text-decoration: underline'>"+e.charAt(++i)+"</span>":r}return n},updateLabels:function(e){var t=this;return Std.each(t.items,function(n,i){var s="";s=e===!0?t.formatLabel(i.text):i.text.replace(/&/,""),i.textElem.html(s)}),t},clearStates:function(){var e=this,t=e.currentSelected();return t&&null!==t.menu&&(t.elem.removeClass("selected"),t.menu.hide(),e._selectedIndex=-1,e._state=0),e},currentSelected:function(){var e=this;return-1===e._selectedIndex?null:e.items[e._selectedIndex]}},"public":{select:function(e){var t=this,n=t.items[e];return null==n?t:(n.menu||(n.menu=Std.ui("Menu",{parent:t,renderTo:"body",items:n.items,css:{position:"absolute"},on:{itemPress:function(){t.clearStates()}}})),t.clearStates(),n.elem.addClass("selected"),t._state=1,t._selectedIndex=e,t.showMenu())},append:Std.func(function(e){var t=this;t.items.push(t.createItem(e))},{each:[isArray]})},main:function(e,t,n){e.items=[],e.initEvents(),n.append(e[1]=newDiv("_items")),t.items&&e.append(t.items)}});