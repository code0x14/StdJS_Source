/**
 *  Std UI Kit Library
 *  http://ui.stdjs.com
 *  module: view
*/
Std.ui.module("View",{parent:"widget",events:"itemEvents itemResizeStart itemResizeStop receive",option:{level:4,defaultClass:"StdUI_View",dots:!1,editable:!0,valueType:"config",background:"",selectionClass:"",itemContextMenu:null},"private":{itemZIndex:0,currentItem:null},initialize:{initDOMTree:function(){var t=this,e=t.DOMMap={};t[0].append([e.client=newDiv("_client")])},initItemContextMenu:function(t){var e=this,n=null;isArray(t)?n={items:t}:isPlainObject(t)?n=t:isObject(t)&&(n={menu:t}),e.DOMMap.client.plugin("contextMenu",n)},initKeyEvents:function(){{var t=this;t.opts}t[0].on("keydown[del]",function(){var e=t._clientLayout.layoutItems();if(t.editable())for(var n=e.length-1;n>=0;n--){var i=t._clientLayout.layoutItems(n);i&&i._selected&&(i._selected=!1,t._clientLayout.remove(i))}}),t[0].on("keydown",function(e){t.editable()&&e.which>=37&&e.which<=40&&Std.each(t.selectedItems(),function(t,n){switch(e.which){case 38:n[0].css("top","-",1);break;case 39:n[0].css("left","+",1);break;case 40:n[0].css("top","+",1);break;case 37:n[0].css("left","-",1)}})})},initEvents:function(){var t=this,e=function(e){t.emit("itemResizeStart",[e.self.ui(),e],!0)},n=function(e){var n=e.self.ui();n.height(e.height),n.width(e.width),t.emit("itemResizeStop",[n,e],!0)};t[0].unselect(!0).on("blur",function(){t.clearSelected()}),t.DOMMap.client.plugin("drop",{items:"> .StdUI_LayoutItem",opacity:1,revert:!1,draggable:!0,droppable:!1,check:function(){return t.editable()},on:{receive:function(e){e.layoutX=e.pageX-e.containmentOffset.x-e.selfX,e.layoutY=e.pageY-e.containmentOffset.y-e.selfY,e.helper.removeStyle("position left top opacity zIndex"),t.emit("receive",e)}}}),t.DOMMap.client.plugin("resize",{items:"> .StdUI_LayoutItem",handle:"> .StdUI_LayoutItem > .StdUI_View_ItemHandle",helper:"original",opacity:1,check:function(){return t.editable()},on:{start:e,stop:n,move:function(t){var e=t.self.ui();e.width(Math.max(e[0].width(),e.minWidth())),e.height(Math.max(e[0].height(),e.minHeight()))}}})},initSelection:function(){var t=this,e=t.DOMMap,n=0,i=0,o=(e.selection=newDiv("_selection "+t.opts.selectionClass).appendTo(t[0])).boxSize(),c=0,u=0,s=null,a=function(){Std.css.cursor(null),Std.dom(document).off({mouseup:a,mousemove:l}),t.selectRange(e.selection.css("left"),e.selection.css("top"),e.selection.width(),e.selection.height()),e.selection.hide()},l=function(t){c=t.pageX-s.x,u=t.pageY-s.y,e.selection.css({left:n>c?c:n,top:i>u?u:i,width:Math.abs(c-n)-o.width,height:Math.abs(u-i)-o.height})};e.client.on("mousedown",function(o){return e.client.is(o.target)&&t.editable()?(s=this.offset(),Std.css.cursor("default"),Std.dom(document).on({mouseup:a,mousemove:l}),void e.selection.show().css({left:n=o.pageX-s.x,top:i=o.pageY-s.y,width:0,height:0,zIndex:Std.ui.status.zIndex+1})):t})},initClient:function(){{var t=this;t._clientLayout=t.DOMMap.client.layout("AbsLayout",!0)}t.DOMMap.client.on("mousedown",function(e){t[0].focus(),t.DOMMap.client.is(e.target)&&t.clearSelected()},0),t.DOMMap.client.on("mouseenter","> .StdUI_LayoutItem",function(e){var n=this.ui(),i=newDiv("StdUI_View_Locker"),o={auto:!1,down:function(e){e.ctrlKey?n.selected?t.clearSelected(n):t.select(n):(t.select(n),t._clientLayout.layoutItems(function(e,i){Std.dom(n).not(i)&&t.clearSelected(i)})),t.emit("itemEvents",["mousedown",n,e],!0)}};Std.dom(n).append(i).once("mouseleave",function(){i.remove()}),Std.each("enter leave up click dblclick move",function(e,i){o[i]=function(e){t.emit("itemEvents",[i,n,e],!0)}}),this.mouse(o,e)})}},extend:{render:function(){var t=this,e=t.opts;t.initClient(),t.initEvents(),t.initKeyEvents(),t.initSelection(),e.value&&t.value(e.value),e.itemContextMenu&&t.initItemContextMenu(e.itemContextMenu)},remove:function(t){var e=this;t&&(e._clientLayout.remove(t),e._clientLayout.update())},destroy:function(){var t=this;t._clientLayout.destroy(),t._currentItem=null,t._clientLayout=null}},"protected":{createItemHandles:function(t){for(var e=(this.clearItemHandles(t),[]),n={"0 6 7":{left:-4},"2 3 4":{right:-4},"0 1 2":{top:-4},"4 5 6":{bottom:-4},"1 5":{left:"50%",marginLeft:-3},"3 7":{top:"50%",marginTop:-3}},i=0;8>i;i++)Std.dom(t).append(e[i]=newDiv("StdUI_View_ItemHandle"));return Std.each(n,function(t,n){for(var i=0,o=(t=t.split(" ")).length;o>i;i++)Std.dom(e[t[i]]).css(n)}),e},clearItemHandles:function(t){var e=this;return t._handles&&(Std.each(t._handles,function(t,e){e.remove()}),delete t._handles),e}},"public":{currentItem:function(){return this._currentItem||this.selectedItem()},items:function(t,e){return this._clientLayout.layoutItems(t,e)},editable:function(t){return this.opt("editable",t)},itemCount:function(){return this._clientLayout.itemCount()},dots:function(t){return this.opt("dots",t,function(){this.DOMMap.client.toggleClass("_dots")})},itemContextMenu:function(t){return this.opt("itemContextMenu",t,function(){this.initItemContextMenu(t)})},background:function(t){var e=this;return e.opt("background",t,function(){e[0].css("background",t)})},selectedItem:function(){var t=this;return t.items(function(t,e){return e._selected?e:void 0})},selectedItems:function(){var t=this;return t.items(function(t,e){return e._selected?e:void 0},!0)},append:function(t){var e=this;return isArray(t)?Std.each(t,function(t,n){e._clientLayout.append(n)}):e._clientLayout.append(t),e._clientLayout.update(),e},insert:function(t,e,n){var i=this;return i._clientLayout.insert(t,e,n)===!1?!1:(i._clientLayout.update(),i)},select:function(t){var e=this,n=null;return n=isObject(t)?t:e._clientLayout.layoutItems(t),!n||n._selected?e:(n._selected=!0,n._handles=e.createItemHandles(n),Std.dom(e._currentItem=n).css("zIndex",++this._itemZIndex),e)},selectRange:function(t,e,n,i){var o=this,c=function(t,e,n,i){return t>=n&&i>=t||e>=n&&i>=e||n>=t&&e>=i};o._clientLayout.layoutItems(function(u,s){var a=s.left(),l=s.top(),r=s.width(),d=s.height();c(e,e+i,l,l+d)&&c(t,t+n,a,a+r)&&o.select(s)})},clearSelected:function(t){var e=this;return(isNumber(t)||isString(t))&&(t=e._clientLayout.layoutItems(t)),void 0===t?(e._clientLayout.layoutItems(function(t,n){e.clearSelected(n)}),e._currentItem=null):(e._currentItem===t&&(e._currentItem=null),e.clearItemHandles(t),t._selected=!1),e},html:function(){},config:function(){},value:function(){var t=this,e=t.opts;"config"===e.valueType}},main:function(t,e){t._items=Std.items(),t.initDOMTree(),e.dots&&t.dots(!0),e.background&&t.background(e.background)}});