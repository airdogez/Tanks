Preloader = function(game){
};

Preloader.prototype = {
  preload:function(){
    this.load.image('land','assets/images/earth.png');
    this.load.image('logo','assets/images/logo.png');
    this.load.atlas('tank','assets/images/tanks.png','assets/images/tanks.json');
    this.load.image('bullet','assets/images/bullet.png');
    this.load.atlas('enemy','assets/images/enemy-tanks.png', 'assets/images/tanks.json');
    //Imagenes a agregar
    this.load.image('instructions-btn','assets/images/instruction-btn.png');
    this.load.image('start-btn','assets/images/start-btn.png');
  },
  create:function(){
    this.state.start('Menu');
  }
};
