Std.source.response("StdJS",function(){
    function CSSFile_UI(name){
        return "ui/theme/default/" + name + ".css";
    }
    function JSFile_UI(name){
        return "ui/" + name + ".js";
    }
    function cryptoJS(name){
        return "crypto/Std.crypto."+name+".js";
    }
    return {
        "ui.Canvas":JSFile_UI("ui.Canvas"),
        "ui.SVG":JSFile_UI("ui.SVG"),
        "ui.Image":JSFile_UI("ui.Image"),
        "ui.Label":JSFile_UI("ui.Label"),
        "ui.Item":JSFile_UI("ui.Item"),
        "ui.ToolTip":JSFile_UI("ui.ToolTip"),	    
        "ui.CheckBox":[
            CSSFile_UI("ui.CheckBox"),
            JSFile_UI("ui.CheckBox")
        ],
        "ui.RadioBox":[
            CSSFile_UI("ui.RadioBox"),
            JSFile_UI("ui.RadioBox")
        ],
	    "ui.SpinBox":{
            basics:"ui.LineEdit",
            files:[
                CSSFile_UI("ui.SpinBox"),
                JSFile_UI("ui.SpinBox")
            ]
        },
        "ui.SwitchBox":[
            CSSFile_UI("ui.SwitchBox"),
            JSFile_UI("ui.SwitchBox")
        ],
        "ui.LineEdit":[
            CSSFile_UI("ui.Edit"),
            JSFile_UI("ui.Edit")
        ],
	    "ui.TextEdit":[
            CSSFile_UI("ui.Edit"),
            JSFile_UI("ui.Edit")
        ],
        "ui.DateTimeEdit":{
            basics:["ui.LineEdit","ui.DatePicker"],
            files:[
                CSSFile_UI("ui.DateTimeEdit"),
                JSFile_UI("ui.DateTimeEdit")
            ]
        },
        "ui.Button":[
            CSSFile_UI("ui.Button"),
            JSFile_UI("ui.Button")
        ],
        "ui.ColorPicker":[
            CSSFile_UI("ui.ColorPicker"),
            JSFile_UI("ui.ColorPicker")
        ],
        "ui.DatePicker":[
            CSSFile_UI("ui.DatePicker"),
            JSFile_UI("ui.DatePicker")
        ],
        "ui.List":{
            basics:"ui.Item",
            files:[
                CSSFile_UI("ui.List"),
                JSFile_UI("ui.List")
            ]
        },
        "ui.Menu":{
            basics:"ui.Item",
            files:[
                CSSFile_UI("ui.Menu"),
                JSFile_UI("ui.Menu")
            ]
        },
        "ui.MenuBar":[
            CSSFile_UI("ui.MenuBar"),
            JSFile_UI("ui.MenuBar")
        ],
        "ui.ComboBox":{
            basics:"ui.Item",
            files:[
                CSSFile_UI("ui.ComboBox"),
                JSFile_UI("ui.ComboBox")
            ]
        },
        "ui.ToolBar":{
            basics:[
                "ui.Button"
            ],
            files:[
                CSSFile_UI("ui.ToolBar"),
                JSFile_UI("ui.ToolBar")
            ]
        },
        "ui.Panel":{
            basics:[
                "ui.ToolBar"
            ],
            files:[
                CSSFile_UI("ui.Panel"),
                JSFile_UI("ui.Panel")
            ]
        },
        "ui.Window":{
            basics:[
                "ui.Panel","ui.Menu"
            ],
            files:[
                CSSFile_UI("ui.Window"),
                JSFile_UI("ui.Window")
            ]
        },
        "ui.MessageBox":[
            CSSFile_UI("ui.MessageBox"),
            JSFile_UI("ui.MessageBox")
        ],
        "ui.Pagination":{
            basics:"ui.ComboBox",
            files:[
                CSSFile_UI("ui.Pagination"),
                JSFile_UI("ui.Pagination")
            ]
        },
        "ui.Progress":[
            CSSFile_UI("ui.Progress"),
            JSFile_UI("ui.Progress")
        ],
        "ui.Accordion":{
            basics:[
                "ui.Item"
            ],
            files:[
                CSSFile_UI("ui.Accordion"),
                JSFile_UI("ui.Accordion")
            ]
        },
        "ui.TabPanel":{
            basics:[
                "ui.Button"
            ],
            files:[
                CSSFile_UI("ui.TabPanel"),
                JSFile_UI("ui.TabPanel")
            ]
        },
        "ui.Slider":[
            CSSFile_UI("ui.Slider"),
            JSFile_UI("ui.Slider")
        ],
        "ui.Tree":[
            CSSFile_UI("ui.Tree"),
            JSFile_UI("ui.Tree")
        ],
        "ui.DataGrid":[
            CSSFile_UI("ui.DataGrid"),
            JSFile_UI("ui.DataGrid")
        ],
        "ui.PropertyGird":[
            CSSFile_UI("ui.PropertyGrid"),
            JSFile_UI("ui.PropertyGrid")
        ],
        "ui.Video":[
            CSSFile_UI("ui.Video"),
            JSFile_UI("ui.Video")
        ],
        "ui.ImageCutter":{
            basics:[
                "ui.Slider","ui.Button"
            ],
            files:[
                JSFile_UI("ui.ImageCutter")
            ]
        },
	
	"ui.KindEditor":{
	    files:[
	       "ui/kindeditor/themes/default/default.css","ui/kindeditor/kindeditor-all-min.js","ui/kindeditor/kindeditor.js"
	    ]
	},
	
	
        "crypto.sha1":cryptoJS("sha1"),
        "crypto.sha256":cryptoJS("sha256"),
        "crypto.base64":cryptoJS("base64"),
        "crypto.md5":cryptoJS("md5"),
	    "crypto.md6":cryptoJS("md6"),
        "crypto.aes":{
            basics:[
                "crypto.base64"
            ],
            files:[
                cryptoJS("aes")
            ]
        }
    };
});