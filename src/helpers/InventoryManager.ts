import { TextureKeys, type FrameKeys } from "@/constants";
import { Inventory } from "@/game-data/inventoryData";
import type { Scene } from "phaser";

export class InventoryManager {
    private scene!: Scene;
    public inventoryGroup!: Phaser.GameObjects.Group;

    constructor(scene: Scene) {
        this.scene = scene;
        this.inventoryGroup = this.scene.add.group();
    }
    public alignItems() {
        Phaser.Actions.GridAlign(this.inventoryGroup.getChildren(), {
            width: -1,
            cellWidth: this.scene.scale.width * 0.12,
            cellHeight: 32,
            x: 12,
            y: this.scene.scale.height - 82,
        });
    }

    public initInventory(interactionCallBack: any) {
        this.scene.add.nineslice(0, this.scene.scale.height - 100, TextureKeys.UiBox, 0, 900, 100, 32, 32, 32, 32)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(2);
        if (Inventory.items.size > 0) {
            Inventory.items.forEach((item) => {
                this.inventoryGroup.add(this.scene.add.sprite(0,0, item.key, item.frame)
                .setScrollFactor(0)
                .setOrigin(0)
                .setScale(2)
                .setInteractive({ draggable: true })
                .setName(item.key)
                .setDepth(2))
            })
        }
        this.alignItems();
        this.addDrag(interactionCallBack);
    }

    addDrag(interActionCalback: any) {
        this.scene.input.on("dragstart", (pointer: any, gameObject: any) => {
            gameObject.setAlpha(0.7)
        })

        this.scene.input.on("drag", (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameObject.x = dragX,
            gameObject.y = dragY
        })

        this.scene.input.on("dragend", (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
            gameObject.setAlpha(1);
            this.alignItems();
        });

        this.scene.input.on('drop', (pointer: Phaser.Math.Vector2, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) => {
            interActionCalback(gameObject, dropZone);
        });

    }

    public addToInventory(key: TextureKeys, frame: FrameKeys) {
        Inventory.addItem({
            key, frame
        });
    }

    public removeFromInventory(key: TextureKeys, frame: FrameKeys) {
        Inventory.removeItem(key);
    }
}