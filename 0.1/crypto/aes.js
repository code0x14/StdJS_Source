Std.crypto.aes=Std.module(function(){var r=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],o=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]],a=function(o,a){for(var n=0;4>n;n++)for(var e=0;a>e;e++)o[n][e]=r[o[n][e]];return o},n=function(r,o){for(var a=new Array(4),n=1;4>n;n++){for(var e=0;4>e;e++)a[e]=r[n][(e+n)%o];for(var e=0;4>e;e++)r[n][e]=a[e]}return r},e=function(r,o,a,n){for(var e=0;4>e;e++)for(var t=0;n>t;t++)r[e][t]^=o[4*a+t][e];return r},t=function(o){for(var a=0;4>a;a++)o[a]=r[o[a]];return o},f=function(r){for(var o=r[0],a=0;3>a;a++)r[a]=r[a+1];return r[3]=o,r},c=function(r){for(var o=0;4>o;o++){for(var a=new Array(4),n=new Array(4),e=0;4>e;e++)a[e]=r[e][o],n[e]=128&r[e][o]?r[e][o]<<1^283:r[e][o]<<1;r[0][o]=n[0]^a[1]^n[1]^a[2]^a[3],r[1][o]=a[0]^n[1]^a[2]^n[2]^a[3],r[2][o]=a[0]^a[1]^n[2]^a[3]^n[3],r[3][o]=a[0]^n[0]^a[1]^a[2]^n[3]}return r},v=function(r){for(var a=4,n=r.length/4,e=n+6,c=new Array(a*(e+1)),v=new Array(4),i=0;n>i;i++){var u=[r[4*i],r[4*i+1],r[4*i+2],r[4*i+3]];c[i]=u}for(var i=n;a*(e+1)>i;i++){c[i]=new Array(4);for(var d=0;4>d;d++)v[d]=c[i-1][d];if(i%n==0){v=t(f(v));for(var d=0;4>d;d++)v[d]^=o[i/n][d]}else n>6&&i%n==4&&(v=t(v));for(var d=0;4>d;d++)c[i][d]=c[i-n][d]^v[d]}return c},i=function(r,o){for(var t=4,f=o.length/t-1,v=[[],[],[],[]],i=0;4*t>i;i++)v[i%4][Math.floor(i/4)]=r[i];v=e(v,o,0,t);for(var u=1;f>u;u++)v=a(v,t),v=n(v,t),v=c(v,t),v=e(v,o,u,t);v=a(v,t),v=n(v,t),v=e(v,o,f,t);for(var d=new Array(4*t),i=0;4*t>i;i++)d[i]=v[i%4][Math.floor(i/4)];return d};return{"static":{encode:function(r,o,a){if(128!=a&&192!=a&&256!=a)return"";r=String(r).utf8Encode(),o=String(o).utf8Encode();for(var n=a/8,e=new Array(n),t=16,f=0;n>f;f++)e[f]=isNaN(o.charCodeAt(f))?0:o.charCodeAt(f);var c=i(e,v(e));c=c.concat(c.slice(0,n-16));for(var u=new Array(t),d=Date.time(),h=d%1e3,A=Math.floor(d/1e3),l=Math.floor(65535*Math.random()),y="",f=0;2>f;f++)u[f]=h>>>8*f&255;for(var f=0;2>f;f++)u[f+2]=l>>>8*f&255;for(var f=0;4>f;f++)u[f+4]=A>>>8*f&255;for(var f=0;8>f;f++)y+=String.fromCharCode(u[f]);for(var w=v(c),g=Math.ceil(r.length/t),C=new Array(g),s=0;g>s;s++){for(var S=0;4>S;S++)u[15-S]=s>>>8*S&255;for(var S=0;4>S;S++)u[15-S-4]=s/4294967296>>>8*S;for(var m=i(u,w),M=g-1>s?t:(r.length-1)%t+1,j=new Array(M),f=0;M>f;f++)j[f]=m[f]^r.charCodeAt(s*t+f),j[f]=String.fromCharCode(j[f]);C[s]=j.join("")}return Std.crypto.base64.encode(y+C.join(""))},decode:function(r,o,a){if(128!=a&&192!=a&&256!=a)return"";r=Std.crypto.base64.decode(String(r)),o=String(o).utf8Encode();for(var n=a/8,e=new Array(n),t=16,f=0;n>f;f++)e[f]=isNaN(o.charCodeAt(f))?0:o.charCodeAt(f);var c=i(e,v(e));c=c.concat(c.slice(0,n-16));for(var u=new Array(8),d=r.slice(0,8),f=0;8>f;f++)u[f]=d.charCodeAt(f);for(var h=v(c),A=Math.ceil((r.length-8)/t),l=new Array(A),y=0;A>y;y++)l[y]=r.slice(8+y*t,8+y*t+t);r=l;for(var w=new Array(r.length),y=0;A>y;y++){for(var g=0;4>g;g++)u[15-g]=y>>>8*g&255;for(var g=0;4>g;g++)u[15-g-4]=(y+1)/4294967296-1>>>8*g&255;for(var C=i(u,h),s=new Array(r[y].length),f=0;f<r[y].length;f++)s[f]=C[f]^r[y].charCodeAt(f),s[f]=String.fromCharCode(s[f]);w[y]=s.join("")}return w.join("").utf8Decode()}},main:function(r,o,a){return Std.crypto.aes(r,o,a)}}});