import { SceneKeys } from "@/constants";
import type { CharacterData } from "@/game-data/characters";
import DialogueManager from "@/helpers/DialogueManager";

export default class Dialogue extends Phaser.Scene {
    private dialogueManager!: DialogueManager;
    private dialogueNode!: number;

    constructor() {
        super({key: SceneKeys.Dialogue});
    }

    init(data: { characterData: CharacterData, startNode: number }) {
        this.dialogueManager = new DialogueManager(this, data.characterData.dialogue);
        this.dialogueNode = data.startNode;
    }

    create() {
        console.log("Dialoge scene started")
        this.dialogueManager.startDialogue(this.dialogueNode);
    }
}