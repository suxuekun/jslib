(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//--wilasCanvas
(function(_global){

	// utils--
	function createStringFromDate(){
		return new Date().getTime().toString(36);
	}
	function getRandomStr(len) {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < len; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    return text;
	}
	function createID(len){
		if (!len) len = 16;
		if (len <4) flag = 0;
		else flag = len -4;
		var s = createStringFromDate();
		if (s.length >flag){
			s= s.subString(0,flag);
		}
		var rest = len - s.length;
		var s2 = getRandomStr(rest);
		var result = s+s2;

		return result;
	}
	function sortByKey(array, key) {
	    return array.sort(function(a, b) {

	        var x = a[key];
	        var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}

	var deepExtend = function(target, source) {
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
	var copyRect = function(rect){
		var copy = []
		for (var key in rect){
			var item = rect[key]
			copy.push(item);
		}
		return copy;
	}

	var enLargeRect = function(rect,l){
		var x = rect[0]-l;
		var y = rect[1]-l;
		var x2 = rect[2]+l;
		var y2 = rect[3]+l;
		return [x,y,x2,y2];
	}

	var combineRect = function(r1,r2){
		var x=r1[0] < r2[0] ? r1[0]:r2[0];
		var y=r1[1] < r2[1] ? r1[1]:r2[1];
		var x2=r1[2] > r2[2] ? r1[2]:r2[2];
		var y2=r1[3] > r2[3] ? r1[3]:r2[3];
		return [x,y,x2,y2];
	}
	var diffRect = function(r1,r2){
		var x=r1[0] > r2[0] ? r1[0]:r2[0];
		var y=r1[1] > r2[1] ? r1[1]:r2[1];
		var x2=r1[2] < r2[2] ? r1[2]:r2[2];
		var y2=r1[3] < r2[3] ? r1[3]:r2[3];
		return [x,y,x2,y2];
	}
	var hitTest = function(pos,rect){
		return pos.x >=rect[0] && pos.x<=rect[2] && pos.y>=rect[1] && pos.y <=rect[3];
	}
	var hitTestRect = function(r1,r2){
		return !isZeroRect(diffRect(r1,r2));
	}

	var isZeroRect = function(rect){
		return rect == null || (rect[0] == 0 && rect[1] == 0 && rect[2] == 0 && rect[3] ==0) || rect[0] == rect[1] == rect[2] == rect[3];
	}

	var MOUSE = "mouse";
	var ACTIONS = ["move","over","out","down","up"];
	var MOUSEACTIONS = ["click"];
	for (var key in ACTIONS){
		MOUSEACTIONS.push(MOUSE+ACTIONS[key]);
	}

	//---- animation
	var Animation = function(){
		var __init = function(){
			this.heartBeat = null;
			this.list = [];
			this.requestAnimationFrame = window.requestAnimationFrame;
			this.cancelAnimationFrame = window.cancelAnimationFrame;
			this.loop = function(){
				var _self = this;
				this.heartBeat = window.requestAnimationFrame(function(){
					_self.loop.call(_self);
					for (var key in _self.list){
						movie = _self.list[key];
						movie.play();
					}
				})
			}
		}
		__init.call(this);
	}
	Animation.prototype = {
		start:function(){
			this.loop();
		},
		stop:function(){
			if (this.heartBeat){
				cancelAnimationFrame(this.heartBeat);
			}
		},
		register:function(movie){
			if (movie == null) return;
			var index = this.list.indexOf(movie);
			if (index == -1){
				this.list.push(movie);
			}
		},
		unregister:function(movie){
			var index = this.list.indexOf(movie);
			if (index > -1){
				this.list.splice(index,1);
			}
		}
	}

	var EFFECTS = {}
	var BaseEffect = function(option){
		this.setOption(option);
	}
	BaseEffect.prototype= {
		count:0,
		setShape:function(shape,done){
			this.shape = shape;
			if (!done && shape != null){
				shape.addEffect(this,true);
			}
		},
		setOption:function(option){
			this.option = option;
		},
		play:function(){

		}
	}
	EFFECTS.BaseEffect = BaseEffect;

	var CircleBounce = function(option){
		BaseEffect.call(this,option);
	}
	CircleBounce.prototype = {};
	deepExtend(CircleBounce.prototype,BaseEffect.prototype);
	CircleBounce_prototype_ext= {
		count:0,
		length:0,
		step:1,
		max:5,
		min:0,
		interval:5,
		setShape:function(shape,done){
			BaseEffect.prototype.setShape.call(this,shape,done);
			this.circle = this.shape;
			this.originR = this.shape.r;

		},
		setOption:function(option){
			BaseEffect.prototype.setOption.call(this,option);
			if (!option) return;
			this.count = option.count || this.count;
			this.length = option.length || this.length;
			this.step = option.step || this.step;
			this.max = option.max || this.max;
			this.min = option.min || this.min;
			this.interval = option.interval || this.interval;
		
		},
		play:function(){

			if (this.circle.isOver())
			{
				this.count++;
				if (this.interval <1) this.interval = 1;
				if (this.count%this.interval ==0){
					this.length+=this.step;
					if(this.length >this.max || this.length < this.min){
						this.step = -this.step;
					}
					this.circle.setR(this.circle.r+this.step);
				}
			}else{
				this.circle.setR(this.originR);
				this.count = 0;
				this.length = 0;
				this.step = 1;
			}
		}
	}
	deepExtend(CircleBounce.prototype,CircleBounce_prototype_ext);
	EFFECTS.CircleBounce = CircleBounce;

	//---- layer manager

	var LayerManager = function (){
		var __init = function(){
			this.layers = {};
			this.list = [];
			this.anime = new Animation();
		}
		__init.call(this);
	}
	LayerManager.prototype = {
		getLayers:function(){
			return this.list;
		},
		getLayerMap:function(){
			return this.layers;
		},
		addLayer:function(layer){
			var index = this.list.indexOf(layer);
			if (index >-1) return;
			this.anime.register(layer);
			this.list.push(layer);
			this.layers[layer.getID()] = layer;
		},
		removeLayer:function(layer){
			var index = this.list.indexOf(layer);
			if (index >-1) {
				this.anime.unregister(layer);
				this.list.splite(index,1);
				var l = this.layers[layer.getID()];
				if (l) delete this.layers[layer.getID()];
			}
		},
		createLayer:function(id){
			var layer = new Layer(id);
			this.addLayer(layer);
			return layer;
		}
	}
	//---- layer
	var Layer = function(id,option){
		var __init = function(){
			
			this.canvas = document.createElement("canvas");
			this.canvas.setAttribute("id", id);
			this.canvas.style.position = "absolute";
			
			this.changed = true;
			this.children = [];
			
			this.ctx = this.canvas.getContext('2d');
			this.setOption(option);
		}
		__init.call(this);
	}
	Layer.prototype = {
		getID:function(){
			return this.canvas.getAttribute("id");
		},
		setOption:function(option){
			if (!option) return;
			this.option = option;
			this.setZIndex(option.zIndex || this.zIndex || 0);
			this.update();
		},
		getCanvas:function(){
			return this.canvas;
		},
		getContext:function(){
			return this.ctx;
		},
		setZIndex:function(z){
			this.zIndex = z;
			this.canvas.style.zIndex = this.zIndex;
		},
		getRect:function(){
			return [0,0,this.canvas.width,this.canvas.height];
		},
		isChanged:function(){
			return this.changed;
		},
		play:function(){
			for(var childKey in this.children){
				var child = this.children[childKey];
				child.play();
			}
			this.redraw();
		},
		clear:function(rect){
			this.changed = false;
			if (this.option && this.option.background){
				rect = null;
			}

			
			if (rect == null){
				rect = this.getRect();
			}else{
				rect = diffRect(rect,this.getRect());
			}

			if (!isZeroRect(rect)){

				this.ctx.clearRect.apply(this.ctx,rect);
				if (this.option && this.option.background){
					this.ctx.save();
					this.ctx.fillStyle = this.option.background;
					this.ctx.globalAlpha = this.option.backgroundAlpha || 1;
					this.ctx.fillRect.apply(this.ctx,rect);
					this.ctx.restore();
				}
			}


		},
		update:function(){
			this.changed = true;
		},
		redraw:function(){
			var layerChange = false;
			for(var childKey in this.children){
				var child = this.children[childKey];
				if (child.isChanged()){
					layerChange = true;
					break;
				}
			}
			if (!layerChange && !this.changed) return;

			var rect = null;
			for(var childKey in this.children){
				var child = this.children[childKey];
			
				var oldRect = child.getPreRect();
				var newRect = child.getRect();
				var fixRect =combineRect(oldRect,newRect);
				if (rect == null) {
					rect = fixRect;
				}else{
					rect = combineRect(rect,fixRect);
				}
				
			}
			this.clear(rect);
			if (rect != null){
				rect = enLargeRect(rect,2);
				
				for(var childKey in this.children){
					var child = this.children[childKey];
					child.redraw();
				}
			}
		},
		_resize:function(width,height){
			this.canvas.width = width;
			this.canvas.height = height;
			this.update();
		},
		resize:function(){
			this._resize(this.parent.clientWidth,this.parent.clientHeight);
		},
		getChildAt:function(index){
			if (this.children.length > index){
				return this.children[index];
			}else{
				return null;
			}
		},
		getChildByID:function(id){
			for (var key in this.children){
				var child = this.children[key];
				if (child.getID() == id)
					return child;
			}
			return null;
		},
		addChild:function(child,done){
			if (this.children.indexOf(child) > -1 ) return;
			this.children.push(child);
			if (!done){
				child.setParent(this,true);
			}
			this._sortChild();
			this.update();
		},
		removeChild:function(child,done){
			var index = this.children.indexOf(child)
			if (index > -1){
				this.children.splice(index,1);
			}
			if (!done){
				child.setParent(null,true);
			}
			this.update();
			
		},
		_sortChild:function(){
			sortByKey(this.children,"z");
		},
		setParent:function(parent){
			if (this.parent == parent) return;
	
			if (this.parent){
				for (var nameKey in MOUSEACTIONS){
					var name = MOUSEACTIONS[nameKey];

					this.parent.removeEventListener(name,this.mouseFunc);
				}
				this.parent.removeChild(this.getCanvas());
			}
			this.parent = parent;
			if (this.parent){
				for (var nameKey in MOUSEACTIONS){
					var name = MOUSEACTIONS[nameKey];

					var _self = this;
					var func = function(e){
						_self.on(e);
					}
					this.mouseFunc = func;
					this.parent.addEventListener(name,func);
				}
				this.parent.appendChild(this.getCanvas());
				this.resize();
			}
			

		},
		on:function(e){
			if (this.parent){

				// var tx = e.pageX;
				// var ty = e.pageY;
				// console.log(e.layerX,e.layerY)

				// var parentNode = this.parent;
				// var oleft = parentNode.offsetLeft;
				// var otop = parentNode.offsetTop;
				// while(parentNode.offsetParent){
				// 	parentNode = parentNode.offsetParent;
				// 	oleft += parentNode.offsetLeft;
				// 	otop += parentNode.offsetTop;
				// }

				// var offset = {
				// 	left:oleft,// + document.body.scrollLeft,
				// 	top:otop,// + document.body.scrollTop,
				// }

				// var x = tx-offset.left;
				// var y = ty-offset.top;
		


				// var transform = this.parent.style.transform;
				// if (transform && transform!= "none"){
				// 	var origin = this.parent.style.transformOrigin;
				// 	console.log('origin',origin,this.parent.style)
				// 	var matrix = transform.match(/-?[\d\.]+/g);

				// 	console.log('tras',this.ctx);

				// 	var a = matrix[0];
				// 	var d = matrix[3];
				// 	var e = Math.floor(matrix[4]);
				// 	var f = Math.floor(matrix[5]);
				// 	console.log(x,y,a,d,e,f,x/a)
				// 	x = Math.floor((x-e)/a);// + Math.floor(e);
				// 	y = Math.floor((y-f)/d);// + Math.floor(f);
				// }
			}
			var x = e.offsetX;
			var y = e.offsetY;

			var pos={x:x,y:y};
			for (var key in this.children){
				var child = this.children[key];
				child.on(e,pos);
			}
			if (this.option && this.option.on){
				this.option.on(e,pos);
			}
		}
	}
	//------------

	var Shape = function(option){
		var __init = function(option){
			this.id = createID();
			this.rect = [0,0,0,0];
			this.preRect = [0,0,0,0];
			this.changed = false;
			this.isMouseOver = false;
			this.anime = null;
			this.setOption(option);
		}
		__init.call(this);
	}
	Shape.prototype = {
		getID:function(){
			return this.id;
		},
		setOption:function(option){
			if (!option) return;
			this.option = option;
			this.x =this.option.x || this.x || 0;
			this.y =this.option.y || this.y || 0;
			this.effects = this.option.effects || this.effects || [];
			if(this.parent){
				if (this.option.z && this.z != this.option.z){
					this.z = this.option.z;
					this.parent._sortChild();
				}
			}
			this.z = this.option.z || this.z || 0;
			this._resetRect();
		},
		play:function(){
			if (this.option){
				if (this.option.play){
					this.option.play.call(this.option.playContext,this.option.playArg);
				}
				if (this.option.effects){
					for (var key in this.option.effects){
						var effect = this.option.effects[key];
						if (effect.shape == null) effect.setShape(this,true);
						effect.play();
					}
				}
				
			}
			
		},
		draw:function(){
			if (this.anime == null){
				this.changed = false;
			}else{
			
			}
			this.preRect = copyRect(this.rect);
			// console.log('draw',this.z);
			//overwrite
		},
		_resetRect:function(){
			//overwrite
		},
		redraw:function(){
			this.draw();
		},
		getRect:function(){
			return this.rect;
		},
		getPreRect:function(){
			return this.preRect;
		},
		setX:function(x){
			if (x != this.x){
				this.changed = true;
				this.x = x;
				this._resetRect();
			}
		},
		setY:function(y){
			if (y != this.y){
				this.changed = true;
				this.y = y;
				this._resetRect();
			}
		},
		setPos:function(x,y){
			if (x != this.x || y != this.y){
				this.changed = true;
				this.x = x;
				this.y = y;
				this._resetRect();
			}
		},
		isChanged:function(){
			return this.changed;
		},
		setParent:function(parent,done){
			if (!done){
				if (this.parent){
					this.parent.removeChild(this,true);
				}
			}
			this.parent = parent;
			if (!done){
				if (this.parent){
					this.parent.addChild(this,true);
				}
			}
		},
		getOption:function(){
			return this.option;
		},
		on:function(e,pos){
			if (hitTest(pos,this.rect)){
				this.isMouseOver = true;
				if (this.option && this.option.highlight){
					this.startAnime(this.option.highlight);
				}
				if (this.option && this.option[e.type]){
					var func = this.option[e.type];
					func.apply(this,[e,pos]);
					
				}
			}else{
				if (this.option && this.option.highlight){
					this.stopAnime();
				}
				this.isMouseOver = false;
			}

		},
		isOver:function(){
			return this.isMouseOver;
		},
		startAnime:function(anime){
			this.anime = anime;
			this.redraw();
		},
		stopAnime:function(){
			this.anime = null;
		},
		addEffect:function(effect,done){
			if (!this.effects) this.effects = [];
			var index = this.effects.indexOf(effect);
			if (index < 0){
				this.effects.push(effect)
				if (!done){
					effect.setShape(this,true);
				}
				
			}
		},
		removeEffect:function(effect,done){
			if (!this.effects) return;
			var index = this.effects.indexOf(effect);
			if (index > -1){
				this.effects.splice(index,1);
				if (!done){
					effect.setShape(null,true);
				}
				
			}
		}
	}

	//---------
	var Circle = function(option){

		var __init = function(){
			this.setOption(option);
			this._resetRect();
		}
		Shape.call(this,option);
		__init.call(this);
	}
	Circle.prototype = {};
	deepExtend(Circle.prototype,Shape.prototype);

	circle_proto_ext = {
		RADIUS:10,
		COLOR:"red",
		setOption:function(option){
			if (option == null) return;
			Shape.prototype.setOption.call(this,option);
			this.r = option.r || this.RADIUS;
			this.style = option.color || option.style || this.COLOR;
		},
		draw:function(){
			Shape.prototype.draw.call(this)
			var ctx = this.parent.getContext()
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false)
			ctx.fillStyle = this.style;
			ctx.fill();
			ctx.restore();
		},
		setR:function(r){
			if (this.r != r){
				this.changed = true;
				this.r = r;
				this._resetRect();
			}
		},
		setXYR:function(x,y,r){
			if (this.r != r || this.x!=x || this.y != y){
				this.changed = true;
				this.x = x;
				this.y = y;
				this.r = r;
				this._resetRect();
			}
		},
		_resetRect:function(){
			this.rect[0] = this.x-this.r;
			this.rect[1] = this.y-this.r;
			this.rect[2] = this.x+this.r;
			this.rect[3] = this.y+this.r;
		},
	}
	deepExtend(Circle.prototype,circle_proto_ext);

	shapes = {
		Circle:Circle,
	};
	//------
	wilasCanvasLite = {
		LayerManager:LayerManager,
		Layer:Layer,
		Shape:Shape,
		Animation:Animation,
		shapes:shapes,
		effects:EFFECTS,
	}
	_global.wilasCanvasLite = wilasCanvasLite;
	
})(window);