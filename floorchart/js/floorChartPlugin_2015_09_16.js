(function(_global){
function floorChartClass(){
	var _self = this;
	var _isReady = false;
	// init default setting
	this.panzoomRoot = null;
	this.panzoom_obj = null;
	this.echart  = null;
	this.pre_mouse_event = null;
	this.draging = false;
	this.transform = [1,0,0,1,0,0];
	//option settings params
	this.rootName = "#set";
	this.chartName = "#echart_floor";
	this.readyList = []
	
	this.defaultEmptySeries = {
            type: 'map',
            mapType: 'floorEmpty',
            mapLocation :{x:'0',y:'0'},
            itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            },
            data:[],
    		scaleLimit:{max:"1",min:"1"}
	}
	this.defaultHeatmap = {
		type:'heatmap',
	    minAlpha: 0.1,
	    opacity:0.8,
	    blurSize: this.blurSize,
	    data:[[]]
	}
	
	this.defaultSeries = {
            type: 'map',
            mapType: 'floorDefault',
            mapLocation :{x:'0',y:'0'},
            itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            },
    		scaleLimit:{max:"1",min:"1"},
            data: [],
            geoCoord: this.points,
            markPoint : {
                symbolSize : 10,
                data : this.mark
            },
            markLine : {
                smooth:false,
                effect : {
                    show: true,
                    scaleSize: 1,
                    period: 20,
                    color: '#fff',
                    shadowBlur: 3
                },
                symbol: ['none'],
                itemStyle : {
                    normal: {
                        borderWidth:3,
                        lineStyle: {
                            type: 'solid'
                        }
                    }
                },
                data : this.line
            }
        }
	this.reset();
}

floorChartClass.prototype.constants = {
	type_clear:"type_clear",
	type_clear_data:"type_clear_data",
	type_merge:"type_merge",
}

floorChartClass.prototype.init = function(divName,option){

	if (divName !=null){
		this.rootName = "#" + divName;
	}
	this.setOption(option)
}

floorChartClass.prototype.reset_panzoom = function(){
	this.zoom_max_scale = 2;
	this.zoom_min_scale = 0.2;
	this.zoom_increment = 0.1;
	this.zoom_initial = (1-this.zoom_min_scale)/(this.zoom_max_scale-this.zoom_min_scale)*100;
	this.update_panzoom();
}

floorChartClass.prototype.reset_chart = function(refresh){
	this.heatmapVisiable = true;
	this.chartLegend = null;
	this.legend = null;
	this.heatData = [];
	this.points = {};

	this.mark =[];
	this.line =[];
	this.markSetting ={};
	this.lineSetting = {};
	this.series = [];
	
	this.blurSize = 5;

	this.echartOption = {
	    tooltip : {
	        trigger: 'item',
	        formatter: function(params, ticket, callback){
	        	var name = params.name;
	        	if (name.indexOf(">")>0){
	        		var from_to = name.split(">");
	        		var from = $.trim(from_to[0]);
	        		var to = $.trim(from_to[1]);
	        		return from + " --> " + to;
	        	}
	        	if (params.data.label){
	        		return params.data.label;
	        	}else{
	        		return params.data.name;
	        	}
	        }
	    },
	    series : [this.defaultSeries,this.defaultHeatmap]
	};
	if (refresh){
		this.refresh()
	}
}

floorChartClass.prototype.reset = function(refresh){
	this.reset_panzoom();
	this.reset_chart(refresh);
}



floorChartClass.prototype.scale_to_value = function(scale){
	var value =  (scale-this.zoom_min_scale)*100/(this.zoom_max_scale-this.zoom_min_scale);
	return value;
}
floorChartClass.prototype.value_to_scale = function(value){
	return value/100*(this.zoom_max_scale-this.zoom_min_scale)+this.zoom_min_scale;
}
floorChartClass.prototype.slide_to_value= function(value){

	this.panzoomRoot.find(".slider-range" ).slider( "value", value)
	this.panzoomRoot.find(".zoom-range").val(this.value_to_scale(value)).trigger("input");
}
floorChartClass.prototype.slide_to_scale= function(scale,no_change_panzoom){
	this.panzoomRoot.find(".slider-range").slider( "value", this.scale_to_value(scale));
	if (!no_change_panzoom){
		this.panzoomRoot.find(".zoom-range").val(scale).trigger("input");
	}
	
}
floorChartClass.prototype.zoom_func = function (out,value_only){

	if (!value_only){
		this.panzoom_obj.panzoom("zoom",out);
	}
	var old_value = this.panzoomRoot.find(".slider-range" ).slider( "value");
	var gap = (this.zoom_increment/(this.zoom_max_scale-this.zoom_min_scale))*100;
	gap = out?gap:-gap;
	var new_value = old_value - gap;
	new_value = new_value<0?0:new_value;
	this.panzoomRoot.find(".slider-range" ).slider( "value", new_value);
}

floorChartClass.prototype.slide_func = function(event,ui){
	this.panzoomRoot.find(".zoom-range").val(ui.value/100*(this.zoom_max_scale-this.zoom_min_scale)+this.zoom_min_scale).trigger("input");
}

floorChartClass.prototype.zoom_out_func = function(){
	this.zoom_func(true);
}
floorChartClass.prototype.zoom_in_func = function(){
	this.zoom_func(false);
}
floorChartClass.prototype.zoom_reset_func = function(){
	this.slide_to_value(this.zoom_initial);
}
floorChartClass.prototype.mouse_wheel_func = function( e ) {
    e.preventDefault();
    var delta = e.delta || e.originalEvent.wheelDelta;
    var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
    this.panzoom_obj.panzoom('zoom', zoomOut, {
      increment: 0.1,
      animate: false,
      focal: e
    });
    this.slide_to_scale(this.panzoom_obj.panzoom("getMatrix")[0],true);
}
floorChartClass.prototype.update_panzoom = function(){
	if (this.panzoomRoot == null) return;
	if (!this.panzoom_obj)
		this.panzoom_obj = this.panzoomRoot.find('.panzoom');
	this.panzoom_obj = this.panzoomRoot.find('.panzoom').panzoom({
				maxScale: this.zoom_max_scale,
				minScale: this.zoom_min_scale,
				increment: this.zoom_increment,
			});
}

floorChartClass.prototype.init_panzoom = function (){
	this.panzoomRoot = $(this.rootName);
	this.panzoom_obj = this.panzoomRoot.find('.panzoom').panzoom({
/* 								$zoomIn: $section.find(".zoom-in"),
		$zoomOut: $section.find(".zoom-out"), */
		$reset: this.panzoomRoot.find(".reset"),
		$zoomRange: this.panzoomRoot.find(".zoom-range"),
		maxScale: this.zoom_max_scale,
		minScale: this.zoom_min_scale,
		increment: this.zoom_increment,
		$set: this.panzoomRoot.find('.parent > div')
	});
	
	this.panzoomRoot.find('.panzoom_mouse').bind('mousewheel.focal', $.proxy(this.mouse_wheel_func,this));
	this.panzoomRoot.find(".slider-range").slider({
		orientation:"vertical",
		range: "min",
		min: 0,
		max: 100,
		value: this.zoom_initial,
		slide: $.proxy(this.slide_func,this)
	});

	this.panzoomRoot.find(".zoom-out").click($.proxy(this.zoom_out_func, this))
	this.panzoomRoot.find(".zoom-in").click($.proxy(this.zoom_in_func,this));
	this.panzoomRoot.find(".reset").click($.proxy(this.zoom_reset_func,this));
}

floorChartClass.prototype.translatePoint = function(point,w,h,a,d,e,f){
	return [w+(point[0]-w)*a+e*1,h+(point[1]-h)*d+f*1];
}
floorChartClass.prototype.translateHeatPoint = function(point,w,h,a,d,e,f){
	var a2 = a;
	if (a2>1) a2 = 1;//no change when scale > 1
	if (a2<1) a2 = 1-((1-a2)/2);//if scale <1 reduce the value decreace
	return [w+(point[0]-w)*a+e*1,h+(point[1]-h)*d+f*1,point[2]*a2];
}


floorChartClass.prototype.redraw = function(transform){
	if (!this.panzoomRoot) {
		return;
	}

	if (transform != null){
		this.transform = transform;
	}
	
	var obj = this.panzoomRoot.find('.panzoom');
	var w = obj.width()/2;
	var h = obj.height()/2;
	var a = this.transform["0"];
	var d = this.transform["3"];
	var e = this.transform["4"];
	var f = this.transform["5"];
	var ps = {};
	var hs = [];
	var a2 = a*a;
	var blurScale = 1;
	for (key in this.points){
		point = this.points[key];
		p = this.translatePoint(point, w, h, a, d, e, f)
		ps[key]=p;
	}
	for (key in this.heatData){
		point = this.heatData[key];
		p = this.translateHeatPoint(point, w, h, a, d, e, f)
		hs.push(p);
	}
	
	// check series should not return happened
	if (this.echartOption.series.length <2) {
		console.log("some thing wrong")
		return;
	}
	
	var number_series = this.echartOption.series.length;
	var default_index = number_series - 2;
	var heatmap_index = number_series - 1;
	
	this.echartOption.series[default_index].geoCoord = ps;
	if (hs.length == 0){
		this.echartOption.series[heatmap_index].data = [];
	}else{
		if (this.heatmapVisiable){
			this.echartOption.series[heatmap_index].data = hs;
			this.echartOption.series[heatmap_index].blurSize = this.blurSize*blurScale;
		}else{
			this.echartOption.series[heatmap_index].data = [];
		}
	}
	this.echart.setOption(this.echartOption,true);
}
/**
 * @param option:
 * @param type:"type_clear_data"(default) | "type_clear" | "type_merge"
 */
floorChartClass.prototype.setOption = function(option,type){
	switch(type){
		case this.constants.type_merge:
			// nothing change
			break;
		case this.constants.type_clear:
			this.reset(false);
			break;
		case this.constants.type_clear_data:
		default:
			//default is clear data only
			this.reset_chart(false);
			break;
	}
	if (option == null) return;
	
	this.chartName = option.chartName?"#" +option.chartName: this.chartName;
	
	this.zoom_max_scale = option.zoom_max_scale || this.zoom_max_scale;
	this.zoom_min_scale = option.zoom_min_scale || this.zoom_min_scale;
	this.zoom_increment = option.zoom_increment || this.zoom_increment;
	
	this.legend = option.legend || this.legend;
	this.chartLegend = option.chartLegend || this.chartLegend;
	this.heatData = option.heatData || this.heatData;
	this.mark = option.mark || this.mark;
	this.line = option.line || this.line;
	this.markSetting = option.markSetting || this.markSetting;
	this.lineSetting = option.lineSetting || this.lineSetting;
	this.points = option.points || this.points;
	this.blurSize = option.blurSize || this.blurSize;
	this.series = option.series || this.series;
	
	//make sure 
	if (this.echartOption.series.length ==0){
		this.echartOption.series[0] = this.defaultSeries;
		this.echartOption.series[1] = this.defaultHeatmap
		console.log("something wrong happened");
	}
	var number_series = this.echartOption.series.length;
	var default_index = number_series - 2;
	var heatmap_index = number_series - 1;
	// create legend and name for chart and heatmap
	if (this.legend){
		this.echartOption.legend = this.legend;
	}
	if (this.chartLegend){
		this.echartOption.series[default_index].name = this.chartLegend;
		this.echartOption.series[heatmap_index].name = this.chartLegend;
	}
	this.echartOption.series[default_index].markLine.data = this.line;
	this.echartOption.series[default_index].markPoint.data = this.mark;
	
	// add additional series
	if (this.series){
		for (key in this.series){
			var item = this.series[key];
			var item_push = {};
			for (k in this.defaultEmptySeries){
				item_push[k] = this.defaultEmptySeries[k];
			}
			for (k in item){
				item_push[k] = item[k];
			}
			this.echartOption.series.unshift(item_push);
		}
	}
	
	this.update_panzoom()
	this.refresh();
}

floorChartClass.prototype.getOption = function(){
	var option = {};
	option.chartName = this.chartName;
	option.zoom_max_scale = this.zoom_max_scale;
	option.zoom_min_scale = this.zoom_min_scale;
	option.zoom_increment = this.zoom_increment;
	
	option.legend = this.legend;
	option.chartLegend = this.chartLegend;
	option.series = this.series;
	option.heatDat = this.heatData;
	option.mark = this.mark;
	option.line = this.line;
	option.markSetting = this.markSetting;
	option.lineSetting = this.lineSetting
	option.points = this.points;
	option.option = this.echartOption;
	option.blurSize = this.blurSize;
	return option;
}

floorChartClass.prototype.refresh = function(){
	this.redraw();
}
floorChartClass.prototype.ready = function(){
	/**
	 * panzoom init
	 * 
	 */
	this.init_panzoom();
	
	/**
	 * chart init
	 * 
	 */
	
	var map_width = 1;
	var map_height =this.panzoomRoot.find('.parent').height()*0.96;
	var sample_xml = 
		'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '+
		'x="0px" y="0px" width="'+map_width+'px" height="'+map_height+'px" viewBox="0 0 '+map_width+' '+map_height+'" '+
		'style="enable-background:new 0 0 '+map_width+' '+map_height+';" xml:space="preserve"></svg>';
	echarts.util.mapData.params.params.floorDefault = {
		getGeoJson: function (callback) {
	    	callback($.parseXML(sample_xml))
	    }
	}
	echarts.util.mapData.params.params.floorEmpty = {
			getGeoJson: function (callback) {
		    	callback($.parseXML(sample_xml))
		    }
		}
	
	this.echart = echarts.init(this.panzoomRoot.find(this.chartName)[0]);
	this.echart.on(echarts.config.EVENT.LEGEND_SELECTED,$.proxy(function(param){
		if(this.chartName && param && param.selected){
			for (key in param.selected){
				if (key == this.chartLegend){
					
					this.set_heatmap_visible(param.selected[key]);
				}
			}
		}
	},this));
	
	$(window).bind('resize',
			$.proxy(function(){

				this.echart.resize();
				this.refresh();
			},
			this));
	//chart drag transfer to .panzoom 'pan'

	this.draging = false;
	this.pre_mouse_event = null;

	this.panzoomRoot.find(this.chartName).mousedown($.proxy(function(event){
		this.pre_mouse_event = event;
		this.draging = true;
	},this))
	this.panzoomRoot.find(".echart_floor").mousemove($.proxy(function(event){
		if (this.draging){
			var x_change = event.offsetX-this.pre_mouse_event.offsetX;
			var y_change = event.offsetY-this.pre_mouse_event.offsetY;
			this.panzoomRoot.find('.panzoom').panzoom("pan",x_change,y_change,{relative: true});
		}
		this.pre_mouse_event = event;
	},this))
	this.panzoomRoot.find(".echart_floor").mouseup($.proxy(function(event){
		this.pre_mouse_event = event;
		this.draging = false;
	},this))
	
	this.panzoomRoot.find('.panzoom').bind('panzoomchange',$.proxy(this.panzoomchange_func,this));
	this.refresh();
	
	this.afterReady()
}

floorChartClass.prototype.register_ready_func = function(item){
	this.readyList.push(item);
	if (this._isReady){
		this.afterReady();
	}
}

floorChartClass.prototype.afterReady = function(){
	for (key in this.readyList){
		item = this.readyList[key];
		if (item.callback){
			if(item.args){
				item.callback.apply(null,item.args);
			}else{
				item.callback()
			}
		}
	}
	this._isReady = true;
}

floorChartClass.prototype.set_heatmap_visible = function(visible){
	this.heatmapVisiable = visible;
	this.refresh()
}

floorChartClass.prototype.panzoomchange_func = function(e,panzoom,transform){
	this.redraw(transform);
}

floorChartClass.prototype.getEchart= function(){
	return this.echart;
}

floorChartPlugin = {}
floorChartPlugin.list =[]
floorChartPlugin.init = function(divName,option){
	var instance = floorChartPlugin.list[divName];
	if (instance == null || instance == undefined){
		instance = new floorChartClass();
		instance.init(divName, option);
		$(function(){
			instance.ready();
		});
		floorChartPlugin.list[divName] = instance;
	}else{
		instance.setOption(option);
	}
	return instance;
}

_global.floorChartPlugin = floorChartPlugin;
})(window)
