import type { GameScene } from "@/scenes/GameScene";
import InteractiveItem from "./InteractiveItem";
import eventsCenter from "@/events/eventsCenter";

export class PortalItem extends InteractiveItem {
    public isUnlocked: boolean = false;

    constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.controller.setState("locked");
        this.on("pointerdown", (pointer: Phaser.Math.Vector2) => {
            // this.emit("interact", this.itemData, pointer);
            eventsCenter.emit("openPortal", this, pointer);
        });
    }
}