/**
    Std UI Kit Library
    http://ui.stdjs.com
	module: ListItem,List
*/
Std.ui.module("ListItem",{b:"Item",e:{defaultClass:"StdUI_ListItem",iconHeight:16,iconWidth:16,height:24,value:null},g:{height:function(e){var t=this,i=t.opts,n=t.DOMMap;isNumber(e)||(e=t.height()),n.icon&&n.icon.marginTop(Math.floor((e-i.iconHeight)/2)),t[0].lineHeight(e-t.boxSize.height)}}}),Std.ui.module("List",{b:"widget",c:"itemClick itemRename itemRemove itemSelected itemSort clear receive focus blur dataSourceMessage",e:{defaultClass:"StdUI_List",level:4,type:"default",itemType:"ListItem",itemEditMode:"dblclick",valueType:"list_value",value:null,items:null,editable:!1,sortable:!1,template:null,dataSource:null,width:"auto",height:"auto",itemHeight:24,itemWidth:80,iconWidth:16,iconHeight:16,selectionMode:"single"},n:{initEvents:function(){var e=this;e[0].focussing(function(){e.enable()&&e.addClass("focused").emit("focus")},function(){e.emit("blur").removeClass("focused")},!1)},initDataSource:function(){var e=this,t=e.opts,i=e.dataSource=Std.dataSource(t.dataSource);i.on("message",function(t){e.emit("dataSourceMessage",t)}).call("items",{value:t.value},function(t,i){e.append(i)}),e.on({itemRemove:function(e){i.call("itemRemove",{item:e,value:e.value()})},itemRename:function(e,t){i.call("itemRename",{item:e,text:t,value:e.value()})},itemDrop:function(e,t){t.traitor||i.call("itemDrop",{item:e,index:t.index,value:e.value()})}})},initSortPlugin:function(){var e=this;e[1].plugin("sort",Std.extend({items:"> *",accept:"."+e.opts.defaultClass+" ._items",helper:"clone",behavior:"insert",forceHelperSize:!0,check:function(){return e.sortable()&&e.enable()}},e.opts.sortOption)).on({sort:function(t){var i=e._items.items(t.self);t.traitor?e.clearSelected(i):(e._items.remove(i),e._items.insert(i,t.index)),e.emit("itemSort",[i,t],!0)},receive:function(t){var i=t.sender.parent().ui(),n=i._items.items(t.self);i._items.remove(n),e[1].insert(n,t.index),e._items.insert(n,t.index)},stop:function(){console.log(11)}})},initItemEvents:function(){var e=this,t=e.opts,i=!1,n=t.itemEditMode.split(" "),s=t.selectionMode,r=function(t,i,n){"multi"===s?(n.ctrlKey||e.clearSelected(),e._selectedItems.has(i)?e.clearSelected(i):e.select(i)):"none"!==s&&(e.clearSelected(),e.select(t))};e[1].delegate("mouseenter","> *",function(s){var a=this.index(),l=e._items.items(a);e.enable()&&l&&Std.dom(l).mouse({auto:!1,dblclick:function(){t.editable&&n.has("dblclick")&&e.editItem(l)},click:function(){t.editable&&n.has("click")&&e.editItem(l),e.emit("itemClick",l)},down:function(e){i=!0,r(a,l,e),e.preventDefault()},up:function(){i=!1}},s)})}},g:{width:function(e){isNumber(e)&&this[1].width(e-this.boxSize.width)},height:function(e){isNumber(e)&&this[1].height(e-this.boxSize.height)},render:function(){var e=this,t=e.opts;e._items.items(function(e,t){isWidget(t)&&t.render()}),t.dataSource&&e.initDataSource(),t.value&&e.value(t.value)},enable:function(e){var t=this;t._items.items(function(t,i){isWidget(i)&&i.enable(e)}),t[0].unselect(!e)},destroy:function(){this._items.items(function(e,t){isWidget(t)&&t.destroy()})},remove:Std.func(function(e){var t=this,i=t._selectedItems;if(isObject(e)&&(e=t._items.indexOf(e)),isNumber(e)||isString(e)){var n=t._items.items(e);(isWidget(n)||Std.is.DOM(n))&&(i.has(n)&&t.clearSelected(n),t._items.remove(e),t.emit("itemRemove",n),n.destroy())}},{each:[isArray]})},i:{editItem:function(e){var t=this;return(e=t.items(e))instanceof Std.ui("ListItem")&&e.DOMMap.text.editText({changeText:!1,apply:function(i,n){i!==n&&(e.text(i),t.emit("itemRename",[e,i,n],!0))}}),t},createTemplateItem:function(e){var t=this,i=t.opts;return Std.ui("TemplateItem",{data:isString(e)?{text:e}:e,parent:t,template:t.template(),textField:i.textField,valueField:i.valueField})},createItem:function(e){var t=this,i=t.opts;if(isWidget(e))return e.parent(this);if(Std.is.DOM(e))return e;if(i.template)return t.createTemplateItem(e);var n={ui:i.itemType,parent:t,height:i.itemHeight,iconWidth:i.iconWidth,iconHeight:i.iconHeight};return"block"==i.type&&(n.width=i.itemWidth),isString(e)||isNumber(e)?n.text=e:Std.is.action(e)?n.action=e:isObject(e)&&(n=Std.extend(n,e)),Std.ui(n.ui,n)}},j:{items:function(e,t){return this._items.items(e,t)},type:function(e){return this.opt("type",e,function(){this[1].toggleClass("_block","block"===e)})},editable:function(e){return this.opt("editable",e)},selectedItem:function(){return this._selectedItems[0]||null},selectedItems:function(){return Array.from(this._selectedItems)},itemCount:function(){return this._items.length},itemEditMode:function(e){return this.opt("itemEditMode",e)},itemWidth:function(e){return this.opt("itemWidth",e,function(){this._items.items(function(t,i){i.width(e)})})},itemHeight:function(e){return this.opt("itemHeight",e,function(){this._items.items(function(t,i){i.height(e)})})},sortable:function(e){return this.opt("sortable",e,function(){e&&this.initSortPlugin()})},template:function(e){var t=this,i=t.opts;return void 0===e?i.template:(isString(e)&&(e=Std.template(e)),e instanceof Std.template&&(i.template=e),t)},reload:function(){var e=this,t=e.opts,i=t.dataSource;return i&&i.call("items",{value:t.value},function(t,i){e.clear(),e.append(i)}),e},select:Std.func(function(e){var t=this,i=t.opts,n=i.selectionMode;if("none"!==n)if(isWidget(e))t.select(t._items.indexOf(e));else if(isNumber(e)||isString(e)){var s=t._items.items(e);if(!s||t._selectedItems.has(s))return;"single"===n&&t.clearSelected(),t._selectedItems.push(s.addClass("selected")),t.emit("itemSelected",[e,s],!0)}},{each:[isArray]}),insert:function(e,t,i){var n=this,s=null;return n._items.insert(e,t,i,function(e){return s=n.createItem(e)}),null===s?!1:(n[1].insert(Std.dom.get(s),i),n.rendered&&s.render(),n)},append:Std.func(function(e,t){this.insert(e,t)},{each:[isArray]}),clearSelected:function(e){var t=this,i=t._selectedItems;if(void 0===e){for(var n=0,s=i.length;s>n;n++)i[n].removeClass("selected");i.clear()}else if(isObject(e))t.clearSelected(i.indexOf(e));else if(isNumber(e)&&-1!==e){var r=i[e];r&&i.has(r)&&(r.removeClass("selected"),i.remove(e))}return t},clear:function(){var e=this,t=e._items;return t.items(function(e,t){t.remove()}),t.clear(),e._selectedItems.clear(),e.emit("clear")},value:function(e){var t=this,i=t.opts,n=null,s=i.valueType;if("list-value"===s)void 0===e?n=t.items(function(e,t){return t.value()},!0):isArray(e)&&Std.each(e,function(e,i){t._items._list[e]?t._items._list[e].value(i):t.append({text:e,value:i})});else if("list-text"===s)void 0===e?n=t.items(function(e,t){return t.text()},!0):isArray(e)&&Std.each(e,function(e,i){t._items._list[e]?t._items._list[e].text(i):t.append(i)});else{if("text-value"!==s)return t.value.parent.call(t,e);void 0===e?(n={},t.items(function(e,t){n[t.text()]=t.value()})):isObject(e)&&Std.each(e,function(e,i){var n=t.items(function(t,i){return i.text()===e?i:void 0});n?n.value(i):t.append({text:e,value:i})})}return n||t}},k:function(e,t){e[1]=newDiv("_items").appendTo(e[0]),e._items=Std.items(),e._selectedItems=[],e.call_opts({type:"default",template:null,sortable:!1},!0),t.items&&e.append(t.items),e.initEvents(),e.initItemEvents()},m:{rule:{children:"append"},html:{create:function(e){var t=this;e.children(function(e,i){var n=Std.options.get(i),s=i.attr("std-icon"),r=i.attr("std-action"),a=i.attr("std-content");if(a&&"text"!=a){if("data"==a)n=i.html().toObject();else if("widget"==a){var l=element.children();if(!(l&&l.length>0))return;var o=l[0].attr("std-ui");return isString(o)&&Std.ui(o)&&(n=Std.ui.build(l[0],!1)),n}}else n.text=i.trimHTML();isString(s)&&(n.icon=s),isString(r)&&(n.action=r),t.append(i.attr("std-name"),n)})}}}});