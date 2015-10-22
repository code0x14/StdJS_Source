Std.ui.module("Accordion",{parent:"widget",events:"change",option:{level:4,defaultClass:"StdUI_Accordion",switchType:"click",items:null,height:400,template:null,titleHeight:30,collapsible:!1,clientPadding:5,activeItem:0,boxSizing:"border-box"},action:{children:"append",childNodes:function(e,t){this.append(Std.each(t,function(e,t){return{icon:t.attr("icon"),text:t.attr("title"),content:t.html()}},!0))}},"private":{current:null},extend:{render:function(){var e=this,t=e.opts,n=e.items;n.length>0&&(e._current=n[t.activeItem])&&(e.repaint(),e._current.client.main.show())},height:function(){var e=this;null!=e._current&&e.repaint()},remove:function(e){var t=this;if(void 0===e)return t.clear();if(isNumber(e))t.removeItem(e);else if(isArray(e))for(var n=e.length-1;n>=0;n--)t.removeItem(e[n]);t.renderState&&t.repaint()}},"protected":{computeClientHeight:function(){var e=this,t=e.opts;return Math.floor(e.height()-e.boxSize.height-e.length*(t.titleHeight+2))+1},appendItem:function(e){var t=this,n=t.createItem(e);return t[0].append(n[0]),t.items.push(n),t.length++,t},removeItem:function(e){var t=this,n=t.items[e];return isWidget(n.client.widget)&&n.client.widget.remove(),n[0].remove(),t.length--,t.items.remove(e),t},refreshClient:function(e,t){var n=e.widget;isWidget(n)&&(n.renderState||n.render(),e.main.animate("end"),n.height(t))},createItem:function(e){var t=this,n=t.createItemHeader(e.text,e.icon,e.iconClass),i=t.createItemClient(e.content);return{0:newDiv("_item").append([n.main,i.main]),header:n,client:i}},createItemHeader:function(e,t,n){var i={main:newDiv("_title").height(this.opts.titleHeight)};return(isString(t)||isString(n))&&(i.main.append(i.icon=newDiv("_icon")),n&&i.icon.addClass(n),t&&newDom("img").appendTo(i.icon).attr("src",t)),i.main.append([i.text=newDiv("_text").html(e),i.arrow=newDiv("_arrow")]),i},createItemClient:function(e){var t=this,n=t.opts,i=newDiv("_client"),r=null;return isString(e)?r=Std.ui("widget",{html:e,tabIndex:null}):isObject(e)&&(r=isWidget(e)?e:null!==n.template?Std.ui("TemplateItem",{data:e,template:n.template}):Std.ui(e.ui||"widget",Std.extend({tabIndex:null},e))),null!==r&&(r[0].padding(r.opts.padding=n.clientPadding),r.appendTo(i)),{main:i,widget:r}},initEvents:function(){var e=this,t=e.opts;return e[0].delegate("mouseenter","._item > ._title",function(n){var i=this.parent().index(),r=t.switchType;"mouseenter"===r&&e.items[i]!==e._current&&e.select(i),this.mouse({auto:!1,unselect:!0,click:function(){e.select(i)}},n)}),e}},"public":{length:0,activeItem:function(e){var t=this;return void 0===e?t.items.indexOf(t._current):t.select(e)},template:function(e){var t=this,n=t.opts;return void 0===e?n.template:(isString(e)&&(e=Std.template(e)),e instanceof Std.template&&(n.template=e),t)},repaint:function(){var e=this,t=e._current;if(null!=t){var n=e.computeClientHeight();t.client.main.height(n),t[0].addClass("selected"),e.refreshClient(t.client,n)}return e},insert:function(e,t){var n=this,i=n.createItem(e);return n[0].insertBefore(i[0],n.items[t][0]),n.items.insert(i,t),n.length++,n.renderState&&n.repaint(),n},append:function(e){var t=this;if(isArray(e))for(var n=0,i=e.length;i>n;n++)t.appendItem(e[n]);else t.appendItem(e);return t.renderState&&t.repaint(),t},select:function(e){var t=this,n=t.opts,i=t.items,r=t.computeClientHeight(),a=t._current;return null!=a&&(a[0].removeClass("selected"),a.client.main.css("overflow","hidden").animate("end").animate({100:{height:0}},150)),n.collapsible&&a===t.items[e]?(t._current=null,t):(t._current!==i[e]&&t.emit("change",e),i[e].client.main.removeClass("overflow").animate("end").animate({100:{height:r}},150,function(){t.refreshClient(i[e].client,r)}),t._current=i[e],t._current[0].addClass("selected"),t)},clear:function(){for(var e=this,t=e.items.length-1;t>=0;t--)e.removeItem(t);return e}},main:function(e,t){e.items=[],null!==t.template&&e.template(t.template),null!==t.items&&e.append(t.items),e.initEvents()}});