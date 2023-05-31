import { FrameKeys, TextureKeys } from "@/constants";
import type InteractiveItem from "@/objects/InteractiveItem";

const DEFAULT_TAKE_TEXT = "Das kann ich nicht mitnehmen"

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
    interactionCondition: (item: Phaser.GameObjects.Sprite | InteractiveItem) => boolean
}

export type InteractiveItemInterface = {
    [value in TextureKeys]: ItemData;
};

const items: Partial<InteractiveItemInterface> =
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
            interactionCondition: function (interactWith:  Phaser.GameObjects.Sprite | InteractiveItem) {
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
            interactionCondition: function (interactWith: Phaser.GameObjects.Sprite | InteractiveItem) {
                if (interactWith.getData("interactable")) {
                    console.log(`interact Holz with ${interactWith.name}`)
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
            interactionCondition: function (interactWith: Phaser.GameObjects.Sprite | InteractiveItem) {
                console.log(`interact Bonfire with ${interactWith.name}`);
                return true
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
            interactionCondition: function (interactWith: Phaser.GameObjects.Sprite | InteractiveItem) {
                if (interactWith.getData("interactable")) {
                    console.log(`interact Fisch with ${interactWith.name}`);
                    return true;
                }
                return false;
            },
        }
    }

export { items }