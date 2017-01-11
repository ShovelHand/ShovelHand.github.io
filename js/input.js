
/***********Mouseover image stuff ********************/
//timers for mouseover
var countTime = 0;
var windowTimer = null;
var index = setInterval(advance, 1500);
var imgList = new Array();
var callingElement;

/*If the mouse is over an image, this timer will advance to next image*/
function advance(){
	index = (index + 1) % imgList.length;
	if(index >= imgList.Length){
		index = 0;
	}
	if(callingElement != null){
		callingElement.src = imgList[index];
		fadeIn(callingElement, 500);
	}
}

function fadeIn(el, time){
	el.style.opacity = 0;
	//change display stlye?
	
	var last = +new Date();
	var tick = function(){
		el.style.opacity = +el.style.opacity + (new Date() - last) / time;
		last = +new Date();
		
		if(el.style.opacity < 1){
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		}
	};
	tick();
}

//rotate through list of images during mouseover
//params are the caller, the folder containing the desired images (string)
//and a string of images seperated by commas (i.e. 'image1.jpg, image2.png, ...,imagen.jpg)
function rollover(caller, folder, imgs){
	index = 0;
	callingElement = caller;
	var multipleElements = true;
	
	while(multipleElements){
		if((imgs.indexOf(',') !== -1)){
			var item = (imgs.split(',',1))[0];
			imgList.push(folder + item);
			item += ', ';
			imgs = imgs.replace(item,"");
		}
		else{
			multipleElements = false;
			imgList.push(folder + imgs)
		}
	}

}

function mouseaway(caller, img){
	imgList = [];
	caller.src = img;
	callingElement = null;
	caller.style.opacity = 1;
	clearInterval(windowTimer);
	countTime = 0;
}

/******************END OF MOUSEOVER IMAGE STUFF************************/
