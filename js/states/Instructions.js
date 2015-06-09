Instructions = function (game) {
};

Instructions.prototype = {
  create: function () {
    /*
     *TODO:
     *Create game instrucctions and 2 buttons for Start game and back to menu
     *Add Credits
    */

  },
  startGame:function(){
    this.state.start('Game');
  },
  instructionsBtn: function () {
    this.state.start('Instructions');
  }
};
