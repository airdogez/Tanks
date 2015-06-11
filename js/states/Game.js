/*
 *TODO:
 **Add HUD
 **Make the game end
 **Add Score
 **Add Time
 */

 Game = function(game){
   this.speed =0;
   this.fireRate = 100;
   this.tanks = [];
   this.nextFire = 0;
   this.bullets = null;
   this.score = 0;
   this.timer = null;
   this.score = 0;
   this.enemies = 10;
   this.wave = 1;
   this.Level = null;
 };

 Game.prototype ={
   create:function(){
     var fontStyleHeader = {font:'bold 24px Arial', fill:'#A00', stroke: "#333", strokeThickness: 5};
     var fontStyleText = {font:'20px Arial', fill:'#FFFFFF', stroke: "#333", strokeThickness: 5, wordWrap: true, wordWrapWidth: 700};

     this.world.setBounds(-1000,-1000,2000,2000);
     this.land = this.add.tileSprite(0,0,800,600,'land');

     this.tank = this.add.sprite(0,0,'tank','tank1');
     this.tank.anchor.setTo(0.5,0.5);
     this.tank.x = 400;
     this.tank.y = 300;
     this.tank.life = 3;
     this.tank.is_dead = false;

     this.livesText =  this.add.text(0,0, 'Lives:', fontStyleHeader);
     this.livesText.anchor.setTo(0.5,0.5);
     var i = 0;
     this.lives = this.add.group();
     for (i = 0; i < 3 ; i++) {
       this.heart = this.add.sprite(0,0,'live');
       this.heart.x = 100 + 40*i;
       this.heart.y = 20; 
       this.heart.width = this.heart.height = 30;
       this.lives.add(this.heart);
     }

     this.scoreText = this.add.text(0, 0,'Score:', fontStyleHeader);
     this.scoreText.anchor.setTo(0.5,0.5);
     this.scoreTotalText = 0;

     this.timeText = this.add.text(0,0,'Time:', fontStyleHeader);
     this.timerText = this.add.text(0,0,'00:00', fontStyleText);

     this.physics.enable(this.tank,Phaser.Physics.ARCADE);
     this.tank.body.collideWorldBounds = true;
     this.canon = this.add.sprite(0,0,'tank','turret');
     this.canon.anchor.setTo(0.3,0.5);
     this.canon.x = this.tank.x;
     this.canon.y = this.tank.y;
     this.keys = this.input.keyboard.createCursorKeys();

     this.camera.follow(this.tank);
     this.land.fixedToCamera = true;

     this.bullets = this.add.group();
     this.bullets.enableBody = true;
     this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
     this.bullets.createMultiple(30, 'bullet', 0, false);
     this.bullets.setAll('anchor.x', 0.5);
     this.bullets.setAll('anchor.y', 0.5);
     this.bullets.setAll('outOfBoundsKill', true);
     this.bullets.setAll('checkWorldBounds', true);

     this.enemyBullets = this.add.group();
     this.enemyBullets.enableBody = true;
     this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
     this.enemyBullets.createMultiple(100,'bullet',0,false);

     this.enemyBullets.setAll('anchor.x', 0.5);
     this.enemyBullets.setAll('anchor.y', 0.5);
     this.enemyBullets.setAll('outOfBoundsKill', true);
     this.enemyBullets.setAll('checkWorldBounds', true);


     for (i = 0; i < 20; i++)
     {
       this.tanks.push(new Tank(i, this, this.tank, this.enemyBullets, game.world.randomX, game.world.randomY));
     }
   },
   update:function(){
     this.timer += this.time.elapsed;

     var minutes = Math.floor(this.timer / 10000);
     var seconds = Math.floor((this.timer - minutes * 10000) / 10);

     if (minutes < 0){
       this.timerText.text = '00:00';
     } else{
       this.timerText.text = minutes + ':' + seconds;
     }

     this.canon.rotation = this.physics.arcade.angleToPointer(this.canon);
     if(this.keys.left.isDown || this.input.keyboard.isDown(Phaser.Keyboard.A)){
       this.tank.angle -= 4;
     }
     if(this.keys.right.isDown || this.input.keyboard.isDown(Phaser.Keyboard.D)){
       this.tank.angle += 4;
     }
     if(this.keys.up.isDown || this.input.keyboard.isDown(Phaser.Keyboard.W)){
       this.speed = 200;
     }else{
       this.speed -= 4;
     }
     if(this.speed>0){
       this.physics.arcade.velocityFromRotation(this.tank.rotation,
         this.speed,this.tank.body.velocity);
     }
     if(this.input.activePointer.isDown){
       this.fire();
     }
     this.canon.x= this.tank.x;
     this.canon.y= this.tank.y;
     this.land.tilePosition.x = -this.camera.x;
     this.land.tilePosition.y = -this.camera.y;

     if(this.tank.x < this.world.width - 300 || this.tank.x > 300 && this.tank.y < this.world.height - 300 || this.tank.y > 300){
       this.scoreText.x = this.tank.x +200;
       this.livesText.x = this.tank.x -300;
       this.lives.x = this.tank.x -350;
       this.scoreText.y = this.tank.y -250;
       this.livesText.y = this.tank.y -250;
       this.lives.y = this.tank.y -285;
       this.timeText.x = this.tank.x - 50;
       this.timeText.y = this.tank.y - 250;
       this.timerText.x = this.tank.x;
       this.timerText.y = this.tank.y - 250;
     }


     for(var i = 0;i<this.tanks.length;i++){
       this.tanks[i].update();
       this.physics.arcade.collide(this.tank,this.tanks[i].tank);
       this.physics.arcade.overlap(this.bullets,this.tanks[i].tank,
         this.hitEnemy,null,this);
     }
     this.physics.arcade.overlap(this.enemyBullets, 
       this.tank,this.hitPlayer, null, this);

   },
   hitPlayer:function(tank ,bullet){
     this.loseHeart(tank);
     if(tank.life === 0){
       tank.kill();
       this.canon.kill();
       tank.is_dead = true;
       this.state.start('GameOver');
       //this.shadow.kill();
     }
     bullet.kill();

   },

   hitEnemy:function(tank, bullet){
     bullet.kill();
     this.tanks[tank.name]._kill();
   },


   fire:function(){
     if (this.time.now > this.nextFire)
     {
       this.nextFire = this.time.now + this.fireRate;

       var bullet = this.bullets.getFirstExists(false);

       bullet.reset(this.canon.x, this.canon.y);
       bullet.rotation = this.physics.arcade.moveToPointer(bullet, 1000, this.input.activePointer);
     }
   },
   loseHeart: function (tank) {
     this.lives.getChildAt(tank.life-1).loadTexture('nolive');
     tank.life--;
   },
   newWave: function () {
     this.Level = new Wave(this.wave, this.enemies*this.wave);
   }
   };
