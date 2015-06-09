Boost = function(game){
};

Boost.prototype = {
  preload:function(){
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.load.image('loading','assets/images/loading-bar.png');
  },
  create:function(){
    this.state.start('Preloader');
  }
};
