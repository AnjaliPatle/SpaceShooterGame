class startGame extends Phaser.Scene{
    constructor() {
        super()
    }
    preload(){
        this.load.image('start-game','assets/start-game.jpg')
        this.load.image('start','assets/play.png')
    }
    create(){
        this.add.image(400,300,'start-game').setScale(0.6)
        this.startbtn=this.add.image(550,365,'start').setScale(0.15)
        this.startbtn.setInteractive();
        this.startbtn.on('pointerdown',this.startGame,this)
        this.add.text(100,100,"Anjali's Space Shooter Game",{fontSize:36})
        this.add.text(100,300,"Click to shoot",{fontSize:24})
        this.add.text(80,330,"Collect stars and",{fontSize:24})
        this.add.text(80,360," destroy bombs",{fontSize:24})
    }
    startGame(){
        this.scene.start('play');
    }
}