var k = 1;//document.body.clientWidth/640.0;
var width = 640*k;
var height = 1136*k;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');
    var bgColors = [0x87fd82, 0xffa579, 0xff98ab, 0xefc8cd, 0xe1b7ed, 0xcce5de, 0xe2d8d8];
    game.States = {};

  function setSuitableSize(){
// set scaleMode and align
    var deviceW=document.body.clientWidth;//$(window).width();
    var deviceH=document.body.clientHeight;//$(window).height();
    var origW=width;
    var origH=height;
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.compatibility.forceMinimumDocumentHeight = true; // seems to do nothing
    this.game.scale.pageAlignHorizontally = true; // seems like I would not even need this
    this.game.scale.pageAlignVeritcally = true; // seems to do nothing

// calculate the scale factor
    var scaleFactor = deviceW / origW;
// set scale
    console.log(deviceH,origH,deviceW,origW);
    //--将这个换掉。
//    game.scale.setUserScale(scaleFactor, scaleFactor);
//    game.scale.refresh();
    var scaleX=deviceW/origW;
    var scaleY=deviceH/origH;

    console.log("scale x:"+scaleX,"scale y:"+scaleY);


    game.scale.setUserScale(scaleX, scaleX);
    game.scale.refresh();

// calculate the scaled dimensions of the canvas
    var canvasW = origW * scaleFactor;
    var canvasH = origH * scaleFactor;

// calculate the Top Distance
    var canvasTop = (deviceH - canvasH) / 2;
// make it a relevant string
    var canvasTop = canvasTop.toString() + 'px';

// get the after setUserScale() applied style attributes
//    this.currentStyle = this.game.canvas.getAttribute("style");
//// add the marginTop to it
//    this.newStyle = this.currentStyle + 'margin-top: ' + canvasTop;
//
//// set the attribute
//    this.game.canvas.setAttribute('style', this.newStyle);


    return;//我自己手动缩放，不要下面这个了，下面这个不智能也不自动坑爹啊。


    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;//THIS LINE IS NOT WELL DOCUMENTED IN PHASER AND ESSENTIAL FOR ANDROID TO WORK

    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.setShowAll();

    game.scale.startFullScreen();//WHAT MAKES THE FULL SCREEN WORK ON IPHONES
    game.scale.refresh();
  }
    game.States.boot = function(){
      this.preload = function(){
        game.load.image('loading', 'assets/loading.png');
          setSuitableSize();
      };
        //game.load.bitmapFont('font')
      this.create = function(){
        game.state.start('preload');
      };
    };

    game.States.preload = function(){
      this.preload = function(){
        game.load.image('square', 'assets/square.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('btn','assets/button.png');
        game.load.image('small', 'assets/small_square.png');
        game.load.spritesheet('bang','assets/bang2.png',300,300);
          game.load.spritesheet('bang2','assets/bang3.png',300,300);
        var preloadSprite = game.add.sprite(50, game.height/2, 'loading');
        game.load.setPreloadSprite(preloadSprite);
      };
      this.create = function(){
        game.state.start('menu');
      };
    };
      
    game.States.menu = function(){
        this.create = function(){
          var tintColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
          game.stage.backgroundColor = tintColor;
          var text = game.add.text(game.world.centerX, game.world.centerY-300, "Jump Scare", {font: "90px Segoe UI Light", fill: "#FFFFFF", align: "center"});
          text.anchor.set(0.5, 0.5);
          var text2 = game.add.text(game.world.centerX, game.height-200, "©Copyright 2018 Salty Studio", {font: "20px Segoe UI Light", fill: "#FFFFFF", align: "center"});
          text2.anchor.set(0.5, 0.5);
          var bgSquare = game.add.sprite(game.world.centerX, 650, "square");
            bgSquare.anchor.set(0.5, 0.5);
            game.add.tween(bgSquare).to({y:500}, 1000, null, true, 0, Number.MAX_VALUE, true);
            var btn = game.add.button(game.width/2, game.height/2+300,'btn',function(){game.state.start('play');});
            btn.anchor.setTo(0.5, 0.5);
        };
    };

    game.States.play = function(){
        this.scoreText = null;
        this.btn = null;
        this.leftTween = null;
        this.rightTween = null;
        this.score = 0;
        this.create = function(){
          this.gameIsOver = false;
          this.scoreText = game.add.text(game.world.centerX, game.world.centerY-250, "Try to Catch the Cube!", {font: "60px Segoe UI Light", fill: "#FFFFFF", align: "center"});
          this.scoreText.anchor.set(0.5, 0.5);
          var tintColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
          game.stage.backgroundColor = tintColor;
          this.pipeGroup = game.add.group();
          //this.square = game.add.sprite(100, 600, 'small');
          //this.square.anchor.setTo(0.5, 0.5);
          //game.physics.enable(this.square, Phaser.Physics.ARCADE);
          this.hasStarted = false;
            game.time.events.loop(900, this.generatePipes, this);
            game.time.events.stop(false);
            this.btn = game.add.button(game.width/2, game.height/2+300,'square');
            this.toLeft = true;
            this.leftTween = game.add.tween(this.btn).to({x:-game.width}, 2000);
            this.leftTween.start();
            this.rightTween = game.add.tween(this.btn).to({x:game.width/2+game.width}, 2000);
            this.btn.anchor.setTo(0.5, 0.5);
            this.btn.onInputDown.add(this.press, this);
            game.input.onDown.addOnce(this.startGame, this);
        };
        
        this.startGame = function() {
            this.gameSpeed = 200;
            this.hasOutside =false;
            this.hasStarted = true;
            this.score = 0;
                //game.add.tween(btn).to({x:1000}, 2000, null, true, 0, Number.MAX_VALUE, true).start();
        };
        
        this.toLeft = true;
        this.tintColorNum = 0;
        this.press = function() {
          var tintColor = bgColors[(this.tintColorNum++)%(bgColors.length)];
          game.stage.backgroundColor = tintColor;
            this.score += 1;
            this.scoreText.text = this.score;
            this.scoreText.style.font = "90px Segoe UI Light";
            if(this.toLeft === true){
                this.rightTween.start();
                this.leftTween.stop();
                this.leftTween = game.add.tween(this.btn).to({x:-game.width}, 6000*(1.0/(1+Math.log(100,this.score))));
                this.toLeft = false;
            }
            else {
                this.leftTween.start();
                this.rightTween.stop();
                this.rightTween = game.add.tween(this.btn).to({x:game.width/2+game.width}, 6000*(1.0/(1+Math.log(100,this.score))));
                this.toLeft = true; 
            }
        };
        this.update = function() {
            if(this.btn.x <= -75 || this.btn.x >= game.width+75) 
            {
                if(this.gameIsOver ===false&&this.toLeft===true){
                var bangEffect = game.add.sprite(0,game.height/2+300,'bang');
                bangEffect.anchor.setTo(0.5,0.5);
                bangEffect.animations.add('fly');
                bangEffect.animations.play('fly',15,false,true);
                this.gameIsOver = true;
                }else if(this.gameIsOver ===false&&this.toLeft===false){
                    var bangEffect2 = game.add.sprite(game.width,game.height/2+300,'bang2');
                bangEffect2.anchor.setTo(0.5,0.5);
                bangEffect2.animations.add('fly');
                bangEffect2.animations.play('fly',15,false,true);
                this.gameIsOver = true;
                }
                this.scoreText.text = "Game Over";
                game.add.button(game.width/2, game.height/2+300,'btn',function(){game.state.start('play');}).anchor.setTo(0.5, 0.5);
            }
        };
        
    };

    game.state.add('boot', game.States.boot);
    game.state.add('preload', game.States.preload);
    game.state.add('menu',game.States.menu);
    game.state.add('play',game.States.play);
      
    game.state.start('boot');