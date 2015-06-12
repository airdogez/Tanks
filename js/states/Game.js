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
   this.waveEnemies = 10;
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

     this.livesText =  this.add.text(100,35, 'Lives:', fontStyleHeader);
     this.livesText.anchor.setTo(0.5,0.5);
     this.livesText.fixedToCamera = true;
     var i = 0;
     this.lives = this.add.group();
     for (i = 0; i < 3 ; i++) {
       this.heart = this.add.sprite(0,0,'live');
       this.heart.x = 155 + 40*i;
       this.heart.y = 35;
       this.heart.width = this.heart.height = 30;
       this.heart.anchor.setTo(0.5,0.5);
       this.lives.add(this.heart);
     }
     this.lives.fixedToCamera = true;

     this.scoreText = this.add.text(350, 35,'Score:', fontStyleHeader);
     this.scoreText.anchor.setTo(0.5,0.5);
     this.scoreText.fixedToCamera = true;
     this.scoreTotal = this.add.text(420,35,this.score, fontStyleText);
     this.scoreTotal.anchor.setTo(0.5,0.5);
     this.scoreTotal.fixedToCamera = true;

     this.timeText = this.add.text(600,35,'Time:', fontStyleHeader);
     this.timeText.fixedToCamera = true; 
     this.timeText.anchor.setTo(0.5,0.5);
     this.timerText = this.add.text(680,35,'00:00', fontStyleText);
     this.timerText.fixedToCamera = true;
     this.timerText.anchor.setTo(0.5,0.5);

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
     this.bullets.createMultiple(20, 'bullet', 0, false);
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

     this.createWave(this.waveEnemies);

   },
   update:function(){
     this.timer += this.time.elapsed;

     var minutes = Math.floor(this.timer / 60000) % 60;
     var seconds = Math.floor(this.timer / 1000) % 60;

     if (minutes < 10){
       minutes = '0' + minutes;
     }
     if (seconds < 10){
       seconds = '0' + seconds;
     }

     this.timerText.text = minutes + ':' + seconds;

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

     this.scoreTotal.text = this.score;

     for(var i = 0;i<this.tanks.length;i++){
       this.tanks[i].update();
       this.physics.arcade.collide(this.tank,this.tanks[i].tank);
       this.physics.arcade.overlap(this.bullets,this.tanks[i].tank,
         this.hitEnemy,null,this);
     }
     this.physics.arcade.overlap(this.enemyBullets, 
       this.tank,this.hitPlayer, null, this);

     if(this.enemies === 0){
       this.waveEnemies += 5;
       this.createWave(this.waveEnemies);
       this.enemies = this.waveEnemies;
     }

   },
   hitPlayer:function(tank ,bullet){
     this.loseHeart(tank);
     if(tank.life === 0){
       tank.kill();
       this.canon.kill();
       tank.is_dead = true;
       this.resetData();
       this.state.clearCurrentState();
       this.state.start('GameOver');
       //this.shadow.kill();
     }
     bullet.kill();

   },

   hitEnemy:function(tank, bullet){
     bullet.kill();
     this.tanks[tank.name]._kill();
     this.score += 100;
     this.enemies--;
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
   createWave: function (enemies) {
     for (i = 0; i < enemies; i++)
     {
       this.tanks.push(new Tank(i, this, this.tank, this.enemyBullets, game.world.randomX, game.world.randomY));
     }
   },
   resetData: function () {
     this.score = 0;
     this.timer = 0;
   }
 };
