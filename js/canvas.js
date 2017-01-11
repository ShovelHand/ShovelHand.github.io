
/******************CANVAS AND SPRITE HANDLING************************/
 var animatedCanvas = function(){
	this.canvas = document.getElementById('home-canvas'),
   this.context = this.canvas.getContext('2d'),
	
	//images
	this.mainImage = new Image(),
	this.spritesheet = new Image(),
	this.mainImage = new Image(),
	
	this.SHORT_DELAY = 5; // milliseconds
	this.TRANSPARENT = 0,
   this.OPAQUE = 1.0,
	
	 // Background width and height........................................
   this.BACKGROUND_WIDTH = 846;
   this.BACKGROUND_HEIGHT = 606;
	
	this.CELL_WIDTH = 846;
	this.CELL_HEIGHT = 606;
	
	this.mouseX = -1;
	this.mouseY = -1;
	
	/*mind that this is all placeholder */
	this.hutCell = [
		{left: 0, top: 0, width: 364, height: 256 }
	],
	
	this.mailBoxCells = [
		{left: 6, top: 290, width: 108, height: 158},
		{left: 188, top: 290, width: 146, height: 158},
		{left: 366, top: 278, width: 116, height: 169}
	],
	
	this.doorCells = [
		{left: 20, top: 496, width: 72, height: 109},
		{left: 150, top: 496, width: 80, height: 109},
		{left: 258, top: 490, width: 77, height: 109},
		{left: 364, top: 490, width: 90, height: 109}
	],
	
	this.signCell = [
		{left: 468, top: 25, width: 134, height: 200}
	],
	
	
	this.lastAnimationFrameTime = 0,		
	this.lastFpsUpdateTime = 0,
   this.fps = 60,
	
	this.sprites = [];
	 // Loading screen....................................................

   this.loadingElement = document.getElementById('loading');
   this.loadingTitleElement = document.getElementById('loading-title');
   this.loadAnimatedGif = document.getElementById('loading-animated-gif');
	
	//a textbox that appears at mousecursor position when hovered over a sprite
	this.hoverOverBox = document.getElementById('hover-over-box');
	this.newHover = true; //to stop sounds from looping
	this.bioBox = document.getElementById('bioBox');
	
	//sounds
	this.doorSFX = document.getElementById('doorSound');
	this.mailboxSFX = document.getElementById('mailboxSound');
		
	/*****************BEHAVIOURS******************************/
	//for looping animations, like run cycles, wheels turning, etc.
	this.cycleBehavior = {
      lastAdvanceTime: 0,

      execute: function (sprite, 
                         now, 
                         fps, 
                         context, 
                         lastAnimationFrameTime) {
		
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {  // skip first time
            this.lastAdvanceTime = now;
         }
         else if (now - this.lastAdvanceTime > 
                  2200 / sprite.runAnimationRate) {
				if(sprite.hovered === true){
					sprite.artist.loop();
				}
					
				else{
					sprite.artist.rewind();
				}
            this.lastAdvanceTime = now;
         }
		 
      }      
   };
	
	//for things that play up to the last frame, and don't loop
	this.playBehavior = {
      lastAdvanceTime: 0,

      execute: function (sprite, 
                         now, 
                         fps, 
                         context, 
                         lastAnimationFrameTime) {
		
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {
            this.lastAdvanceTime = now;
         }
			
         else if (now - this.lastAdvanceTime > 
                  2200 / sprite.runAnimationRate) {
			
					if(sprite.hovered === true){
						animatedCanvas.sprites[1].artist.play();
					}
						
					else{
						animatedCanvas.sprites[1].artist.rewind();
					}
				
            this.lastAdvanceTime = now;
         }
		 
      }      
   };
	
	//for things that leap to a particular frame
	this.popBehavior = {
      lastAdvanceTime: 0,

      execute: function (sprite, 
                         now, 
                         fps, 
                         context, 
                         lastAnimationFrameTime) {
		
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {
            this.lastAdvanceTime = now;
         }
         else if (now - this.lastAdvanceTime > 
                  2200 / sprite.runAnimationRate) {
				if(animatedCanvas.mailBox.opened){
					animatedCanvas.mailBox.artist.pop(2);
				}
				else if(sprite.hovered === true){
					sprite.artist.pop(sprite.popFrame);
				}
					
				else{
					sprite.artist.rewind();
				}
            this.lastAdvanceTime = now;
         }
		 
      }      
   };
	
 };
 /**************************END OF BEHAVIOURS******************************/
 
 animatedCanvas.prototype = {
	 
	createSprites: function () {
		this.createHutSprite(); 
		this.createDoorSprite();
		this.createMailBoxSprite();
		this.createSignSprite();
		// this.initializeSprites();
   },
	
	fadeInElements: function () {
      var args = arguments;

      for (var i=0; i < args.length; ++i) {
         args[i].style.display = 'block';
      }

      setTimeout( function () {
         for (var i=0; i < args.length; ++i) {
            args[i].style.opacity = this.OPAQUE;
         }
      }, this.SHORT_DELAY);
   },

   fadeOutElements: function () {
      var args = arguments,
          fadeDuration = args[args.length-1]; // Last argument

          for (var i=0; i < args.length-1; ++i) {
            args[i].style.opacity = this.TRANSPARENT;
         }

         setTimeout(function() {
            for (var i=0; i < args.length-1; ++i) {
               args[i].style.display = 'none';
            }
         }, fadeDuration);
      },
	
	
	//this sprite is test stuff, will be improved
	createHutSprite: function () {
		this.hut = new Sprite('hut',
                        new SpriteSheetArtist(this.spritesheet,
                                              this.hutCell),
                        [this.playBehavior]);
		
		this.hut.runAnimationRate = 20;
		this.hut.left = 35;
		this.hut.top = 75;
      this.hut.width = 360;
      this.hut.height = 260;
		this.hut.hovered = false;
      
		this.sprites.push(this.hut);
	},
	
	createDoorSprite: function(){
		this.door = new Sprite('door',
										new SpriteSheetArtist(this.spritesheet, 
										this.doorCells),
										[]); //todo, new behaviour
		this.door.runAnimationRate = 30;
		this.door.left = 275;
		this.door.top = 210;
		this.door.width = this.doorCells[0].width;
		this.door.height = this.doorCells[0].height;
		this.door.hovered = false;
		
		this.sprites.push(this.door);
	},
	
	createMailBoxSprite: function(){
		this.mailBox = new Sprite('mailBox',
										new SpriteSheetArtist(this.spritesheet, 
										this.mailBoxCells),
										[this.popBehavior]);
		this.mailBox.runAnimationRate = 30;
		this.mailBox.left = 40;
		this.mailBox.top = 350;
		this.mailBox.width = 100;
		this.mailBox.height = 100;
		this.mailBox.popFrame = 1;
		this.mailBox.hovered = false;
		this.mailBox.opened = false;
		this.sprites.push(this.mailBox);
	},
	
	createSignSprite: function(){
		this.signSprite = new Sprite('sign', 
												new SpriteSheetArtist(this.spritesheet,
												this.signCell),
												[]);
		this.signSprite.runAnimationRate = 0;
		this.signSprite.left = 480;
		this.signSprite.top = 370;
		this.signSprite.width = 134;
		this.signSprite.height = 200;
		this.signSprite.hovered = false;
		this.signSprite.clicked = false;
		this.sprites.push(this.signSprite);
	},
	
	draw: function(now){
		this.drawBackground();
		this.updateSprites(now);
		this.drawSprites();
	},
	
	drawBackground: function(){
		animatedCanvas.context.drawImage(
         this.mainImage, 0, 0, 
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);
	},
	
	backgroundLoaded: function(){
		console.log("loaded sprite sheet");
		var LOADING_SCREEN_TRANSITION_DURATION = 0;

      this.fadeOutElements(this.loadingElement, 
         LOADING_SCREEN_TRANSITION_DURATION);
			
		animatedCanvas.revealCanvas();
	},
	
	loadingAnimationLoaded: function(){
		this.fadeInElements(this.loadAnimatedGif,
      this.loadingTitleElement);
		console.log("loading gif loaded");
	},
	
	revealCanvas: function () {
      this.fadeInElements(this.canvas);
		requestNextAnimationFrame(this.animate);
   },
	
	initializeImages: function () {
      this.spritesheet.src = './images/home/newSpriteSheet.png';
		this.mainImage.src = './images/home/background.png';
		this.loadAnimatedGif.src = './images/home/runLoop.gif';
		
		this.mainImage.onload = function (e) {
         animatedCanvas.backgroundLoaded();
      };
		
		this.loadAnimatedGif.onload = function () {
         animatedCanvas.loadingAnimationLoaded();
      };
   },
	
	updateSprites: function (now) {
      var sprite;
		var spriteHovered = false;
      var whichSprite = null;
		
		for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
			//check if the mouse cursor is over the sprite;
			if((this.mouseX >= sprite.left && this.mouseX <= (sprite.left + sprite.width)) &&
				this.mouseY >= sprite.top && this.mouseY <= (sprite.top + sprite.height)){
				sprite.hovered = true;
				//console.log("hovered over " + sprite.type);
				spriteHovered = true;
				whichSprite = sprite.type;
			}else{
				sprite.hovered = false;
			}
			sprite.update(now, 
					this.fps, 
					this.context,
					this.lastAnimationFrameTime);   
      }
		
		if(spriteHovered){
			this.doHoverOverStuff(whichSprite);
			this.newHover = false;
		}
		else{
			this.hoverOverBox.style.opacity=0;
			this.newHover = true;
		}
   },

	drawSprites: function() {
      var sprite;

      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
         sprite.draw(this.context);
      }
		
   },
	
	animate: function(now){
		animatedCanvas.draw(now);
		animatedCanvas.lastAnimationFrame = now;
		requestNextAnimationFrame(animatedCanvas.animate);
	},
	
	//param is the sprite type, a string like 'door', or whatever
	doHoverOverStuff: function(name){
		console.log(name);
		this.hoverOverBox.style.opacity = 0.8;
		this.hoverOverBox.style.top = (this.mouseY + 200).toString() + "px";
		this.hoverOverBox.style.left = (this.mouseX + 200).toString() + "px";
		var textContent;
		switch(name){
				case "mailBox":
					textContent = "Click for contact info!";
					if(this.newHover)
						this.mailboxSFX.play();
				break;
				case "door": case "hut":
					textContent = " Click for build logs of old projects!";
					if (this.newHover)
						this.doorSFX.play();
				break;
				case "sign":
					textContent = "Click for info about me!";
				break;
		}
		txt = document.createTextNode(textContent);
		//space = document.getElementById("hover-over-box");
		this.hoverOverBox.innerText = txt.textContent;
	},
	
	mouseclick: function(){
		 for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
			//check if the mouse cursor is over the sprite;
			if((this.mouseX >= sprite.left && this.mouseX <= (sprite.left + sprite.width)) &&
				this.mouseY >= sprite.top && this.mouseY <= (sprite.top + sprite.height)){
					//the idea here is that we can take a different action based on which sprite was clicked,
					//specifically url redirection.
					switch(sprite.type){
						case 'hut':
							window.location.href = 'buildLogs.html';
							break;
						case 'mailBox':
							this.mailBox.opened = ! this.mailBox.opened;
							break;
						case 'sign':
							this.signSprite.clicked = ! this.signSprite.clicked;
							if(this.signSprite.clicked){
								this.fadeInElements(this.bioBox);
							}
							else{
								//this.fadeOutElements(this.bioBox, this.LOADING_SCREEN_TRANSITION_DURATION);
								this.bioBox.style.opacity = 0;
							}
							break;
						
						default:
						break;
					}
					
				}
		}
	}	
 };
 
 //launch canvas
var animatedCanvas = new animatedCanvas;
 
animatedCanvas.initializeImages();
animatedCanvas.createSprites();

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function draw(e){
    var pos = getMousePos(animatedCanvas.canvas, e);
    animatedCanvas.mouseX = pos.x;
    animatedCanvas.mouseY = pos.y;
}

function mouseclick(){
	animatedCanvas.mouseclick();
}

/******************END OF CANVAS AND SPRITE HANDLING***********************/
