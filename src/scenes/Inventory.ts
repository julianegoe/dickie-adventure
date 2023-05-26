import { FrameKeys, SceneKeys, TextureKeys } from "@/constants";
import type { ItemData } from "@/dialogues/itemObjects";
import eventsCenter from "@/events/eventsCenter";
import InteractiveItem from "@/objects/InteractiveItem";
import { useInventoryStore, type InventoryItem } from "@/stores/inventory";

export class Inventory extends Phaser.Scene {

    private inventoryStore!: any;
    private nineslice!: Phaser.GameObjects.NineSlice;
    private itemPool!: Phaser.GameObjects.Group;


    constructor() {
        super({ key: SceneKeys.Inventory });
        this.inventoryStore = useInventoryStore();
    }
    isItemVisible(itemName: string) {
        return this.inventoryStore.items.find((item: any) => item.name === itemName)?.isInInventory;
    }

    private displayItem(itemData: ItemData, frame: FrameKeys, slot: number) {
        const duplicates: Phaser.GameObjects.Sprite[] = this.itemPool.getMatching('name', itemData.key);
        if (duplicates.length > 0) {
            duplicates.forEach((duplicate) => duplicate.setFrame(frame));
        } else {
            const padding = 12;
            const gridColumn = this.scale.width * 0.1;
            const gridRow = this.scale.height - 100 + padding;
            const newItem = this.add.sprite(gridColumn * slot + padding, gridRow, itemData.key)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2)
                .setVisible(true)
                .setName(itemData.key);
            if (frame) {
                newItem.setFrame(itemData.frames[2])
            } else {
                newItem.setFrame(itemData.initialFrame)
            }
            this.itemPool.add(newItem);
        }
    }

    create() {
        this.itemPool = this.add.group()
        this.nineslice = this.add.nineslice(0, this.scale.height - 100, TextureKeys.UiBox, 0, 900, 100, 32, 32, 32, 32).setOrigin(0);
        // Listen for Scene Event
        eventsCenter.on('itemTaken', (itemData: ItemData, index: number) => {
            const newFrame = itemData.frames[index];
            this.inventoryStore.addItem(itemData.key, newFrame)
            this.displayItem(itemData, newFrame, this.inventoryStore.items.size - 1);
        }, this);
    }
}