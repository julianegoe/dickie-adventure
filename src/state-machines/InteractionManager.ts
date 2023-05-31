import { SceneKeys } from "@/constants";
import type InteractiveItem from "@/objects/InteractiveItem";
import type { Scene } from "phaser";

export class InteractionManager {
    private scene!: Scene;
    public useItem: Phaser.GameObjects.Sprite | InteractiveItem | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
      }

    public useWith(item: Phaser.GameObjects.Sprite | InteractiveItem) {
        if (this.useItem && item.name !== this.useItem.name) {
            const testCondition: (gameObject: Phaser.GameObjects.Sprite | InteractiveItem) => boolean = item.getData("interactionCondition");
            const isSolved: boolean = testCondition(this.useItem)
            if (isSolved) {
                this.scene.scene.launch(SceneKeys.DisplayText, { text: "Das passt", autoDelete: true})
            } else {
                this.scene.scene.launch(SceneKeys.DisplayText, { text: "Das passt nicht.", autoDelete: true})
            }
            this.resetItem();
        } else {
            this.resetItem();
        }
    }

    public setItem(item: Phaser.GameObjects.Sprite | InteractiveItem) {
        if (!this.useItem) {
            this.useItem = item;
        } else if (this.useItem && this.useItem.name === item.name) {
            console.log("item already set")
            this.resetItem();
        }
    };

    private resetItem() {
        this.useItem?.setAlpha(1)
        this.useItem = null;
    }
}