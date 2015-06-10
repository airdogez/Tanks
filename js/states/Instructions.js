Instructions = function (game) {
};

Instructions.prototype = {
  create: function () {
    /*
     *TODO:
     *Create game instrucctions and 2 buttons for Start game and back to menu
     *Add Credits
     */
     this.background = this.add.tileSprite(0,0,800,600, 'land');


     var instrucction = "El juego consiste en sobrevivir la mayor cantidad de olas de tanques, cada ola incrementa en dificultad.";
     instrucction += "\n\nEl jugador tendra 3 vidas y cada vez que elimine a un enemigo obtendra 100 puntos.";

     var fontStyleHeader = {font:'bold 24px Arial', fill:'#AA0', stroke: "#333", strokeThickness: 5};
     var fontStyleText = {font:'20px Arial', fill:'#FFFFFF', stroke: "#333", strokeThickness: 5, wordWrap: true, wordWrapWidth: 700};

     this.instructionsText1 = this.add.text(50, 50, 'Instrucciones:', fontStyleHeader);

     this.instructionsText2 = this.add.text(50, 100, instrucction, fontStyleText);



     this.integrantesText1 = this.add.text(50, 420, 'Integrantes:', fontStyleHeader);
     this.integrantesText2 = this.add.text(50, 460, '\t -Alberto Gonzalez', fontStyleText);
     this.integrantesText3 = this.add.text(50, 490, '\t -Andres Revolledo', fontStyleText);
     this.integrantesText4 = this.add.text(50, 520, '\t -Renzo Villavisencio', fontStyleText);

     this.startBtn = this.add.button(350, 420, 'start-btn', this.startGame, this, 1,0,2);
     this.backBtn = this.add.button(350, 500, 'back-btn', this.backBtn, this, 1,0,2);

  },
  startGame:function(){
    this.state.start('Game');
  },
  backBtn: function () {
    this.state.start('Menu');
  }
};
