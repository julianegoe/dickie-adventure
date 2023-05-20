import type { CharacterKey } from '@/constants';
import { characters, type CharacterData } from '@/dialogues/characters';
import DialogueManager from '@/helpers/DialogueManager';
import Phaser, { Scene } from 'phaser'

export default class InteractiveCharacter extends Phaser.GameObjects.Sprite {

    private characterData!: CharacterData;
    private dialogueManager;

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.dialogueManager = new DialogueManager(scene);
        this.setInteractive({ cursor: 'url(speak.cur), pointer' });
        this.characterData = characters[this.texture.key as CharacterKey] as CharacterData;
    }

    /* public onTalkTo(callback: (location: { x: number, y: number }, characterData: CharacterData) => void) {
        if (this.characterData.interactable) {
            this.on('pointerdown', (location: { x: number, y: number }) => callback(location, this.characterData))
        } else {
            console.debug('not interactable')
        }
    } */

    public onTalkTo() {
        this.on('pointerdown', () => {
            this.dialogueManager.startDialogue(this.characterData.dialogue);
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