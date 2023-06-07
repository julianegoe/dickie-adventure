import { QuestKeys } from "@/constants";
import type InteractiveCharacter from "@/objects/InteractiveCharacter";
import type { PortalItem } from "@/objects/PortalItem";
import type { Quest } from "@/state-machines/QuestStateMachine";
import { useGameObjectStore } from "@/stores/gameObjects";

const store = useGameObjectStore()

export interface QuestData {
    name: string;
    key: QuestKeys;
    changes: (args?: any) => void,
    changesNextStage: (args?: any) => void,
    conditions: (args?: any) => void,
    hint: string;
};
export type QuestInterface = {
    [value in QuestKeys]: QuestData;
};

export const quests: QuestInterface = {
    theBribe: {
        name: "The Bribe",
        key: QuestKeys.TheBribe,
        changes: (explorer: InteractiveCharacter) => {
            explorer.setNextDialogueNode(6)
        },
        changesNextStage: (explorer: InteractiveCharacter) => {
            explorer.setNextDialogueNode(12);
            explorer.setData("nextDialogueNode", 12)
        },
        conditions: (bribeQuest: Quest) => {

        },
        hint: "Vielleicht lockert das seine Zunge. Chöchöchö.",
    },
    searchTent: {
        name: "Search The Tent",
        key: QuestKeys.SearchTent,
        changes: (tent: PortalItem) => {
            tent.controller.setState("unlocked")
        },
        changesNextStage: () => { console.log("next stage tent") },
        conditions: (tentQuest: Quest) => {
            return true;
        },
        hint: "Something",
    },
};