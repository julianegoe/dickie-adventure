import { SceneKeys, TextureKeys } from "@/constants";
import eventsCenter from "@/events/eventsCenter";
import { Inventory as InventoryData } from "@/game-data/inventoryData";

export class Inventory extends Phaser.Scene {
    inventoryGroup!: Phaser.GameObjects.Group;
    constructor() {
        super({ key:  SceneKeys.Inventory });
    }
    alignItems() {
        Phaser.Actions.GridAlign(this.inventoryGroup.getChildren(), {
            width: -1,
            cellWidth: this.scale.width * 0.12,
            cellHeight: 32,
            x: 12,
            y: this.scale.height - 82,
        });
    }

    initInventory() {
        this.add.nineslice(0, this.scale.height - 100, TextureKeys.UiBox, 0, 900, 100, 32, 32, 32, 32)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(3);
        if (InventoryData.items.size > 0) {
            InventoryData.items.forEach((item) => {
                this.inventoryGroup.add(this.add.sprite(0,0, item.key, item.frame)
                .setScrollFactor(0)
                .setOrigin(0)
                .setScale(2)
                .setInteractive({ draggable: true })
                .setName(item.key)
                .setDepth(2)).setDepth(4)
            })
        }
        this.alignItems();
        this.addDrag();
    }

    addDrag() {
        this.input.on("dragstart", (pointer: any, gameObject: any) => {
            gameObject.setAlpha(0.7)
        })

        this.input.on("drag", (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameObject.x = dragX,
            gameObject.y = dragY
        })

        this.input.on("dragend", (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
            gameObject.setAlpha(1);
            this.alignItems();
        });

        this.input.on('drop', (pointer: Phaser.Math.Vector2, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) => {
            eventsCenter.emit("inventoryItemDropped", { inventoryItem: gameObject, dropZone })
        });
    }

    create() {
        this.inventoryGroup = this.add.group();
        this.initInventory();

        eventsCenter.on("addToInventory", (item: any) => {
            console.log(item)
        })
    }
}