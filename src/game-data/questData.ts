import type { QuestKeys } from "@/constants";
import type InteractiveCharacter from "@/objects/InteractiveCharacter";

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
        conditions: () => {
            return false;
        },
        hint: "Vielleicht lockert das seine Zunge. Chöchöchö.",
    }
}