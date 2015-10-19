(function(_global){

	var EMPTY_LIST = [];
	var STACK = "stack";
	var TOP_DIV_CLASS = "compare_chart_top";
	var BOTTOM_DIV_CLASS = "compare_chart_bottom";

	var default_option = {
		animationDuration:20,
		animationDurationUpdate:20
	}

	var default_title = {

	}

	var default_legend = {
		selectedMode:false
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

	var getValueFormatter = function(str){
		return function(value){
			if (value == 0) return 0;
			var absValue = Math.abs(value);
			return str.replace(/{value}/gi,absValue);
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
		        for (key in params){
		        	if (html != ""){
		        		html += "<br/>"
		        	}
		            var item = params[key];
		            if (!item.data) continue;
		            var str = item.seriesName + " : " + valueFormatter(item.value);
		            html += str;
		        }
		        if (item){
		        	html = item.name+"<br/>"+html
		        }
		        
		        return html;
		}
    	return default_tooltip_formatter
    }
    var getGrid = function (index,top,bottom,left,right){
    	var grid = {};
    	grid.x = left;
    	grid.x2 = right;
    	if (index == 0){
    		grid.y = top;
    		grid.y2 = 0;
    	}else{
    		grid.y = 0;
    		grid.y2 = bottom;
    	}
    	return grid;
    }

    var copyObject = function(obj,origin){
    	for (key in origin){
    		obj[key] = origin[key];
    	}
    }

    var createSeries = function(name,type,stack,data){
    	return {
    		name:name,
    		type:type,
    		stack:stack,
    		itemStyle: {normal: {areaStyle: {type: 'default'}}},
    		data:data,
    	}
    }

    var createOption = function (index,compareChart){
    	var option = {};

    	for (key in default_option){
    		option[key] = default_option[key];
    	}

    	var title = {};
    	copyObject(title,default_title);
    	copyObject(title,compareChart.title);

    	var legend = {};
    	copyObject(legend,default_legend);
    	copyObject(legend,compareChart.legend);

    	legend.data = [compareChart.name1,compareChart.name2];

    	var xAxis = {};
    	copyObject(xAxis,default_xAxis);
    	copyObject(xAxis,compareChart.xAxis);
    	xAxis.axisLabel = {};
    	xAxis.data = compareChart.label;

    	var yAxis = {};
    	copyObject(yAxis,default_yAxis);
    	copyObject(yAxis,compareChart.yAxis);
    	yAxis.axisLabel = {};

    	var toolbox = {}
    	copyObject(toolbox,default_toolbox);
    	copyObject(toolbox,compareChart.toolbox);

    	var tooltip = {}
    	copyObject(tooltip,default_tooltip);
    	copyObject(tooltip,compareChart.tooltip);

    	var grid = getGrid(index,compareChart.top,compareChart.bottom,compareChart.left,compareChart.right);

    	var series = [];
    	var valueFormatter = null;

    	if (index == 0){
    		console.log(compareChart.valueFormat1)
    		valueFormatter = getValueFormatter(compareChart.valueFormat1)

    		tooltip.position = getPositionFunc(compareChart.top);
    		tooltip.formatter = getTooltipFormatter(valueFormatter);

    		
    		yAxis.axisLabel.formatter = valueFormatter;

    		series.push(createSeries(compareChart.name1,compareChart.type,STACK,compareChart.data1));
    		series.push(createSeries(compareChart.name2,compareChart.type,STACK,EMPTY_LIST));

    	}else{
    		console.log(compareChart.valueFormat2)
    		valueFormatter = getValueFormatter(compareChart.valueFormat2)

			legend.y = compareChart.fixY;
			toolbox.y = compareChart.fixY; 

			tooltip.position = getPositionFunc(0);
			tooltip.formatter = getTooltipFormatter(valueFormatter);

			xAxis.position = "top";
			xAxis.axisLabel.margin = compareChart.margin;
			yAxis.axisLabel.formatter = valueFormatter;

			

			series.push(createSeries(compareChart.name2,compareChart.type,STACK,compareChart.data2));
    	}
    	console.log(xAxis,index);
    	
    	

    	option.title = title;
    	option.legend = legend;
    	option.toolbox = toolbox;
    	option.tooltip = tooltip;
    	option.xAxis = [xAxis];
    	option.yAxis = [yAxis];
    	option.grid = grid;
    	option.series = series;

    	return option;
    }

    function minusData(list){
    	var new_list = [];
    	for (key in list){
    		new_list[key] = -1 * list[key];
    	}
    	return new_list;
    }

	function CompareChart(){
		this.isReady = false;
		this.id = null;
		this.root = null;
		this.chart1 = null;
		this.chart2 = null;
		this.option1 = null
		this.option2 = null;
		this.data1 = null;
		this.data2 = null;
		this.name1 = null;
		this.name2 = null;

		this.title = null;
		this.legend = null;
		this.toolbox = null;
		this.tooltip = null;
		this.xAxis = null;
		this.yAxis = null;

		this.type = "line";

		this.label = null;
		this.left = 100;
		this.right = 20;
		this.top = 60;
		this.bottom = 20;
		this.margin = -200;
		this.fixY = -30;
		this.valueFormat1 = "{value}";
		this.valueFormat2 = "{value}";
	};


	function init(id){
		this.id = id;
	}

	function afterReady(){
		console.log('afterready');
		this.isReady = true;
		this.redraw();
	}

	function ready(){
		console.log('ready');
		this.root = $("#"+this.id);
		if (!this.root) return;
		this.root.html('<div class ="'+ TOP_DIV_CLASS+'"></div><div class ="'+BOTTOM_DIV_CLASS+'"></div>');
		this.chart1 = echarts.init(this.root.find("."+TOP_DIV_CLASS)[0]);
		this.chart2 = echarts.init(this.root.find("."+BOTTOM_DIV_CLASS)[0]);
		this.chart1.connect([this.chart2]);
		this.chart2.connect([this.chart1]);
		
		$(_global).resize($.proxy(function(){
			this.chart1.resize();
			this.chart2.resize();
		},this));
		this._afterReady();
	}


	function setOption(option){
		console.log('setOption');
		this.left = option.left || this.left;
		this.right = option.right || this.right;
		this.top = option.top || this.top;
		this.bottom = option.bottom || this.bottom;
		this.margin = option.margin || this.margin;
		this.fixY = option.fixY || this.fixY;

		this.title = option.title || this.title;
		this.legend = option.legend || this.legend;
		this.toolbox = option.toolbox || this.toolbox;
		this.tooltip = option.tooltip || this.tooltip;
		this.xAxis = option.xAxis || this.xAxis;
		this.yAxis = option.yAxis || this.yAxis;

		this.valueFormat1 = option.valueFormat1 || this.valueFormat1;
		this.valueFormat2 = option.valueFormat2 || this.valueFormat2;

		this.label = option.label || this.label;
		this.data1 = option.data1 || this.data1;
		this.data2 = option.data2 || this.data2;
		this.name1 = option.name1 || this.name1;
		this.name2 = option.name2 || this.name2;

		this.data2 = minusData(this.data2)

		this.redraw();
	}
	function redraw(){
		console.log('redraw');
		if (!this.isReady) return;
		console.log("inredraw");
		this.option1 = createOption(0,this);
		this.option2 = createOption(1,this);

		console.log("afteroption");

		//console.log(this.chart1);
		// this.chart1.setOption(this.option1)
		this.chart1.setOption(this.option1,true);
		this.chart2.setOption(this.option2,true);
	}

	CompareChart.prototype={
		init:init,
		ready:ready,
		_afterReady:afterReady,
		setOption:setOption,
		redraw:redraw,
	}

	var CompareChartPlugin = {};
	CompareChartPlugin = {}
	CompareChartPlugin.list =[]
	CompareChartPlugin.init = function(id){
		var instance = CompareChartPlugin.list[id];
		if (instance == null || instance == undefined){
			instance = new CompareChart();
			instance.init(id);
			$(function(){
				instance.ready();
			});
			CompareChartPlugin.list[id] = instance;
		}else{
			instance.setOption(option);
		}
		return instance;
	}
	CompareChartPlugin.has = function(id){
		return CompareChartPlugin.list[id]!=null;
	}

	_global.CompareChartPlugin = CompareChartPlugin;
})(window)