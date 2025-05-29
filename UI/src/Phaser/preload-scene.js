import Phaser from "phaser";
import Background from '../assets/background.png';
import Foreground from '../assets/foreground.png';
import Player from '../assets/sprites/NarutoMatt.png';
import PlayerDeath from '../assets/sprites/death.png';
import PlainBarrier from '../assets/sprites/obstacle1.png';
import BarrierShould from '../assets/sprites/obstacle2.png';
import BarrierHave from '../assets/sprites/obstacle3.png';
import BarrierJoined from '../assets/sprites/obstacle4.png';
import BarrierThe from '../assets/sprites/obstacle5.png';
import BarrierAir from '../assets/sprites/obstacle6.png';
import BarrierForce from '../assets/sprites/obstacle7.png';


export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key: 'PreloadScene'})
    }

    preload() {
        this.load.image('Background', Background);
        this.load.image('Foreground', Foreground);
        this.load.spritesheet('Player', Player);
        this.load.spritesheet('PlayerDeath', PlayerDeath);
        this.load.image('PlainBarrier', PlainBarrier);
        this.load.image('BarrierShould', BarrierShould);
        this.load.image('BarrierHave', BarrierHave);
        this.load.image('BarrierJoined', BarrierJoined);
        this.load.image('BarrierThe', BarrierThe);
        this.load.image('BarrierAir', BarrierAir);
        this.load.image('BarrierForce', BarrierForce);
    }

    create() {
        this.#createAnimations()
        this.scene.run('GameScene');
    }

    #createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('Player', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('Player', {start: 0, end: 10}),
            frameRate: 10,
        })
    }
}
