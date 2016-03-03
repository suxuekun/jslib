require.config({
	baseUrl:"js",
	paths:{
		"test":"requireTest/test",
		"jquery":"jquery",
		"my":"requireTest/myModule",
		"my2":"requireTest/module.submodule"
		
	},
	shim:{
		"my":{
			deps:["jquery"],
			exports:"myModule",
		},
		"my2":{
			deps:["jquery","my"],
			exports:"module.submodule"
		}
	}
})

// $(function(){
	console.log(require);
	console.log('before require myModule')
	console.log('window.myModule = ',window.myModule);
	console.log('jquery = ',window.$);
	console.log('----------');

	require(['jquery','my2'],function($,my2){
		console.log('after require myModule.submodule')
		console.log('window.myModule = ',myModule);
		console.log('window.myModule.submodule = ',myModule.submodule);
		console.log('required myModule.submodule',my2);
		console.log('submodule are same instance',myModule.submodule ===my2);
		my2.printName();
			console.log('----------');
		my2.setName('my2');
		//console.log(myModule.submodule,my2);
	});
	require(['jquery','my'],function($,my){
		console.log('after require myModule')
		console.log('window.myModule = ',myModule);
		console.log('required myModule = ',my);
		console.log('they are same',my === myModule);
		my.printName();
		console.log('----------');
	});

// })

