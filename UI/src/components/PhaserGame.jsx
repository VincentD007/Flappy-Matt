import {Game, CANVAS} from 'phaser';
import { useEffect } from 'react';
import PreloadScene from '../Phaser/preload-scene.js';
import GameScene from '../Phaser/game-scene.js';

export default function PhaserGame() {
    useEffect(() => {
        const GameConfig = {
            type: CANVAS,
            roundPixels: true,
            pixelArt: true,
            parent: 'PhaserRoot',
            width: 550,
            height: 400,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y:150},
                    debug: false
                }
            }
        }
        const game = new Game(GameConfig);
        game.scene.add('PreloadScene', PreloadScene);
        game.scene.add('GameScene', GameScene);
        game.scene.start('PreloadScene');
        return () => {game.destroy(true)}
    }, [])

    return (
        <div id='PhaserRoot'></div>
    )
    
}
