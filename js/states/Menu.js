Menu = function(game){
};

Menu.prototype ={
  create:function(){
    /*
     *TODO:
     **Add animations to the menu: Tanks moving at the top horizontaly
     **Add Instrucctions and Start Buttons
     **Move Logo
     */

    this.bg = this.add.tileSprite(0,0,800,600,'land');
    this.logo = this.add.sprite(0,0,'logo');
    this.instructions = this.add.button(0,0,'instructions-btn',this.instructionsBtn,this);
    this.start = this.add.button(0,0,'start-btn', this.startGame, this);
    this.logo.anchor.setTo(0.5,0.5);
    this.logo.x = 400;
    this.logo.y = 300;
    //this.logo.inputEnabled = true;
    //this.logo.events.onInputDown.add(this.startGame,this);
    this.instructions.x = 400;
    this.instructions.y = 400;
    this.start.x = 400;
    this.start.x = 360;
  },
  startGame:function(){
    this.state.start('Game');
  },
  instructionsBtn: function () {
    this.state.start('Instructions');
  }
};
