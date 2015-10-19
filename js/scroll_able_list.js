(function(_global){
	var ROOT_CLASS = "search_able_list";
	var SEARCH_CLASS = "search";
	var LIST_CLASS = "list";
	var ITEM_CLASS = "list_item";
	var HIDE_CLASS = "item_hidden";
	var SELECT_CLASS = "item_select";
	var innerHtml='<input class = "'+SEARCH_CLASS+'" type = "text"></input><div class="'+LIST_CLASS+'"></div></div>';
	var ITEM = '<div id = "{id}" class = "'+ITEM_CLASS+'">{label}</div>';
	var NAMESPACE = "AEFFCC_";

	var EVENT ={
		CHANGE:"CHANGE",
		INPUT:"INPUT",
	}

	var getOriginId = function(id,force){
		if (id.indexOf(NAMESPACE) <0) {
			if (force){
				return id;
			}else{
				return "";
			}
		}
		else return id.substring(NAMESPACE.length);
	}
	var getItemIDFromOriId = function(oriID){
		return NAMESPACE + oriID;
	}

	var DEFAULT_OPTION = {
		selectAble:true,
		multiSelect:false,
	};
	function SearchAbleList(id){
		this.id = id;
		this.data = null;
		this.root = $("#"+id);
		this.root.html(innerHtml);
		this.option = {};
		this.handlers = {};
		this.setOption(DEFAULT_OPTION);
	}
	SearchAbleList.prototype.EVENT = EVENT;

	/**
	*{<br/>
		selectAble:true,<br/>
		multiSelect:false,<br/>
	}<br/>
	*/
	SearchAbleList.prototype.setOption = function(option){
		for (k in DEFAULT_OPTION){
			this.option[k] = option[k] || DEFAULT_OPTION[k];
		}
		if (!this.option.selectAble){
			this.clearSelect();
		}
	}
	SearchAbleList.prototype.bind = function(event,callback){
		if (!this.handlers[event]){
			this.handlers[event] = [];
		}
		this.handlers[event].push(callback);
	}
	SearchAbleList.prototype.getOriginId = getOriginId;
	SearchAbleList.prototype.getItemIDFromOriId = getItemIDFromOriId;
	SearchAbleList.prototype.nameSpace = NAMESPACE;

	SearchAbleList.prototype.getSearch = function(){
		return this.root.find("."+SEARCH_CLASS);
	}
	SearchAbleList.prototype.getList = function(){
		return this.root.find("."+LIST_CLASS);
	}
	SearchAbleList.prototype.allItem = function(){
		return this.root.find("."+ITEM_CLASS);
	}
	SearchAbleList.prototype.search = function(text){
		if (!text) text = "";
		this.getSearch().val(text);
		this.getSearch().trigger("input");
	}
	SearchAbleList.prototype.ready = function(){
		this.bindSearch();
		this.bindSelect();
	}
	SearchAbleList.prototype.list = function(data){
		this.data = data;
		this.getList().html("");
		var innerhtml = "";
		$.each(data,function(id,v){
			var item = ITEM.replace("{id}",getItemIDFromOriId(id)).replace("{label}",v.label);
			innerhtml+=item;
		});
		this.getList().html(innerhtml);
		var height = this.root.outerHeight() - this.getSearch().outerHeight();
		this.getList().css("height",height)
	}
	SearchAbleList.prototype.getData = function(){
		return this.data;
	}

	SearchAbleList.prototype.clearSelect = function(){
		var $all =this.allItem();
		$all.each(function(i,e){
			var item = $all.eq(i);
			item.removeClass(SELECT_CLASS);
		});
	}

	SearchAbleList.prototype.isSelected = function (id){
		var itemID = this.getItemIDFromOriId(id);
		var item = this.root.find("#"+itemID);
		if (item && item.hasClass(SELECT_CLASS))
			return true
		return false;
	}

	SearchAbleList.prototype.toggle = function(id){
		if (this.isSelected(id)){
			return this.unSelect(id);
		}else{
			return this.select(id);
		}
	}

	SearchAbleList.prototype.unSelect = function(id){
		return this.changeSelectState(id,false);
	}

	SearchAbleList.prototype.select = function(id){
		return this.changeSelectState(id,true);
	}
	SearchAbleList.prototype.changeSelectState = function(id,status){
		var itemID = this.getItemIDFromOriId(id);
		if (this.option.selectAble){
			item = this.root.find("#"+itemID);
			if (status){
				if (!this.option.multiSelect)
				{
					this.clearSelect();
				}
				item.addClass(SELECT_CLASS);
			}else{
				item.removeClass(SELECT_CLASS);
			}
			return id;
		}
		return null;
	}
	SearchAbleList.prototype.getSelections = function(){
		var $all =this.allItem();
		var list = [];
		$all.each(function(i,e){
			var item = $all.eq(i);
			if (item.hasClass(SELECT_CLASS)){
				id = e.id;
				oriID = search_able_list.getOriginId(id);
				if (oriID!= ""){
					list.push(oriID);
				}
			}
		});
		return list;
	}
	SearchAbleList.prototype.dispatchEvent = function(name,event){
		if (this.handlers[name]){
			for (key in this.handlers[name]){
				callback = this.handlers[name][key];
				callback(event);
			}
		}
	}

	SearchAbleList.prototype.clickItem = function(e){
		id = this.getOriginId(e.target.id);
		if (id == "") return;
		result = this.toggle(id);
		if (result){
			this.dispatchEvent(EVENT.CHANGE,e);
		}
	}
	SearchAbleList.prototype.searchChange = function(e){
		var search = this.getSearch();
		var list = this.getList();
		var search_text = search.val();
		var search_arr = search_text.split(" ");
		$.each(search_arr,function(i,v){
			search_arr[i] = $.trim(v);
		})
		var $all =this.allItem();
		$all.each(function(i,e){
			
			var item = $all.eq(i);
			var name = item.html();
			var success = true;
			$.each(search_arr,function(i,v){
				var current_search = search_arr[i];
				if (current_search == "") return;
				if (name.indexOf(current_search)<0){
					success = false;
					return false;
				}
			})
			if (success){
				item.removeClass(HIDE_CLASS);
			}else{
				item.addClass(HIDE_CLASS);
			}
		});
		this.dispatchEvent(EVENT.INPUT,e);
	}
	SearchAbleList.prototype.bindSearch = function(){
		this.getSearch().bind('input',$.proxy(this.searchChange,this));
	}
	SearchAbleList.prototype.bindSelect = function(){
		this.root.bind("click",$.proxy(this.clickItem,this));
	}
	var searchAbleListPlugin = {};
	searchAbleListPlugin.list = [];
	searchAbleListPlugin.init = function(id){
		var instance = searchAbleListPlugin.list[id];
		if (instance == null || instance == undefined){
			instance = new SearchAbleList(id);
			$(function(){
				instance.ready();
			});
			searchAbleListPlugin.list[id] = instance;
		}
		return instance;
	}
	searchAbleListPlugin.has = function(id){
		return searchAbleListPlugin.list[id]!=null;
	}
	_global.searchAbleListPlugin = searchAbleListPlugin;
})(window);