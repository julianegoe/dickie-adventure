import { SceneKeys, TextureKeys } from "@/constants";
import { items } from "@/game-data/itemObjects";
import type InteractiveItem from "@/objects/InteractiveItem";
import type { GameScene } from "@/scenes/GameScene";

export class InteractionManager {
    private scene!: GameScene;

    constructor(scene: GameScene) {
        this.scene = scene;
    }

    public useWith(inventoryItem: Phaser.GameObjects.Sprite, worldItemName: TextureKeys.Bonfire | TextureKeys.Tent) {
        if (inventoryItem && worldItemName !== inventoryItem.name) {
            const condition = items[worldItemName]?.interactionCondition;
            const worldItem: InteractiveItem = this.scene[worldItemName];
            if (condition && worldItem) {
                const isSolved: boolean = condition(inventoryItem, worldItem)
                if (isSolved) {
                    inventoryItem.destroy(true);
                    this.scene.scene.launch(SceneKeys.DisplayText, { text: worldItem.getData("successText"), autoDelete: true });
                    worldItem.controller.setState("questCompleted");
                } else {
                    Phaser.Actions.GridAlign(this.scene.inventoryGroup.getChildren(), {
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

    public combineInventoryIntems(itemA: Phaser.GameObjects.Sprite, itemB: Phaser.GameObjects.Sprite) {

    }

    private resetItem(inventoryItem: Phaser.GameObjects.Sprite) {
        inventoryItem?.setAlpha(1)
    }
}