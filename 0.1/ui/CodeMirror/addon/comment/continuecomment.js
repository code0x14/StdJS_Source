!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){function n(n){if(n.getOption("disableInput"))return e.Pass;for(var o,i=n.listSelections(),r=[],l=0;l<i.length;l++){var m=i[l].head,s=n.getTokenAt(m);if("comment"!=s.type)return e.Pass;var c=e.innerMode(n.getMode(),s.state).mode;if(o){if(o!=c)return e.Pass}else o=c;var f=null;if(o.blockCommentStart&&o.blockCommentContinue){var a,u=s.string.indexOf(o.blockCommentEnd),d=n.getRange(e.Pos(m.line,0),e.Pos(m.line,s.end));if(-1!=u&&u==s.string.length-o.blockCommentEnd.length&&m.ch>=u);else if(0==s.string.indexOf(o.blockCommentStart)){if(f=d.slice(0,s.start),!/^\s*$/.test(f)){f="";for(var C=0;C<s.start;++C)f+=" "}}else-1!=(a=d.indexOf(o.blockCommentContinue))&&a+o.blockCommentContinue.length>s.start&&/^\s*$/.test(d.slice(0,a))&&(f=d.slice(0,a));null!=f&&(f+=o.blockCommentContinue)}if(null==f&&o.lineComment&&t(n)){var g=n.getLine(m.line),a=g.indexOf(o.lineComment);a>-1&&(f=g.slice(0,a),/\S/.test(f)?f=null:f+=o.lineComment+g.slice(a+o.lineComment.length).match(/^\s*/)[0])}if(null==f)return e.Pass;r[l]="\n"+f}n.operation(function(){for(var e=i.length-1;e>=0;e--)n.replaceRange(r[e],i[e].from(),i[e].to(),"+insert")})}function t(e){var n=e.getOption("continueComments");return n&&"object"==typeof n?n.continueLineComment!==!1:!0}for(var o=["clike","css","javascript"],i=0;i<o.length;++i)e.extendMode(o[i],{blockCommentContinue:" * "});e.defineOption("continueComments",null,function(t,o,i){if(i&&i!=e.Init&&t.removeKeyMap("continueComment"),o){var r="Enter";"string"==typeof o?r=o:"object"==typeof o&&o.key&&(r=o.key);var l={name:"continueComment"};l[r]=n,t.addKeyMap(l)}})});