(function(_global){
	var defineProp = Object.defineProperty;
	var defaultKeys = ["initialize","uper","constructor","class"];
	var defaultKeyConfig = {
		configurable:false,
		enumerable:false,
		writeable:false,
	}
	var customizedKeyConfig = {
		configurable:false,
		enumerable:true,
		writeable:false,
	}

	function defineClass(option){
		if (!option || typeof option != "object") {
			option = {};
		}
		var className = option.className || "";
		var initialize = option.initialize || function(){};
		var uper = option.uper || null;
		var methods = option.methods || {};
		var attributes = option.attributes || {};
		//default
		// class
		var clazz = new Function(
		     "return function " + className + "(){this.initialize.apply(this,arguments);}"
		)();

		// super
		if (uper != null){
			clazz.prototype = Object.create(uper.prototype);
			clazz.prototype.uper = uper.prototype;
		}else{
			clazz.prototype = {
				uper:null
			};
		}
		// constructor class
		// initialize

		clazz.prototype.constructor = clazz.prototype.class = clazz;
		clazz.prototype.initialize = initialize;

		for (var l in defaultKeys){
			var keyName = defaultKeys[l];
			defineProp(clazz.prototype,keyName,defaultKeyConfig);
		}
		//customize 
		// attributes
		// methods

		for (var key in methods){
			clazz.prototype[key] = methods[key];
			defineProp(clazz.prototype,key,customizedKeyConfig)
		}
		for (var key in attributes){
			clazz.prototype[key] = attributes[key];
			defineProp(clazz.prototype,key,customizedKeyConfig)
		}
		return clazz;
	}

	function definePackage(package){

	}
})(window)