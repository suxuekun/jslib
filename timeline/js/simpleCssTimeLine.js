(function(_global){
	var class_root = "timeline_container";
	var class_layer = "timeline_layer";
	var class_timeline = "timeline";
	var class_pointer = "time_pointer";
	var class_niddle = "time_pointer_niddle"

	var layer_header = "time_line_"

	var ACTION = {}
	ACTION.GLOBAL = "global";
	ACTION.LOCAL = "local";
	ACTION.NONE = "none";
	var EVENT = {};
	EVENT.CHANGE = "change";
	var SORT ={};
	SORT.DESC = "desc";
	SORT.ASC = "ASC";
	SORT.NONE = "none";

	var desc_sort = function(a,b){
			    if(a.id < b.id) {
			        return 1;
			    } else {
			        return -1;
			    }
			}
	var asc_sort = function(a,b){
			    if(a.id < b.id) {
			        return -1;
			    } else {
			        return 1;
			    }
			}

	function SimpleCssTimeLine(parent){
		this.parent = parent;
		this.parent.append('<div class="'+class_root+'"></div>')
		this.root = this.parent.find("."+class_root)
		this.root.addClass(class_root);
		this.option = {};
		this.handlers = {};
		this.children = [];
		this.pointer = null;
		this.niddle = null;
		this.currentChild = null;
		this.currentX = 0;
		this.currentValue = 0;
		this.draging = false;
		this.total = 0;
		$(_global).mousemove($.proxy(this.mousemove,this));
		this.root.mousemove($.proxy(this.mousemove,this));
		$(_global).click($.proxy(this.click,this));
		this.root.click($.proxy(this.click,this));
		$(_global).mouseup($.proxy(this.mouseup,this))
		this.root.mousedown($.proxy(this.mousedown,this));
	}
	SimpleCssTimeLine.prototype.getCurrentChild = function(){
		return this.currentChild;
	}
	SimpleCssTimeLine.prototype.getCurrentChildName = function(){
		if (this.getCurrentChild()){
			return this.getCurrentChild().attr("id");
		}else{
			return null;
		}
		
	}
	
	SimpleCssTimeLine.prototype.getParent = function(){
		return this.parent;
	}
	SimpleCssTimeLine.prototype.getRoot = function(){
		return this.root;
	}
	SimpleCssTimeLine.prototype.mousemove = function(e){
		var x = this.getxFromEvent(e);
		if (this.option){
			if (this.draging){
				this.setPointerX(x);
			}else{
				switch(this.option.move){
					case ACTION.GLOBAL:
						if (e.currentTarget != this.root[0]){	
							this.setPointerX(x);
						}
					break;
					case ACTION.LOCAL:
					if (e.currentTarget == this.root[0]){
						this.setPointerX(x);
					}
					break;
					case ACTION.NONE:
					default:
				}
			}

		}
	}
	SimpleCssTimeLine.prototype.click = function(e){
		var x = this.getxFromEvent(e);
		if (this.option){
			switch(this.option.click){
				case ACTION.GLOBAL:
					if (e.currentTarget != this.root[0]){	
						this.setPointerX(x);
					}
				break;
				case ACTION.LOCAL:
					if (e.currentTarget == this.root[0]){	
						this.setPointerX(x);
					}
				break;
				case ACTION.NONE:
				default:
			}
		}
	}
	SimpleCssTimeLine.prototype.mouseup = function(e){
		this.draging = false;
	}
	SimpleCssTimeLine.prototype.mousedown = function(e){
		if (this.pointer[0] == e.target || this.niddle[0] == e.target){
			if (this.option){
				if (this.option.dragAble){
					this.draging = true;
				}
			}
		}
	}
	
	SimpleCssTimeLine.prototype.defaultOption = {
		colors:["#FF0000","#00FF00","#0000FF"],
		move:ACTION.NONE,
		click:ACTION.LOCAL,
		dragAble:true,
		sort:SORT.DESC,
		data:[{layer:"demo",name:"demoName",value:1}]
	};
	SimpleCssTimeLine.prototype.setOption = function(option){
		this.option = {};
		for (key in this.defaultOption){
			if (option[key]){
				this.option[key] = option[key];
			}else{
				this.option[key] = this.defaultOption[key];
			}
		}
		if(this.option.dragAble == false){
			this.draging = false;
		}
		if (this.option.data == null) return;
		this.redraw()
	}
	SimpleCssTimeLine.prototype.redraw = function(force){
		if (!this.root) return;
		this.root.html("");//clear
		if (!this.option) return;
		if (!this.option.data) return;
		if (this.option.data.length <1) return;
		
		this.total = 0;
		for (key in this.option.data){
			item = this.option.data[key];
			this.total +=item.value;
		}
		if (this.total <=0) return;
		this.scale = this.parent.width()/this.total;
		if (this.scale ==0) return;
		// do redraw
		var layers = {};
		var left = 0;
		var colorIndex = 0;
		var count = 0;
		this.children = [];
		for (key in this.option.data){
			item =this.option.data[key];
			layer = null;
			width = item.value*this.scale;
			if (layers[item.layer] == null){
				layers[item.layer] = {};
				layer=layers[item.layer];
				layer.parentHtml = '<div id=' +layer_header + item.layer+' class ="'+class_layer+'"></div>';
				this.root.append(layer.parentHtml);
				layer.parent = $("#time_line_"+item.layer);
				// layers[item.layer].color = option.colors[colorIndex];
				// colorIndex++;
				// if (colorIndex >=option.colors.length) colorIndex = 0;
				// count ++;
			}
			layer = layers[item.layer];
			childHtml = '<div id = "' +item.name+'" class ="'+class_timeline+'"></div>';
			layer.parent.append(childHtml);
			child = $("#"+item.name);
			child.css("left",left);
			child.css("width",width)
			// child.css("background-color",layer.color);
			left+=width;
			this.children.push(child);
		}
		var time_layers = this.parent.find("." + class_layer);
		if (this.option.sort){
			switch (this.option.sort){
				case SORT.DESC:
				time_layers = time_layers.sort(desc_sort);
				break;
				case SORT.ASC:
				time_layers = time_layers.sort(asc_sort);
				break;
				case SORT.NONE:
				default:
				break;
			}
			
			this.root.html(time_layers);
		}
		var colorList =this.option.colors;
		if (this.option.sort && this.option.sort == SORT.DESC){
			time_layers = $(time_layers.get().reverse());
		}
		time_layers.each(function(){
			$(this).children().each(function(){
				var child = $(this);
				var item = 
				child.css("background-color",colorList[colorIndex])
			})
			colorIndex++;
			if (colorIndex >= colorList.length) colorIndex = 0;
			count ++;
		})
		pointerHtml = '<div class = "' + class_pointer+'""><div class = "'+class_niddle+'""></div></div>'
		this.root.append(pointerHtml);
		this.pointer = this.root.find("."+class_pointer);
		this.niddle = this.root.find("."+class_niddle);
		this.setValue(this.currentValue);
		// this.root.css("width",this.parent.width());

	}
	
	SimpleCssTimeLine.prototype.getxFromEvent = function(e){
		var x =e.pageX-this.getRoot().offset().left;
		if (x<0) x =0;
		if (x>this.root.width()) x = this.root.width();
		return x;
	}
	SimpleCssTimeLine.prototype.getCurrentValue = function(){
		return this.currentValue;
	}
	SimpleCssTimeLine.prototype.getCurrentX = function(){
		return this.currentX;
	}
	
	SimpleCssTimeLine.prototype.getChild = function (x){
		var pre_child = null;
		for (key in this.children){
			child = this.children[key];
			position = child.position();
			// if (x>=position.left && x<position.left+child.width()){
			// 	return child;
			// }
			if (x<position.left){
				return pre_child;
			}
			pre_child = child;
		}
		return child;
	}
	
	SimpleCssTimeLine.prototype.getChildByEvent = function(e){
		var x = this.getxFromEvent(e);
		child = this.getChild(x);
		return child;
	}
	SimpleCssTimeLine.prototype.currentEvent = function(){
		return {
			x:this.currentX,
			value:this.currentValue,
			child:this.getCurrentChild(),
			name:this.getCurrentChildName()
		}
	}

	SimpleCssTimeLine.prototype.setPointerX = function(x,force){
		if (this.pointer){
			var update = true;
			if (this.currentX == x) update = false;
			this.currentChild = this.getChild(x);
			this.currentX = x;
			
			this.scale = this.parent.width()/this.total;
			if (this.scale!=0){
				var changeValue = x/this.scale;
				this.currentValue = changeValue;
			}
			var w_half = (this.pointer.outerWidth(true) + this.niddle.outerWidth(true))/2;
			this.pointer.css("left",x-w_half);
			if (update || force){
				this.dispatchEvent(EVENT.CHANGE,this.currentEvent())
			}
			
		}
	}
	SimpleCssTimeLine.prototype.bind = function(event,callback){
		if (!this.handlers[event]){
			this.handlers[event] = [];
		}
		this.handlers[event].push(callback);
	}
	SimpleCssTimeLine.prototype.dispatchEvent = function(name,event){
		if (this.handlers[name]){
			for (key in this.handlers[name]){
				callback = this.handlers[name][key];
				callback(event);
			}
		}
	}
	SimpleCssTimeLine.prototype.resize = function(name,event){
		this.redraw(true);
	}
	SimpleCssTimeLine.prototype.setValue = function(value){
		// this.currentValue = x/this.scale;
		this.setPointerX(value*this.scale);
	}
	SCTL = {}


	SCTL.ACTION = ACTION;
	SCTL.EVENT = EVENT;
	SCTL.SORT = SORT;

	SCTL.init = function(id){
		timeline = new SimpleCssTimeLine(id);
		return timeline;
	}
	_global.SCTL = SCTL;
})(window);