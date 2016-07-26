/**
    Std UI Kit Library
    http://ui.stdjs.com
	module: TabButton,TabPanel
*/
Std.ui.module("TabPanel",{b:"widget",c:"removeTab selectTab sortTab",e:{defaultClass:"StdUI_TabPanel",level:4,tabButtonWidth:null,tabButtonHeight:32,tabButtonSpacing:2,tabButtonMinWidth:60,tabButtonMinHeight:60,tabClosable:!1,tabSortable:!1,tabStretchable:!1,maxTabButtonWidth:"50%",contentPadding:5,deferRender:!0,autoClean:!0,selected:0,items:null,switchType:"mousedown",tabAlign:"left",tabSide:"top",theme:"default"},h:{timer1:null,tabBarOverflowed:!1,lastWidth:null,lastHeight:null,direction:null,dropDownMenu:null,sortPlugin:null},g:{render:function(){var t=this,e=t.opts;t._items.items(function(t,n){n.button.render(),e.deferRender||e.selected===t||n.content.render()}),t.call_opts({tabSortable:!1},!0),t.initEvents(),t.initKeyboard(),t.tabBarOverflowCheck(),t.select(e.selected),e.value&&t.value(e.value)},width:function(){this.rendered&&this.updateLayout()},height:function(){var t=this,e=t.DOMMap,n=t.computeContentHeight();e.contents.height(n),t._items.items(function(t,e){e.content.height(n)}),t.rendered&&t.updateLayout()},destroy:function(){var t=this;t._items.items(function(t,e){e.button.destroy(),e.content.destroy()}),t._items.clear(),t._activeItem=null,t._dropDownMenu&&t._dropDownMenu.destroy()},remove:function(t){var e=this,n=null;isObject(t)&&(t=e._items.indexOf(t)),(isNumber(t)||isString(t))&&(n=e._items.items(t))&&(n.destroy(),e._items.remove(t))},enable:function(t){var e=this;e._items.items(function(e,n){n.button.enable(t),n.content.enable(t)})}},n:{initKeyboard:function(){var t=this;return t},initEvents:function(){var t=this,e=t.opts;return t.DOMMap.buttons.delegate(e.switchType,".StdUI_TabButton",function(e){var n=this.index(),i=t._items.items(n).button;t.enable()&&1===e.which&&(t.select(n),"vertical"===t._direction?t.verticalTabButtonClick(n,i):t.horizontalTabButtonClick(n,i))}),t},initTabBar:function(){var t=this,e=t.DOMMap;return t[0].append(e.tabBar=newDiv("_tabBar").height(t.opts.tabButtonHeight).append([e.leftTools=newDiv("_tools _left"),e.line=newDiv("_line"),e.tabs=newDiv("_tabs").append(e.buttons=newDiv("_buttons")),e.rightTools=newDiv("_tools _right")])),t},initClient:function(){var t=this,e=t.opts,n=t.DOMMap;switch(n.contents=newDiv("_contents"),e.tabSide){case"right":case"bottom":t[0].prepend(n.contents);break;case"left":case"top":t[0].append(n.contents)}return t.addClass("_"+e.tabSide),n},initSortPlugin:function(){var t=this,e=function(e){var n=t._items.items(function(t,n){return e.self.is(n.button)?t:void 0});-1!==n&&-1!==e.index&&(t._items._list.move(n,e.index),t.emit("sortTab",e))};t._sortPlugin=t.DOMMap.buttons.plugin("sort",{items:">.StdUI_TabButton",behavior:"insert",check:function(){return t.tabSortable()},on:{sort:e}})}},i:{initScrollButtons:function(t,e,n){var i=this,o=i.opts,a=i.DOMMap,s={down:t,delay:10,interval:3};return a.leftTools.append(a.prevBtn=newDiv("_scrollButton _backward").height(o.tabButtonHeight-1).mouse(Std.extend(s,{longpress:e})).append(newDiv("_icon"))),a.rightTools.append([a.nextButton=newDiv("_scrollButton _forward").height(o.tabButtonHeight-1).mouse(Std.extend(s,{longpress:n})).append(newDiv("_icon")),a.controlHand=newDiv("_controlHand").height(o.tabButtonHeight-1).mouse({down:function(t){1===t.which&&(i._dropDownMenu?i._dropDownMenu.destroy():(this.addClass("selected"),i.initDropDownMenu()))}}).append(newDiv("_icon"))]),i._tabBarOverflowed=!0,i},initHScrollButtons:function(){if(this._tabBarOverflowed)return this;var t=this,e=t.opts,n=t.DOMMap,i=0,o=0,a=0,s=e.tabButtonHeight-1,r=e.tabButtonSpacing;return t.initScrollButtons(function(){i=0,a=n.buttons.css("margin-left"),o=n.tabs.width(),t._items.items(function(t,e){i+=e.button.width()+r})},function(){r>a&&n.buttons.css("margin-left",a+=3)},function(){i+a>o&&n.buttons.css("margin-left",a-=3)}),n.prevBtn.height(s),n.nextButton.height(s),n.buttons.css("margin-left",r),t.updateTabsWidth()},initVScrollButtons:function(){if(this._tabBarOverflowed)return this;var t=this,e=t.opts,n=t.DOMMap,i=0,o=0,a=0,s=e.tabButtonSpacing,r=n.tabBar.width()-s;return t.initScrollButtons(function(){i=0,a=n.buttons.css("margin-top"),o=n.tabs.height(),t._items.items(function(t,e){i+=e.button.height()+s})},function(){s>a&&n.buttons.css("margin-top",a+=3)},function(){i+a>o&&n.buttons.css("margin-top",a-=3)}),Std.doms([n.prevBtn,n.nextButton,n.controlHand]).css({height:25,width:r}),n.buttons.css("margin-top",s),t.updateTabsHeight()},initDropDownMenu:function(){var t=this,e=t.DOMMap,n=t[0].offset(),i=t.opts.tabButtonHeight;if(t._dropDownMenu)return t;var o=function(t){var n=t.target;a[0].contains(n)||e.controlHand.contains(n)||a.destroy()},a=t._dropDownMenu=Std.ui("Menu",{renderTo:"body",maxHeight:t.height()-i,css:{boxShadow:"none",position:"absolute"},items:[{text:"Close All",click:function(){t.closeAll()}},{text:"First Page",click:function(){t.activeIndex(0).updateTabScroll()}},{text:"Last Page",click:function(){t.activeIndex(t._items.length-1).updateTabScroll()}},{ui:"sep"}],on:{itemPress:function(){a.destroy()},visible:function(t){e.controlHand.toggleClass("selected",t)},destroy:function(){t._dropDownMenu=null,e.controlHand.removeClass("selected"),Std.dom(document).off("mousedown",o)}}}).toForeground();switch(t._items.items(function(e,n){var i=n.button,o=i.text(),s=i.icon();a.append({text:o,icon:s,checked:t._activeItem===n,click:function(){t.activeItem(n).updateTabScroll()}})}),t.opts.tabSide){case"top":a[0].css({left:n.x+t.width()-a.width(),top:n.y+i-1});break;case"right":a[0].css({left:n.x+t.width()-a.width(),top:n.y+t.height()-a.height()-e.controlHand.outerHeight()+1});break;case"bottom":a[0].css({left:n.x+t.width()-a.width(),top:n.y+t.height()-a.height()-e.controlHand.outerHeight()+1});break;case"left":a[0].css({left:n.x,top:n.y+t.height()-a.height()-e.controlHand.outerHeight()+1})}return Std.dom(document).on("mousedown",o),t},computeContentHeight:function(){var t=this,e=t.opts,n=t.DOMMap,i=t.height(),o=i-2*e.contentPadding-2;switch(e.tabSide){case"left":case"right":n.tabBar.height(i-t.boxSize.height-t.boxSize.extraHeight),t._tabBarOverflowed&&t.updateTabsHeight();break;case"top":n.line.css("top",e.tabButtonHeight-1);case"bottom":o-=e.tabButtonHeight}return o},verticalTabButtonClick:function(t,e){var n=this,i=e.height(),o=e[0].position().y,a=n.DOMMap.tabs.height(),s=n.opts.tabButtonSpacing;return n._tabBarOverflowed?(o+i>a?n.DOMMap.buttons.animateTo({"margin-top[+]":a-(o+i)-s},100):0>o&&n.DOMMap.buttons.animateTo({"margin-top[-]":o-s},100),n):n},horizontalTabButtonClick:function(t,e){var n=this,i=e.width(),o=e[0].position().x,a=n.DOMMap.tabs.width(),s=n.opts.tabButtonSpacing;return n._tabBarOverflowed?(o+i>a?n.DOMMap.buttons.animateTo({"margin-left[+]":a-(o+i)-s},100):0>o&&n.DOMMap.buttons.animateTo({"margin-left[-]":o-s},100),n):n},tabBarOverflowCheck:function(){var t=this,e=t.opts,n=t._items.length,i=e.tabButtonSpacing,o=(n-1)*i;switch(t._direction){case"horizontal":var a=t.width()-t.boxSize.width-t.boxSize.extraWidth;t._items.items(function(t,n){o+=e.tabStretchable?e.tabButtonMinWidth:n.button.width()}),o>a?t.initHScrollButtons():t._tabBarOverflowed&&t.removeScrollButtons();break;case"vertical":t._items.items(function(t,n){o+=e.tabStretchable?e.tabButtonMinHeight:n.button.height()}),o>t.height()?t.initVScrollButtons():t._tabBarOverflowed&&t.removeScrollButtons()}return t},removeScrollButtons:function(){var t=this,e=t.DOMMap;return e.buttons.css({marginTop:0,marginLeft:0}),Std.doms([e.prevBtn,e.nextButton,e.controlHand]).remove(),t._dropDownMenu&&t._dropDownMenu.destroy(),t._tabBarOverflowed=!1,t.updateTabsWidth()},updateTabsWidth:function(){var t=this,e=t.opts,n=t.DOMMap,i=t._items.length,o=e.tabButtonSpacing,a=t.width()-t.boxSize.width-t.boxSize.extraWidth-n.leftTools.width()-n.rightTools.width();if(n.tabs.width(a),e.tabStretchable)if(t._tabBarOverflowed)t._items.items(function(t,n){n.button.width(e.tabButtonMinWidth)});else{var s=(a-(i-1)*o)/i;t._items.items(function(t,e){e.button.width(s)})}return t},updateTabsHeight:function(){var t=this,e=t.opts,n=t.DOMMap,i=t._items.length,o=e.tabButtonSpacing,a=t.height()-t.boxSize.height-t.boxSize.extraHeight-n.leftTools.height()-n.rightTools.height();if(n.tabs.height(a),e.tabStretchable)if(t._tabBarOverflowed)t._items.items(function(t,n){n.button.height(e.tabButtonMinHeight)});else{var s=(a-(i-1)*o)/i;t._items.items(function(t,e){e.button.height(s)})}return t},updateTabScroll:function(){var t=this,e=t.activeIndex();return t["horizontal"===t._direction?"horizontalTabButtonClick":"verticalTabButtonClick"](e,t._items._list[e].button),t},updateHorizontalLayout:function(){var t=this,e=t.opts,n=t.width()-2*e.contentPadding-t.boxSize.width-t.boxSize.extraWidth-2;return t.updateTabsWidth(),t._items.items(function(t,e){e.content.width(n)}),t},updateVerticalLayout:function(){var t=this,e=t.opts,n=t.width(),i=t.DOMMap,o=i.tabBar.width();switch(t.opts.tabSide){case"left":i.line.css("left",o-1);case"right":i.contents.width(n-2*e.contentPadding-o-2)}return t.updateTabsHeight(),t._items.items(function(t,i){i.content.width(n-2*e.contentPadding-o-2)}),t},updateLayout:function(t){var e=this;return t!==!1&&e.tabBarOverflowCheck(),"horizontal"===e._direction?e.updateHorizontalLayout():e.updateVerticalLayout(),e},convertIndex:function(t,e){var n=this,i=-1,o=n._items;if("first"===t)i=0;else if("last"===t)i=o.length-1;else if("beside"===t){var a=o.length;a-1>e?i=e:a>1?i=e-1:1===a&&(i=0)}else isString(t)&&(i=o.itemIndex(t));return i}},j:{items:function(t,e){return this._items.items(t,e)},itemCount:function(){return this._items.length},appendTab:function(t,e){return this.insertTab(t,-1,e)},contentPadding:function(t){var e=this;return e.DOMMap.contents.css("padding",t+"px"),e},tabSortable:function(t){var e=this;return this.opt("sortable",t,function(){t&&e.initSortPlugin()})},buttons:function(){var t=this,e=[];return t.items(function(t,n){"button"in n&&e.push(n.button)}),e},contents:function(){var t=this,e=[];return t.items(function(t,n){"content"in n&&e.push(n.content)}),e},select:function(t,e){var n=this;return isString(t)&&(t=n.convertIndex(t,e)),-1!==t&&t<n._items.length&&(n.activeIndex(t),n.emit("selectTab",[t,n._items._list[t]],!0)),n},activeIndex:function(t){var e=this,n=e._items;return void 0===t?n.indexOf(e._activeItem):(n._list[t]&&e.activeItem(n._list[t]),e)},activeItem:function(t){var e=this,n=e.opts,i=e._items,o=n.deferRender&&n.autoClean;if(void 0===t){var a=e.activeIndex();return-1==a?null:i._list[a]}var s=e._activeItem;return s&&(s.button.select(!1),s.content.removeClass("_visible"),o&&s.content[0].detach()),o&&t.content[0].appendTo(e.DOMMap.contents),t.button.select(!0),t.content.addClass("_visible"),e._activeItem=t,e.updateLayout(!1),t.content.rendered?o&&t.content.updateLayout():(t.content.height(e.computeContentHeight()),t.content.render()),e},insert:function(t,e,n){return this.insertTab(t,e,n)},append:function(t){var e=this;return isArray(t)?Std.each(t,function(t,n){e.appendTab(n,!1)}):isObject(t)&&e.appendTab(t,!1),e.rendered&&e.updateLayout(!0),e},insertTab:function(t,e,n){var i=this,o=i.opts,a=new Std.ui.modules.TabPanel.itemModule(t,this),s=a.opts.name,r=i.DOMMap;return-1===e?(r.buttons.append(a.button[0]),o.deferRender||r.contents.append(a.content[0]),s?i._items.append(s,a):i._items.push(a)):(r.buttons.insert(a.button[0],e),o.deferRender||r.contents.insert(a.content[0],e),s?i._items.insert(s,a,e):i._items.insert(a,e)),i.rendered&&(a.button.render(),n!==!1&&i.updateLayout(),o.deferRender||(a.content.height(i.computeContentHeight()),a.content.render())),a},closeAll:function(){for(var t=this,e=t._items.length-1;e>=0;e--){var n=t._items._list[e];n&&n.button.closable()&&t.remove(n)}return t.tabBarOverflowCheck(),t},removeTab:function(t){var e=this,n=e._items,i=e.items(t),o=e.activeIndex();return i?(i.button.destroy(),i.content.destroy(),n.remove(t=n.itemIndex(i)),i===e._activeItem&&(e._activeItem=null),t===o&&e.select("beside",t),e.tabBarOverflowCheck(),e.opts.tabStretchable&&e.updateLayout(!1),e.emit("removeTab",[t],!0)):e},valid:function(){var t=this,e=t.opts,n=e.valueType;return"auto"===n||"array"===n||"map"===n?!1!==t.items(function(t,e){return e.content.valid()===!1?!1:void 0}):t.valid.parent.call(t)},map:function(t){var e=this,n={};return e.items(function(i,o){var a=o.name(),s=o.content;s.rendered&&("layout"===s.opts.contentType?s.layout().map(function(i,o){isFunction(t)&&t.call(e,i,o,n),n[o]=i}):a&&(n[a]=s,isFunction(t)&&t.call(e,s,a,n)))}),isString(t)?n[t]||null:n},value:function(t){var e=this,n=e.opts,i="auto"===n.valueType?"array":n.valueType;return void 0===t?e.rendered?"array"===i?e.items(function(t,e){return e.content.value()},!0):"map"===i&&(t={})?(e.map(function(e,n){t[n]=e.value()}),t):n.value:n.value:(isArray(n.value=t)&&"array"===i?e.items(function(e,n){e<t.length&&n.content.value(t[e])}):isObject(t)&&"map"===i&&e.map(function(e,n){e.value(t[n])}),e)},clear:function(){var t=this;return t._items.items(function(t,e){e.button.destroy(),e.content.destroy()}),t._items.clear(),t._activeItem=null,t}},k:function(t,e){switch(e.tabSide){case"left":case"right":t._direction="vertical";break;case"top":case"bottom":t._direction="horizontal"}t._items=Std.items(),t.DOMMap={},t.initTabBar(),t.initClient(),null!==e.items&&t.append(e.items),t.call_opts({contentPadding:0},!0)},m:{rule:{},html:{nodeName:["DIV"],create:function(t){this.append(t.children("ul",function(t,e){var n=null,i=e.attr("std-content"),o=e.children("li");if(o&&!(o.length<2)){var a=o[0],s=o[1];if(i&&"html"!==i)if("layout"==i){var r=s.attr("std-ui");r&&Std.ui(r)&&(n={layout:Std.ui.build(s,!1)})}else"iframe"==i?n={iframe:s.text()}:"data"==i&&(n=s.html().toObject());else n=s.html();return{name:e.attr("std-name"),button:Std.extend({icon:a.attr("std-icon"),text:a.html()},Std.options.get(a)),content:n}}}))}}}}),Std.ui.module("TabButton",{b:"Button",e:{level:4,height:30,closable:!1,closeButtonSize:18,closeButtonSpacing:3,align:"left",styleType:"text",defaultClass:"StdUI_TabButton"},h:{selected:!1},g:{create:function(t,e){e.closable&&t.initCloseCell()},width:function(t){var e=this,n=e.opts;n.closable&&isNumber(t)&&!e.select()&&(e._fixedTableLayout?e.removeCell("close"):e._cells.close||e.initCloseCell())}},i:{initCloseCell:function(){var t=this;return t.addCell("close",newDiv("_cell _close").on("mouseenter",function(e){t.enable()&&this.mouse({auto:!1,down:function(t){t.stopPropagation()},click:function(){var e=t.parent();e&&e.destroy()}},e)})),t}},j:{closable:function(t){var e=this;return e.opt("closable",t,function(){t===!0?e.initCloseCell():t===!1&&e.removeCell("close")})},select:function(t){var e=this;return void 0===t?e._selected:(e._selected=t,t===!0&&e.closable()&&(e.cells("close")||e.initCloseCell()),e.toggleClass("selected",t))}},k:function(){}}),Std.ui("TabPanel").itemModule=Std.module({e:{name:null,button:null,content:null,value:null},i:{createButton:function(t){var e=this,n=e.parent.opts,i={parent:e,align:n.tabAlign,closable:n.tabClosable};return isString(t)?i.text=t:isObject(t)&&(i=Std.extend(i,t)),isNumber(n.tabButtonWidth)&&(i.width=n.tabButtonWidth),i.height=n.tabButtonHeight,Std.ui("TabButton",i)},createContent:function(t){var e=null;return isString(t)?e=Std.ui("widget",{tabIndex:null,defaultClass:"StdUI_TabContent",html:t}):isWidget(t)||Std.is.DOM(t)?e=Std.ui("widget",{tabIndex:null,defaultClass:"StdUI_TabContent",layout:{ui:"VArrayLayout",items:[t]}}):isLayout(t)?e=Std.ui("widget",{tabIndex:null,defaultClass:"StdUI_TabContent",layout:t}):isPlainObject(t)&&(e=Std.ui(t.ui||"widget",Std.extend({tabIndex:null,defaultClass:"StdUI_TabContent"},t))),e}},j:{name:function(t){return this.opt("name",t)},value:function(t){return this.opt("value",t)},index:function(){return this.parent._items.indexOf(this)},select:function(){return this.parent.select(this.index()),this},destroy:function(){return this.parent.removeTab(this.index()),this}},k:function(t,e){var n=this,i=n.init_opts(t);n.parent=e,n.button=n.createButton(i.button),n.content=n.createContent(i.content),e.enable()||(isWidget(n.button)&&n.button.enable(!1),isWidget(n.content)&&n.content.enable(!1))}});