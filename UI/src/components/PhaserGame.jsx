import {Game, CANVAS} from 'phaser';
import background from '../assets/background.png';
import foreground from '../assets/foreground.png';
import player from '../assets/sprites/NarutoMatt.png';
import { useEffect } from 'react';

export default function PhaserGame() {
    useEffect(() => {
        const GameConfig = {
            type: CANVAS,
            // roundPixels: true,
            // pixelArt: true,
            parent: 'PhaserRoot',
            width: 550,
            height: 400,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y:30},
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        }
        const game = new Game(GameConfig);

        return () => {game.destroy(true)}
    }, [])

    return (
        <div id='PhaserRoot'></div>
    )
    
}

function preload() {
    this.load.image('background', background);
    this.load.image('foreground', foreground);
    this.load.spritesheet('player', player, {
        frameWidth: 60,
        frameHeight: 60
    });
}

function create() {
    let b1 = this.add.image(275, 200, 'background').setScale(400/240);
    let b2 = this.add.image(275 + b1.width, 200, 'background').setScale(400/240);
    let f1 = this.physics.add.staticImage(275, 350, 'foreground').setScale(400/240).refreshBody();
    let f2 = this.physics.add.staticImage(275 + f1.width, 350, 'foreground').setScale(400/240).refreshBody();

    this.backgroundloop = [b1, b2];
    this.foregroundloop = [f1, f2];
    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    })

    this.player = this.physics.add.sprite(100, 150, 'player');
    // this.player = this.physics.add.sprite(100, 150, 'player').setScale(60/160);
    this.player.body.setVelocityY(150)
    this.player.setGravityY(600)
    this.physics.add.collider(this.player, f1);
    this.physics.add.collider(this.player, f2);
    this.player.anims.play('run');
    this.allowJump = true;
    this.player.setCollideWorldBounds(true);
}

function update() {

    if (this.cursors && this.cursors.space.isDown && this.allowJump) {
        this.player.y -= 10;
        this.player.setVelocityY(-300);
        this.allowJump = false;
        setTimeout(() => {this.allowJump = true}, 300)
    }

    if (!(this.player.anims.isPaused) && !(this.player.body.blocked.down)) {
        this.player.anims.pause();
    }
    else if (this.player.anims.isPaused && this.player.body.blocked.down) {
        this.player.anims.resume();
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
