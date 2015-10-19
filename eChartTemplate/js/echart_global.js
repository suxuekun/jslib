console.log("echart_globle init");
echart_global = {};



echart_global.ajax_waiting_list = [];
echart_global.ajax_current = null;

echart_global.ajax_success = function(data){
	echart_global.ajax_current.success(data);
	echart_global.ajax_current = null;
	if (echart_global.ajax_waiting_list.length >0){
		next = echart_global.ajax_waiting_list.shift();
		console.log("echart ajax from waiting list:");
		echart_global.ajax(next);
	}
}
echart_global.ajax = function (ajaxObj){
	if (echart_global.ajax_current == null){
		console.log("echart ajax:",ajaxObj)
		echart_global.ajax_current = ajaxObj;
		new_ajax_obj = {};
		for (key in ajaxObj){
			new_ajax_obj[key] = ajaxObj[key];
		}
		// wrap success function to new function;
		new_ajax_obj.success = echart_global.ajax_success;
		$.ajax(new_ajax_obj);
	}else{
		echart_global.ajax_waiting_list.push(ajaxObj);
	}
};

var eventmanager = {};
eventmanager.list = {};
eventmanager.register = function(name,callback){
  if (this.list[name] == null){
	  this.list[name] = [];
  }
  if (this.list[name].indexOf(callback) == -1){
	  this.list[name].push(callback);
  }
}
eventmanager.unregister = function (name,callback){
	  if (this.list[name] == null){
		  return
	  }
	  var index = this.list[name].indexOf(callback);
	  if (index == -1){
		 return;
	  }
	  this.list[name].splice(index,1);
}
eventmanager.dispatch= function(name,args){
	args.event_name = name;
	console.log("dispatch:",name," args:",args)
	if (this.list[name] == null){
		return
	}
	for (var key in this.list[name]){
		var callback = this.list[name][key];
		callback(args);
	}
}

echart_global.event_manager = eventmanager;

echart_global.interval_size = 10;
echart_global.default_rotate = 15;

echart_global.wrap_params = function(args){
	if (args == null) args = {};
	var params = {};
	// make a copy
	for (key in args){
		params[key] = args[key];
	}

	// default if null
	if (params.buildingId == "-1" || params.buildingId == null) params.buildingId = "";
	if (params.levelId == "-1" || params.levelId == null) params.levelId = "";
	if (params.zoneId == "-1" || params.zoneId == null) params.zoneId = "";
	if (params.period == "" || params.period == null) params.period = "daily";
	if (params.endDate == "" || params.endDate == null){
		var now = new Date();
		var year=now.getFullYear(); 
		var month=now.getMonth()+1; 
		var date=now.getDate(); 
		params.endDate = date+"-"+month+"-"+year;
	}
	if (params.startDate == "" || params.startDate == null){
		params.startDate = "";
	}
	if (params.size == "" || params.size ==null){
		params.size = 30;
	}
	// all params
	//console.log("warped params:",params);
	return params;
}

echart_global.show_data_not_found = function(chart){
	chart.showLoading({
	    text : "Sorry,No Data Found!",
	    effect : "bubble",//'spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
	    textStyle : {
	        fontSize : 20
	    }
	});
	setTimeout(function(){
		chart.hideLoading()
	},3000)
}

echart_global.loadingDefault = {
	    text : "loading",
	    effect : "whirling",//'spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
	    textStyle : {
	        fontSize : 20
	    }
};

echart_global.loadingDynamic = {
	    text : "loading",
	    effect : "dynamicLine",//'spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
	    textStyle : {
	        fontSize : 20
	    }
};

echart_global.loadingBubble = {
	    text : "loading",
	    effect : "bubble",//'spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
	    textStyle : {
	        fontSize : 20
	    }
};

echart_global.loadingBar = {
	    text : "loading....",
	    effect : "bar",//'spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
	    textStyle : {
	        fontSize : 20
	    }
};

echart_global.yAxisLineDefault = {
 			show:true,
 			lineStyle:{
 				color: '#48b',
 			    width: 2,
 			    type: 'solid'
 			}
 		}

echart_global.yAxisDefault= {
 		type:'value',
 		axisLabel:{formatter:"{value}"},
 		splitLine:{show:false},
 		axisLine:echart_global.yAxisLineDefault
 	};
echart_global.tooltipDefaultFormat = function(params, ticket, callback){
		var res = params[0].name;
		for (var i = 0, l = params.length; i < l; i++) {
            res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
        }
        setTimeout(function (){
            // 仅为了模拟异步回调
              callback(ticket, res);
        }, 200)
        return 'loading';
	}
echart_global.tooltipDefaultFormatForItemTrigger = function(params, ticket, callback){
	
	var tickets = ticket.split(":");
	var currentName = tickets[0];
	var currentIndex = tickets[1];
	var globleParam = this._optionRestore.series;
	var res = this._optionRestore.xAxis.data[currentIndex];
	for (var i = globleParam.length-1; i>=0 ; i--) {
        if (globleParam[i].name == currentName){
        	res += '<br/><font color="lightGreen">' + globleParam[i].name + ' : ' + globleParam[i].data[currentIndex]+'</font>';
        }else{
        	res += '<br/>' + globleParam[i].name + ' : ' + globleParam[i].data[currentIndex];
        }
    }
    setTimeout(function (){
        // 仅为了模拟异步回调
          callback(ticket, res);
    }, 200)
    return 'loading';
}

echart_global.getLineChartAreaStyle = function(){
	return {normal: {areaStyle: {type: 'default'}}};
}

/**
 * 
 * @param show boolean = false
 * @param magicType boolean = false
 * @param restore boolean = false
 * @param saveimg boolean = false
 * @returns {___anonymous182_436}
 */
echart_global.getToolBoxEN = function(show,magicType,restore,saveimg){
	show = show || false;
	magicType = magicType||false;
	restore = restore||false;
	saveimg = saveimg||false;
    return {
        show : show,
        feature : {
            magicType : {title:{'line':'Line', 'bar':'Bar'},show: magicType, type: ['line', 'bar']},
            restore : {title:"Restore",show: restore},
            saveAsImage : {title:"Save As Image",show: saveimg,lang:["click to save"]}
        }
    }
}
/**
 * 
 * @param show boolean = false
 * @param magicType boolean = false
 * @param restore boolean = false
 * @param saveimg boolean = false
 * @returns {___anonymous182_436}
 */
echart_global.getToolBoxWithStackEN = function(show,magicType,restore,saveimg){
	show = show || false;
	magicType = magicType||false;
	restore = restore||false;
	saveimg = saveimg||false;
    return {
        show : show,
        feature : {
            magicType : {title:{'line':'Line','bar':'Bar','stack':'Stack','tiled':'Tiled'},show: magicType, type: ['line', 'bar','stack','tiled']},
            restore : {title:"Restore",show: restore},
            saveAsImage : {title:"Save As Image",show: saveimg,lang:["click to save"]}
        }
    }
}

/**
 * 
 * @param show boolean = false
 * @param magicType boolean = false
 * @param restore boolean = false
 * @param saveimg boolean = false
 * @returns {___anonymous182_436}
 */
echart_global.getToolBoxWithStackOnlyEN = function(show,magicType,restore,saveimg){
	show = show || false;
	magicType = magicType||false;
	restore = restore||false;
	saveimg = saveimg||false;
    return {
        show : show,
        feature : {
            magicType : {title:{'stack':'stack','tiled':'tiled'},show: magicType, type: ['stack','tiled']},
            restore : {title:"restore",show: restore},
            saveAsImage : {title:"saveAsImage",show: saveimg,lang:["click to save"]}
        }
    }
}

/**
 * @param trigger 'item' or 'axis',
 * @param formatter a string contains:</br>
 * 	{a} : series name </br>
 *  {b} : data name </br>
 *  {c} : data value </br>
 *  {d} : (1) percentage of pie chart only, or (2)front end name of line</br>
 *  {e} : end name of line</br>
 * 
 * @returns
 */
echart_global.getTooltip= function(trigger,formatter)
{
	return trigger? {
        trigger: trigger,
        formatter: formatter?formatter:"{b}:{c}"
    }:{};
}

echart_global.createLegend = function(series)
{
	var legendlist = [];
	for (key in series){
		var item = series[key]
		legendlist.push(item.name)
	}
	return {data:legendlist}
}

/**
 * @param title title
 * @param toolbox getToolBoxEN (show,no_magicType,show_restore,show_saveImg)
 * @param tooltip getTooltip("axis")
 */

echart_global.createGeneralEchartOption = function(title,toolbox,tooltip){
	return {
		title:title?{
				show:true,
				text:title,
				textStyle:{
					fontSize: 18,
				    fontWeight: 'bolder',
				    color: '#333'
				},
			}:{},
		toolbox:toolbox?toolbox:echart_global.getToolBoxEN(true,false,false,true),
		tooltip:tooltip?tooltip:echart_global.getTooltip("axis"),
		grid:{y:80}
	}
	
}
echart_global.createGeneralTimeLineEchartOption = function(timeline,options){
	return {
		timeline:timeline,
		options:options
	}
}

echart_global.refreshList = {};

/**
 * params = {
 * chartName = "",
 * (not implemented yet)filters = ["building","level","zone","time"],
 * callback = function(args),
 * freshing = false;
 * }
 * 
 */
echart_global.register_refresh = function(divId,params){
	//console.log("register_refresh",divId,params);
	echart_global.refreshList[divId] = params;
	params.refreshing = false;
	if (echart_global.filter != null){
		echart_global.filter.redraw();
	}
}
echart_global.refresh_all = function(args){
	for(key in echart_global.refreshList){
		echart_global.refresh(key,args);
	}
	if (echart_global.filter){
		echart_global.filter.enable_refresh_all(false);
	}
}
echart_global.set_refreshing = function (key,refreshing){
	params = echart_global.refreshList[key];
	params.refreshing = refreshing;
	if (echart_global.filter && echart_global.filter.current_chart_key == key){
		echart_global.filter.enable_refresh(!refreshing);
	}
}
echart_global.is_refreshing = function (key){
	params = echart_global.refreshList[key];
	//console.log("refreshing",params);
	if (params && params.refreshing != null){
		return params.refreshing;
	}else{
		return false;
	}
}

echart_global.refresh = function(key,args){
	params = echart_global.refreshList[key];
	if (params && params.callback!= null)
		if (!params.refreshing){
			params.refreshing = true;
			params.callback(args);
			console.log("refresh chart:"+key);
			return true;
		}else{
			console.log("not refresh chart:"+key);
			return false;
		}
}