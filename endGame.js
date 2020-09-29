class endGame extends Phaser.Scene{
    constructor() {
        super('end')
    }
    init(data){
        this.score=data.totalScore;
    }
    preload(){
        this.load.image('start-game','assets/start-game.jpg')
        this.load.image('over','assets/game-over.png')
    }
    create(){
        this.scene=this.add.image(400,300,'start-game').setScale(0.6)
        this.add.image(400,300,'over').setScale(0.9)
        this.scene.setTint(0xff0000)
        this.add.text(230,100,'Your Score:'+this.score,{fontSize:48})
    }
}