import { SceneKeys } from "@/constants";
import type { CharacterData } from "@/dialogues/characters";
import DialogueManager from "@/helpers/DialogueManager";

export default class Dialogue extends Phaser.Scene {
    private dialogueManager!: DialogueManager;
    private characterData!: CharacterData;
    private startNode: number = 0;



    constructor() {
        super({key: SceneKeys.Dialogue});
    }

    init(data: { dialogueData: CharacterData, startNode: number }) {
        this.characterData = data.dialogueData;
        this.startNode = data.startNode;
        this.dialogueManager = new DialogueManager(this, this.characterData.dialogue);
    }

    create() {
        console.log("Dialoge scene started")
        this.dialogueManager.startDialogue(this.startNode);
    }
}