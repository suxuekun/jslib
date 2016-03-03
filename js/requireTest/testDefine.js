define('datatableHandler',['datatables'],function(){





//	return{

//	createDatatable: function(element,ajaxurl){

//	console.log(element+ajaxurl);

//

//	var otable = $('#' + element).DataTable({

//	"bSort" : false,

//	"bServerSide" : true,

//	"sDom" : '<""l>t<"F"p>',

//	"bJQueryUI" : true,

//	"bSearchable" : false,

//	"sPaginationType" : "full_numbers",

//	"sAjaxSource" : ajaxurl

//	});

//

//	},

//	refreshDatatable: function(element){

//	console.log("refresh");

//	var otable = $('#' + element).DataTable({

//	"bSort" : false,

//	"bServerSide" : true,

//	"sDom" : '<""l>t<"F"p>',

//	"bJQueryUI" : true,

//	"bSearchable" : false,

//	"sPaginationType" : "full_numbers",

//	"sAjaxSource" : 'newsandnotifications/ajax_list2.wilas'

//	});

//

//	}

//	};



function createDatatable(element,ajaxurl){

console.log(element+ajaxurl);


var otable = $('#' + element).DataTable({

"bSort" : false,

"bServerSide" : true,

"sDom" : '<""l>t<"F"p>',

"bJQueryUI" : true,

"bSearchable" : false,

"sPaginationType" : "full_numbers",

"sAjaxSource" : ajaxurl

});


};



function refreshDatatable(element){

console.log("refresh");

var otable = $('#' + element).DataTable({

"bSort" : false,

"bServerSide" : true,

"sDom" : '<""l>t<"F"p>',

"bJQueryUI" : true,

"bSearchable" : false,

"sPaginationType" : "full_numbers",

"sAjaxSource" : 'newsandnotifications/ajax_list2.wilas'

});


};


return{

createDatatable:createDatatable,

refreshDatatable:refreshDatatable

};






});

