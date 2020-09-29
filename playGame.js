class playGame extends Phaser.Scene{
    constructor() {
        super('play')
        this.score=0;
    }

 preload() {
    this.load.image('jet', 'assets/jet.png')
    this.load.image('bg', 'assets/bg.jpg')
    this.load.image('ammo', 'assets/ammo.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.spritesheet('explosion','assets/explosion.png',{
        frameWidth:16,
        frameHeight:16
    })
    this.load.audio('gun-shot','assets/audio/gunshot.wav')
    this.load.image('star','assets/star.png')
    this.load.audio('coinhit','assets/audio/coinhit.wav')
    this.load.audio('end','assets/audio/end.mp3')
}

 create() {
    
    this.sky = this.add.tileSprite(400, 300,config.height,config.width, 'bg').setScale(1.3);
    this.jet = this.physics.add.image(390, 500, 'jet').setScale(0.2).setOrigin(0.5, 0);
    this.jet.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', this.shoot, this);

    this.bomb= this.physics.add.group({
        key: 'bomb',
        repeat: 4,
        setXY: {
            x: 50,
            y: 50,
            stepX: Phaser.Math.Between(20, config.width - 20),
            stepY: Phaser.Math.Between(15, 300),
        },
        setScale: { x: 0.02, y: 0.02 }
    })
    this.setObjectVelocity(this.bomb);

    this.stars=this.physics.add.group();
    for(let i=0;i<3;i++){
        let x=Phaser.Math.Between(20,config.width-15)
        let newCoin=this.stars.create(x,0,'star').setScale(0.05)
    }
    this.setObjectVelocity(this.stars)

    this.anims.create({
        key:'explode',
        frames:this.anims.generateFrameNumbers('explosion'),
        frameRate:20,
        hideOnComplete:true
    })
    this.gunShot=this.sound.add('gun-shot')
    this.coinhit=this.sound.add('coinhit')
    this.end=this.sound.add('end')
    this.physics.add.collider(this.jet,this.stars,this.collectStars,null,this)
    this.physics.add.collider(this.jet,this.bomb,this.endGame,null,this)
    this.scoreText=this.add.text(15,15,'Score: 0',{fontSize:32,fill:'#0f0'})
    
}
 collectStars(jet,stars){
    this.coinhit.play();
    stars.disableBody(true,true)
    let x=Phaser.Math.Between(20,config.width-20);
    stars.enableBody(true,x,0,true,true)
    let xVel=Phaser.Math.Between(-100,100);
    let yVel=Phaser.Math.Between(80,120);
    this.stars.setVelocity(xVel,yVel);
    this.score+=10;
    this.scoreText.setText('Score: '+this.score)
}

 setObjectVelocity(bomb){
    bomb.children.iterate(function(bomb){
        let xVel=Phaser.Math.Between(-100,100);
        let yVel=Phaser.Math.Between(100,150);
        bomb.setVelocity(xVel,yVel);
    })
}
 shoot() {
    this.ammo = this.physics.add.image(this.jet.x, this.jet.y, 'ammo');
    this.ammo.setScale(0.04).setRotation(-Phaser.Math.PI2 / 2.75);
    this.ammo.setVelocityY(-600);
    this.physics.add.collider(this.ammo, this.bomb, this.destroyBomb, null, this)
}

 destroyBomb(ammo, bomb) {
    this.gunShot.play()
    this.explosion=this.add.sprite(bomb.x,bomb.y,'explosion').setScale(3);
    this.explosion.play('explode')
    bomb.disableBody(true, true)
    ammo.disableBody(true, true)
    let x=Phaser.Math.Between(20,config.width-20);
    bomb.enableBody(true,x,0,true,true)
    let xVel=Phaser.Math.Between(-100,100);
    let yVel=Phaser.Math.Between(100,150);
    bomb.setVelocity(xVel,yVel);
    this.score+=20;
    this.scoreText.setText('Score: '+this.score)
}
endGame(jet,bomb){
    this.physics.pause();
    this.jet.setTint(0xff0000)
    this.explosion=this.add.sprite(jet.x,jet.y,'this.').setScale(6);
    this.explosion.play('explode')
    this.gameOver=true;
    this.end.play()
}
 update() {
    if(this.gameOver&& !this.end.isPlaying){
        this.scene.start('end',{totalScore:this.score});
    }
    this.sky.tilePositionY-=0.5;
    if (this.cursors.left.isDown) {
        this.jet.setVelocityX(-150);
    } else if (this.cursors.right.isDown) {
        this.jet.setVelocityX(+150);
    } else {
        this.jet.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.jet.setVelocityY(-150);
    } else if (this.cursors.down.isDown) {
        this.jet.setVelocityY(+150);
    } else {
        this.jet.setVelocityY(0);
    }
    this.checkForRepos(this.bomb);
    this.checkForRepos(this.stars);
}
resetPos(bomb){
    bomb.y=0;
    let randomX=Phaser.Math.Between(15,config.width-15);
    bomb.x=randomX;
}
checkForRepos(bombs){
    let game=this;
    bombs.children.iterate(function(bomb){
        if(bomb.y>config.height){
            game.resetPos(bomb);
        }
    })
}

}