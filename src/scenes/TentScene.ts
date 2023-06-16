import { SceneKeys, TextureKeys } from '@/constants';
import '../objects/InteractiveCharacter';
import '../objects/InteractiveItem';
export class TentScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private player!: Phaser.GameObjects.Sprite;
    private gameWidth!: number;
    private gameHeight!: number;
    private velocityX: number = 0;

    constructor() {
        super({ key: SceneKeys.TentScene });
    }

    createPlayer() {
        return this.add.sprite(0, this.gameHeight - 200, TextureKeys.DickieMove)
            .setOrigin(0)
    }

    preload() {
        // preload assets
    }

    create() {
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.cameras.main.setBackgroundColor('#cccccc');
        this.cameras.main.fadeIn(2000, 0, 0, 0)
        //const tent = this.add.image(0, 0, TextureKeys.TentInside).setOrigin(0).setScale(4);
        const map = this.make.tilemap({ key: 'tent_inside_tilemap' });
        const tileset = map.addTilesetImage('tent_inside', TextureKeys.TentInside);
        map.createLayer('tent_inside_background', tileset as Phaser.Tilemaps.Tileset, 0, 0)?.setScale(4);
        map.createLayer('tent_inside_bed', tileset as Phaser.Tilemaps.Tileset, 0, 0)?.setScale(4);
        this.player = this.createPlayer().setScale(4);
        map.createLayer('tent_inside_foreground', tileset as Phaser.Tilemaps.Tileset, 0, 0)?.setScale(4);
	
    }

    update() {
        if (this.cursors?.left.isDown) {
            this.velocityX -= 2.5;

            this.player.anims.play('left', true);
        }
        else if (this.cursors?.right.isDown) {
            this.velocityX += 2.5;

            this.player.anims.play('right', true);
        } else {
            this.velocityX += 0;
            this.player.anims.play('idle', true)
        }
        this.player.x = this.velocityX;
    }
}