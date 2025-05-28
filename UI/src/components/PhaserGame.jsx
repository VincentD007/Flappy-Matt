import {Game, CANVAS} from 'phaser';
import background from '../assets/background.png';
import foreground from '../assets/foreground.png';
import { useEffect } from 'react';

export default function PhaserGame() {
    useEffect(() => {
        const GameConfig = {
            type: CANVAS,
            parent: 'PhaserRoot',
            width: 550,
            height: 400,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        }
        const game = new Game(GameConfig);

        return  () => {game.destroy(true)}
    }, [])

    return (
        <div id='PhaserRoot'></div>
    )
    
}

function preload() {
    // this.load.atlas('playerRun', '/sprites/NarutoMatt.png', '/sprites/NarutoMatt.json')
    this.load.image('background', background);
    this.load.image('foreground', foreground);
    
}

function create() {
    let b1 = this.add.image(275, 200, 'background').setScale(400/240);
    let b2 = this.add.image(b1.width + 275, 200, 'background').setScale(400/240);
    this.backgroundloop = [b1, b2];
    // this.foreground = this.add.image(275, 200, 'foreground').setScale(400/240);

    // this.anims.create({
    //     key: 'run',
    //     frames: [
    //         { key: 'playerRun', frame: 'NarutoMatt 0.aseprite' },
    //         { key: 'playerRun', frame: 'NarutoMatt 1.aseprite' },
    //         { key: 'playerRun', frame: 'NarutoMatt 2.aseprite' },
    //         { key: 'playerRun', frame: 'NarutoMatt 3.aseprite' }
    //     ],
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.player = this.add.sprite(100, 200, 'playerRun', 'NarutoMatt 0.aesprite');
    // this.player.setScale(1);
    // this.player.play('run');
}

function update() {
    // this.player.body.setVelocityX(80);
    let b1 = this.backgroundloop[0];
    let b2 = this.backgroundloop[1];
    
    if (b2.x === 275) {
        console.log('shifted');
        this.backgroundloop.push(this.backgroundloop.shift());
        b1.x += b1.width * 2;
    }

    b1.x -= 1;
    b2.x -= 1;

}
