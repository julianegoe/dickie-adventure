import { SceneKeys, TextureKeys } from "@/constants";

export class SnowScene extends Phaser.Scene {

    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super({ key: SceneKeys.Snowfall });
    }

    init(data: {
        player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    }) {
        this.player = data.player
    }

    create() {
        const { width, height } = this.scale;
        const particles = this.add.particles(0, 100, TextureKeys.Snow, {
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

    }

    update() {
        // do something
    }



}