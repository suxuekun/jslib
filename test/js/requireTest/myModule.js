(function(_global){
	var name = "main";
    function printName(){
        console.log(this.name);
                console.log('jquery is ',$);
    }
    function setName(name){
    	this.name = name;
    }
	var myModule = {
		name:name,
		setName:setName,
		printName: printName
	};

if ( typeof module === "object" && module && typeof module.exports === "object" ) {

	module.exports = myModule;
} else {
	if (_global.myModule == null){
		_global.myModule = myModule;
		console.log('mymodule assign');
	}

	if ( typeof define === "function" && define.amd ) {
		console.log('mymodule define');
		define('myModule', function () {return _global.myModule; } );
	}
}
})(window);

(function(_global){
	var name = 'sub';
    function printName(){
        console.log(this.name);
        console.log('jquery is ',$);
    }
    function setName(name){
    	this.name = name;
    }
	var submodule2 = {
		name:name,
		setName:setName,
		printName: printName
	};

	if ( typeof module === "object" && module && typeof module.exports === "object" ) {

		module.exports = myModule;
	} else {
		if (!_global.myModule){
			_global.myModule = {};
		}
		if (!_global.myModule.submodule2){
			_global.myModule.submodule2 = submodule2;
		}

		console.log("mymodule.submodule2 assign")
		if ( typeof define === "function" && define.amd ) {
			console.log("mymodule.submodule2 define")
			define( 'myModule.submodule2',['myModule'],function () {return _global.myModule.submodule2; } );
		}
	}
})(window);