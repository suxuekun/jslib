(function(_global){
	var sillypackage = function(){
	};
	var getClassName = function(){
		return this.className;
	}
	var createNode = function(parent,className,package){
		if (parent[className] == null){
			var temp = {};
			var CLASS = function(){
				this.className = className;
				this.package = package
			};
			CLASS.prototype={
				getClassName:getClassName,
			}
			parent[className] = CLASS;
		}
		return parent[className];
	}
	var deepExtend = function(target,source){
		for (var key in source){
			var s = source[key];
			var t = target[key];
			if (!t) t = {};
			if (s && typeof(s) == 'object'){
				if (!t) {
					t = s.constructor();
				}
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
		var package = "";
		for (var key in hierarchy){
			var node = hierarchy[key];
			parent = createNode(parent, node,package);
			if (package != "") package+=".";
			package+=node;
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