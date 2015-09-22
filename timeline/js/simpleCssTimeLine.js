(function(_global){
	var class_root = "timeline_container";
	var class_layer = "timeline_layer";
	var class_timeline = "timeline";
	var class_pointer = "time_pointer";
	function SimpleCssTimeLine(parent){
		this.parent = parent;
		this.parent.append('<div class="'+class_root+'"></div>')
		this.root = this.parent.find("."+class_root)
		this.root.addClass(class_root);
		this.option = {};
		this.children = [];
		this.pointer = null;
		this.currentChild = null;
		this.currentX = 0;
		this.currentValue = 0;
		$(_global).mousemove($.proxy(this.mousemove,this));
		this.parent.mousemove($.proxy(this.mousemove,this));
	}
	SimpleCssTimeLine.prototype.getCurrentChild = function(){
		return this.currentChild;
	}
	
	SimpleCssTimeLine.prototype.getParent = function(){
		return this.parent;
	}
	SimpleCssTimeLine.prototype.getRoot = function(){
		return this.root;
	}
	SimpleCssTimeLine.prototype.mousemove = function(e){
		var x = this.getxFromEvent(e);
		if (e.currentTarget == this.parent[0]){	
			this.setPointerX(x);
		}else{
			if (option && option.globalmove){
				this.setPointerX(x);
			}
		}

	}
	
	SimpleCssTimeLine.prototype.defaultOption = {
		colors:["#FF0000","#00FF00","#0000FF"],
		width:1,
		height:10,
		globalmove:false,
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
		this.option = option;
		if (this.option.data == null) return;
		this.redraw()
	}
	SimpleCssTimeLine.prototype.redraw = function(){
		if (!this.root) return;
		this.root.html("");//clear
		if (!this.option) return;
		if (!this.option.data) return;
		if (this.option.data.length <1) return;
		
		var total = 0;
		for (key in this.option.data){
			item =option.data[key];
			total +=item.value;
		}
		if (total <=0) return;
		this.scale = this.option.width/total;
		if (this.scale ==0) return;
		// do redraw
		var layers = {};
		var left = 0;
		var colorIndex = 0;
		var count = 0;
		this.children = [];
		for (key in this.option.data){
			item =option.data[key];
			layer = null;
			width = item.value*this.scale;
			if (layers[item.layer] == null){
				layers[item.layer] = {};
				layer=layers[item.layer];
				layer.parentHtml = '<div id=time_line_' + item.layer+' class ="'+class_layer+'"></div>';
				this.root.append(layer.parentHtml);
				layer.parent = $("#time_line_"+item.layer);
				layer.parent.css("height",option.height);
				layers[item.layer].color = option.colors[colorIndex];
				colorIndex++;
				if (colorIndex >=option.colors.length) colorIndex = 0;
				count ++;
			}
			layer = layers[item.layer];
			childHtml = '<div id = "' +item.name+'" class ="'+class_timeline+'"></div>';
			layer.parent.append(childHtml);
			child = $("#"+item.name);
			child.css("left",left);
			child.css("width",width)
			child.css("background-color",layer.color);
			left+=width;
			this.children.push(child);
		}
		pointerHtml = '<div class = "' + class_pointer+'"></div>'
		this.root.append(pointerHtml);
		this.pointer = this.root.find("."+class_pointer);
		this.root.css("width",this.option.width);
		this.root.css("height",count*this.option.height);

	}
	
	SimpleCssTimeLine.prototype.getxFromEvent = function(e){
		var x =e.pageX-this.getRoot().position().left;
		if (x<0) x =0;
		if (x>option.width) x =option.width;
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
	SimpleCssTimeLine.prototype.setPointerX = function(x){
		if (this.pointer){
			this.currentChild = this.getChild(x);
			this.currentX = x;
			if (this.scale!=0){
				this.currentValue = x/this.scale;
			}		
			this.pointer.css("left",x);
		}
	}
	SCTL = {}
	SCTL.init = function(id){
		timeline = new SimpleCssTimeLine(id);
		return timeline;
	}
	_global.SCTL = SCTL;
})(window);