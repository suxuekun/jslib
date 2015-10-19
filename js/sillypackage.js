(function(_global){
	var sillypackage = function(){
	};
	var createNode = function(parent,node){
		if (parent[node] == null){
			parent[node] = {}
		}
		return parent[node];
	}
	var deepExtend = function(target,source){
		for (var key in source){
			var s = source[key];
			var t = target[key];
			if (!t) t = {};
			if (s && typeof(s) == 'object'){
				deepExtend(t,s);
			}else{
				t = source[key];
			}
			target[key] = t;
		}
	}
	var createHierarchy = function(name){
		if (typeof name != 'string' || name.length ==0) return;
		var hierarchy = name.split(".");
		var parent = _global;
		for (var key in hierarchy){
			var node = hierarchy[key];
			parent = createNode(parent, node);
		}
		return parent;
	}
	var p = {
			createHierarchy:createHierarchy,
			deepExtend:deepExtend,

	}
	sillypackage.prototype = p;
	_global.sillypackage = new sillypackage();
})(window);