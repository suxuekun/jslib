(function(_global){
	var RADIUS_FACTOR = 0.78;
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
		cellSize:15,
		padding:10,
		textFix:2,
		fontFamily:"Times New Roman",
		labelZ:0,
		pointerZ:10,
		heatmapZ:20,
	}
	var heatmapOption = {
		container:null,
		radius: 15,
		blur: 0.5,
		maxOpacity:0.6,
		minOpacity:0.1,
	}
	var createheatmapIns = function(tableHeatmap){
		var parent = tableHeatmap.parent;
		var option = tableHeatmap.option;
		var $parent=$(parent);
		var heatcanvas = $parent.find(".heatmap-canvas");
		if (heatcanvas.length>0){
			heatcanvas.remove();
		}
		var op = {}
		deepExtend(op,heatmapOption);
		op.container = parent;
		op.radius = option.cellSize*RADIUS_FACTOR;
		heatmapInstance = h337.create(op);
		var heatcanvas = $parent.find(".heatmap-canvas");
		if (heatcanvas.length >0){
			heatcanvas[0].style.zIndex = option.heatmapZ;
		}
		return heatmapInstance;
	}
	var drawLabel = function(tableHeatmap){
		var option = tableHeatmap.option;
		var info = tableHeatmap.info;
		var data = tableHeatmap.data;
		var labelx = data.labelx;
		var labely = data.labely;
		var ctx = tableHeatmap.labelLayer.getContext();
		ctx.font= "" + option.cellSize + "px " + option.fontFamily;

		ctx.moveTo(0,info.offsetY);
		ctx.lineTo(ctx.canvas.clientWidth,info.offsetY);
		ctx.moveTo(info.offsetX,0);
		ctx.lineTo(info.offsetX,ctx.canvas.clientHeight);
		for (var i =0;i<info.counti;i++){
			var txt = labely[i];
			
			var tempPos = (i+1)*option.cellSize + info.offsetY - option.textFix;

			ctx.fillText(txt,0,tempPos);
		}
		ctx.save()
		ctx.rotate(Math.PI/2);
		for (var j=0;j<info.countj;j++){
			var txt = labelx[j];
			var tempPos = -j*option.cellSize - info.offsetX - option.textFix;
			ctx.save()
			
			ctx.fillText(txt,0,tempPos);
			ctx.restore()
		}
		ctx.stroke();
		ctx.restore();

	}

	var getXY = function(tableHeatmap,i,j){
		var info = tableHeatmap.info;
		var option = tableHeatmap.option;
		var lineW = option.cellSize;

		var x = lineW/2 + j*lineW;
		var y = lineW/2 + i*lineW;

		x+=info.offsetX;
		y+=info.offsetY;
		return {
			x:x,
			y:y,
		}
	}
	var computeHeatmapData = function(tableHeatmap){
		var heatData = {
			max:0,
			data:[]
		}
		var data = tableHeatmap.data.data;
		var info = tableHeatmap.info;
		var option = tableHeatmap.option;
		for (var i=0;i<info.counti;i++){
			for (var j=0;j<info.countj;j++){
				var pos = getXY(tableHeatmap,i,j);
				pos.value = data[i][j];
				heatData.data.push(pos);
				if (heatData.max < pos.value){
					heatData.max = pos.value;
				}
			}
		}
		return heatData;
	}
	var drawHeatmap = function(tableHeatmap){
		if (tableHeatmap.parent){
			var info = tableHeatmap.info;
			var data = tableHeatmap.data;
			var heatData = computeHeatmapData(tableHeatmap);
			tableHeatmap.heatmap = createheatmapIns(tableHeatmap);
			tableHeatmap.heatmap.setData(heatData);
		}
	}
	var drawPointer = function(tableHeatmap){
		var info = tableHeatmap.info;
		var option = tableHeatmap.option;
		var lineW = option.cellSize;
		var ctx = tableHeatmap.pointerLayer.getContext();


		var i = info.i;
		var j = info.j;
		var pos = getXY(tableHeatmap,i,j)
		var x = pos.x;
		var y = pos.y;
		ctx.save();
		ctx.globalAlpha = 0.5
		ctx.beginPath();
		ctx.lineWidth = lineW;
		ctx.moveTo(0,y);
		ctx.lineTo(ctx.canvas.clientWidth,y);
		ctx.moveTo(x,0);
		ctx.lineTo(x,ctx.canvas.clientHeight);
		ctx.stroke();
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

		this.labelLayer.tableHeatmap = this;
		this.pointerLayer.tableHeatmap = this;
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
				setData(this.data);
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
				ctx.font= "" + option.cellSize + "px " + option.fontFamily;
				//vertical labels; get offsetX use i
				for (var i =0;i<info.counti;i++){
					var label = data.labely[i];
					var width = ctx.measureText(label).width;
					if (width>info.labelX){
						info.labelX = width;
					}
				}
				//horzontal labels; get offsetY use j
				for (var j =0;j<info.countj;j++){
					var label = data.labelx[j];
					var width = ctx.measureText(label).width;
					if (width>info.labelY){
						info.labelY = width;
					}
				}
				info.labelX = info.labelX >>0;
				info.labelY = info.labelY >>0;
				info.offsetX = (info.labelX + option.padding)>>0;
				info.offsetY = (info.labelY + option.padding)>>0;
				info.totalX = info.offsetX + info.countj*option.cellSize;
				info.totalY = info.offsetY + info.counti*option.cellSize;

				this.labelLayer.setOption({
					zIndex:option.labelZ,
					draw:function(layer){
						var tableHeatmap = layer.tableHeatmap;
						drawLabel(tableHeatmap);
					}
				})
				$(this.parent).width(info.totalX);
				$(this.parent).height(info.totalY);
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
							var lineW = option.cellSize;
							var data = tableHeatmap.data;
							info.x = pos.x;
							info.y = pos.y;
							var px = (pos.x - info.offsetX);
							var py = (pos.y - info.offsetY);
							if (px<0) px = 0;
							if (py<0) py = 0;
							info.j = (px/lineW)>>0;
							info.i = (py/lineW)>>0;
							info.data = data.data[info.i][info.j];
							layer.update();
							break;
						}
					}
				})
				this.labelLayer.resize();
				pointerLayer.resize();
			// }
			this.redraw();
		},
		redraw:function(){
			// drawLabel(this);
			drawHeatmap(this);
			// drawPointer(this);
		},
		getData:function(){//return data
			return this.data;
		},
		setParent:function(parent){
			this.parent = parent,
			this.labelLayer.setParent(parent);
			this.pointerLayer.setParent(parent);
		},
		getInfo:function(){//return {width:w,height:h}
			return this.info;
		},
	}

	TableHeat = {
		init:function(div,option){
			var instance = new TableHeatmap(option);
			instance.setParent(div);
			return instance;
		}
	}
	_global.TableHeatmapLite = TableHeat;
})(window)