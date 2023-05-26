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
    takenState: Array<FrameKeys | null>;
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
            takenState: [null],
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
            takenState: [FrameKeys.LogQuant2, FrameKeys.LogQuant1],
            interactionCondition: function (interactWith: string) {
                if (this.interactable) {
                    // test
                    console.log(`interact ${this.name} with ${interactWith}`)
                }
            },
        }
    }

export { items }