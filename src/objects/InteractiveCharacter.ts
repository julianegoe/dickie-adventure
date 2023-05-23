import type { CharacterKey } from '@/constants';
import { characters, type CharacterData } from '@/dialogues/characters';
import DialogueManager from '@/helpers/DialogueManager';
import { useGameStore } from '@/stores/gameStore';
import Phaser, { Scene } from 'phaser'

export default class InteractiveCharacter extends Phaser.GameObjects.Sprite {

    private characterData!: CharacterData;
    private dialogueManager: DialogueManager;


    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.characterData = characters[this.texture.key as CharacterKey] as CharacterData;
        this.dialogueManager = new DialogueManager(scene, this.characterData.dialogue);
        this.setInteractive({ cursor: 'url(speak.cur), pointer' });
    }

    public onTalkTo() {
        this.on('pointerdown', () => {
            this.dialogueManager.startDialogue(0);
        })
    }

    public showNameOnHover(position: { x: number, y: number}) {
        const text = this.scene.add.text(position.x + 100, position.y, this.characterData.name, {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px"
        }).setScrollFactor(0).setVisible(false);
        this.on('pointerover', (pointer: {x: number, y: number}) => {
            text.setVisible(true).setOrigin(0).setPosition(pointer.x, pointer.y)
        })
        this.on('pointerout', () => {
            text.setVisible(false)
        })
    }
}
Phaser.GameObjects.GameObjectFactory.register(
    'interactiveCharacter',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string) {
        const interactiveCharacter: InteractiveCharacter = new InteractiveCharacter(this.scene, x, y, texture)

        this.displayList.add(interactiveCharacter)
        this.updateList.add(interactiveCharacter)

        return interactiveCharacter
    }
)