Std.ui.module("FieldSet",{nodeName:"fieldset",parent:"widget",option:{level:1,defaultClass:"StdUI_FieldSet",boxSizing:"border-box",items:null,spacing:5,width:300,height:150,tabIndex:null,title:"FieldSet",layout:"VBoxLayout"},action:{children:"append"},extend:{render:function(){var t=this;t._layout.render().update()},remove:function(t){var e=this;e._layout&&e._layout.remove(t)},width:function(){var t=this;t.D.client.width(t.width()-t.boxSize.width)}},"protected":{initLayout:function(){var t=this;return t._layout=Std.ui(t.opts.layout,{parent:t.D.client,spacing:t.spacing()}),t},initElements:function(){var t=this,e=t.D={legend:newDom("legend","_title"),client:newDiv("_client")};return t[0].append([e.legend.html(t.title()),e.client]),t}},"public":{refreshLevel:function(){var t=this;return t.level(t._layout),t},title:function(t){return this.opt("title",t,function(){this.D.label.html(t)})},spacing:function(t){return this.opt("spacing",t,function(){this[0].padding(t)})},update:function(){var t=this;return t._layout.update(),t},insert:function(t,e){var n=this;return n._layout.insert(t,e),n},append:function(t){var e=this;return e._layout.append(t),e.refreshLevel(),e},clear:function(){var t=this;return t._layout.clear(),t}},main:function(t,e){t.initElements(),t.initLayout(),t.call_opts("spacing"),e.items&&t.append(e.items)}});