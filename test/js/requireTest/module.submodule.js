(function(_global){
	var name = 'sub';
    function printName(){
        console.log(this.name);
        console.log('jquery is ',$);
    }
    function setName(name){
    	this.name = name;
    }
	var submodule = {
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
	_global.myModule.submodule = submodule;

	if ( typeof define === "function" && define.amd ) {
		define(function () {return _global.myModule.submodule; } );
	}
}
})(window);