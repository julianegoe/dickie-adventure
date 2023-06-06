import type { Scene } from "phaser";

type StateNames = "inInventory" | "interactionSuccess" | "interactionFailure"

export default class InventoryController {
    private possibleStates!: { [key in StateNames]: { enter: (args?: any) => void } };
    private currentState!: { enter: () => void };

    constructor(inventoryItem: any, scene: Scene) {
        const group = scene.add.group()
        this.possibleStates = {
            inInventory: new InInventoryState(inventoryItem, group, scene),
            interactionSuccess: new InteractionSuccessState(inventoryItem),
            interactionFailure: new InteractionFailureState(inventoryItem),
        }
    }

    setState(name: StateNames) {
        this.currentState = this.possibleStates[name]
        this.currentState.enter()
    }
}

class InInventoryState {
    private item!: Phaser.GameObjects.Sprite;
    private scene!: Scene;
    private readonly frames!: string[];
    private currentInventoryItemFrame!: number;
    private inventoryGroup!: Phaser.GameObjects.Group

    constructor(item: Phaser.GameObjects.Sprite, inventoryGroup: Phaser.GameObjects.Group, scene: Scene) {
        this.item = item;
        this.inventoryGroup = inventoryGroup;
        this.scene = scene;
        this.frames = item.getData("frames")
        this.currentInventoryItemFrame = this.frames.length;
    }

    enter() {
        this.currentInventoryItemFrame -= 1;
        this.inventoryGroup.add(this.item);
        if (this.frames.length > 0 && this.currentInventoryItemFrame < this.frames.length && this.currentInventoryItemFrame >= 0) {
            this.item.setFrame(this.frames[this.currentInventoryItemFrame]);
            this.item.setVisible(true)
        } else if (this.frames.length === 0) {
            this.item.setVisible(true)
        }
        Phaser.Actions.GridAlign(this.inventoryGroup.getChildren(), {
            width: -1,
            cellWidth: this.scene.scale.width * 0.12,
            cellHeight: 32,
            x: 12,
            y: this.scene.scale.height - 82,
        });
    }
}

 class InteractionSuccessState {
    constructor(item: any) {
        // Todo
    }
    enter() {}
 }

 class InteractionFailureState {
    constructor(item: any) {
        // Todo
    }
    enter() {}
 }