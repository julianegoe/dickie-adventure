import type { GameScene } from "@/scenes/GameScene";
import InteractiveItem from "./InteractiveItem";

export class PortalItem extends InteractiveItem {
    public isUnlocked: boolean = false;

    constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.controller.setState("locked")
    }
}