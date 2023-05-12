import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";
import InteractionMenu from "./scenes/InteractionMenu";
import Dialogue from "./scenes/Dialogue";
import {Inventory} from "./scenes/Inventory";

const launch = (id: string) => {
   return new Phaser.Game({
        type: Phaser.AUTO,
        width: 900,
        height: 600,
        pixelArt: true,
        parent: id,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [BootScene, PreloadScene, GameScene, Inventory, InteractionMenu, Dialogue]
    })
}

export default launch;