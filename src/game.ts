import Phaser from "phaser"
import {PreloadScene} from "@/scenes/PreloadScene";
import {GameScene} from "@/scenes/GameScene";
import InteractionMenu from "@/scenes/InteractionMenu";
import Dialogue from "@/scenes/Dialogue";
import {BootScene} from "@/scenes/BootScene";
import { SnowScene } from "./scenes/SnowScene";
import DisplayText from "./scenes/DisplayText";
import { TentScene } from "./scenes/TentScene";
import { Controller } from "./scenes/Controller";
import { Inventory } from "./scenes/Inventory";

function launch(containerId: string) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 900, // 30 * 32
        height: 580, // 15 * 32
        pixelArt: true,
        parent: containerId,
        scene: [BootScene, PreloadScene, Controller, GameScene, InteractionMenu, Dialogue, Inventory, SnowScene, DisplayText, TentScene]
    })
}

export default launch
export { launch }