import type { CharacterKey } from "@/constants";

export interface Choice {
    text: string;
    nextNode: number | null;
}

export interface IDialogue {
    index: number;
    text: string[] | string;
    choices: Choice[]
}

export interface CharacterData {
    id: number;
    name: string;
    altName: string;
    interactable: boolean;
    dialogue: IDialogue[]
}

export type InteractiveCharacterInterface = {
    [value in CharacterKey]: CharacterData;
};


const characters: Partial<InteractiveCharacterInterface> = {
    explorer: {
        id: 1,
        name: "Angel-Mensch",
        altName: "Forscher",
        interactable: true,
        dialogue: [
            {
                index: 0,
                text: "Tach auch.",
                choices: [
                    { text: "Challo, was bist du?", nextNode: 1 },
                    { text: "Weißt du, wo meine Familie ist?", nextNode: 2 },
                    { text: "Tschüß.", nextNode: null }
                ]
            },
            {
                index: 1,
                text: "Ich bin Polarforscher und besorge mir gerade mein Abendessen.",
                choices: [
                    { text: "Darf ich was abhaben?", nextNode: 3 }
                ]
            },
            {
                index: 2,
                text:"Du bist der erste Seehund, der mir in letzter Zeit begegnet ist.",
                choices: [
                    { text: "Doof.", nextNode: 4 },
                    { text: "Du auch der erste Polarforscher.", nextNode: 5 },
                ]
            },
            {
                index: 3,
                text: "Nein.",
                choices: [
                    { text: "Bütteeeee!", nextNode: 3 },
                    { text: "Ok, dann nicht.", nextNode: null }
                ]
            },
            {
                index: 4,
                text: "Hmm.",
                choices: []
            },
            {
                index: 5,
                text: "Und nu?",
                choices: [
                    { text: "Hilfst du mir bei der Suche nach meiner Familie?", nextNode: 3 },
                ]
            },
            {
                index: 6,
                text: "Wo ist mein Holz?",
                choices: [
                    { text: "Ich hab in letzter Zeit kein Holz gesehen.", nextNode: 7 },
                    { text: "Vielleicht wurde es ja geklaut?", nextNode: 8 },
                    { text: "Weiß nicht...", nextNode: 9 },
                ]
            },
            {
                index: 7,
                text: "Wo hast du es versteckt, du kleiner Gauner?",
                choices: [
                    { text: "Seh ich aus als könnte ich Holz tragen?", nextNode: 9 },
                    { text: "In meiner Speckfalte.", nextNode: 9 },
                ]
            },
            {
                index: 8,
                text: "Und ich kann mir vorstellen von wem, du kleiner Gauner.",
                choices: [
                    { text: "Ich geb dir das Holz, wenn du mit mir meine Familie suchst.", nextNode: 10 },
                ]
            },
            {
                index: 9,
                text: "Wir können das hier den ganzen Tag machen: Wo ist mein Holz?",
                choices: [
                    { text: "Ich hab in letzter Zeit kein Holz gesehen.", nextNode: 6 },
                    { text: "Vielleicht wurde es ja geklaut.", nextNode: 8 },
                    { text: "Weiß nicht...", nextNode: 6 },
                ]
            },
            {
                index: 10,
                text: "Hab ich eine Wahl?",
                choices: [
                    { text: "Nein.", nextNode: 4 },
                ]
            },
        ],
    }
}

export { characters }