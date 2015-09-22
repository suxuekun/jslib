var eventmanager = {};
eventmanager.list = {};
eventmanager.register = function(name,callback){
  if (this.list[name] == null){
	  this.list[name] = [];
  }
  if (this.list[name].indexOf(callback) == -1){
	  this.list[name].push(callback);
  }
}
eventmanager.unregister = function (name,callback){
	  if (this.list[name] == null){
		  return
	  }
	  var index = this.list[name].indexOf(callback);
	  if (index == -1){
		 return;
	  }
	  this.list[name].splice(index,1);
}
eventmanager.dispatch= function(name,args){
	args.event_name = name;
	console.log("dispatch:",name," args:",args)
	if (this.list[name] == null){
		return
	}
	for (var key in this.list[name]){
		var callback = this.list[name][key];
		callback(args);
	}
}