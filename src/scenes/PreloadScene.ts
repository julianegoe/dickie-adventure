import { AnimationKeys, AudioKeys, CharacterKey, SceneKeys, TextureKeys } from "@/constants";
import WebFontFile from '@/helpers/WebFontFile'

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    private createAnimations() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames(TextureKeys.DickieMove, {
                prefix: AnimationKeys.DickieMoveLeft,
                end: 3,
                zeroPad: 3,
            }),
            repeat: -1,
            frameRate: 7,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames(TextureKeys.DickieMove, {
                prefix: AnimationKeys.DickieMoveRight,
                end: 3,
                zeroPad: 3,
            }),
            repeat: -1,
            frameRate: 7,
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames(TextureKeys.DickieMove, {
                prefix: AnimationKeys.DickieIdle,
                end: 1,
                zeroPad: 3,
            }),
            repeat: -1,
            frameRate: 2,
        });
    }

    private createExplorerAnimation() {
        this.anims.create({
            key: 'explorer_wind',
            frames: this.anims.generateFrameNames(CharacterKey.Explorer, {
                prefix: AnimationKeys.ExplorerWind,
                end: 3,
                zeroPad: 3,
            }),
            repeat: -1,
            frameRate: 7,
        });
    }

    preload() {
        // this.load.image(TextureKeys.Ice, '/background/mountains.png')
        // this.load.tilemapTiledJSON(TilemapKeys.Mountains, '/background/mountains.json')
        this.load.addFile(new WebFontFile(this.load, 'VT323'))
        this.load.image(TextureKeys.Bubble, 'bubble.png');
        this.load.image(TextureKeys.Mountains, 'background/mountain_tile.png');
        this.load.image(TextureKeys.Foreground, 'background/foreground.png');
        this.load.image(TextureKeys.Ground, 'background/ground.png');
        this.load.image(TextureKeys.InteractionMenu, 'interaction_menu.png');
        this.load.image(TextureKeys.Snow, 'snowflake.png');
        this.load.image(TextureKeys.Tent, 'tent.png');
        this.load.image(TextureKeys.Star, 'star.png');
        this.load.image(TextureKeys.Fish, 'fish.png');
        this.load.image(TextureKeys.LookAt, 'lookat.png');
        this.load.image(TextureKeys.Take, 'take.png');
        this.load.image(TextureKeys.Inventory, 'inventory.png');
        this.load.image(TextureKeys.DialogueChoices, 'dialogue_choices.png');

        this.load.atlas(CharacterKey.Explorer, "explorer.png", "explorer.json");
        this.load.atlas(TextureKeys.DickieMove, "dickie_version_1/dickie_move.png", "dickie_version_1/dickie_move.json");
        this.load.atlas(TextureKeys.Seal, "dickie_version_2/dickie_move.png", "dickie_version_2/dickie_move.json");

        this.load.audio(AudioKeys.ArcticWinds, ['arctic_winds.ogg'])
    }

    create() {
        this.createAnimations();
        this.createExplorerAnimation()
        this.input.setDefaultCursor('url(/crosshair.cur), pointer');
        this.scene.start(SceneKeys.Game);
    }
}