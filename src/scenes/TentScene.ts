import { SceneKeys } from '@/constants';
import '../objects/InteractiveCharacter';
import '../objects/InteractiveItem';
export class TentScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.TentScene });
    }


    preload() {
        // preload assets
    }

    create() {
        this.cameras.main.setBackgroundColor('#cccccc');
        this.add.text(this.game.config.width as number / 2, this.game.config.height as number / 2, 'Zelt Platzhalter', {
            fontSize: '64px',
            color: "#fff",
            fontFamily: "'Press Start 2P'"
        }).setOrigin(0.5);
    }
}