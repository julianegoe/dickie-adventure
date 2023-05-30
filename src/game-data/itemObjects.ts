import { FrameKeys, TextureKeys } from "@/constants";

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
    interactionCondition: (item: TextureKeys) => void
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
            interactionCondition: function (interactWith: string) {
                if (this.interactable) {
                    // test
                    console.log(`interact ${this.name} with ${interactWith}`)
                }
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
            interactionCondition: function (interactWith: string) {
                if (this.interactable) {
                    // test
                    console.log(`interact ${this.name} with ${interactWith}`)
                }
            },
        },
        fish: {
            id: 2,
            name: "Fisch",
            altName: "Fisch",
            key: TextureKeys.Fish,
            removeable: true,
            interactable: true,
            lookAtText: "Hmmm lecker.",
            takeText: "Meins.",
            frames: [],
            initialFrame: TextureKeys.Fish,
            interactionCondition: function (interactWith: string) {
                if (this.interactable) {
                    // test
                    console.log(`interact ${this.name} with ${interactWith}`)
                }
            },
        }
    }

export { items }