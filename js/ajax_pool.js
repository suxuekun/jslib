
(function(_global){
	var AjaxQueue = function(name){
		this.name = name;
		this.ajax_waiting_list = [];
		this.ajax_current = null;
	}
	
	AjaxQueue.prototype.ajax_success = function(data){
		if (this.ajax_current.context){
			this.ajax_current.success.apply(this.ajax_current.context,[data]);
		}else{
			this.ajax_current.success(data);
		}
	}
	AjaxQueue.prototype.ajax_complete = function(data){
		if (this.ajax_current.context){
			this.ajax_current.complete.apply(this.ajax_current.context,[data]);
		}else{
			this.ajax_current.complete(data);
		}
		this.ajax_current = null;
		if (this.ajax_waiting_list.length>0){
			var next = this.ajax_waiting_list.shift();
			this.ajax(next);
		}
	}
	AjaxQueue.prototype.ajax = function(ajaxObj){
		if (this.ajax_current == null){
			this.ajax_current = ajaxObj;
			var new_ajax_obj = {};
			for (key in ajaxObj){
				new_ajax_obj[key] = ajaxObj[key];
			}
			new_ajax_obj.context = this;
			new_ajax_obj.success = this.ajax_success;
			new_ajax_obj.complete = this.ajax_complete;
			$.ajax(new_ajax_obj);
		}else{
			this.ajax_waiting_list.push(ajaxObj);
		}
	}
	AjaxQueue.prototype.ajax_only_next = function (ajaxObj){
		this.clear();
		this.ajax(ajaxObj);
	}
	AjaxQueue.prototype.clear = function(){
		this.ajax_waiting_list.length = 0;
	}
	AjaxQueue.prototype.getWaitingCount = function(){
		return this.ajax_waiting_list.length;
	}
	AjaxQueue.prototype.isAjaxing = function(){
		return this.ajax_current !=null;
	}
	AjaxQueue.prototype.isFree = function(){
		return (this.getWaitingCount() == 0 && this.isAjaxing);
	}
	
	var pools = {};
	var AjaxPool = {};
	AjaxPool.getQ = function(name){
		if (pools[name] == null){
			pools[name] = new AjaxQueue(name);
		}
		return pools[name];
	}
	_global["AjaxPool"] = AjaxPool;
})(window)

