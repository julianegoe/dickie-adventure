import type { CharacterKey } from "@/constants";

export interface Choices {
    text: string;
    nextNode: number | null;
}

export interface IDialogue {
    text: string[];
    choices: Choices[]
}

export interface CharacterData {
    id: number;
    name: string;
    altName: string;
    interactable: boolean;
    dialogue: IDialogue[]
}

export type InteractiveItemInterface = {
    [value in CharacterKey]: CharacterData;
};


const characters: Partial<InteractiveItemInterface> = {
    explorer: {
        id: 1,
        name: "Angel-Mensch",
        altName: "Forscher",
        interactable: true,
        dialogue: [
            {
                text: [ "Tach auch."],
                choices: [
                    { text: "Challo, was bist du?", nextNode: 1 },
                    { text: "Weißt du, wo meine Familie ist?", nextNode: 2 },
                    { text: "Tschüß", nextNode: null }
                ]
            },
            {
                text: [ "Ich bin Polarforscher", "und besorge mir gerade mein Abendessen"],
                choices: [
                    { text: "Darf ich was abhaben?", nextNode: 3 }
                ]
            },
            {
                text:[ "Du bist der erste Seehund, ", "der mir in letzter Zeit begegnet ist"],
                choices: [
                    { text: "Doof.", nextNode: 0 },
                    { text: "Du auch der erste Polarforscher", nextNode: 0 },
                ]
            },
            {
                text: [ "Nein."],
                choices: [
                    { text: "Bütteeeee", nextNode: 3 },
                    { text: "Ok, dann nicht.", nextNode: null }
                ]
            },
        ],
    }
}

export { characters }