import { SceneKeys, type CharacterKey } from '@/constants';
import { characters, type CharacterData } from '@/game-data/characters';
import DialogueManager from '@/helpers/DialogueManager';
import Phaser, { Scene } from 'phaser'

export default class InteractiveCharacter extends Phaser.GameObjects.Sprite {

    private characterData!: CharacterData;
    private dialogueNode: number = 0


    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.characterData = characters[this.texture.key as CharacterKey] as CharacterData;
        this.setInteractive({ cursor: 'url(speak.cur), pointer' });
        const text = this.scene.add.text(this.x + this.width, this.y, this.characterData.name, {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px",
            backgroundColor: "#fff",
            wordWrap: { width: this.scene.scale.width - 50, useAdvancedWrap: true }
        }).setScrollFactor(1).setOrigin(0.5).setVisible(false)
        this.on('pointerover', () => {
            text.setVisible(true);
        });
        this.on('pointerout', () => {
            text.setVisible(false);
        })
        this.talkTo()
    }

    private talkTo() {
        this.on('pointerup', () => {
            this.scene.scene.pause(SceneKeys.Game);
            this.scene.scene.launch(SceneKeys.Dialogue, { characterData: this.characterData, startNode: this.dialogueNode});
        });
    }

    public setNextDialogueNode(nodeIndex: number) {
        this.dialogueNode = nodeIndex;
        this.setData("currentDialogueNode", nodeIndex);
    }
}
Phaser.GameObjects.GameObjectFactory.register(
    'interactiveCharacter',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string) {
        const interactiveCharacter: IInteractiveCharacter = new InteractiveCharacter(this.scene, x, y, texture)

        this.displayList.add(interactiveCharacter)
        this.updateList.add(interactiveCharacter)

        return interactiveCharacter
    }
)