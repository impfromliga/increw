var app = {scn:[]};

document.addEventListener("fullscreenchange", function( event ) {
    // The event object doesn't carry information about the fullscreen state of the browser,
    // but it is possible to retrieve it through the fullscreen API
    if ( document.fullscreen ) {
        
        // The target of the event is always the document,
        // but it is possible to retrieve the fullscreen element through the API
        document.fullscreenElement;
    }

});

document.addEventListener("fullscreenerror", function( event ) {
    console.log("fullscreenerror");
});
var cntScroll = 0;
onload = app.init = function(){
	console.log('load',cntScroll++);
	app.lastY = 0;
	content.onscroll = function(){
		console.log('scroll',cntScroll++);
	}
	var cnv = document.querySelector('canvas');
	cnv.width = cnv.height = Math.min(innerWidth, innerHeight);
	ctx = cnv.getContext('2d');
	app.scn[0](ctx);
	(app.btnNext=document.querySelector('#btnNext')).addEventListener('click',app.movId);
	(app.btnPrev=document.querySelector('#btnPrev')).addEventListener('click',app.movId);
	onresize = function(){
		console.log('resize',cntScroll++);
		setTimeout(function(){
			var curId = app.curId();
			console.log(curId);
			document.querySelectorAll('.scene').forEach(function(v,i){
				(app.scn[i] = app.scn[i] || {}).pos = v.offsetTop;
				(app.scn[i] = app.scn[i] || {}).h = v.offsetHeight;
			})
			app.movId(curId,1);
		},20);
	}
	onresize();
}
app.curId = function(){
	for(id = app.scn.length; id && app.scn[--id].pos >= app.lastY;);
	return id + (app.lastY - app.scn[id].pos) /app.scn[id].h;
}
app.movId = function(target, interval, ease){
	interval = interval || 750;
	ease = ease || function easeInOut(x){return (1.911882804-1.8257148*Math.abs(x-=.5))*x+.5;};
	if(typeof target != 'number' ){
		idx = 'getAttribute' in this ? this.getAttribute('data-swipe') : 0;
		console.log('swipe',idx)
		idx = app.curId() + +idx -.999*(idx>>31) | 0;
		console.log(idx);
		target = app.scn[(idx + app.scn.length) % app.scn.length].pos;
	}else target = app.scn[target|0].pos + (target%1) * innerHeight; //* app.scn[target|0].h;
	var delta = target - content.scrollTop;
	var end = (new Date()).getTime() + interval;
	setTimeout( function animate(){
		var t = 1 + ((new Date()).getTime() - end)/interval;
		if(t>=1) return content.scrollTop = target;
		content.scrollTop = target + delta * (ease(ease(t)) - 1);
		setTimeout( animate, 50/3 );
	},50/3);
}
app.scn[0] = function(ctx){
	var aspect = 16/9;
	//gex
	ctx.save();
	ctx.strokeStyle = '#333';
	ctx.lineWidth = .5;
	ctx.setLineDash([10, 20]);
	ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
	for(var q = 3; --q;){
		for(var s = 1<<(6-q), r = ctx.canvas.height/s, n = 15 * cnv.width / r; n > 0; n--){
			var i = ((Math.random()-.5)*s|0)/s, j = ((Math.random()-.5)*s|0)/s,
				x = (i - j)*ctx.canvas.width, y = (i + j)*2*ctx.canvas.height;
			ctx.beginPath();
			ctx.moveTo(x,y-=r*2);
			ctx.lineTo(x+=r*aspect,y+=r);
			ctx.lineTo(x,y+=r*2);
			ctx.lineTo(x-=r*aspect,y+=r);
			ctx.lineTo(x-=r*aspect,y-=r);
			ctx.lineTo(x,y-=r*2);
			ctx.closePath();
			ctx.fillStyle = 'hsla('+(Math.random()*360|0)+',40%,'+(30+Math.random()*40)+'%,.25)';
			ctx.fill();
			//lines
			ctx.stroke();
		}
	}

	ctx.restore();
	//noise
	ctx.fillStyle = '#999';
	for(var h = ctx.canvas.height >> 2, w = ctx.canvas.width, x, n = h * w; n--; )
		if(Math.random()<.6)
			ctx.fillRect(x = (n / h | 0), 4 * (n % h) + 2*(x&1),.6,.6);
}