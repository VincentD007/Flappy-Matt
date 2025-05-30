import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'});
    }
    score = 0;
    
    memeBarrierKeys = [
        'BarrierShould',
        'BarrierHave',
        'BarrierJoined',
        'BarrierThe',
        'BarrierAir',
        'BarrierForce'
    ];
    currentMemeIndex = 0;
    plainBarrierCount = 0;
    plainBarriersToSpawn = 5;

    create() {
        let b1 = this.add.image(275, 200, 'Background').setScale(400/240);
        let b2 = this.add.image(275 + b1.width, 200, 'Background').setScale(400/240);

        this.Crayons = this.physics.add.staticGroup();
        this.Barriers = this.physics.add.staticGroup();
        let Ground = this.physics.add.staticGroup();
        let f1 = Ground.create(275, 350, 'Foreground').setScale(400/240).refreshBody();
        let f2 = Ground.create(275 + f1.width, 350, 'Foreground').setScale(400/240).refreshBody();


        this.backgroundloop = [b1, b2];
        this.foregroundloop = [f1, f2];
        this.cursors = this.input.keyboard.createCursorKeys();
        this.allowJump = true;

        this.score = 0;


        this.PlayerAlive = this.physics.add.sprite(100, 150, 'Player');
        this.PlayerAlive.body.setVelocityY(150);
        this.PlayerAlive.setGravityY(600);
        this.PlayerAlive.anims.play('run');
        this.physics.add.collider(this.PlayerAlive, Ground);
        this.physics.add.collider(this.PlayerAlive, this.Crayons, (_, obj2) => {obj2.destroy()});
        this.physics.add.collider(this.PlayerAlive, this.Barriers, this.handlePlayerDeath, null, this);

        this.PlayerAlive.setCollideWorldBounds(true);


        this.PlayerDeath = this.physics.add.sprite(100, 150, 'PlayerDeath').setScale(60/160);
        this.PlayerDeath.setVisible(false);  
        this.physics.add.collider(this.PlayerDeath, Ground, () => {
            if (!this.alive) {
                this.time.delayedCall(2000, () => {
                    this.scene.restart();
                }, [], this)
            }
        });
        this.PlayerAlive.setGravityY(500); 
        this.alive = true;


         this.crayongenerator = this.time.addEvent({
            delay: 2000,
            callback: () => {
                let random_y = 43 + (Math.random() * 240);
                let random_crayon = Math.round(Math.random() * 3);
                this.Crayons.create(600, random_y, 'Crayons', random_crayon).setScale(.5).refreshBody();
            },
            loop: true
        });
        this.spawnBarrierWithRandomDelay();

        const { width, height } = this.sys.game.config;
        this.scoreText = this.add.text(
            width - 20, height - 30,
            'Distance: 0',
            { font: '20px Arial', fill: '#fff', align: 'right' }
        ).setOrigin(1, 1);
    }

    spawnBarrierWithRandomDelay() {
        this.spawnBarrier();

        let nextDelay = Phaser.Math.Between(100, 2000);

        this.barrierSpawner = this.time.addEvent({
            delay: nextDelay,
            callback: this.spawnBarrierWithRandomDelay,
            callbackScope: this
        });
    }

    spawnBarrier() {
        let barrierKey;
        if (this.currentMemeIndex < this.memeBarrierKeys.length) {
            barrierKey = this.memeBarrierKeys[this.currentMemeIndex];
            this.currentMemeIndex++;
        } else if (this.plainBarrierCount < this.plainBarriersToSpawn) {
            barrierKey = 'PlainBarrier';
            this.plainBarrierCount++;
        } else {
            this.currentMemeIndex = 0;
            this.plainBarrierCount = 0;
            barrierKey = this.memeBarrierKeys[this.currentMemeIndex];
            this.currentMemeIndex++;
        }

        let groundY;
        if (barrierKey === 'PlainBarrier') {
            groundY = 280;
        } else {
            groundY = Math.round(40 + (Math.random() * 280));
        }

        this.Barriers.create(500, groundY, barrierKey);
    }

    handlePlayerDeath(player, barrier) {
        if (!this.alive) {return};

        this.alive = false;
        player.setVisible(false);
        this.PlayerDeath.setVisible(true);  
        this.PlayerDeath.y = player.y;
        this.PlayerDeath.anims.play('death');

        if (this.barrierSpawner) {this.barrierSpawner.remove()};
        if (this.crayon_generator) {this.crayon_generator.remove()};
    }

    update() {
        if (this.cursors && this.cursors.space.isDown && this.allowJump) {
        this.PlayerAlive.y -= 10;
        this.PlayerAlive.setVelocityY(-250);
        this.allowJump = false;
        setTimeout(() => {this.allowJump = true}, 300)
    }

        // if (this.cursors && this.cursors.down.isDown) {
        //     this.PlayerAlive.setVisible(false);
        //     this.PlayerDeath.setVisible(true);
        //     this.alive = false;
        //     this.PlayerDeath.y = this.PlayerAlive.y;
        //     this.PlayerDeath.anims.play('death');
        // }

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

        if (this.alive) {
            b1.x -= .25;
            b2.x -= .25;
            f1.x -= .5;
            f2.x -= .5;

            this.score += 1;
            this.scoreText.setText('Distance: ' + this.score);

            for (let crayon of this.Crayons.getChildren()) {
                if (crayon.x < -20) {
                    crayon.destroy();
                }
                else {
                    crayon.x -= .5;
                    crayon.body.updateFromGameObject();
                }
            }

            for (let barrier of this.Barriers.getChildren()) {
                if (barrier.x < -20) {
                    barrier.destroy();
                } else {
                    barrier.x -= 1;
                    if (barrier.body) barrier.body.updateFromGameObject();
                }
            }
            
            
        }
        else {
            if (!this.crayongenerator.paused || !this.barrierSpawner) {
                this.crayongenerator.paused = true;
                this.barrierSpawner.paused = true;
            }
        }
    }
}
