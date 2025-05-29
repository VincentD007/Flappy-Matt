import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'})
    }

    create() {
        let b1 = this.add.image(275, 200, 'Background').setScale(400/240);
        let b2 = this.add.image(275 + b1.width, 200, 'Background').setScale(400/240);

        let Ground = this.physics.add.staticGroup();
        let f1 = Ground.create(275, 350, 'Foreground').setScale(400/240).refreshBody();
        let f2 = Ground.create(275 + f1.width, 350, 'Foreground').setScale(400/240).refreshBody();

        this.backgroundloop = [b1, b2];
        this.foregroundloop = [f1, f2];
        this.cursors = this.input.keyboard.createCursorKeys();
        this.allowJump = true;

        this.PlayerAlive = this.physics.add.sprite(100, 150, 'Player');
        this.PlayerAlive.body.setVelocityY(150);
        this.PlayerAlive.setGravityY(600);
        this.PlayerAlive.anims.play('run');
        this.physics.add.collider(this.PlayerAlive, Ground);
        this.PlayerAlive.setCollideWorldBounds(true);

        this.PlayerDeath = this.physics.sprite.add(100, 150, 'PlayerDeath').setScale(60/160);
        this.PlayerAlive.setGravityY(500);
        // PlayerDeath.setVisible(false);

    }

    update() {
        if (this.cursors && this.cursors.space.isDown && this.allowJump) {
        this.PlayerAlive.y -= 10;
        this.PlayerAlive.setVelocityY(-300);
        this.allowJump = false;
        setTimeout(() => {this.allowJump = true}, 300)
    }

    if (!(this.PlayerAlive.anims.isPaused) && !(this.PlayerAlive.body.blocked.down)) {
        this.PlayerAlive.anims.pause();
    }
    else if (this.PlayerAlive.anims.isPaused && this.PlayerAlive.body.blocked.down) {
        this.PlayerAlive.anims.resume();
    }

    let b1 = this.backgroundloop[0];
    let b2 = this.backgroundloop[1];
    let f1 = this.foregroundloop[0];
    let f2 = this.foregroundloop[1];
    
    if (b2.x === 275) {
        this.backgroundloop.push(this.backgroundloop.shift());
        b1.x += (b1.width * 2);
    }

    if (f2.x === 275) {
        f1.x += (f1.width * 2);
        this.foregroundloop.push(this.foregroundloop.shift());
    }

    b1.x -= .25;
    b2.x -= .25;
    f1.x -= .5;
    f2.x -= .5;
    }
}
