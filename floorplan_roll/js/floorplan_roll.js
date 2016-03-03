(function(_global){
	var DEFAULT_OPTION = {
		containerHeight:600,
		perspective:1200,
		translateZ:400,
		degree:75,
		itemHeight:200,
		mainMargin:3,
	}
	var TEMPLATE = '<div id = "{id}" idx = {idx} class = "foldContainer"><div class = "card card_fold black">{content}</div></div>';
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
	var clear = function(roll){
		$(roll.container).empty();
	}
	var calcParams = function(option,count){
		var mainMargin = option.mainMargin;
		var itemHeight = option.itemHeight;
		var degree = option.degree;
		var translateZ = option.translateZ;
		var perspective = option.perspective;
		var containerHeight = option.containerHeight;

		var mainHeight = itemHeight*(perspective/(perspective-translateZ));
		var l = (Math.sin(degree/180*Math.PI))*itemHeight;
		var f = (perspective/(perspective+l));
		var subHeight = itemHeight*Math.cos(degree/180*Math.PI) * f;
		var maxHeight = mainHeight+(count-1)*subHeight;

		var base = 0;
		var gap = -15;
		var fix = 18;

		if (maxHeight > containerHeight){
			base = 0;
			var less = maxHeight-containerHeight + mainMargin*2;
			if (count <= 3){
				gap = 0
			}else{
				gap = -less/(count-3);
			}
			fix = -gap + mainMargin;
		}else{
			base = (containerHeight-maxHeight)/(count+1);
			var more = containerHeight-maxHeight - base *2;
			if (count == 1){
				gap = 0
			}else{
				gap = more/(count-1);
			}
			
			fix = 0;
		}
		var step = subHeight + gap;

		var params = {
			count:count,
			mainHeight:mainHeight,
			subHeight:subHeight,
			base:base,
			gap:gap,
			fix:fix,
			step:step,
		}
		console.log(params);
		return params;
	}
	var makeUI = function(roll){
		if (roll && roll.container && roll.option && roll.data){
			var count = roll.params.count;
			var mainHeight = roll.params.mainHeight;
			var subHeight = roll.params.subHeight;
			var base = roll.params.base;
			var gap = roll.params.gap;
			var fix = roll.params.fix;
			var step = roll.params.step;

			$container = roll.container;
			$container.html("");
			var data = roll.data;
			for (var i =0;i<data.length;i++){
				var div = TEMPLATE.replace("{id}",data[i].id).replace("{idx}",i).replace("{content}",data[i].content);
				$container.append(div);
			}
			$cards = $container.find(".card");
			$cards.each(function(){
				var card = $(this);
				var idx = card.parent().attr("idx");
				card.addClass("card_fold");
				card.parent().css("bottom",idx*step+base);
			})
			roll.params.moving = false;

			$cards.mousemove(function(){
				var card = $(this);
				if (card.hasClass("card_unfold")) return;
				roll.params.moving = true;
				var idx = card.parent().attr('idx') >> 0;
				$cards.each(function(){
					var temp = $(this)
					temp.parent()[0].style.zIndex = 0;
					temp.removeClass("card_unfold");
					temp.removeClass("card_fold");
					var idx2 = temp.parent().attr('idx') >> 0;
					if (idx2 < idx){
						temp.addClass("card_fold");
						temp.parent().css("bottom",base + idx2*step);
					}else if (idx2 > idx){
						temp.addClass("card_fold");
						temp.parent().css("bottom",base + idx2*step -subHeight+ mainHeight + fix*2);
					}else{
						temp.parent().css("bottom",base + idx2*step +fix);
						temp.addClass("card_unfold");
					}
				})
				card.parent()[0].style.zIndex = 1;
				setTimeout(function(){
					roll.params.moving = false;
				},200)
			});
		}
	}
	var Roll = function(option){
		this.setOption(option);
	}
	Roll.prototype = {
		setContainer:function(container){
			if (this.container) return false;
			this.container = container;
		},
		setOption:function(option){
			if (this.option == null){
				this.option = {};
				deepExtend(this.option,DEFAULT_OPTION);
			}
			if (option == null) return;
			deepExtend(this.option,option);
			//remakeUI
			setData(this.data);
		},
		setData:function(data){
			if (!data) return;
			if (data.length == 0){
				this.data = data;
				clear(this);
			}
			this.data = data;
			this.params = calcParams(this.option,this.data.length);
			makeUI(this);
		}
	}
	var init = function(div,option){
		var roll = new Roll();;
		roll.setContainer(div);
		roll.setOption(option);
		div.floorplanRoll = roll;
		return roll;
	}


	var floorplanRoll = {
		init:init,
	}
	_global.floorplanRoll = floorplanRoll;
})(window);