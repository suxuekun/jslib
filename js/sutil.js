/**
* sutil javascript library version alpha 1.0.0
* https://github.com/suxuekun/sutil.git
*
* utils for Namespace Class Interface in javascript
*
* MIT LICENCE
* 
* @author suxuekun@gmail.com sillyboy
*/
(function(_global){
	var defineProp = Object.defineProperty;
	var defaultKeys = ["initialize","uper","constructor"];

	function _override(clazz,key,method){
		clazz.prototype[key] = method;
		defineProp(clazz.prototype,key,customizedKeyConfig);
	}
	// functions for Class only
	// not functions for instance
	var defaults = {
		interfaces:[],
		override:function(key,method){
			_override(this,key,method);
		},
		overrides:function(methods){
			if (!methods) methods == {};
			for (var key in methods){
				this.override(key,methods[key]);
			}
		},
		impl:function(i,methods){
			if (i){
				this.interfaces.push(i);
			}
			this.extend(methods);
			var implemented = i.check(this);
			if (!implemented && i.warning){
				console.dir(this);
				console.warn("Interface "+ i.name +" is not implemented by Class " + this.name);
			}
		}
	}
	// not enumerable for initialize uper(super) constructor
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

	/**
	* <p> define a Class </p>
	* <p> Class extends Function </p>
	* <p> instance of A Class is usually a Object </p>
	* <p> example:</p>
	* var A = defineClass({className:"A"})//a empty class named "A".
	* var a = new A();// a.__proto__ = A.prototype
	* console.log(a);//a A {}
	* @param options for class
	*			</br>Object{
	*			</br>	className:string
	*			</br>	initialize:function
	*			</br>	uper:Class(super)
	*			</br>	methods:map.<string,function>
	*			</br>	attributes:map.{string,object} ( not deep copy , static of this class)
	*			</br>	interfaces:list[Interface,...];
	*			</br>}
	* @see Interface
	* @return Class
	*/

	function defineClass(option){
		if (!option || typeof option != "object") {
			option = {};
		}
		var className = option.className || "";
		var initialize = option.initialize || function(){};
		var uper = option.uper || null;
		var methods = option.methods || {};
		var attributes = option.attributes || {};
		var interfaces = option.interfaces || [];

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
		// constructor
		clazz.prototype.constructor = clazz;
		// initialize
		clazz.prototype.initialize = initialize;

		//default class methods
		for (var l in defaults){
			clazz[l] = defaults[l];
		}
		for (var l in defaultKeys){
			var keyName = defaultKeys[l];
			defineProp(clazz.prototype,keyName,defaultKeyConfig);
		}

		//customize 
		// attributes
		// methods

		for (var key in methods){
			_override(clazz,key,methods[key]);
		}
		for (var key in attributes){
			_override(clazz,key,attributes[key]);
		}
		// interfaces
		for (var key in interfaces){
			var i = interfaces[key];
			clazz.impl(i);
		}
		return clazz;
	}
	/**
	* <p> get or create namespace </p>
	* <p> organize resource using namespace </p>
	* <p> example: </p>
	* </br>	var ns = getNamespace("org.example",window.app);
	* </br>	var data = {'test':'test'};
	* </br>	ns.data = data;//window.app.org.example.data == {'test':'test'}
	* </br>	this function ensure the namespace exist, if not exist ,create the namespace chain.
	* @param ns 	namespace to get or create, example: org.example.test
	* @param root	root to add this namespace ,default is window
	*
	* @return required namespace reference
	* 
	*/
	function getNamespace(ns,root){
		if (!root) root = _global;
		var chain = ns.split("\.");
		var childName = "";
		var key = "";
		var currentChain = root;
		for (var i=0;i<chain.length;i++){
			childName = chain[i];
			if (currentChain[childName] == null){
				currentChain[childName] = {};
			}
			currentChain = currentChain[childName];
		}
		return currentChain;
	}
	/**
	* <p> Interface </p>
	* <p> example: </p>
	*</br> 	var iPerson = new Interface({
	*</br>		name:'iPerson',
	*</br>		method:''
	*</br>	})
	*@param	option {'name':'isomeInterface',methods:['someFuncNameThatShouldBeImplemented',...]}
	*@return a Interface which can be implements by class
	*/
	var Interface = defineClass({
		className:"Interface",
		initialize:function(option){
			if (!option) option = {};
			this.name = option.name || "";
			this.methods = option.methods || [];
			if (option.warning){
				this.warning = option.warning;
			} 
		},
		attributes:{
			warning:false,
		},
		methods:{
			check:function(clazz){
				if (!clazz) return true;
				for (var l in this.methods){
					var interface_method_name = this.methods[l];
					if (!clazz.prototype[interface_method_name]) {
						return false;
					}
				}
				return true;
			}
		}
	})
	var ns = getNamespace("sutil");
	var sutil = {
		getNamespace:getNamespace,
		defineClass:defineClass,
		Interface:Interface
	}
	for (var key in sutil){
		ns[key] = sutil[key];
	}
})(window)