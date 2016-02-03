/*angularJS for reading data*/
var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function($scope, Reddit) {
  $scope.reddit = new Reddit();
  $scope.$on('newsUpdated', function(mass) {
	  console.log(mass);
	  $scope.reddit.reload();
  });
});

//Reddit constructor function to encapsulate HTTP and pagination logic
myApp.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = 1;
  };
  
  
  Reddit.prototype.reload = function() {
		 
	  if (this.busy) return;
	    this.busy = true;

	    
	    var url = "rest/messages/news_list.wilas?pageNum=1";
	    
	    $http.get(url).success(function(data, status, headers, config) {
	    	
	    	this.items =[];
		    var items = data.aaData;
		    
		    for (var i = 0; i < items.length; i++) {
		        this.items.push(items[i]);
		    }
		    this.busy = false;
		    
		}.bind(this)).
		  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
		});
	    
	  };

  Reddit.prototype.nextPage = function() {
	  
	console.log(this.after);
    if (this.busy) return;
    this.busy = true;

    
    var url = "rest/messages/news_list.wilas?pageNum=" + this.after;
    
    $http.get(url).
	  success(function(data, status, headers, config) {
//	    console.log(data);
	    var items = data.aaData;
//	    console.log(items.length);
	    
	    for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	    }
	    this.after = this.after + this.items.length;
	    this.busy = false;
	    
//	    console.log(this.after);
	    
	}.bind(this)).
	  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
	});
  };

  return Reddit;
});


/*Notification Function*/
myApp.controller('NotificationController', function($scope, WilasNotification) {
	
	  $scope.wilasnotification = new WilasNotification();
	  
	  $scope.$on('notificUpdated', function(mass) {
		  console.log(mass);
		  $scope.wilasnotification.reload();
	  });
	  
});


//Reddit constructor function to encapsulate HTTP and pagination logic
myApp.factory('WilasNotification', function($http) {
  var WilasNotification = function() {
    this.items = [];
    this.busy = false;
    this.after = 1;
  };
  
  WilasNotification.prototype.reload = function() {
	 
	  if (this.busy) return;
	    this.busy = true;

	    
	    var url = "rest/messages/notification_list.wilas?pageNum=1";
	    
	    $http.get(url).success(function(data, status, headers, config) {
	    	
	    	this.items =[];
		    var items = data.aaData;
		    
		    for (var i = 0; i < items.length; i++) {
		        this.items.push(items[i]);
		    }
		    this.busy = false;
		    
		}.bind(this)).
		  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
		});
	    
	  };

  WilasNotification.prototype.nextPage = function() {
	  
    if (this.busy) return;
    this.busy = true;

    
    var url = "rest/messages/notification_list.wilas?pageNum=" + this.after;
    
    $http.get(url).success(function(data, status, headers, config) {
	    var items = data.aaData;
	    
	    for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	    }
	    this.after = this.after + this.items.length;
	    this.busy = false;
	    
	    console.log(this.after);
	    
	}.bind(this)).
	  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
	});
    
  };

  return WilasNotification;
});



/*submit*/
myApp.controller('submitNewsController', function($scope,$http) {
	   
	$scope.master = {};
	$scope.submit = function() {
		
	    $scope.master = angular.copy($scope.message);
	    console.log("$scope.master.msgBody:" + $scope.master.msgBody);
        if ($scope.master.msgBody) {
        	
        	$http.post('rest/messages/postNew.wilas', $scope.master).
        	  success(function(data, status, headers, config) {
        	    
        	    alertNotification(data);
        	    this.$emit('newsUpdated','123');
        	    
        	}.bind(this)).
        	  error(function(data, status, headers, config) {
        		    // called asynchronously if an error occurs
        		    // or server returns response with an error status.
        	});
        	
        	
        }
    };
});

myApp.controller('submitNotificationController', function($scope,$http) {
   
	$scope.master = {};
	$scope.submit = function() {
		
	    $scope.master = angular.copy($scope.message);
	    console.log("$scope.master.msgBody:" + $scope.master.msgBody);
        if ($scope.master.msgBody) {
        	
        	$http.post('rest/messages/postNotification.wilas', $scope.master).
        	  success(function(data, status, headers, config) {
        	    
        	    alertNotification(data);
        	    this.$emit('notificUpdated','123');
        	    
        	}.bind(this)).
        	  error(function(data, status, headers, config) {
        		    // called asynchronously if an error occurs
        		    // or server returns response with an error status.
        	});
        	
        	
        }
    };
});



/*Normal JQuery Flow*/

$(document).ready(function() {
	
	
	var dialog_buttons = {}; 
	dialog_buttons[$("#hideButSend").html()] = function(){
		$("#newsSub").trigger("click");
		dialogDiv.dialog("close");
	};
	dialog_buttons[$("#hideButCancel").html()] = function(){
		dialogDiv.dialog("close");
	};
	
	var dialogDiv = $("#dialog-form-new").dialog({
		autoOpen : false,
		resizable : false,
		height : 250,
		width : 550,
		modal : true,
		buttons :dialog_buttons,
		show: {
			effect: "puff",
			duration: 500
		},
		hide: {
			effect: "puff",
			duration: 500
		}
	});
	
	
	var dialog_buttons2 = {}; 
	dialog_buttons2[$("#hideButSend").html()] = function(){
		$("#noticSub").trigger("click");
		dialogDiv2.dialog("close");
	};
	dialog_buttons2[$("#hideButCancel").html()] = function(){
		dialogDiv2.dialog("close");
	};
	
	var dialogDiv2 = $("#dialog-form").dialog({
		autoOpen : false,
		resizable : false,
		height : 250,
		width : 550,
		modal : true,
		buttons : dialog_buttons2,
		show: {
			effect: "puff",
			duration: 500
		},
		hide: {
			effect: "puff",
			duration: 500
		}
	});
	
	
	$("#add-news-btn").click(function(){
		dialogDiv.dialog("open");
	});
	
	$("#add-notfication-btn").click(function(){
		dialogDiv2.dialog("open");
	});
	
	
	
	
	
});
				
