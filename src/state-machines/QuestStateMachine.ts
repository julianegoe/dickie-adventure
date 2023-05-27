import type { QuestData } from "@/game-data/questData";
import type { Scene } from "phaser";

type StateNames = "locked" | "unlocked" | "solve" | "completed"

export class Quest {
    public questData!: QuestData;
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
        console.log("Quest started: ", this.questData.name);
        this.questData.changes(this.gameObject);
    }

    testConditions() {
        const isCompleted = this.questData.conditions();
        console.log("quest completed?", isCompleted);

    }
}

export default class QuestController {
    private possibleStates!: { [key in StateNames]: { enter: (args?: any) => void } };
    private currentState!: { enter: () => void };
    public currentStateName: StateNames = "locked";

    constructor(quest: Quest) {
        this.possibleStates = {
            locked: new LockedQuest(quest),
            unlocked: new UnlockedQuest(quest),
            solve: new SolveQuest(quest),
            completed: new CompletedQuest(quest),
        }
    }

    setState(name: StateNames) {
        if (this.currentState === this.possibleStates[name]) {
            return
        }
        if (this.currentStateName === "locked" && name !== "unlocked") {
            return
        }
        this.currentState = this.possibleStates[name];
        this.currentStateName = name;
        this.currentState.enter()
    }
}

class LockedQuest {
    private quest!: Quest;
    constructor(quest: Quest) {
        this.quest = quest;
    }

    enter() {
        console.log("quest locked: ", this.quest.questData.name)
    }
}

class UnlockedQuest {
    private quest!: Quest;
    constructor(quest: Quest) {
        this.quest = quest;
    }

    enter() {
        console.log("Quest unlocked: ", this.quest.questData.name)
        this.quest.startQuest()
    }
}

class SolveQuest {
    private quest!: Quest;
    constructor(quest: Quest) {
        this.quest = quest;
    }

    enter() {
        console.log("Trying to solve quest: ", this.quest.questData.name)
        this.quest.testConditions()
    }
}

class CompletedQuest {
    private quest!: Quest;
    constructor(quest: Quest) {
        this.quest = quest;
    }

    enter() {
        console.log("quest completed: ", this.quest.questData.name)
    }
}