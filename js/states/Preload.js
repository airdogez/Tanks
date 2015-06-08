Preload = function(game){};

//loading the game assets
Preload.prototype = {
  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    /*
     *this.load.image('playerDead', 'assets/images/player_dead.png');
     *this.load.image('floor', 'assets/images/floor.png');
     *this.load.image('water', 'assets/images/water.png');
     *this.load.image('coin', 'assets/images/coin.png');
     *this.load.image('facebook_share', 'assets/images/Facebook-Share-Button.png');
     *this.load.image('background', 'assets/images/background.png');
     *this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 51, 67, 5, 2, 3);
     */
  },
  create: function() {
    this.state.start('Game');
  }
};
