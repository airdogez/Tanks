Tank = function(index,game, player,bullets){

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;	

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    
    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    this.game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();
    this.game.physics.arcade.velocityFromRotation(this.tank.rotation,100, this.tank.body.velocity);

};
Tank.prototype._kill = function(){
    this.tank.kill();
    this.shadow.kill();
    this.turret.kill();
    this.alive = false;
};
Tank.prototype.update = function(){
    this.shadow.x= this.tank.x;
    this.shadow.y = this.tank.y;
    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;
    if(!this.player.is_dead && this.alive){
        this.turret.rotation = this.game.physics.arcade.angleBetween(this.turret,this.player);
        if(this.game.physics.arcade.distanceBetween(this.tank, this.player) < 200){
            if(this.game.time.now > this.nextFire && 
                this.bullets.countDead()>0){
                this.nextFire = this.game.time.now+ this.fireRate;
                var bullet = this.bullets.getFirstDead();
                bullet.reset(this.turret.x, this.turret.y);
                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
            }
        }
    }

};






