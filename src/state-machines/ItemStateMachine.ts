import type { FrameKeys, TextureKeys } from "@/constants";
import eventsCenter from "@/events/eventsCenter";
import type { InventoryManager } from "@/helpers/InventoryManager";
import type InteractiveItem from "@/objects/InteractiveItem";
import type { PortalItem } from "@/objects/PortalItem";
import type { GameScene } from "@/scenes/GameScene";
import type { TentScene } from "@/scenes/TentScene";
import { useGameObjectStore } from "@/stores/gameObjects";
import type { Scene } from "phaser";

type StateNames = "inWorld" | "inInventory" | "questCompleted" | "locked" | "unlocked"

export default class ItemController {
    private possibleStates!: { [key in StateNames]: { enter: (args?: any) => void } };
    private currentState!: { enter: () => void };

    constructor(item: InteractiveItem | PortalItem, scene: GameScene) {
        const frames = item.getData("frames") as string[];
        this.possibleStates = {
            inWorld: new InWorldState(item),
            inInventory: new InInventoryState(item, scene, frames),
            questCompleted: new QuestCompletedState(item),
            locked: new LockedState(item as PortalItem),
            unlocked: new UnlockedState(item as PortalItem),
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
    private scene!: GameScene | TentScene;
    private readonly frames!: string[];
    private currentCloneFrame!: number;
    private currentItemFrame: number = 0;
    private clone!: Phaser.GameObjects.Sprite;

    constructor(item: Phaser.GameObjects.Sprite, scene: GameScene | TentScene, frames: string[]) {
        this.item = item;
        this.scene = scene;
        this.frames = frames
        this.currentCloneFrame = this.frames.length;
        this.clone = this.scene.add.sprite(0, 0, this.item.name)
            .setScrollFactor(0)
            .setOrigin(0)
            .setScale(2)
            .setVisible(false)
            .setInteractive({ draggable: true })
            .setData(this.item.data.values)
            .setName(this.item.name)
            .setDepth(2);
        this.clone.on("pointerdown", () => eventsCenter.emit("interactInInventory", this.clone))
    }

    enter() {
        this.currentCloneFrame -= 1;
        this.currentItemFrame += 1;
        this.scene.inventoryManager.inventoryGroup.add(this.clone);
        if (this.frames.length > 0 && this.currentCloneFrame < this.frames.length && this.currentCloneFrame >= 0) {
            this.clone.setFrame(this.frames[this.currentCloneFrame]);
            this.clone.setVisible(true);
            this.scene.inventoryManager.addToInventory(this.item.name as TextureKeys, this.frames[this.currentCloneFrame] as FrameKeys)
        } else if (this.frames.length === 0) {
            this.clone.setVisible(true)
        }
        if (this.currentItemFrame < this.frames.length) {
            this.item.setFrame(this.frames[this.currentItemFrame]);
        } else {
            this.item.destroy(true)
        }
        this.scene.inventoryManager.alignItems()
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

class LockedState {
    private item!: PortalItem;

    constructor(item: PortalItem) {
        this.item = item;
    }

    enter() {
        console.log("locked")
    }
}

class UnlockedState {
    private item!: PortalItem;

    constructor(item: PortalItem) {
        this.item = item;
    }

    enter() {
        this.item.isUnlocked = true
    }
}