import { AudioKeys, SceneKeys, TextureKeys } from "@/constants";

export class SnowScene extends Phaser.Scene {

    private player!: Phaser.GameObjects.Sprite;
    private windSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    constructor() {
        super({ key: SceneKeys.Snowfall });
    }

    init(data: {
        player: Phaser.GameObjects.Sprite;
    }) {
        this.player = data.player
    }

    addSounds() {
        this.windSound = this.sound.add(AudioKeys.ArcticWinds)
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setSize(this.scale.width, this.scale.height - 100)
        this.add.particles(0, 100, TextureKeys.Snow, {
            x: 0,
            y: 0,
            // emitZone
            emitZone: {
                source: new Phaser.Geom.Rectangle(-width * 3, 0, width * 7, 100),
                type: 'random',
                quantity: 100,
            },
            angle: { min: 90, max: 135 },
            //speedY: { min: 50, max: 100 },
            speedX: { min: -800, max: -300 },
            accelerationY: { random: [10, 100] },
            // lifespan
            lifespan: { min: 8000, max: 10000 },
            scale: { random: [0.25, 1.8] },
            alpha: { random: [0.05, 0.6] },
            gravityY: 10,
            quantity: 40,
            blendMode: 'ADD',
            // follow the player at an offiset
            follow: this.player,
            followOffset: { x: -width * 0.5, y: -height - 100 }
        });
        /* this.addSounds();
        this.windSound.play({
            mute: false,
            volume: 2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        }) */

    }

    update() {
        // do something
    }



}