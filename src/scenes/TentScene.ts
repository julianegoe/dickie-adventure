import { FrameKeys, SceneKeys, TextureKeys } from '@/constants';
import '../objects/InteractiveCharacter';
import '../objects/InteractiveItem';
import { InventoryManager } from '@/helpers/InventoryManager';
import { InteractionManager } from '@/helpers/InteractionManager';
import InteractiveItem from '../objects/InteractiveItem';
import eventsCenter from '@/events/eventsCenter';
export class TentScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private player!: Phaser.GameObjects.Sprite;
    private gameWidth!: number;
    private gameHeight!: number;
    private velocityX: number = 0;
    public inventoryGroup!: Phaser.GameObjects.Group;
    public inventoryManager!: InventoryManager;
    public worldItemGroup!: Phaser.GameObjects.Group;

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
        this.inventoryManager = new InventoryManager(this);
        const interactionManager = new InteractionManager(this)
        this.inventoryManager.initInventory((gameObject: any, dropZone: any) => {
            interactionManager.useWith(gameObject, dropZone.name as TextureKeys.Bonfire | TextureKeys.Tent)
        });
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.worldItemGroup = this.add.group();
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.cameras.main.setBackgroundColor('#cccccc');
        this.cameras.main.fadeIn(2000, 0, 0, 0)
        const map = this.make.tilemap({ key: 'tent_inside_tilemap' });
        const tileset = map.addTilesetImage('tent_inside', TextureKeys.TentInside);
        map.createLayer('tent_inside_background', tileset as Phaser.Tilemaps.Tileset, 0, 0)?.setScale(4);
        const bed = new InteractiveItem(this, 587, 362, TextureKeys.TentInsideBed).setScale(4);
        this.add.existing(bed);
        this.worldItemGroup.add(bed);
        const polygon = this.add.polygon(687, 375, [687, 375, 844, 377, 754, 470, 576, 469, 691, 376], 0xfff)
        this.player = this.createPlayer().setScale(4);
        map.createLayer('tent_inside_foreground', tileset as Phaser.Tilemaps.Tileset, 0, 0)?.setScale(4).setDepth(1);
        
        // Item Triggers
        eventsCenter.on("lookAtItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("lookAtText"), autoDelete: true })
        });
        eventsCenter.on("takeItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("takeText"), autoDelete: true });
            if (item.getData("removeable")) {
                item.controller.setState("inInventory");
            }
        });

        eventsCenter.on("interactInWorld", (item: InteractiveItem, pointer: Phaser.Math.Vector2) => {
            this.scene.launch(SceneKeys.InteractionMenu, { item, pointer}).bringToTop();
        })    }

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