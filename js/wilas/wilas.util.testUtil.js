(function(_global){
	
	//define
	var testUtil = {
			wtf:"wtfTest",
			whatisjquery2:function(){
				console.log("jquery is ",$)
			},
		}

	if (wilas){
		var moduleName = "wilas.util.testUtil";
		var deps = ["jquery"];
		testUtil.moduleName = moduleName;
		// if(wilas.createNormalModule && typeof wilas.createNormalModule == "function"){
		// 	testUtil = wilas.createNormalModule(testUtil);
		// }
		// if(wilas.supportAMD && typeof wilas.supportAMD == "function"){
		// 	wilas.supportAMD(null,testUtil);
		// }
		wilas.support(testUtil,deps);
	}
})(window);