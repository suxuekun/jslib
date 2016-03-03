<script>
	var data = [];
	for (var i=0;i<100000;i++){
		var x = Math.random()*4000;
		var y = Math.random()*4000;
		var v = Math.random()*10000;
		data.push({x:x,y:y,value:v});
	}
	console.log(data);
	var s = "";
	for (var i=0;i<data.length;i++){
		var item = data[i];
		var x = item.x;
		var y = item.y;
		var z = item.z;
		var p = x>>16+y;
		var v = z;
		var s1 = p.toString(16);;
		var s2 = v.toString(16);
		if (s==""){
			console.log(s1,s2);
		}
		s += s1+s2;
	}

	console.log(s)


</script>