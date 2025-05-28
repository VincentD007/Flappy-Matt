import {Game, AUTO} from 'phaser';
console.log(Phaser)
import { useEffect } from 'react';

export default function PhaserGame() {
    useEffect(() => {
        const GameConfig = {
            type: AUTO,
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
    return
}

function create() {
    return
}

function update() {
    return
}
