import { FrameKeys, QuestKeys, TextureKeys } from "@/constants";
import type InteractiveItem from "@/objects/InteractiveItem";
import { useGameObjectStore } from "@/stores/gameObjects";

const DEFAULT_TAKE_TEXT = "Das kann ich nicht mitnehmen"
const DEFAULT_FAILURE_TEXT = "Das kann ich damit nicht benutzen."

const store = useGameObjectStore()

export interface ItemData {
    id: number;
    name: string;
    key: TextureKeys;
    altName: string;
    removeable: boolean;
    interactable: boolean;
    lookAtText: string;
    takeText: string;
    frames: Array<FrameKeys>;
    initialFrame: FrameKeys | string;
    successText: string, 
    failureText: string
    interactionCondition: (inventoryItem: Phaser.GameObjects.Sprite, worldItem: InteractiveItem) => boolean
}

export type InteractiveItemInterface = {
    [value in TextureKeys]: ItemData;
};

let items: Partial<InteractiveItemInterface> =
{
    tent: {
        id: 1,
        name: "graues Ungetüm",
        altName: "Zelt",
        key: TextureKeys.Tent,
        removeable: false,
        interactable: true,
        lookAtText: "Ich habe sowas Monströses noch nie gesehen.",
        takeText: DEFAULT_TAKE_TEXT,
        frames: [],
        initialFrame: TextureKeys.Tent,
        successText: "Es ist offen.", 
        failureText: DEFAULT_FAILURE_TEXT,
        interactionCondition: function (inventoryItem: Phaser.GameObjects.Sprite, worldItem: Phaser.GameObjects.Sprite) {
            return false
        },
    },
    logs: {
        id: 2,
        name: "Cholz",
        altName: "Holzscheite",
        key: TextureKeys.Logs,
        removeable: true,
        interactable: true,
        lookAtText: "Damit könnte man Feuer machen",
        takeText: "Eins kann ich mir ja mal nehmen.",
        initialFrame: FrameKeys.LogQuant3,
        frames: [FrameKeys.LogQuant3, FrameKeys.LogQuant2, FrameKeys.LogQuant1],
        successText: "Meins. Chöchöchö", 
        failureText: "Das kann ich nicht tragen.",
        interactionCondition: function (inventoryItem: Phaser.GameObjects.Sprite, worldItem: Phaser.GameObjects.Sprite) {
            if (worldItem.getData("interactable")) {
                console.log(`interact ${inventoryItem.name} with ${worldItem.name}`);
                return true;
            }
            return false;
        },
    },
    bonfire: {
        id: 3,
        name: "Feuerstelle",
        altName: "Feuerstelle",
        key: TextureKeys.Bonfire,
        removeable: false,
        interactable: true,
        lookAtText: "Brennt nicht.",
        takeText: "Hmm?",
        initialFrame: FrameKeys.Bonfire1,
        frames: [FrameKeys.Bonfire1, FrameKeys.Bonfire2],
        successText: "schön warm.", 
        failureText: "Das reicht wohl nicht.",
        interactionCondition: function (inventoryItem: Phaser.GameObjects.Sprite, worldItem: Phaser.GameObjects.Sprite) {
            if (inventoryItem.name === TextureKeys.Logs && worldItem.frame.name !== FrameKeys.Bonfire2 && inventoryItem.frame.name === FrameKeys.LogQuant3) {
                console.log(`interact ${inventoryItem.name} with ${worldItem.name}`);
                worldItem.setFrame(FrameKeys.Bonfire2);
                worldItem.setData("lookAtText", "Brennt.");
                const bribeQuest = store.getQuest(QuestKeys.TheBribe);
                bribeQuest.controller.setState("unlockedNextStage");
                bribeQuest.controller.setState("completed")
                return true
            }
            return false
        },
    },
    fish: {
        id: 4,
        name: "Fisch",
        altName: "Fisch",
        key: TextureKeys.Fish,
        removeable: true,
        interactable: true,
        lookAtText: "Hmmm lecker.",
        takeText: "Meins.",
        frames: [],
        initialFrame: TextureKeys.Fish,
        successText: "Meins. Chöchöchö", 
        failureText: "Der ist mir wohl entwischt.",
        interactionCondition: function (inventoryItem: Phaser.GameObjects.Sprite, worldItem: Phaser.GameObjects.Sprite) {
            if (worldItem.getData("interactable")) {
                console.log(`interact ${inventoryItem.name} with ${worldItem.name}`);
                return true;
            }
            return false;
        },
    },
    tent_inside_bed: {
        id: 5,
        name: "Bett",
        altName: "Bett",
        key: TextureKeys.TentInsideBed,
        removeable: false,
        interactable: true,
        lookAtText: "Gemütlich.",
        takeText: DEFAULT_TAKE_TEXT,
        frames: [],
        initialFrame: TextureKeys.TentInsideBed,
        successText: "", 
        failureText: DEFAULT_FAILURE_TEXT,
        interactionCondition: function (inventoryItem: Phaser.GameObjects.Sprite, worldItem: InteractiveItem) {
            if (worldItem.getData("interactable")) {
                console.log(`interact ${inventoryItem.name} with ${worldItem.name}`);
                if (worldItem.name == TextureKeys.TentInsideBed) {
                    return false;
                }
                return true;
            }
            return false;
        },
    },
    polarbear_skull: {
        id: 6,
        name: "Eisbär-Schädel",
        altName: "Eisbär-Schädel",
        key: TextureKeys.Skull,
        removeable: true,
        interactable: true,
        lookAtText: "So kannst du mich nicht mehr fressen, chöchöchö.",
        takeText: "Bist bei mir besser aufgehoben.",
        frames: [],
        initialFrame: TextureKeys.Skull,
        successText: "Das passt.", 
        failureText: DEFAULT_FAILURE_TEXT,
        interactionCondition: function (inventoryItem: Phaser.GameObjects.Sprite, worldItem: InteractiveItem) {
            if (worldItem.getData("interactable") && worldItem.controller.getState() === "unlocked") {
                console.log(`interact ${inventoryItem.name} with ${worldItem.name}`);
                return true;
            }
            return false;
        },
    }
}

export { items }