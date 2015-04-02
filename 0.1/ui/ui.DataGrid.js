/**
 * grid widget module
*/
Std.ui.module("DataGrid",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"clear selectionModeChange cellChange columnClick rowClick cellClick columnDblClick rowDblClick cellDblClick columnDropStart columnDropStop removeColumn removeRow updateRow dataSourceLoad",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_DataGrid",
        level:4,
        height:300,
        minWidth:120,
        minHeight:60,
        headerHeight:29,
        headerVisible:true,
        columnWidth:80,
        columnResizable:true,
        columnSortable:false,
        columnTextAlign:"left",
        columnDroppable:true,
        columnEditable:false,
        rowHeight:30,
        rowEditable:false,
        rowNumbers:false,
        rowCheckable:false,
        rowCollapsible:false,
        cellPadding:3,
        cellEditable:false,
        cellBorder:true,
        cellTextAlign:"left",
        cellDroppable:false,
        contextMenu:null,
        stripeRows:false,
        hoverMode:"row",     //row,cell
        selectionMode:"row", //row,rows,cell,cells,checkedRows,column,columns,none
        items:null,
        columns:null,
        dataSource:null,
        value:null
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * row count
        */
        rowCount:0,
        /*
         * column count
        */
        columnCount:0,
        /*
         * column positions
        */
        columnPositions:null,
        /*
         * lastRowBlock
        */
        lastRowBlock:null,
        /*
         * selected column
        */
        selectedColumn:null,
        /*
         * selected row
        */
        selectedRow:null,
        /*
         * selected row index
        */
        selectedRowIndex:null,
        /*
         * selected cell
        */
        selectedCell:null,
        /*
         * sort handle
        */
        sortHandle:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.updateRowBlocks();
            that.repaint();
            that.updateStyle();
            that.call_opts({
                contextMenu:null
            },true);
        },
        /*
         * height
        */
        height:function(height){
            var that    = this;
            var opts    = that.opts;
            var boxSize = that.boxSize;

            if(!isNumber(height)){
                height = that.height();
            }
            that[1].height(opts.headerHeight);
            that[2].height(height - boxSize.height - opts.headerHeight - 1);
        },
        /*
         * remove
         */
        remove:function(item){
            var that = this;

            if(item === undefined){
                that.CSSStyle.remove();
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init header
        */
        initHeader:function(){
            var that = this;
            var opts = that.opts;

            that[0].append(
                that[1] = newDiv("_header").append(
                    that.D.columns = newDiv("_columns")
                )
            );
            if(opts.columns !== null){
                that.appendColumn(opts.columns);
            }
            return that;
        },
        /*
         * init body
        */
        initBody:function(){
            var that = this;

            that[0].append(
                that[2] = newDiv("_body")
            );

            return that;
        },
        /*
         * init column positions
        */
        initColumnPositions:function(){
            var that = this;
            var opts = that.opts;

            that._columnPositions = [];

            for(var i=0,length=that._columns.length,lastColumnEndPos=0;i<length;i++){
                that._columnPositions.push({
                    begin:lastColumnEndPos,
                    end  :lastColumnEndPos = (isNumber(that._columns[i].width) ? lastColumnEndPos+that._columns[i].width : lastColumnEndPos+opts.columnWidth)
                });
            }
            return that._columnPositions;
        },
        /*
         * init scroll event
        */
        initScrollEvent:function(){
            var that  = this;
            var timer = null;

            that[2].on("scroll",function(){
                that[1].css("left",-this.scrollLeft());
            });
            that[2].on("scroll",function(){
                if(timer !== null){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    that.repaint();
                    timer = null;
                },5);
            });
            return that;
        },
        /*
         * init resize event
        */
        initColumnResizeEvent:function(column){
            var that      = this;
            var offset    = column.offset();
            var resizer   = newDiv("_resizer").appendTo(that[0]).css({
                left   : column.position().x - that[2].scrollLeft(),
                width  : column.offsetWidth(),
                height : that.height()
            });
            var mousemove = function(e){
                resizer.width(e.pageX - offset.x + 2);
            };
            Std.dom(document).on("mousemove",mousemove).once("mouseup",function(e){
                var width = resizer.outerWidth();
                var index = column.index();

                this.off("mousemove",mousemove);
                resizer.remove();
                that._columns[index].width = width;
                that.updateStyle();
            });
            return that;
        },
        /*
         * init column drop handle
        */
        initColumnDropHandle:function(columnElement){
            var that = this;
            var opts = that.opts;

            return newDiv().css({
                position:"absolute",
                cursor: "move",
                zIndex: Std.ui.status.zIndex+1,
                border:"1px solid " + columnElement.css("border-right-color"),
                paddingLeft:opts.cellPadding + 3,
                outerWidth : columnElement.outerWidth() + 1,
                outerHeight: columnElement.outerHeight() + 2,
                lineHeight:columnElement.height(),
                background:that[1].css("background-color"),
                color:columnElement.css("color"),
                fontSize:columnElement.css("font-size"),
                textAlign:opts.columnTextAlign
            }).html(columnElement.html()).appendTo("body");
        },
        /*
         * init column drop event
        */
        initColumnDropEvent:function(columnElement){
            var that        = this;
            var opts        = that.opts;
            var startX      = 0;
            var startY      = 0;
            var columnWidth = 0;
            var columnIndex = columnElement.index();
            var offset      = columnElement.offset();
            var movestart   = false;
            var moveHandle  = null;
            var headOffset  = 0;
            var columnPos   = that._columnPositions = that.initColumnPositions();
            var lastIndex   = null;
            var initHandle  = function(e){
                movestart   = true;
                moveHandle  = that.initColumnDropHandle(columnElement);

                startX      = offset.x - e.pageX - 1;
                startY      = offset.y - e.pageY - 1;
                headOffset  = that[1].offset();
                columnWidth = columnElement.outerWidth();
                that.emit("columnDropStart",[e.pageX,e.pageY],true);
            };
            var inRange    = function(e){
                return !(
                    e.pageX + startX + columnWidth < headOffset.x ||
                    e.pageX + startX > headOffset.x + that.width()
                    ||
                    e.pageY + startY + opts.headerHeight < offset.y ||
                    e.pageY + startY > headOffset.y + opts.headerHeight
                );
            };
            var computePos = function(e){
                for(var i=0,x=e.pageX+startX+columnWidth/2,length=columnPos.length;i<length;i++){
                    var begin   = columnPos[i].begin;
                    var end     = columnPos[i].end;
                    var offsetX = headOffset.x;

                    if(x < offsetX && e.pageX+startX+columnWidth > offsetX){
                        return 0;
                    }else if(x >= offsetX+begin && x<=offsetX+begin + (end-begin) / 2){
                        return i;
                    }else if(x >= offsetX+begin && x<=offsetX+end && x >= offsetX + begin + (end-begin) / 2){
                        return ++i;
                    }else if(i===length-1 && e.pageX+startX <= offsetX+end){
                        return ++i;
                    }
                }
                return -1;
            };
            var mousemove = function(e){
                if(movestart == false){
                    initHandle(e);
                }
                if(!inRange(e)){
                    that.hideColumnDropPosition();
                }else{
                    var index = computePos(e);
                    if(index !== -1 && index != lastIndex){
                        that.showColumnDropPosition(lastIndex = index);
                    }
                }
                moveHandle.css({left:e.pageX+startX,top:e.pageY + startY});
                e.preventDefault();
            };
            var animateBack = function(){
                moveHandle.animate({
                    to:{
                        left:offset.x,
                        top:offset.y,
                        opacity:0.5
                    }
                },300,function(){
                    moveHandle.remove();
                    moveHandle = null;
                });
            };

            Std.dom(document).on("mousemove",mousemove).once("mouseup",function(e){
                if(moveHandle !== null){
                    if(inRange(e)){
                        var index = computePos(e);
                        if(index !== -1 && index !== columnIndex){
                            that.moveColumn(columnIndex,index)
                        }
                        moveHandle.remove();
                        moveHandle = null;
                    }else{
                        animateBack();
                    }
                }
                this.off("mousemove",mousemove);
                that.emit("columnDropStop",[e.pageX,e.pageY],true).updateStyle();
                that.hideColumnDropPosition();
            });
        },
        /*
         * init header events
        */
        initHeaderEvents:function(){
            var that       = this;
            var opts       = that.opts;
            var mouseenter = function(e){
                var columnIndex = this.index();
                this.mouse({
                    auto:false,
                    dblclick:function(){
                        if(opts.columnEditable){
                            that.editColumn(this);
                        }
                        that.emit("columnDblClick",columnIndex);
                    },
                    down:function(e){
                        var selectionMode = opts.selectionMode;
                        if(opts.columnDroppable && e.which == 1){
                            that.initColumnDropEvent(this);
                            e.preventDefault();
                        }
                        if(selectionMode === "column"){
                            that.clearSelected(selectionMode);
                            that.selectColumn(this.index());
                        }
                    },
                    click:function(){
                        var sortType = that._columns[columnIndex].sortType;

                        switch(sortType){
                            case "asc":
                                sortType = "desc";
                                break;
                            case "desc":
                                sortType = "asc";
                                break;
                            default:
                                sortType = "asc";
                        }
                        if(opts.columnSortable){
                            that.sortColumn(columnIndex,sortType);
                        }
                        that.emit("columnClick",columnIndex);
                    }
                },e);
            };
            that.D.columns.on("mouseenter","._column",mouseenter).delegate("mouseenter","._column > ._resizeHandle",function(e){
                opts.columnResizable && this.mouse({
                    auto:false,
                    unselect:true,
                    down:function(){
                        that.initColumnResizeEvent(this.parent());
                        return false;
                    }
                },e);
            });
            return that;
        },
        /*
         * init cell events
        */
        initCellEvents:function(){
            var that        = this;
            var opts        = that.opts;
            var selectCells = function(cellPosition){
                if(!this.hasClass("selected")){
                    that.selectCell(cellPosition,this);
                }else if(cellPosition in that._selectedCell){
                    this.removeClass("selected");
                    delete that._selectedCell[cellPosition];
                }
            };
            that[2].delegate("mouseenter","._block > ._row > ._cell",function(e){
                var selectionMode = opts.selectionMode;
                var cellPosition  = null;
                var cell          = this.mouse({
                    auto:false,
                    classStatus:opts.hoverMode === "cell",
                    click:function(){
                        that.emit("cellClick",cellPosition);
                    },
                    dblclick:function(e){
                        if(opts.cellEditable){
                            that.editCell(this,function(text){
                                that.emit("cellChange",[cellPosition,text],true);
                            });
                        }
                        that.emit("cellDblClick",cellPosition);
                    },
                    down:function(e){
                        var startIndex      = cell.index();
                        var startRowIndex   = cell.parent().index();
                        var startBlockIndex = cell.parent("._block").index();

                        cellPosition = sprintf("%d:%d",startBlockIndex * 10 + startRowIndex,startIndex);

                        if(selectionMode === "cells" && e.ctrlKey){
                            if(selectionMode === "cells" && e.which === 1){
                                e.preventDefault();
                                that.cellsSelectStart(this,startBlockIndex,startRowIndex,startIndex);
                            }
                            selectCells.call(this,cellPosition);
                        }else if(selectionMode === "cells" || selectionMode === "cell"){
                            that.clearSelected("cell");
                            that.selectCell(cellPosition,this);
                        }
                    }
                },e);
            });
            return that;
        },
        /*
         * init row events
        */
        initRowEvents:function(){
            var that       = this;
            var opts       = that.opts;
            var selectRows = function(rowPosition){
                if(!this.hasClass("selected")){
                    that.selectRow(rowPosition,this);
                }else{
                    var index = that.rowIndex(rowPosition);
                    if(that._selectedRow[index]){
                        this.removeClass("selected");
                        delete that._selectedRow[index];
                    }
                }
            };

            that[2].delegate("mouseenter","._block > ._row",function(e){
                var startIndex,startBlockIndex,rowPosition;
                var selectionMode = opts.selectionMode;
                var row           = this.mouse({
                    auto:false,
                    classStatus:opts.hoverMode === "row",
                    click:function(){
                        that.emit("rowClick",rowPosition);
                    },
                    dblclick:function(){
                        that.emit("rowDblClick",rowPosition);
                    },
                    down:function(e){
                        startIndex      = row.index();
                        startBlockIndex = row.parent().index();
                        rowPosition     = sprintf("%d:%d",startBlockIndex,startIndex);

                        if(selectionMode === "rows" && e.ctrlKey){
                            if(e.which === 1){
                                e.preventDefault();
                                that.rowsSelectStart(row,startBlockIndex,startIndex);
                            }
                            selectRows.call(row,rowPosition);
                        }else if(selectionMode === "rows" || selectionMode === "row"){
                            that.clearSelected("row");
                            that.selectRow(rowPosition,row);
                        }
                    }
                },e);
            });

            return that;
        },
        /*
         * init body events
        */
        initBodyEvents:function(){
            var that = this;

            that.initScrollEvent();
            that.initRowEvents();
            that.initCellEvents();

            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].focussing(function(){
                that.addClass("focus");
            },function(){
                that.removeClass("focus");
            }).mouse();

            that.initHeaderEvents();
            that.initBodyEvents();

            return that;
        },
        /*
         * show column drop position
        */
        showColumnDropPosition:function(index){
            var that       = this;
            var opts       = that.opts;
            var headOffset = that[1].offset();
            var offsetLeft = headOffset.x - 6 + index + (index === that._columns.length ? that._columnPositions[index - 1].end : that._columnPositions[index].begin);
            var zIndex     = Std.ui.status.zIndex + 1;

            that.hideColumnDropPosition();
            that.D.columnPos1 = newDiv("StdUI_DataGrid_ColumnPosition _top").appendTo("body").css({
                top:headOffset.y - 12,
                left:offsetLeft,
                zIndex:zIndex
            });
            that.D.columnPos2 = newDiv("StdUI_DataGrid_ColumnPosition _bottom").appendTo("body").css({
                top:headOffset.y + opts.headerHeight,
                left:offsetLeft,
                zIndex:zIndex
            });
            return that;
        },
        /*
         * hide column drop position
        */
        hideColumnDropPosition:function(){
            var that = this;

            if(that.D.columnPos1){
                that.D.columnPos1.remove();
            }
            if(that.D.columnPos2){
                that.D.columnPos2.remove();
            }
            return that;
        },
        /*
         * create row html
        */
        createRowHtml:function(row,cell){
            var html         = "";
            var rowHtml      = "";
            var rowClass     = "_row";
            var rowClass_odd = rowClass + (this.opts.stripeRows ? " _odd" : "");

            for(var i=0;i<cell;i++){
                rowHtml += "<div class='_cell _cell"+i+"'></div>";
            }
            for(var y=0;y<row;y++){
                html += "<div class='" + (y%2==0 ? rowClass : rowClass_odd) + "'>"+rowHtml+"</div>";
            }
            return html;
        },
        /*
         * update Cell
        */
        paintCell:function(element,data){
            if(isString(data) || isNumber(data)){
                element.innerHTML = data;
            }else if(isObject(data)){
                if(isWidget(data) || data.ui){
                    Std.dom(element).widget(data);
                }else{
                    Std.dom(element).set(data);
                }
            }
            return element;
        },
        /*
         * refresh column class
        */
        resetColumnClass:function(startIndex){
            var that    = this;
            var columns = that._columns;

            for(var i=startIndex || 0,length=columns.length;i<length;i++){
                columns[i].element.className("_column _column"+i);
            }
            return that;
        },
        /*
         * paint cell
        */
        paintRow:function(rowIndex,blockID,rowElement,rowData){
            var that     = this;
            var cells    = [];
            var rowCells = rowData.cells;

            if(!isArray(rowCells) && isObject(rowCells)){
                var cellsArray = new Array(that._columnCount);
                for(var name in rowCells){
                    var columnIndex = that.column(name);
                    if(columnIndex !== -1){
                        cellsArray[columnIndex] = rowCells[name];
                    }
                }
                rowCells = cellsArray;
            }
            for(var y=0,children=rowElement.childNodes,cellCount=children.length;y<cellCount;y++){
                if(!rowData || !rowCells[y]){
                    continue;
                }
                cells[y] = that.paintCell(children[y],rowCells[y]);
            }

            return {row:rowElement,cells:cells,blockID:blockID};
        },
        /*
         * edit cell
        */
        editCell:function(cell,callback){
            var that     = this;
            var position = cell.position();
            var input    = newDom("input","_input").value(cell.text()).on({
                blur:function(){
                    var value = this.value();
                    cell.html(value);
                    input.remove();
                    Std.func(callback).call(that,value)
                },
                keypress:function(e){
                    if(e.keyCode === 13){
                        this.blur();
                    }
                }
            }).appendTo(this[2]).css({
                top  : position.y + that[2].scrollTop(),
                left : position.x + that[2].scrollLeft(),
                outerWidth  : cell.outerWidth(),
                outerHeight : cell.outerHeight()
            });

            setTimeout(input.focus.bind(
                input.lineHeight(input.height())
            ),10);

            return that;
        },
        /*
         * edit column
        */
        editColumn:function(column){
            var that     = this;
            var position = column.position();
            var input    = newDom("input","_input").value(column.text()).on({
                blur:function(){
                    var text       = this.value();
                    var columnData = that._columns[column.index()];

                    Std.dom("._client",column).html(columnData.text = text);
                    input.remove();
                },
                keypress:function(e){
                    if(e.keyCode === 13){
                        this.blur();
                    }
                }
            }).appendTo(this[1]).css({
                top  : position.y + that[1].scrollTop(),
                left : position.x + that[1].scrollLeft(),
                outerWidth  : column.outerWidth(),
                outerHeight : column.outerHeight()
            });

            setTimeout(input.focus.bind(
                input.lineHeight(input.height())
            ),10);

            return that;
        },
        /*
         * edit row
        */
        editRow:function(){
            var that = this;


            return that;
        },
        /*
         * rows select start
        */
        rowsSelectStart:function(startElement,startBlockIndex,startIndex){
            var that         = this;
            var rowSelector  = "._block > ._row";
            var selectedRows = {};

            var mouseenter = function(e){
                Std.each(selectedRows,function(i,row){
                    if(i in that._selectedRow){
                        delete that._selectedRow[i];
                    }
                    row.removeClass("selected");
                    delete selectedRows[i];
                });

                var current             = this;
                var current_index       = current.index();
                var current_blockIndex  = current.parent().index();
                var from_index          = startIndex;
                var from_blockIndex     = startBlockIndex;

                if(current_blockIndex < from_blockIndex || (current_blockIndex == from_blockIndex && current_index < from_index)){
                    current_index      ^= from_index;
                    from_index         ^= current_index;
                    current_index      ^= from_index;

                    from_blockIndex    ^= current_blockIndex;
                    current_blockIndex ^= from_blockIndex;
                    from_blockIndex    ^= current_blockIndex;
                }

                for(var i=from_blockIndex;i<=current_blockIndex;i++){
                    var rows     = Std.dom(that._rowBlocks[i]).children();
                    var length   = rows.length;
                    var startPos = 0;
                    var endPos   = length - 1;

                    if(i === from_blockIndex){
                        startPos = from_index;
                        if(from_blockIndex === current_blockIndex){
                            endPos = current_index;
                        }
                    }else if(i === current_blockIndex){
                        startPos = 0;
                        endPos   = current_index;
                    }
                    for(var y=startPos;y<=endPos;y++){
                        selectedRows[i*10 + y] = rows[y];
                    }
                }

                Std.each(selectedRows,function(i,row){
                    row.addClass("selected");
                });
            };

            Std.dom(document).once("mouseup",function(){
                Std.each(selectedRows,function(i,row){
                    that.selectRow(~~i,row);
                });
                that[2].off("mouseenter",rowSelector,mouseenter);
            });

            that[2].delegate("mouseenter",rowSelector,mouseenter);

            return that;
        },
        /*
         * cells select start
        */
        cellsSelectStart:function(startElement,startBlockIndex,startRowIndex,startIndex){
            var that          = this;
            var cellSelector  = "._block > ._row > ._cell";
            var selectedCells = {};

            var mouseenter = function(e){
                Std.each(selectedCells,function(i,cell){
                    if(i in that._selectedCell){
                        delete that._selectedCell[i];
                    }
                    cell.removeClass("selected");
                    delete selectedCells[i];
                });

                var current             = this;
                var currentRow          = current.parent();
                var current_index       = current.index();
                var current_rowIndex    = currentRow.index();
                var current_blockIndex  = currentRow.parent().index();
                var from_index          = startIndex;
                var from_rowIndex       = startRowIndex;
                var from_blockIndex     = startBlockIndex;

                if(current_index < from_index){
                    current_index      ^= from_index;
                    from_index         ^= current_index;
                    current_index      ^= from_index;
                }
                if(current_blockIndex < from_blockIndex || (current_blockIndex == from_blockIndex && current_rowIndex < from_rowIndex)){
                    current_rowIndex   ^= from_rowIndex;
                    from_rowIndex      ^= current_rowIndex;
                    current_rowIndex   ^= from_rowIndex;

                    from_blockIndex    ^= current_blockIndex;
                    current_blockIndex ^= from_blockIndex;
                    from_blockIndex    ^= current_blockIndex;
                }

                for(var i=from_blockIndex;i<=current_blockIndex;i++){
                    var rows     = Std.dom(that._rowBlocks[i]).children();
                    var length   = rows.length;
                    var startPos = 0;
                    var endPos   = length - 1;

                    if(i === from_blockIndex){
                        startPos = from_rowIndex;
                        if(from_blockIndex === current_blockIndex){
                            endPos = current_rowIndex;
                        }
                    }else if(i === current_blockIndex){
                        startPos = 0;
                        endPos   = current_rowIndex;
                    }

                    for(var y=startPos;y<=endPos;y++){
                        var cells = rows[y].children();
                        for(var z=from_index;z<=current_index;z++){
                            selectedCells[i*10 + y + ":" + z] = cells[z];
                        }
                    }
                }
                Std.each(selectedCells,function(i,cell){
                    cell.addClass("selected");
                });
            };

            Std.dom(document).once("mouseup",function(){
                Std.each(selectedCells,function(i,row){
                    that.selectCell(i,row);
                });
                that[2].off("mouseenter",cellSelector,mouseenter);
            });
            that[2].delegate("mouseenter",cellSelector,mouseenter);
            return that;
        },
        /*
         * update row blocks
        */
        updateRowBlocks:function(){
            var that      = this;
            var rowCount  = that._rowCount;
            var rowBlocks = that._rowBlocks;
            var fragment  = document.createDocumentFragment();

            for(var i=0,length=Math.ceil(rowCount / 10) - rowBlocks.length;i<length;i++){
                var block       = document.createElement("div");
                block.className = "_block _block"+i;

                fragment.appendChild(block);
                rowBlocks.push(block);
            }
            that[2].dom.appendChild(fragment);

            if(that._lastRowBlock !== null){
                Std.dom(that._lastRowBlock).removeStyle("height");
            }

            var lastBlock = Std.dom(rowBlocks[rowBlocks.length-1]);

            if(lastBlock !== null){
                that._lastRowBlock = lastBlock.height(
                    (that._rowCount - (rowBlocks.length-1) * 10) * (that.opts.rowHeight)
                ).dom;
            }
            return that;
        },
        /*
         * update style
        */
        updateStyle:function(){
            var that        = this;
            var opts        = that.opts;
            var CSSData     = {};
            var bodyWidth   = 0;
            var gridWidth   = that.width() - that.boxSize.width;
            var rowHeight   = opts.rowHeight - 1;
            var blockHeight = (rowHeight + 1) * 10 + "px";
            var cellHeight  = rowHeight - opts.cellPadding * 2;

            var columnData  = {
                "._column":{
                    textAlign:opts.columnTextAlign,
                    height:opts.headerHeight - 1 + "px",
                    lineHeight:opts.headerHeight - 1 + "px",
                    '>':{
                        "._sortType":{
                            marginTop:(opts.headerHeight - 7) / 2 + "px"
                        }
                    }
                }
            };
            var cellData    = {
                "._cell":{
                    padding:opts.cellPadding + "px",
                    height:cellHeight + "px",
                    lineHeight:cellHeight + "px",
                    textAlign:opts.cellTextAlign
                }
            };

            for(var i=0,length=that._columnCount;i<length;i++){
                var column = that._columns[i];
                var width  = (column.width || opts.columnWidth) - 1 + "px";

                columnData["._column" + i] = {
                    width:width
                };
                cellData["._cell" + i] = {
                    width:(column.width || opts.columnWidth) - opts.cellPadding * 2 + "px"
                };
                bodyWidth += (column.width || opts.columnWidth) + 1;
            }

            if(bodyWidth < gridWidth){
                bodyWidth = "100%";
            }else{
                bodyWidth += "px";
            }

            var rowStyles = {
                height:rowHeight + "px",
                lineHeight:rowHeight + "px",
                '>':cellData
            };

            CSSData[".StdUI_DataGrid.StdUI_" + that.objectName] = {
                '>':{
                    "._header":{
                        '>':{
                            "._columns":{
                                '>':columnData
                            }
                        }
                    },
                    "._body":{
                        '>':{
                            "._block":{
                                width:bodyWidth,
                                height:blockHeight
                            },
                            "._block > ._row":rowStyles
                        }
                    }
                }
            };

            if(opts.cellBorder === false){
                cellData["._cell"].borderColor = rowStyles.borderColor = "transparent";
            }
            that.CSSStyle.clear().append(CSSData);
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * data source
        */
        dataSource:function(dataSource){
            return this.opt("dataSource",dataSource,function(){
                this.reload();
            });
        },
        /*
         * row
        */
        row:function(pos){
            return this._rows[this.rowIndex(pos)];
        },
        /*
         * cell
        */
        cell:function(rowPos,cellPos){
            var that = this;

            if(isString(rowPos)){
                var data = rowPos.split(":");
                rowPos  = ~~data[0];
                cellPos = ~~data[1];
            }
            var cells = this._rows[rowPos].cells;
            if(!isArray(cellPos) && isObject(cells)){
                cellPos = that._columns[cellPos].name;
            }
            return cells[cellPos];
        },
        /*
         * column
        */
        column:function(pos){
            var that = this;

            if(isNumber(pos)){
                return that._columns[pos];
            }else if(isString(pos)){
                for(var i=0;i<that._columnCount;i++){
                    if(pos === that._columns[i].name){
                        return i;
                    }
                }
            }
            return -1;
        },

        /*
         * columnResizable
        */
        columnResizable:function(state){
            return this.opt("columnResizable",state);
        },
        /*
         * selection mode
        */
        selectionMode:function(mode){
            return this.opt("selectionMode",mode,function(){
                this.emit("selectionModeChange",mode);
            });
        },
        /*
         * column draggable
        */
        columnDroppable:function(droppable){
            return this.opt("columnDroppable",droppable);
        },
        /*
         * column sortable
        */
        columnSortable:function(sortable){
            return this.opt("columnSortable",sortable);
        },
        /*
         * column text align
        */
        columnTextAlign:function(value){
            return this.opt("columnTextAlign",value,function(){
                this.updateStyle();
            });
        },
        /*
         * stripe rows
        */
        stripeRows:function(state){
            return this.opt("stripeRows",state,function(){
                this.refresh();
            });
        },
        /*
         * header visible
        */
        headerVisible:function(state){
            var that = this;

            return that.opt("headerVisible",state,function(){
                that[1].visible(state);
            });
        },
        /*
         * row numbers
        */
        rowNumbers:function(state){
            var that = this;
            var doms = that.D;

            return that.opt("rowNumbers",state,function(){
                that.renderState && that.updateStyle();
            });
        },
        /*
         * get row index
        */
        rowIndex:function(pos){
            if(isString(pos)){
                var length = (pos = pos.split(':')).length;
                if(length == 1){
                    pos = ~~pos[0];
                }else if(length == 2){
                    pos = ~~pos[0] * 10 + ~~pos[1];
                }
            }
            return pos;
        },
        /*
         * row checkable
        */
        rowCheckable:function(){
            var that = this;

            return that;
        },
        /*
         * row count
        */
        /*
        rowCount:function(value){
            var that = this;

            if(value === undefined){
                return that._rowCount;
            }
            if(value === that._rowCount){
                return that;
            }

            that._rowCount = value;
            that.updateRowBlocks();
            that.repaint();

            return that;
        },
        */
        /*
         *  context menu plugin
        */
        contextMenu:function(menu){
            var that = this;

            that.plugin("contextMenu",Std.extend({
                handle:that[2]
            },menu));

            return that;
        },
        /*
         * repaint
        */
        repaint:function(){
            var that        = this;
            var opts        = that.opts;
            var scrollTop   = that[2].dom.scrollTop;
            var blockHeight = opts.rowHeight * 10;
            var beginBlock  = Math.floor(scrollTop / blockHeight);
            var blockNumber = Math.ceil((that.height() - that.boxSize.height - opts.headerHeight - 1) / blockHeight  + (scrollTop / blockHeight % 1));

            for(var i=0;i<blockNumber;i++){
                var blockID = beginBlock + i;
                var block   = that._rowBlocks[blockID];

                if(!block || block.childNodes.length !== 0){
                    continue;
                }
                var rowCount  = block === that._lastRowBlock ? that._rowCount - blockID * 10 : 10;
                var blockHtml = that.createRowHtml(rowCount,that._columnCount);
                var fragment  = Std.dom.fragment(blockHtml);

                for(var y=0,rows=fragment.childNodes,length=rows.length;y<length;y++){
                    that.paintRow(blockID * 10 + y,blockID,rows[y],that._rows[blockID * 10 + y]);
                }
                block.appendChild(fragment);
            }
            return that;
        },
        /*
         * move column
        */
        moveColumn:function(from,to){
            var that    = this;
            var columns = that._columns;

            if(to === columns.length){
                columns[from].element.insertAfter(columns[to-1].element);
            }else{
                columns[from].element.insertBefore(columns[to].element);
            }
            columns.move(from,to > from ? --to : to);

            for(var i=0;i<that._rowCount;i++){
                var cells = that._rows[i].cells;

                if(isArray(cells)){
                    cells.move(from,to);
                }
            }
            return that.resetColumnClass().refresh();
        },
        /*
         * swap column
        */
        swapColumn:function(sourceIndex,targetIndex){
            var that    = this;
            var columns = that._columns;

            columns[sourceIndex].element.swap(columns[targetIndex].element);
            columns.swap(sourceIndex,targetIndex);

            for(var i=0;i<that._rowCount;i++){
                var cells = that._rows[i].cells;

                if(isArray(cells)){
                    cells.swap(sourceIndex,targetIndex);
                }
            }
            return that.resetColumnClass().refresh();
        },
        /*
         * insert column
        */
        insertColumn:function(column,index){
            var that    = this;
            var text    = "";
            var name    = "";
            var width   = null;
            var element = newDiv("_column _column" + that._columnCount);
            var columns = that._columns;

            if(isString(column)){
                text  = column;
            }else if(isObject(column)){
                text  = column.text  || "column" + that._columnCount;
                name  = column.name  || null;
                width = column.width || null;
            }

            var columnData = {
                name:name,
                text:text,
                width:width,
                element:element.append([
                    newDiv("_client").html(text),
                    newDiv("_resizeHandle")
                ])
            };

            if(index != null && index < that._columnCount){
                element.insertBefore(columns[index].element);
                columns.insert(columnData,index);
            }else{
                that.D.columns.append(element);
                columns.push(columnData);
            }
            that._columnCount++;

            return that;
        },
        /*
         * sort column
        */
        sortColumn:function(columnIndex,type){
            var that     = this;
            var column   = that._columns[columnIndex];
            var getIndex = function(cells,index){
                if(isArray(cells)){
                    return index;
                }
                return column.name;
            };
            if(that._sortHandle !== null){
                that._sortHandle.remove();
            }
            if(type === "desc"){
                that._rows.sort(function(x,y){
                    return x.cells[getIndex(x.cells,columnIndex)] < y.cells[getIndex(y.cells,columnIndex)];
                });
            }else if(type === "asc"){
                that._rows.sort(function(x,y){
                    return x.cells[getIndex(x.cells,columnIndex)] > y.cells[getIndex(y.cells,columnIndex)];
                });
            }
            column.sortType = type;
            column.element.append(
                that._sortHandle = newDiv("_sortType" + (type ? " _" + type : ""))
            );
            return that.refresh();
        },
        /*
         * select row
        */
        selectRow:function(pos,row){
            var that        = this;
            var rowIndex    = -1;
            var selectedRow = that._selectedRow;

            if(pos === undefined){
                return selectedRow;
            }
            if(isString(row) && pos === undefined){
                rowIndex = that.rowIndex(row);
            }else if(isString(pos)){
                rowIndex = that.rowIndex(pos);
            }else if(isNumber(row)){
                rowIndex = row;
            }else{
                rowIndex = pos;
            }

            if(!isObject(row)){
                row = that._rowBlocks[Math.floor(rowIndex / 10)].children(rowIndex % 10);
            }
            if(row && !(rowIndex in selectedRow)){
                selectedRow[rowIndex] = row.addClass("selected");
            }
            return that;
        },
        /*
         * selectedRow
        */
        selectedRow:function(){
            var that          = this;
            var selectedRow   = that._selectedRow;
            var selectionMode = that.selectionMode();

            if(selectionMode == "row"){
                for(var name in selectedRow){
                    return name;
                }
            }else if(selectionMode == "rows"){
                var list = [];
                for(var name in selectedRow){
                    list.push(name);
                }
                return list;
            }
            return null;
        },
        /*
         * select cell
        */
        selectCell:function(index,cell){
            var that         = this;
            var selectedCell = that._selectedCell;
            var cellIndex    = -1;

            if(index === undefined){
                if(that.selectionMode() == "cell"){
                    for(var name in selectedCell){
                        return selectedCell[name];
                    }
                }
                return selectedCell;
            }
            if(isString(index)){
                cellIndex = index.split(':');
            }
            if(!isObject(cell)){
                var row = that._rowBlocks[Math.floor(cellIndex[0] / 10)].children(cellIndex[0] % 10);
                cell = row.children(cellIndex[1]);
            }
            if(cell && !(index in selectedCell)){
                selectedCell[index] = cell.addClass("selected");
            }
            return that;
        },
        /*
         * selected cell
        */
        selectedCell:function(){
            var that          = this;
            var selectedCell  = that._selectedCell;
            var selectionMode = that.selectionMode();

            if(selectionMode == "cell"){
                for(var name in selectedCell){
                    return selectedCell[name];
                }
            }else if(selectionMode == "cells"){
                var list = [];
                for(var name in selectedCell){
                    list.push(name);
                }
                return list;
            }
            return null;
        },
        /*
         * select column
        */
        selectColumn:function(index){
            var that           = this;
            var columns        = that._columns;
            var selectedColumn = that._selectedColumn;

            if(!(index in selectedColumn)){
                selectedColumn[index] = columns[index];
                selectedColumn[index].element.addClass("selected");
            }
            return that;
        },
        /*
         * merge cell
        */
        mergeCells:function(rowIndex,cellIndex1,cellIndex2){
            var that = this;

            return that;
        },
        /*
         * update cell
        */
        updateCell:function(index,data){
            var that = this;

            if(isString(index)){
                index = index.split(':');
                that._rows[index[0]].cells[index[1]] = data;
            }else if(isObject(index)){
                for(var name in index){
                    data = index[name];
                    that._rows[(name = name.split(':'))[0]].cells[name[1]] = data;
                }
            }
            return that.refresh();
        },
        /*
         * update row
        */
        updateRow:function(index,data){
            var that = this;

            if(isNumber(index)){
                that._rows[index] = data;
            }else if(isObject(index)){
                for(var name in index){
                    that._rows[~~name] = data;
                }
            }
            return that.refresh();
        },
        /*
         * append column
        */
        appendColumn:Std.func(function(column){
            return this.insertColumn(column);
        },{
            each:[isArray]
        }),
        /*
         * insert row
        */
        insertRow:Std.func(function(row){

        },{
            each:[isArray]
        }),
        /*
         * append row
        */
        appendRow:function(row){
            var that  = this;

            if(isArray(row)){
                that._rows.mergeArray(row);
                that._rowCount += row.length;
            }else if(isObject(row) && "cells" in row){
                that._rows.push(row);
                that._rowCount++;
            }
            return that.refresh();
        },
        /*
         * refresh
        */
        refresh:function(){
            var that = this;

            that.clearRowBlocks();
            that.updateRowBlocks();

            return that.repaint();
        },
        /*
         * reload
        */
        reload:function(){
            var that       = this;
            var opts       = that.opts;
            var dataSource = opts.dataSource;
            var read       = dataSource.read;

            if(dataSource && dataSource.type === "ajax" && isObject(read)){
                that.clear();
                Std.ajax.json({
                    url:read.url,
                    data:read.data,
                    type:read.type || "get",
                    success:function(responseJSON){
                        that.appendRow(Std.mold.dataPath(responseJSON,read.dataPath));
                        that.emit("dataSourceLoad",responseJSON);
                    }
                });
            }
            if(that.renderState){
                that.refresh();
            }
            return that;
        },
        /*
         * remove column
        */
        removeColumn:function(data){
            var that    = this;
            var columns = that._columns;

            if(isNumber(data) && that._columnCount > data){
                var column = columns[data];
                var index  = columns.indexOf(column);

                for(var i=0;i<that._rowCount;i++){
                    that._rows[i].cells.remove(index);
                }
                column.element.remove();
                columns.remove(index);

                that.resetColumnClass(data);
            }
            that._columnCount = that._columns.length;

            return that.refresh().emit("removeColumn",data);
        },
        /*
         * remove row
        */
        removeRow:function(row){
            var that = this;

            if(row === "select"){
                var indexs = [];
                Std.each(that._selectedRow,function(index){
                    indexs.push(~~index);
                    that._rowCount--;
                });
                that._rows.remove(indexs);
            }else if(isNumber(row)){
                that._rows.remove(row);
                that._rowCount = that._rows.length;
            }
            return that.refresh().emit("removeRow",row);
        },
        /*
         * clear selected
        */
        clearSelected:Std.func(function(type){
            var that = this;

            switch(type){
                case undefined:
                    that.clearSelected("column row cell");
                    break;
                case "column":
                    Std.each(that._selectedColumn,function(i,column){
                        column.element.removeClass("selected");
                        delete that._selectedColumn[i];
                    });
                    break;
                case "row":
                    Std.each(that._selectedRow,function(i,row){
                        row.removeClass("selected");
                        delete that._selectedRow[i];
                    });
                    break;
                case "cell":
                    Std.each(that._selectedCell,function(i,cell){
                        cell.removeClass("selected");
                        delete that._selectedCell[i];
                    });
                    break;
            }
            return that;
        },{
            each:[isArray,isString]
        }),
        /*
         * clear
        */
        clear:function(){
            var that = this;

            that._rowCount = 0;
            that._rows.clear();
            that.clearRowBlocks();

            return that.emit("clear");
        },
        /*
         * clearRowBlocks
        */
        clearRowBlocks:function(){
            var that = this;

            that._rowBlocks.clear();
            that._lastRowBlock = null;
            that.clearSelected();
            that[2].clear();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.addClass("StdUI_" + that.objectName);
        that.D               = {};
        that.CSSStyle        = new Std.css;
        that._rows           = [];
        that._columns        = [];
        that._rowBlocks      = [];
        that._selectedColumn = {};
        that._selectedRow    = {};
        that._selectedCell   = {};

        that.initHeader();
        that.initBody();
        that.initEvents();
        that.call_opts({
            rowNumbers:false,
            dataSource:null
        },true);

        if(isArray(opts.items)){
            that._rows.mergeArray(opts.items);
            that._rowCount += opts.items.length;
        }
    }
});