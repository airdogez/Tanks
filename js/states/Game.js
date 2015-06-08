Game = function(){};

Game.prototype = {
  create:function(){

    this.background = this.add.tileSprite(0,0,this.world.width,this.world.height,'background');
    this.background.tileScale.y =2;
    this.worldSpeed = 200;
    this.isJumping = false;
    this.jumpPeaked = false;
    this.maxJumpDistance = 120;
    this.background.autoScroll(-this.worldSpeed,0);
    this.player = this.add.sprite(50,140,'player');
    this.player.anchor.setTo(0.5,0.5);
    this.player.animations.add('running',[0,1,2,3,2,1], 
      15 , true);
    this.player.play('running');
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.physics.arcade.gravity.y = 1000;

    this.physics.arcade.enable(this.player);
    this.player.body.setSize(38,60,0,0);
    //this.player.body.allowGravity = false;

    this.water = this.add.tileSprite(0,this.world.height-30,
      this.world.width,this.world.height,
      'water');
    this.water.autoScroll(-this.worldSpeed/2,0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.floorPool = this.add.group();
    this.platformPool = this.add.group();

    this.currentPlatform = new Platform(
      this.game,this.floorPool,12,0,200,-this.worldSpeed);

    this.platformPool.add(this.currentPlatform);

  },
  update:function(){

    if(this.player.alive){
      this.platformPool.forEachAlive(function(platform, index){
        this.game.physics.arcade.collide(this.player,platform);
        if(platform.length && platform.children[platform.length-1].right<0){
          platform.kill();
        }
      },this);

      if(this.player.body.touching.down){
        this.player.body.velocity.x = this.worldSpeed;
      }else{
        this.player.body.x = 0;
      }
      if(this.cursors.up.isDown || 
        this.game.input.activePointer.isDown){
        this.playerJump();
        }else if(this.cursors.up.isUp ||
        this.game.input.activePointer.isUp
        ){
          this.isJumping = false;
        }

        if(this.currentPlatform.length && 
          this.currentPlatform.children[this.currentPlatform.length-1].right < this.game.world.width){
          this.createPlatform();
          }
          if(this.player.top >= this.world.height){
            this.gameOver();
          }
    }
  },
  gameOver:function(){
    this.player.kill();
    this.overlay = this.add.bitmapData(this.game.width, this.game.height);
    this.overlay.ctx.fillStyle = "#000";
    this.overlay.ctx.fillRect(0,0,this.game.width, this.game.height);

    this.panel = this.add.sprite(0,0,this.overlay);
    this.panel.alpha  =0.5;
    this.btn = this.add.button(this.game.width/2, this.game.height/2+100,
      'facebook_share',this.share,this);
    this.btn.anchor.setTo(0.5,0.5);
  },
  share:function(){
    FB.ui(
      {
        method: 'feed',
        link: 'https://developers.facebook.com/docs/',
        name: 'Mi gran demo',
        caption: 'Esto es mi test',
        description: 'Obtuve un puntaje de '
    },function(response){});

  },
  playerJump:function(){
    if(this.player.body.touching.down){
      this.startJumpY = this.player.y;
      this.isJumping = true;
      this.jumpPeaked = false;
      this.player.body.velocity.y = -300;
    }else if(this.isJumping && !this.jumpPeaked){
      var distanceJumped = this.startJumpY-this.player.y;
      if(distanceJumped<= this.maxJumpDistance){
        this.player.body.velocity.y = -300;
      }else{
        this.jumpPeaked = true;
      }
    }
  },
  loadLevel:function(){
    this.createPlatform();
  },
  createPlatform:function(){
    var nextPlatform = this.generateRandomPlatform();
    if(nextPlatform){
      this.currentPlatform = this.platformPool.getFirstDead();
      if(!this.currentPlatform){
        this.currentPlatform = new Platform(
          this.game,this.floorPool,nextPlatform.numTiles,
          this.game.world.width + nextPlatform.separation, 
          nextPlatform.y,
          -this.worldSpeed);
      }else{
        this.currentPlatform.prepare(nextPlatform.numTiles,
          this.game.world.width + nextPlatform.separation, 
          nextPlatform.y,
          -this.worldSpeed);

      }
      this.platformPool.add(this.currentPlatform);
    }
  },
  generateRandomPlatform:function(){
    var data = {};
    var minSeparation = 60;
    var maxSperation = 200;

    data.separation = minSeparation + Math.random()*(maxSperation-minSeparation);
    var minDifY = -120;
    var maxDifY = 120;

    data.y = this.currentPlatform.children[0].y + minDifY+ Math.random()*(maxDifY-minDifY);
    data.y = Math.max(150,data.y);
    data.y = Math.min(this.world.height-50,data.y);

    var minTiles = 1;
    var maxTiles = 5;

    data.numTiles = minTiles + Math.random()*(maxTiles-minTiles);
    return data;
  },
  render:function(){
    //this.game.debug.body(this.player);
  }
};
