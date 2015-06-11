Preloader = function(game){
};

Preloader.prototype = {
  preload:function(){
    this.load.image('land','assets/images/earth.png');
    this.load.image('logo','assets/images/logo.png');

    this.load.atlas('tank','assets/images/tanks.png','assets/images/tanks.json');
    this.load.atlas('enemy','assets/images/enemy-tanks.png', 'assets/images/tanks.json');

    this.load.image('bullet','assets/images/bullet.png');
    this.load.image('live','assets/images/live.png');
    this.load.image('nolive','assets/images/nolive.png');

    this.load.spritesheet('instructions-btn','assets/images/instructions-btn.png', 323 ,46);
    this.load.spritesheet('start-btn','assets/images/start-btn.png', 178, 54);
    this.load.spritesheet('back-btn','assets/images/back-btn.png', 150, 46);
    this.load.spritesheet('retry-btn','assets/images/retry-btn.png', 153, 53);
  },
  create:function(){
    this.state.start('Menu');
  }
};
