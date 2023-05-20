import { SceneKeys, TextureKeys } from "@/constants";
import type { CharacterData, IDialogue } from "@/dialogues/characters";
import type { ItemData } from "@/dialogues/itemObjects";

export default class Dialogue extends Phaser.Scene {
    constructor() {
        super({key: 'Dialogue'});
    }

    private dialogue: IDialogue[] = [];
    private node: number = 0;
    private gameWidth!: number;
    private gameHeight!: number;

    init(data: { dialogueData: CharacterData, node?: number }) {
        this.dialogue = data.dialogueData?.dialogue
    }

    create() {
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        const npcText = this.add.text(50, 50, this.dialogue[this.node].text, {
            fontFamily: 'VT323',
            fontSize: 32,
            color: '#000',
        }).setOrigin(0);

        setTimeout(() => {
            this.scene.stop(SceneKeys.Dialogue)
        }, 3500)
    }
}