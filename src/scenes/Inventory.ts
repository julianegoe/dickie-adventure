import { TextureKeys } from "@/constants";
import {useInventoryStore} from "@/stores/inventory";
import InteractiveItem from "@/objects/InteractiveItem";

export class Inventory extends Phaser.Scene {

    private inventoryStore!: any;
    private item!: InteractiveItem;
    constructor() {
        super({ key: TextureKeys.Inventory });
    }
    isItemVisible(itemName: string) {
        return this.inventoryStore.items.find((item: any) => item.name === itemName)?.isInInventory;
    }
    create() {
        this.inventoryStore = useInventoryStore()
        this.add.image(0, this.scale.height, TextureKeys.Inventory).setOrigin(0, 1);
        this.item = new InteractiveItem(this, 0, this.scale.height, TextureKeys.Star)
            .setOrigin(0, 1).setScale(3, 3)
            .setVisible(this.isItemVisible(TextureKeys.Star));
        this.add.existing(this.item);
    }

    update() {
        this.item.setVisible(this.isItemVisible(TextureKeys.Star));
    }



}