Menu = function(game){
	this.bg = null;
	this.logo = null;
}

Menu.prototype ={
	create:function(){
		//this.bg = this.add.sprite(0,0,'land');
		this.bg = this.add.tileSprite(0,0,800,600,'land');
		this.logo = this.add.sprite(0,0,'logo');
		this.logo.anchor.setTo(0.5,0.5);
		this.logo.x = 400;
		this.logo.y = 300;
		this.logo.inputEnabled = true;
		this.logo.events.onInputDown.add(this.goGame,this);
	},
	goGame:function(){
		this.state.start('Game');
	}
}