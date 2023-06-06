import eventsCenter from "@/events/eventsCenter";
import type InteractiveItem from "@/objects/InteractiveItem";
import { useGameObjectStore } from "@/stores/gameObjects";
import type { Scene } from "phaser";

type StateNames = "inWorld" | "inInventory" | "questCompleted"

export default class ItemController {
    private possibleStates!: { [key in StateNames]: { enter: (args?: any) => void } };
    private currentState!: { enter: () => void };

    constructor(item: InteractiveItem, scene: Scene) {
        const frames = item.getData("frames") as string[];
        this.possibleStates = {
            inWorld: new InWorldState(item),
            inInventory: new InInventoryState(item, scene, frames),
            questCompleted: new QuestCompletedState(item),
        }
    }

    setState(name: StateNames) {
        if (this.currentState === this.possibleStates[name] && name !== "inInventory") {
            return
        }
        this.currentState = this.possibleStates[name]
        this.currentState.enter()
    }
}

class InWorldState {
    private item!: Phaser.GameObjects.Sprite;

    constructor(item: Phaser.GameObjects.Sprite) {
        this.item = item
    }

    enter() {
        this.item.setVisible(true);
    }
}

class InInventoryState {
    private item!: Phaser.GameObjects.Sprite;
    private scene!: Scene;
    private readonly frames!: string[];
    private currentCloneFrame!: number;
    private currentItemFrame: number = 0;
    private clone!: Phaser.GameObjects.Sprite;
    private store!: any;

    constructor(item: Phaser.GameObjects.Sprite, scene: Scene, frames: string[]) {
        this.item = item;
        this.scene = scene;
        this.frames = frames
        this.currentCloneFrame = this.frames.length;
        this.clone = this.scene.add.sprite(0, 0, this.item.name)
            .setScrollFactor(0)
            .setOrigin(0)
            .setScale(2)
            .setVisible(false)
            .setInteractive({ draggable: true})
            .setData(this.item.data.values)
            .setName(this.item.name);
        this.clone.on("pointerdown", () => eventsCenter.emit("interactInInventory", this.clone))
        this.store = useGameObjectStore();
    }

    enter() {
        this.currentCloneFrame -= 1;
        this.currentItemFrame += 1;
        this.store.initGroup(this.scene);
        this.store.addToGroup(this.clone);
        const currentGroup = this.store.getInventoryGroup();
        if (this.frames.length > 0 && this.currentCloneFrame < this.frames.length && this.currentCloneFrame >= 0) {
            this.clone.setFrame(this.frames[this.currentCloneFrame]);
            this.clone.setVisible(true)
        } else if (this.frames.length === 0) {
            this.clone.setVisible(true)
        }
        if (this.currentItemFrame < this.frames.length) {
            this.item.setFrame(this.frames[this.currentItemFrame]);
        } else {
            this.item.destroy(true)
        }
        Phaser.Actions.GridAlign(currentGroup.getChildren(), {
            width: -1,
            cellWidth: this.scene.scale.width * 0.12,
            cellHeight: 32,
            x: 12,
            y: this.scene.scale.height - 82,
        });
    }
}

class QuestCompletedState {
    private item!: Phaser.GameObjects.Sprite;

    constructor(item: Phaser.GameObjects.Sprite) {
        this.item = item;
    }

    enter() {
        console.log("solved")
    }
}