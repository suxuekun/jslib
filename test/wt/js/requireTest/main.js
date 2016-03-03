require.config({
	baseUrl:"js",
	paths:{
		"test":"requireTest/test",
		"s":"scroll_able_list",
		"jquery":"jquery-private"
	}
})

$(function(){
	require(['test','s'],function(T,S){
		// console.log('a',T);
		// window.t1=T;
		// T.plus();
		// console.log('t1',T.getCount());
		// // console.log(T,window.wtfthis);
		// // console.log(window,wtfthis.add == T.add)
		// //alert(T.add(1,2));
		// console.log(searchAbleListPlugin);
		// var l = searchAbleListPlugin.init('list');
		// var data =[
		// 	{name:'abc',label:'def'},
		// 	{name:'abc',label:'def'},
		// 	{name:'abc',label:'def'},
		// ]
		// l.list(data);
	});
	require(['test','s'],function(T,S){
		// console.log(T);
		// window.t2=T;
		// console.log(window.t1,window.t2,t1==t2);
		// 	T.plus();
		// console.log('t1',T.getCount());
	});
})

