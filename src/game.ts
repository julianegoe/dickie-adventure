import Phaser from "phaser"
import {PreloadScene} from "@/scenes/PreloadScene";
import {GameScene} from "@/scenes/GameScene";
import InteractionMenu from "@/scenes/InteractionMenu";
import Dialogue from "@/scenes/Dialogue";
import {BootScene} from "@/scenes/BootScene";
import { SnowScene } from "./scenes/SnowScene";
import DisplayText from "./scenes/DisplayText";

function launch(containerId: string) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 900, // 30 * 32
        height: 580, // 15 * 32
        pixelArt: true,
        parent: containerId,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [BootScene, PreloadScene, GameScene, InteractionMenu, Dialogue, SnowScene, DisplayText]
    })
}

export default launch
export { launch }