import { AnimationKeys, SceneKeys, TextureKeys } from "@/constants";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    private createAnimations() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames(TextureKeys.DickieMove, {
                prefix: AnimationKeys.DickieMoveLeft,
                end: 4,
                zeroPad: 4,
            }),
            repeat: -1,
            frameRate: 8,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames(TextureKeys.DickieMove, {
                prefix: AnimationKeys.DickieMoveRight,
                end: 4,
                zeroPad: 4,
            }),
            repeat: -1,
            frameRate: 8,
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames(TextureKeys.DickieIdle, {
                prefix: AnimationKeys.DickieIdle,
                end: 2,
                zeroPad: 4,
            }),
            repeat: -1,
            frameRate: 8,
        });
    }

    preload() {
        // load the PNG file
        this.load.image(TextureKeys.Ice, 'background_arctic.png')

        // load the JSON file
        this.load.tilemapTiledJSON('tilemap', 'background_arctic.json')
        this.load.image(TextureKeys.Bubble, 'bubble.png');
        this.load.image(TextureKeys.Star, 'star.png');
        this.load.image(TextureKeys.Fish, 'fish.png');
        this.load.image(TextureKeys.LookAt, 'lookat.png');
        this.load.image(TextureKeys.Take, 'take.png');
        this.load.image(TextureKeys.Inventory, 'inventory.png');
        this.load.atlas(TextureKeys.DickieIdle, "dickie_idle.png", "dickie_idle.json");
        this.load.atlas(TextureKeys.DickieMove, "dickie_move.png", "dickie_move.json");
        [TextureKeys.Star, TextureKeys.Fish].forEach((key) => {
            this.load.json({
                key: key,
                url: 'src/dialogues/item_texts.json',
                dataKey: key,
            });
        })
    }

    create() {
        this.createAnimations();
        this.input.setDefaultCursor('url(/crosshair.cur), pointer');
        this.scene.start(SceneKeys.Game);
    }
}