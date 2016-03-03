(function(_global){
	var add = function (x,y){
		return x+y;
	};
	var func = function(){
		return {
			count:0,
			prototype:{}
		}
	}
	func.prototype.add = add;
	func.prototype.getCount = function(){return this.count},
	func.prototype.plus = function(){
		this.count ++;
		console.log(this,this.count);
	}
	//define(func);
	_global.wtfthis = func();
})(window);