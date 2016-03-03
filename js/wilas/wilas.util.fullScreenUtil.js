(function(_global){
	var DEFAULT_FULLSCREEN_CONTAINER = "wilas_fullscreen";
	
	function launchFullScreen(element) {  
		if(element.requestFullscreen) {  
			element.requestFullscreen();  
		} else if(element.mozRequestFullScreen) {  
			element.mozRequestFullScreen();  
		} else if(element.webkitRequestFullscreen) {  
			element.webkitRequestFullscreen();  
		} else if(element.msRequestFullscreen) {  
			element.msRequestFullscreen();  
		}
	}  
	function exitFullscreen() {  
		if(document.exitFullscreen) {  
			document.exitFullscreen();  
		} else if(document.mozExitFullScreen) {  
			document.mozExitFullScreen();  
		} else if(document.webkitExitFullscreen) {  
			document.webkitExitFullscreen();  
		}  else if (document.msExitFullscreen){
			document.webkitExitFullscreen();  
		}
	}
	/**
	* exit full screen
	  return all elements to it's own position
	*/
	function checkExitFullScreen(element){
		var $elements = this.$elements;
		var div = this.div;
		$(element).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(){
			var state = (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen)
			if (!state){
				var l = $elements.length;
				for (i=l-1;i>=0;i--){
					item = $elements[i];
					var childList = item.p.childNodes;
					if (childList.length <= item.i){
						item.p.appendChild(item.e);
					}else{
						var refNode = childList[item.i];
						item.p.insertBefore(item.e,refNode);
					}

				}
				document.body.removeChild(div);
				$elements.length = 0;
				this.div = null;
			}
		});
	}
	/**
		
	*/
	function fullScreen(elements,divCLASS){
		if (divCLASS == null || divCLASS == ""){
			divCLASS = DEFAULT_FULLSCREEN_CONTAINER;
		}
		var $elements = this.$elements;
		if ($elements.length > 0) return false;
		this.div = document.createElement("div")
		var div = this.div;
		$div = $(div);
		$div.addClass(divCLASS);
		for (key in elements){
			element = elements[key];
			var p = element.parentNode;
			var temp = element;
			var i = 0;
			while( (temp = temp.previousSibling) != null ) {
				i++;
			}
			$elements.push({e:element,p:p,i:i})
			div.appendChild(element);
		}
		document.body.appendChild(div);
		launchFullScreen.call(this,div);
		checkExitFullScreen.call(this,div);
		return true;
	}
	//define
	var fullScreenUtil = {
			$elements:[],
			div:null,
			fullScreen:fullScreen,
		}
	if (wilas){
		var moduleName = "wilas.util.fullScreenUtil";
		var deps = ["jquery"];
		fullScreenUtil.moduleName = moduleName;
		if (wilas.support && typeof wilas.support == "function"){
			wilas.support(fullScreenUtil,deps);
		}
		// if(wilas.createNormalModule && typeof wilas.createNormalModule == "function"){
		// 	fullScreenUtil = wilas.createNormalModule(fullScreenUtil);
		// }
		// if(wilas.supportAMD && typeof wilas.supportAMD == "function"){
		// 	wilas.supportAMD(deps,fullScreenUtil);
		// }
	}
})(window);