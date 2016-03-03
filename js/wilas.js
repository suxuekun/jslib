(function(_global){
	function deepExtend(target, source) {
		for ( var key in source) {
			var s = source[key];
			var t = target[key];
			if (s && typeof (s) == 'object') {// object or array
				if (!t) {
					t = s.constructor();
				}
				deepExtend(t, s);
			} else {
				t = source[key];// function or normal attr
			}
			target[key] = t;
		}
	}
	/**
	*	name: wilas.xx.oo
	*	module: the module that will named as wilas.xx.oo
	*	if wilas.xx.oo exist, will cover merge
	*	return merged module
	*/
	function createNormalModule(module){
		var moduleName = module.moduleName;
		// clear pre condition(dependence)
		var chain = moduleName.split("\.");
		var childName = "";
		var key = "";
		var currentChain = window;
		for (key in chain){
			childName = chain[key];
			if (currentChain[childName] == null){
				currentChain[childName] = {};
			}
			currentChain = currentChain[childName];
		}
		deepExtend(currentChain,module);
		var exports = currentChain;
		return exports;
	}
	/**
	*	fix as AMD module
	*/
	function supportAMD(module,deps,moduleName){
		if (typeof define === "function" && define.amd ) {
			//AMD
			if (deps){
				if (moduleName){
					define(moduleName,deps,function () {return module} );
				}else{
					define(deps,function () {return module} );
				}
			}else{
				if (moduleName){
					define(moduleName,function () {return module} );
				}else{
					define(function () {return module} );
				}
			}
			
		}
	}
	function support(module,deps,moduleName){
		module = createNormalModule(module);
		supportAMD(module,deps,moduleName);
	}
	var moduleName = "wilas";
	var wilas = {
		moduleName:moduleName,
		deepExtend:deepExtend,
		createNormalModule:createNormalModule,
		supportAMD:supportAMD,
		support:support,

	};
	//createNormalModule(wilas);
	support(wilas,null,moduleName);
})(window)