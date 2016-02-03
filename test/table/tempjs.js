var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");

var txt="委托方"
c.width = 500;
c.height = 500;
var gap = 10;
var textfix = 2;
var fix = 0.5;
var size = 14;
ctx.font= "" + size + "px Arial";

var length = ctx.measureText(txt).width;
length += gap;
length = length >>0;
length2 = length + fix;
console.log(length2);
ctx.moveTo(0,length2);
ctx.lineTo(ctx.canvas.clientWidth,length2);
ctx.moveTo(length2,0);
ctx.lineTo(length,ctx.canvas.clientHeight);
for (var i =0;i<30;i++){
  ctx.fillText(txt,0,i*size + length + size -textfix);
}
ctx.save()
ctx.rotate(Math.PI/2);
for (var i=0;i<30;i++){
	ctx.save()
  ctx.fillText(txt,0,-i*size - length - textfix);
  ctx.restore()
}
ctx.stroke()
ctx.restore()
ctx.fillText(txt,10,10)


