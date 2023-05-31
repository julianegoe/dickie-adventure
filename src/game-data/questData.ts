import type { QuestKeys } from "@/constants";
import type InteractiveCharacter from "@/objects/InteractiveCharacter";
import type { Quest } from "@/state-machines/QuestStateMachine";

export interface QuestData {
    name: string;
    changes: (args?: any) => void,
    conditions: (args?: any) => void,
    hint: string;
};
export type QuestInterface = {
    [value in QuestKeys]: QuestData;
};

export const quests: QuestInterface = {
    theBribe: {
        name: "The Bribe",
        changes: (explorer: InteractiveCharacter) => {
            explorer.setNextDialogueNode(6)
        },
        conditions: (bribeQuest: Quest) => {
            console.log(bribeQuest)
            return false;
        },
        hint: "Vielleicht lockert das seine Zunge. Chöchöchö.",
    }
}