import { SceneKeys, TextureKeys } from "@/constants";
import { Inventory } from "@/game-data/inventoryData";
import { items } from "@/game-data/itemObjects";
import type InteractiveItem from "@/objects/InteractiveItem";
import type { GameScene } from "@/scenes/GameScene";
import type { TentScene } from "@/scenes/TentScene";

export class InteractionManager {
    private scene!: GameScene | TentScene;

    constructor(scene: GameScene | TentScene) {
        this.scene = scene;
    }

    public useWith(inventoryItem: Phaser.GameObjects.Sprite, worldItemName: any) {
        if (inventoryItem && worldItemName !== inventoryItem.name) {
            const condition = items[worldItemName as TextureKeys]?.interactionCondition;
            const worldItem: InteractiveItem[] = this.scene.worldItemGroup.getMatching("name", worldItemName);
            console.log(this.scene.worldItemGroup);
            if (condition && worldItem.length > 0) {
                const isSolved: boolean = condition(inventoryItem, worldItem[0])
                if (isSolved) {
                    inventoryItem.destroy(true);
                    Inventory.removeItem(inventoryItem.name as TextureKeys);
                    this.scene.scene.launch(SceneKeys.DisplayText, { text: worldItem[0].getData("successText"), autoDelete: true });
                    worldItem[0].controller.setState("questCompleted");
                } else {
                    this.scene.inventoryManager.alignItems();
                    this.scene.scene.launch(SceneKeys.DisplayText, { text: worldItem[0].getData("failureText"), autoDelete: true })
                }
                this.resetItem(inventoryItem);
            }
        } else {
            this.resetItem(inventoryItem);
        }
    }

    public combineInventoryIntems(itemA: Phaser.GameObjects.Sprite, itemB: Phaser.GameObjects.Sprite) {

    }

    private resetItem(inventoryItem: Phaser.GameObjects.Sprite) {
        inventoryItem?.setAlpha(1)
    }
}