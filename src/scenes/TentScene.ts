import { SceneKeys, TextureKeys } from '@/constants';
import '../objects/InteractiveCharacter';
import '../objects/InteractiveItem';
import { InventoryManager } from '@/helpers/InventoryManager';
import { InteractionManager } from '@/helpers/InteractionManager';
import InteractiveItem from '../objects/InteractiveItem';
import eventsCenter from '@/events/eventsCenter';
import Sprite = Phaser.GameObjects.Sprite;

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

    createInteractableItem(texture: TextureKeys, scale: number, positionX: number, positionY: number) {
        const item = new InteractiveItem(this, positionX, positionY, texture).setScale(scale);
        this.add.existing(item);
        this.worldItemGroup.add(item);
        return item;
    }

    create() {
        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.inventoryManager = new InventoryManager(this);
        const interactionManager = new InteractionManager(this);
        this.inventoryManager.initInventory((gameObject: any, dropZone: any) => {
            interactionManager.useWith(gameObject, dropZone.name as TextureKeys.TentInsideBed)
        });

        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.worldItemGroup = this.add.group();
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.cameras.main.setBackgroundColor('#cccccc');
        const map = this.make.tilemap({ key: 'tent_inside_tilemap' });
        const tileset = map.addTilesetImage('tent_inside', TextureKeys.TentInside);
         map.createLayer('tent_inside_background', tileset as Phaser.Tilemaps.Tileset, 0, 0)?.setScale(4);
        
        // Create Game Objects

        const bed = this.createInteractableItem(TextureKeys.TentInsideBed, 4, 587, 362);
        bed.controller.setState("unlocked");
        bed.createDropZone(4)
        const skull = this.createInteractableItem(TextureKeys.Skull, 2.5, 500, 350);
        const polygon = this.add.polygon(687, 375, [687, 375, 844, 377, 754, 470, 576, 469, 691, 376], 0xfff)
        this.player = this.createPlayer().setScale(4);
        map.createLayer('tent_inside_foreground', tileset as Phaser.Tilemaps.Tileset, 0, 0)?.setScale(4).setDepth(1);

        // Item Triggers
        eventsCenter.on("lookAtItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("lookAtText"), autoDelete: true }).bringToTop(SceneKeys.DisplayText)
        });
        eventsCenter.on("takeItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("takeText"), autoDelete: true }).bringToTop(SceneKeys.DisplayText);
            if (item.getData("removeable")) {
                item.controller.setState("inInventory");
            }
        });
        eventsCenter.on("interactInWorld", (item: InteractiveItem, pointer: Phaser.Math.Vector2) => {
            this.scene.launch(SceneKeys.InteractionMenu, { pointer, item}).bringToTop(SceneKeys.InteractionMenu)
        });

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