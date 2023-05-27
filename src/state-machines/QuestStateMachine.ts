import type { QuestData } from "@/game-data/questData";
import type { Scene } from "phaser";

type StateNames = "locked" | "unlocked" | "completed"

export class Quest {
    private questData!: QuestData;
    private gameObject!: Phaser.GameObjects.Sprite;
    private scene!: Scene;
    constructor(questData: QuestData, gameObject?: Phaser.GameObjects.Sprite, scene?: Scene) {
        this.questData = questData;
        if (gameObject) {
            this.gameObject = gameObject;
        }
        if (scene) {
            this.scene = scene;
        }
    }

    startQuest() {
        console.log("Quest started.");
        this.questData.changes(this.gameObject);
    }
}

export default class QuestController {
    private possibleStates!: { [key in StateNames]: { enter: (args?: any) => void } };
    private currentState!: { enter: () => void };

    constructor(quest: Quest) {
        this.possibleStates = {
            locked: new LockedQuest(quest),
            unlocked: new UnlockedQuest(quest),
            completed: new CompletedQuest(quest),
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

class LockedQuest {
    private quest!: Quest;
    constructor(quest: Quest) {
        this.quest = quest;
    }

    enter() {
        console.log("quest locked: ", this.quest)
    }
}

class UnlockedQuest {
    private quest!: Quest;
    constructor(quest: Quest) {
        this.quest = quest;
    }

    enter() {
        this.quest.startQuest()
    }
}

class CompletedQuest {
    private quest!: Quest;
    constructor(quest: Quest) {
        this.quest = quest;
    }

    enter() {
        console.log("quest completed: ", this.quest)
    }
}