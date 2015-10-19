(function(_global){

	var EMPTY_LIST = [];
	var STACK = "stack";
	var CHART_DIV_CLASS = "compare_chart";
	var TOP_DIV_CLASS = "compare_chart_top";
	var BOTTOM_DIV_CLASS = "compare_chart_bottom";

	var default_option = {
		animationDuration:20,
		animationDurationUpdate:20
	}

	var default_title = {
		x:"center",
	}

	var default_legend = {
		padding:30,
		x:"center",
		y:"top",
		
    }
    var default_toolbox = {
        show : true,
        feature : {
            magicType : {show: true,title:{line:'Line', bar:'Bar'}, type: ['line', 'bar']},
            restore : {show: true,title:"Restore"},
            saveAsImage : {show: true,title:"Save as Image",type:'png',lang : ['click to save']}
        }
    }
    var default_tooltip ={
        show:true,
        showDelay:0,
        trigger:"axis"
        // position : func,
        // formatter: func
    }

    var default_xAxis ={
	    splitLine: {show:false},
	    type : 'category',
    }
    var default_yAxis ={
        splitLine: {show:false},
        type : 'value',
    }
    var default_series ={
    	smooth:true
    }

	var getValueFormatter = function(str){
		if (typeof str === "function"){
			return str;
		}
		return function(value){
			if (value == 0) return 0;
			return str.replace(/{value}/gi,value);
		}
	}

    var getPositionFunc = function(fixY){
    	return function(pos){
	    	return [pos[0],fixY];
	    }
    }

    var getTooltipFormatter = function(valueFormatter){
    	var default_tooltip_formatter = function(params){
			var html = "";
		        for (var key in params){
		        	if (html != ""){
		        		html += "<br/>"
		        	}
		            var item = params[key];
		            if (!item.data) continue;
		           	var index = item.series.yAxisIndex;
		           	var formatter = valueFormatter[index];
		           	var str = item.seriesName + " : ";
		           	if (formatter){
		           		str += formatter(item.value);
		           	}else{
		           		str += item.value;
		           	}
		            html += str;
		        }
		        if (item){
		        	html = item.name+"<br/>"+html
		        }
		        
		        return html;
		}
    	return default_tooltip_formatter
    }
    var getGrid = function (top,bottom,left,right){
    	var grid = {};
    	grid.x = left;
    	grid.x2 = right;
    	grid.y = top;
    	grid.y2 = bottom;
    	return grid;
    }

    var copyObject = function(obj,origin){
    	if (!origin) return;
    	for (var key in origin){
    		obj[key] = origin[key];
    	}
    }
    var createLegendData = function(series)
	{
		var legendlist = [];
		for (var key in series){
			var item = series[key]
			legendlist.push(item.name)
		}
		return legendlist;
	}
	/**
	label:[],
	series[{name:"",yAxisIndex:0,data:[1,2,3]}],
	formatters:[func / string ,[ func / string]],

	// other echart settings
	title:{}//echart title
	legend: {} // legend data will auto create if legend.data is null;
	toolbox :

	tooltip : will use formatter for values
	xAxis: create from label if xAxis.data is null
	yAxis: create from series if yAxis is null

	*/
    var createOption = function (params){
    	var option = {};

    	var valueFormatter = [];
    	for (var key in params.formatters){
    		valueFormatter.push(getValueFormatter(params.formatters[key]));
    	}

    	copyObject(option,default_option);

    	//create title
    	var title = {};
    	copyObject(title,default_title);
    	copyObject(title,params.title);

    	//create legend
    	var legend = {};
    	copyObject(legend,default_legend);
    	copyObject(legend,params.legend);

    	if (legend && params.series && !legend.data){
    		legend.data = createLegendData(params.series);
    	}

    	// create xAxis
    	var xAxis = {};
    	copyObject(xAxis,default_xAxis);
    	copyObject(xAxis,params.xAxis);
    	xAxis.axisLabel = {};
    	xAxis.data = params.label;

    	// create 2 yAxis;
    	// if no custom setting ,use default
    	var yAxisList = [];
    	for (i=0;i<=1;i++){
    		yAxis = {};
    		copyObject(yAxis,default_yAxis);
    		yAxisList.push(yAxis);
    	}
    	if (params.yAxis){
	    	for (var key in yAxisList){
	    		yAxis = yAxisList[key];

	    		copyObject(yAxis,params.yAxis[key]);
	    	}
	    }
	    for (var key in yAxisList){
	    	yAxis = yAxisList[key];
    		if(!yAxis.axisLabel){
    			yAxis.axisLabel = {};
    		}
    		if (valueFormatter[key]){
    			yAxis.axisLabel.formatter = valueFormatter[key];
    		}
	    }

    	var toolbox = {}
    	copyObject(toolbox,default_toolbox);
    	copyObject(toolbox,params.toolbox);

    	var tooltip = {}
    	copyObject(tooltip,default_tooltip);
    	copyObject(tooltip,params.tooltip);
    	
    	if (!tooltip.position){
    		tooltip.position = getPositionFunc(params.top);
    	}
    	if (!tooltip.formatter){
    		tooltip.formatter = getTooltipFormatter(valueFormatter)
    	}
    	

    	var grid = null;
    	if (!params.grid){
    		grid = getGrid(params.top,params.bottom,params.left,params.right);
    	}else{
    		grid = params.grid;

    	}

    	var series = [];
    	for (var key in params.series){
    		var item = {};
    		copyObject(item,default_series);
    		copyObject(item,params.series[key]);
    		series.push(item);
    	}

    	option.title = title;
    	option.legend = legend;
    	option.toolbox = toolbox;
    	option.tooltip = tooltip;
    	option.xAxis = [xAxis];
    	option.yAxis = yAxisList;
    	option.grid = grid;
    	option.series = series;
    	return option;
    }

	function CompareChartInOne(){
		this.isReady = false;
		this.id = null;
		this.root = null;
		this.chart = null;
		this.option = null
		this.drawOption = null;

		this.left = 80;
		this.right = 80;
		this.top = 60;
		this.bottom = 20;
		this.formatters = ["{value}","{value}"];
	};


	function init(id){
		this.id = id;
	}

	function afterReady(){
		this.isReady = true;
		this.redraw();
	}

	function ready(){
		this.root = $("#"+this.id);
		if (!this.root) return;
		this.root.html('<div class ="'+ CHART_DIV_CLASS+'"></div>');
		this.chart = echarts.init(this.root.find("."+CHART_DIV_CLASS)[0]);
		$(_global).resize($.proxy(function(){
			if (this.chart){
				this.chart.resize();
			}
		},this));
		this._afterReady();
	}


	function setOption(option){
		this.option = option;
		option.left = option.left || this.left;
		option.right = option.right || this.right;
		option.top = option.top ||this.top;
		option.bottom = option.bottom || this.bottom;
		option.formatters = option.formatters || this.formatters;
		this.redraw();
	}
	function redraw(){
		if (!this.isReady) return;
		if (!this.option) return;
		this.drawOption = createOption(this.option);
		this.chart.setOption(this.drawOption,true);
	}

	CompareChartInOne.prototype={
		init:init,
		ready:ready,
		_afterReady:afterReady,
		setOption:setOption,
		redraw:redraw,
	}

	//--------------//
	function updateCompareChartInOne(chart,title,label,series,formatters){
		var option={
			title:{text:title},
			label:label,
			series:series,
			formatters:formatters
		}
		chart.setOption(option);
	}

	var CompareChartInOnePlugin = {
		list:[],
		init:function(id){
			var instance = this.list[id];
			if (instance == null || instance == undefined){
				instance = new CompareChartInOne();
				instance.init(id);
				$(function(){
					instance.ready();
				});
				this.list[id] = instance;
			}else{
				instance.setOption(option);
			}
			return instance;
		},
		has:function(id){
			return this.list[id]!=null;
		},
		get:function(id){
			return this.list[id];
		},
		update:function(chart,title,label,series,formatters){
			var option={
				title:{text:title},
				label:label,
				series:series,
				formatters:formatters
			}
			if (typeof chart == "string"){
				chart = this.get(chart);
			}
			chart.setOption(option);
		}
	}
	_global.CompareChartInOnePlugin = CompareChartInOnePlugin;
})(window)