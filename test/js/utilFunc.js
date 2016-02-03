function desc(a,indent,max){
	if (indent == null) indent = 0;
	if (max == null) max = 10;
	var flag = ("-".repeat(4)+" ").repeat(indent);
	for (var key in a){
		var item = a[key];
		if (typeof item == "function"){
			console.log(flag+"{",key,"} : ",item.constructor.name,"params",item.length)
		}else if (typeof item == "object"){
			console.log(flag+"{",key,"} : ",a.constructor.name)
			if (indent < max ){
				desc(item,indent+1,max);
			}	
		}else{
			console.log(flag+"{",key,"} : ",item.constructor.name,"--",item)
		}
	}
}

function deepExtend(target, source) {
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

function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL
			.split('&'), sParameterName, i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
	return null;
};