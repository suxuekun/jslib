(function(_global){
	var RADIUS_FACTOR = 0.78;
	var BASECOLOR = 255<<16;
	var deepExtend = function(target, source) {
		for ( var key in source) {
			var s = source[key];
			var t = target[key];
			if (s && typeof (s) == 'object') {// object or array
				if (!t) {
					t = s.constructor();
				}
				deepExtend(t, s);
			} else {
				t = source[key];// function or normal attr
			}
			target[key] = t;
		}
	}
	var DefaultOption = {
		fontSize:15,
		padding:4,
		paddingTB:4,
		textTopFix:3,
		bold:true,
		fontFamily:"Times New Roman",
		labelZ:20,
		pointerZ:30,
		heatmapZ:10,
		pointerAlpha:0.2,
		pointerColor:"black",
		pointerTextColor:"white",
		lineColor:"white",
		sumTotalRow:false,
		sumTotalRowLabel:"Total",
		sumTotalRowLineColor:"black",
		sumTotalCol:false,
		sumTotalColLabel:"Total",
		sumTotalColLineColor:"black",
		heatColorAlpha:0.8,
		heatColorUInt:0xff0000,
		minWidthText:"0000",
	}
	

	var getCellRect = function(tableHeatmap,i,j){
		var info = tableHeatmap.info;
		var option = tableHeatmap.option;
		var lineH = option.fontSize +2*option.paddingTB;
		var lineW = info.widths[j];

		var x = info.lefts[j];
		var y = i*lineH;

		x+=info.offsetX;
		y+=info.offsetY;
		return {
			left:x,
			top:y,
			width:lineW,
			height:lineH,
		}
	}
	var getColor = function(value,max,baseColor,alpha){
		if (baseColor == null){
			baseColor = BASECOLOR;
		}
		var r = baseColor>>16 & 0xff;
		var g = baseColor>>8 & 0xff;
		var b = baseColor>>0 & 0xff;

		var percent = value/max;
		var ra = 255-percent *(255-r);
		var rg = 255-percent *(255-g);
		var rb = 255-percent *(255-b);
		ra = ra>>0;
		rg = rg>>0;
		rb = rb>>0;
		var color = "rgba("+ra+","+rg+","+rb+","+alpha+")";
		return color;
	}

	var getXY = function(tableHeatmap,i,j){
		var info = tableHeatmap.info;
		var option = tableHeatmap.option;
		var lineH = option.fontSize +2*option.paddingTB;
		var lineW = info.widths[j];

		var x = lineW/2 + info.lefts[j];
		var y = lineH/2 + i*lineH;

		x+=info.offsetX;
		y+=info.offsetY;
		return {
			x:x,
			y:y,
		}
	}
	var drawLabel = function(tableHeatmap){

		var option = tableHeatmap.option;
		var info = tableHeatmap.info;
		var data = tableHeatmap.data;
		var labelx = data.labelx;
		var labely = data.labely;
		var ctx = tableHeatmap.labelLayer.getContext();
		var bold = "";
		if (bold){
			bold = "bold "
		}
		ctx.font= bold + option.fontSize + "px " + option.fontFamily;

		ctx.save();
		ctx.strokeStyle = option.lineColor;
		ctx.beginPath();
		var lineH = option.fontSize + 2*option.paddingTB;
		for (var i =0;i<info.counti;i++){
			var y = i*lineH + info.offsetY;
			y = y>>0;
			y += 0.5;
			ctx.moveTo(0,y);
			ctx.lineTo(ctx.canvas.clientWidth,y);
		}
		for (var j=0;j<info.countj;j++){
			var x = info.lefts[j] + info.offsetX;
			x = x>>0;
			x+=0.5;
			ctx.moveTo(x,0)
			ctx.lineTo(x,ctx.canvas.clientHeight);
		}
		ctx.stroke();
		ctx.restore();
		for (var i =0;i<info.counti;i++){
			var txt = labely[i];
			var tempPos = (i+1)*lineH + info.offsetY - option.textTopFix - option.paddingTB;
			ctx.fillText(txt,0,tempPos);
		}
		
		ctx.save();
		ctx.rotate(Math.PI/2);
		for (var j=0;j<info.countj;j++){

			var txt = labelx[j];
			var tempPos = -(info.lefts[j] + info.offsetX +(info.widths[j] -lineH)/2 + option.textTopFix + option.paddingTB);
			ctx.save();
			ctx.fillText(txt,0,tempPos);
			ctx.restore();
		}
		ctx.restore();
		//total
		if (option.sumTotalCol){
			var txt = option.sumTotalColLabel;
			var tempPos = info.totalPos.top + info.totalPos.height - option.textTopFix  - option.paddingTB;
			ctx.fillText(txt,0,tempPos);
			var y = info.totalPos.top;
			y = y>>0;
			y+=0.5;
			ctx.save();
			ctx.strokeStyle = option.sumTotalColLineColor;
			ctx.beginPath();
			ctx.moveTo(0,y);
			ctx.lineTo(ctx.canvas.clientWidth,y);
			ctx.stroke();
			ctx.restore();
		}
		
		if (option.sumTotalRow){
			var txt = option.sumTotalRowLabel;
			var tempPos = -(info.totalPos.left + (info.totalPos.width -lineH)/2 + option.textTopFix  - option.paddingTB);
			ctx.save();
			ctx.rotate(Math.PI/2);
			ctx.fillText(txt,0,tempPos);
			ctx.restore();
			var x = info.totalPos.left;
			x = x>>0;
			x+=0.5;
			ctx.save();
			ctx.strokeStyle = option.sumTotalColLineColor;
			ctx.beginPath();
			ctx.moveTo(x,0);
			ctx.lineTo(x,ctx.canvas.clientHeight);
			ctx.stroke();
			ctx.restore();
		}
	}
	var drawHeatmap = function(tableHeatmap){
		var option = tableHeatmap.option;
		var info = tableHeatmap.info;
		var data = tableHeatmap.data;
		var labelx = data.labelx;
		var labely = data.labely;
		var baseColor = option.heatColorUInt;
		var baseColorAlpha = option.heatColorAlpha;
		var ctx = tableHeatmap.heatLayer.getContext();
		var bold = "";
		if (bold){
			bold = "bold "
		}
		ctx.font= bold + option.fontSize + "px " + option.fontFamily;
		for (var i=0;i<info.counti;i++){
			for (var j=0;j<info.countj;j++){
				var value = data.data[i][j];
				if (!value || value <=0) value = 0;
				var max = info.maxData;
				var rect = getCellRect(tableHeatmap,i,j);
				var color = getColor(value,max,baseColor,baseColorAlpha);
				ctx.save();
				ctx.fillStyle = color;
				ctx.fillRect(rect.left,rect.top,rect.width,rect.height);
				ctx.restore();
				ctx.save();
				ctx.fillText(value,rect.left+option.padding,rect.top+rect.height - option.textTopFix - option.paddingTB);
				ctx.restore();
			}
		}
		if (option.sumTotalCol){
			for (var j=0;j<info.countj;j++){
				var value = info.colSum[j];
				var rect = getCellRect(tableHeatmap,0,j);
				ctx.save();
				ctx.fillText(value,rect.left+option.padding,info.totalPos.top+info.totalPos.height - option.textTopFix  - option.paddingTB);
				ctx.restore();
			}
		}
		if (option.sumTotalRow){
			for (var i=0;i<info.counti;i++){
				var value = info.rowSum[i];
				var rect = getCellRect(tableHeatmap,i,0);
				ctx.save();
				ctx.fillText(value,info.totalPos.left+option.padding,rect.top+rect.height - option.textTopFix - option.paddingTB);
				ctx.restore();
			}
		}
		if (option.sumTotalCol && option.sumTotalRow){
			var value = info.sumTotal;
			ctx.save();
			ctx.fillText(value,info.totalPos.left+option.padding,info.totalPos.top+info.totalPos.height - option.textTopFix  - option.paddingTB);
			ctx.restore();
		}
	}
	var drawPointer = function(tableHeatmap){
		var info = tableHeatmap.info;
		var data = tableHeatmap.data;
		var option = tableHeatmap.option;
		var ctx = tableHeatmap.pointerLayer.getContext();
		var bold = "";
		if (bold){
			bold = "bold "
		}
		ctx.font= bold + option.fontSize + "px " + option.fontFamily;

		var i = info.i;
		var j = info.j;
		var lineW = info.widths[j];
		var lineH = option.fontSize + 2* option.paddingTB;
		var pos = getXY(tableHeatmap,i,j)
		var x = pos.x;
		var y = pos.y;
		ctx.save();
		ctx.globalAlpha = option.pointerAlpha;
		ctx.beginPath();
		ctx.lineWidth = lineH;
		ctx.strokeStyle = option.pointerColor;
		ctx.moveTo(0,y);
		ctx.lineTo(ctx.canvas.clientWidth,y);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = lineW;
		ctx.strokeStyle = option.pointerColor;
		ctx.moveTo(x,0);
		ctx.lineTo(x,ctx.canvas.clientHeight);
		ctx.stroke();
		ctx.restore();

		var rect = getCellRect(tableHeatmap,i,j);
		var value = data.data[i][j];
		if (!value || value <0) value = 0;
		ctx.save();
		ctx.fillStyle = option.pointerTextColor;
		ctx.fillText(value,rect.left+option.padding,rect.top+rect.height - option.textTopFix  - option.paddingTB);
		ctx.restore();
	}

	var TableHeatmap = function(option){
		this.setOption(option);
		this.data = null
		this.parent = null;
		this.layerManager = new _global.wilasCanvasLite.LayerManager();
		var layerManager = this.layerManager;
		this.labelLayer = layerManager.createLayer("labelLayer");
		this.pointerLayer = layerManager.createLayer("pointerLayer");
		this.heatLayer = layerManager.createLayer("heatLayer");

		this.labelLayer.tableHeatmap = this;
		this.pointerLayer.tableHeatmap = this;
		this.heatLayer.tableHeatmap = this;
		layerManager.anime.start();

		this.info = {
			i:0,
			j:0,
			x:0,
			y:0,
			counti:0,
			countj:0,
			labelX:0,
			labelY:0,
			totalX:0,
			totalY:0,
			lineFix:0.5,
			offsetX:0,
			offsetY:0,
			lefts:[],
			widths:[],
			rowSum:[],
			colSum:[],
			totalPos:{},
			sumTotal:0,
		};
	}
	TableHeatmap.prototype = {
		setOption:function (option){
			if (this.option == null){
				this.option = {};
				deepExtend(this.option,DefaultOption);
			}
			if (option == null) return;
			deepExtend(this.option,option);
			if (this.data){
				this.setData(this.data);
			}
		},
		setData:function(data){
		//{ labelx:[],labely:[],data:[[],[],[]]}
			if (data == null) return;
			// if (this.data != data){
				var option = this.option;
				var info = this.info;
				this.data = data;
				info.counti = data.labely.length;
				info.countj = data.labelx.length;
				info.labelX = 0;
				info.labelY = 0;
				var ctx = this.labelLayer.getContext();
				var bold = "";
				if (bold){
					bold = "bold "
				}
				ctx.font= bold + option.fontSize + "px " + option.fontFamily;
				info.rowSum =[];
				info.colSum = [];

				//vertical labels; get offsetX use i
				for (var i =0;i<info.counti;i++){
					var label = data.labely[i];
					var width = (ctx.measureText(label).width+option.textTopFix)>>0;
					if (width>info.labelX){
						info.labelX = width;
					}
					info.rowSum[i] = 0;
				}
				//horzontal labels; get offsetY use j
				for (var j =0;j<info.countj;j++){
					var label = data.labelx[j];
					var width = (ctx.measureText(label).width+option.textTopFix)>>0;
					if (width>info.labelY){
						info.labelY = width;
					}
					info.colSum[j] = 0;
				}
				// data
				info.maxData = 0;

				info.totalPos={
					left:0,
					top:0,
					width:0,
					height:option.fontSize+2*option.paddingTB,
				}
				info.sumTotal = 0;
				
				
				var minWidth = (ctx.measureText(option.minWidthText).width+2*option.padding)>>0;
				if (minWidth < option.fontSize){
					minWidth = option.fontSize;
				}
				info.minWidth = minWidth;
				
				for (var j=0;j<info.countj;j++){
					if (j == 0 ){
						info.lefts[j] = 0;
					}else{
						info.lefts[j] = info.lefts[j-1] + info.widths[j-1];
					}
					info.widths[j] = info.minWidth;
					for(var i=0;i<info.counti;i++){
						var value = data.data[i][j];
						if (!value || value <0) value = 0;
						info.rowSum[i] += value;
						info.colSum[j] += value;
						info.sumTotal += value;
						var width = (ctx.measureText(value).width+2*option.padding)>>0;
						if (width>info.widths[j]){
							info.widths[j] = width;
						}
						if (value>info.maxData){
							info.maxData = value;
						}
					}
					if (option.sumTotalCol){
						var totalValue = info.colSum[j];
						var width = (ctx.measureText(totalValue).width+2*option.padding)>>0;
						if (width>info.widths[j]){
							info.widths[j] = width;
						}
					}
				}
				info.labelX = info.labelX >>0;
				info.labelY = info.labelY >>0;
				info.offsetX = (info.labelX + option.padding)>>0;
				info.offsetY = (info.labelY + option.padding)>>0;
				info.totalX = info.offsetX + info.lefts[info.countj-1] + info.widths[info.countj-1];
				info.totalY = info.offsetY + info.counti*(option.fontSize + 2*option.paddingTB);
				info.totalPos.left = info.totalX;
				info.totalPos.top = info.totalY;
				info.totalPos.width = minWidth;
				if (option.sumTotalRow){
					for (var i in info.rowSum){
						var value = info.rowSum[i];
						var width = (ctx.measureText(value).width+2*option.padding)>>0;
						if (width > info.totalPos.width){
							info.totalPos.width = width;
						}
					}
					if (option.sumTotalCol){
						var value = info.sumTotal;
						var width = (ctx.measureText(value).width+2*option.padding)>>0;
						if (width > info.totalPos.width){
							info.totalPos.width = width;
						}

					}
				}
				var clientWidth = info.totalX;
				var clientHeight = info.totalY;
				if (option.sumTotalRow){
					clientWidth += info.totalPos.width;
				}
				if (option.sumTotalCol){
					clientHeight += info.totalPos.height;
				}
				$(this.parent).width(clientWidth);
				$(this.parent).height(clientHeight);

				this.labelLayer.setOption({
					zIndex:option.labelZ,
					draw:function(layer){
						var tableHeatmap = layer.tableHeatmap;
						drawLabel(tableHeatmap);
					}
				})

				var pointerLayer = this.pointerLayer;
				pointerLayer.setOption({
					zIndex:option.pointerZ,
					draw:function(layer){
						var tableHeatmap = layer.tableHeatmap;
						drawPointer(tableHeatmap);
					},
					on:function(e,pos,layer){
						if (!layer.visible) return;
						switch(e.type){
						case "mousemove":
							var tableHeatmap = layer.tableHeatmap;
							var option = tableHeatmap.option;
							var info = tableHeatmap.info;
							var lineH = option.fontSize + 2*option.paddingTB;
							var data = tableHeatmap.data;
							info.x = pos.x;
							info.y = pos.y;
							var px = (pos.x - info.offsetX);
							var py = (pos.y - info.offsetY);
							if (px<0) px = 0;
							if (py<0) py = 0;
							var infoJ = info.countj-1;
							for (var j = 0;j<info.countj;j++){
								if ((info.lefts[j]+info.widths[j])>px){
									infoJ = j;
									break;
								}
							}

							info.j = infoJ;
							info.i = (py/lineH)>>0;
							if (info.i >= info.counti){
								info.i = info.counti-1;
							}
							info.data = data.data[info.i][info.j];
							layer.update();
							break;
						}
					}
				})

				this.heatLayer.setOption({
					zIndex:option.heatmapZ,
					draw:function(layer){
						var tableHeatmap = layer.tableHeatmap;
						drawHeatmap(tableHeatmap);
					}
				})

				this.labelLayer.resize();
				pointerLayer.resize();
				this.heatLayer.resize();
				this.labelLayer.update();
				this.heatLayer.update();
			// }
			this.redraw();
		},
		redraw:function(){

		},
		getData:function(){//return data
			return this.data;
		},
		setParent:function(parent){
			this.parent = parent,
			this.labelLayer.setParent(parent);
			this.pointerLayer.setParent(parent);
			this.heatLayer.setParent(parent);
		},
		getInfo:function(){//return {width:w,height:h}
			return this.info;
		}
	}

	TableHeat = {
		init:function(div,option){
			var instance = new TableHeatmap(option);
			instance.setParent(div);
			return instance;
		}
	}
	_global.TableHeatmap = TableHeat;
})(window)