/**
    Std UI Kit Library
    http://ui.stdjs.com
	module: Item,TemplateItem
*/
Std.ui.module("Item",{b:"widget",e:{level:2,defaultClass:"StdUI_Item",text:"",icon:null,value:null,tabIndex:null,iconWidth:null,iconHeight:null,verticalAlign:"top"},h:{textVisible:!0},g:{beforeRender:function(){this.call_opts({text:"",value:null,icon:null},!0)},width:function(){var t=this,e=t.opts,i=t.width(),n=t.DOMMap;isNumber(e.iconWidth)&&n.icon&&i-t.boxSize.width<=e.iconWidth?t._textVisible&&n.text&&(n.text.hide(),t._textVisible=!1):!t._textVisible&&n.text&&(n.text.show(),t._textVisible=!0)},height:function(){var t=this,e=t.opts,i=e.verticalAlign;if("top"!==i&&"none"!==i){var n=t.DOMMap,l=t.height()-t.boxSize.height,o=0,c=0;"middle"===i?(isNumber(e.iconHeight)&&(o=(l-e.iconHeight)/2),c=l):"bottom"===i&&(isNumber(e.iconHeight)&&(o=l-e.iconHeight),c=2*l),n.icon&&isNumber(e.iconHeight)&&n.icon.marginTop(o),n.text&&n.text.lineHeight(c)}}},"protected":{initIcon:function(){var t=this,e=t.DOMMap,i=e.icon=newDiv("_icon");return e.text?i.insertBefore(e.text):i.appendTo(t[0]),t.call_opts({iconWidth:null,iconHeight:null},!0)}},j:{verticalAlign:function(t){return this.opt("verticalAlign",t)},iconWidth:function(t){var e=this;return e.opt("iconWidth",t,function(){e.DOMMap.icon&&Std.icon.update(e.DOMMap.icon,{width:t})})},iconHeight:function(t){var e=this;return e.opt("iconHeight",t,function(){e.DOMMap.icon&&Std.icon.update(e.DOMMap.icon,{height:t})})},text:function(t){var e=this;return e.opt("text",t,function(){e.DOMMap.text||(e.DOMMap.text=newDiv("_text").appendTo(e[0])),e.DOMMap.text.html(t)})},icon:function(t){var e=this,i=e.DOMMap;return e.opt("icon",t,function(){i.icon||e.initIcon(),Std.icon.update(i.icon,t,{width:null,height:null})})}},k:function(t,e,i){t.DOMMap={},isFunction(e.click)&&i.on("click",function(){t.enable()&&e.click.call(t)})},m:{rule:{content:"text"},html:{create:function(t){var e=t.html(),i=t.attr("std-icon");i&&this.icon(i),e&&this.text(e)}}}}),Std.ui.module("TemplateItem",{b:"widget",c:"templateRender",e:{level:2,defaultClass:"StdUI_TemplateItem",text:"",data:null,value:null,tabIndex:null,template:null,textField:"text",valueField:"value"},g:{render:function(){var t=this;t.call_opts({data:null},!0)}},j:{text:function(t){return this.opt("text",t)},template:function(t){var e=this,i=e.opts;return e.opt("template",t,function(){i.template=Std.template(t)})},data:function(t){var e=this,i=e.opts;if(void 0===t)return i.data;var n=e.template();return(isString(t)||isNumber(t))&&(t={value:t}),isObject(n)&&(n.renderTo(e,t),e.emit("templateRender")),e.text(t[i.textField]),e.value(t[i.valueField]),i.data=t,e}},k:function(t,e,i){t.DOMMap={},e.template&&t.template(e.template),isFunction(e.click)&&i.on("click",function(){t.enable()&&e.click.call(t)})},m:{rule:{content:"text"},html:{create:function(t){var e=t.html().trim(),i=t.attr("std-template");isString(i)&&this.template(i),isEmpty(e)||this.text(e)}}}});