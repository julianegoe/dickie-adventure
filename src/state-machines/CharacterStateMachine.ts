import type { QuestData } from "@/game-data/questData";
import type InteractiveCharacter from "@/objects/InteractiveCharacter";

type StateNames = "locked" | "unlocked" | "completed"

export default class CharacterController {
    private possibleStates!: { [key in StateNames]: { enter: (args?: any) => void } };
    private currentState!: { enter: () => void };

    constructor(character: InteractiveCharacter, quest: QuestData) {
        this.possibleStates = {
            locked: new IdleState(character),
            unlocked: new QuestState(character),
            completed: new CompletedQuestState(character),
        }
    }

    setState(name: StateNames) {
        if (this.currentState === this.possibleStates[name]) {
            return
        }
        this.currentState = this.possibleStates[name]
        this.currentState.enter()
    }
}

class IdleState {
    private character!: InteractiveCharacter;
    constructor(character: InteractiveCharacter) {
        this.character = character;
    }

    enter() {
        console.log("quest locked: ", this.character)
    }
}

class QuestState {
    private character!: InteractiveCharacter;
    constructor(character: InteractiveCharacter) {
        this.character = character;
    }

    enter() {
        this.character.setNextDialogueNode(6)
    }
}

class CompletedQuestState {
    private character!: InteractiveCharacter;
    constructor(character: InteractiveCharacter) {
        this.character = character;
    }

    enter() {
        console.log("quest completed: ", this.character)
    }
}