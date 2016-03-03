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
$elements = null;
var div = null;
function fullScreenUtil(elements){
	$elements = [];
	div = document.createElement("div")
	for (key in elements){
		element = elements[key];
		console.log(element,element.parentElement);
		$elements.push({e:element,p:element.parentElement})
		div.appendChild(element);
	}
	document.body.appendChild(div);
	launchFullScreen(div);
	checkExitFullScreen(div);

	

}
function checkExitFullScreen(element){
	$(element).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(){
		var state = (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen)
		if (!state){
			for (key in elements){
				item = elements[key];
				item.p.appendChild(item.e);
				body.removeChild(div);
			}
		}
	});
}





