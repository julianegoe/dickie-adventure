import Phaser from 'phaser'
import {PreloadScene} from "@/scenes/PreloadScene";
import {GameScene} from "@/scenes/GameScene";
import {Inventory} from "@/scenes/Inventory";
import InteractionMenu from "@/scenes/InteractionMenu";
import Dialogue from "@/scenes/Dialogue";
import {BootScene} from "@/scenes/BootScene";
import { SnowScene } from './scenes/SnowScene';

function launch(containerId: string) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 800, // 30 * 32
        height: 480, // 15 * 32
        pixelArt: true,
        parent: containerId,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [BootScene, PreloadScene, GameScene, InteractionMenu, Dialogue, SnowScene]
    })
}

export default launch
export { launch }