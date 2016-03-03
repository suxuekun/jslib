
(function(_global){
	var AjaxPool = function(name){
		this.name = name;
		this.ajax_waiting_list = [];
		this.ajax_current = null;
	}
	
	AjaxPool.prototype.ajax_success = function(data){
		if (this.ajax_current.context){
			this.ajax_current.success.apply(this.ajax_current.context,[data]);
		}else{
			this.ajax_current.success(data);
		}
	}
	AjaxPool.prototype.ajax_complete = function(data){
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
	AjaxPool.prototype.ajax = function(ajaxObj){
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
	AjaxPool.prototype.ajax_only_next = function (ajaxObj){
		this.clear();
		this.ajax(ajaxObj);
	}
	AjaxPool.prototype.clear = function(){
		this.ajax_waiting_list.length = 0;
	}
	
	var pools = {};
	var AjaxPools = {};
	AjaxPools.getPool = function(name){
		if (pools[name] == null){
			pools[name] = new AjaxPool(name);
		}
		return pools[name];
	}
	_global["AjaxPools"] = AjaxPools;
})(window)

