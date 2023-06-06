import { SceneKeys, TextureKeys } from "@/constants";
import { items, type InteractiveItemInterface } from "@/game-data/itemObjects";
import type InteractiveItem from "@/objects/InteractiveItem";
import { useGameObjectStore } from "@/stores/gameObjects";
import type { Scene } from "phaser";

export class InteractionManager {
    private scene!: Scene;
    private store!: any;

    constructor(scene: Scene) {
        this.scene = scene;
        this.store = useGameObjectStore(); 
    }

    public useWith(inventoryItem: Phaser.GameObjects.Sprite, worldItemName: TextureKeys) {
        if (inventoryItem && worldItemName !== inventoryItem.name) {
            const condition = items[worldItemName]?.interactionCondition;
            const worldItem: InteractiveItem = this.store.getObject(worldItemName)
            if (condition && worldItem) {
                const isSolved: boolean = condition(inventoryItem, worldItem)
                if (isSolved) {
                    inventoryItem.destroy(true);
                    this.scene.scene.launch(SceneKeys.DisplayText, { text: worldItem.getData("successText"), autoDelete: true });
                    worldItem.controller.setState("questCompleted");
                } else {
                    const group: Phaser.GameObjects.Group = this.store.getInventoryGroup();
                    Phaser.Actions.GridAlign(group.getChildren(), {
                        width: -1,
                        cellWidth: 900 * 0.12,
                        cellHeight: 32,
                        x: 12,
                        y: 580 - 82,
                    });
                    this.scene.scene.launch(SceneKeys.DisplayText, { text: worldItem.getData("failureText"), autoDelete: true })
                }
                this.resetItem(inventoryItem);
            }
        } else {
            this.resetItem(inventoryItem);
        }
    }

    private resetItem(inventoryItem: Phaser.GameObjects.Sprite) {
        inventoryItem?.setAlpha(1)
    }
}