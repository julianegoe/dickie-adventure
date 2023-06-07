import { QuestKeys, type CharacterKey } from "@/constants";

export interface Choice {
    text: string;
    nextNode: number | null;
    unlockQuest: QuestKeys | null;
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
    currentDialogueNode: number;
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
        currentDialogueNode: 0,
        dialogue: [
            {
                index: 0,
                text: "Tach auch.",
                choices: [
                    { text: "Challo, was bist du?", nextNode: 1, unlockQuest: null },
                    { text: "Weißt du, wo meine Familie ist?", nextNode: 2, unlockQuest: null },
                    { text: "Tschüß.", nextNode: null, unlockQuest: null }
                ]
            },
            {
                index: 1,
                text: "Ich bin Polarforscher und besorge mir gerade mein Abendessen.",
                choices: [
                    { text: "Darf ich was abhaben?", nextNode: 3, unlockQuest: null }
                ]
            },
            {
                index: 2,
                text:"Du bist der erste Seehund, der mir in letzter Zeit begegnet ist.",
                choices: [
                    { text: "Doof.", nextNode: 4, unlockQuest: null },
                    { text: "Du auch der erste Polarforscher.", nextNode: 5, unlockQuest: null },
                ]
            },
            {
                index: 3,
                text: "Nein.",
                choices: [
                    { text: "Bütteeeee!", nextNode: 3, unlockQuest: null },
                    { text: "Ok, dann nicht.", nextNode: null, unlockQuest: null }
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
                    { text: "Hilfst du mir bei der Suche nach meiner Familie?", nextNode: 3, unlockQuest: null },
                ]
            },
            {
                index: 6,
                text: "Wo ist mein Holz?",
                choices: [
                    { text: "Ich hab in letzter Zeit kein Holz gesehen.", nextNode: 7, unlockQuest: null },
                    { text: "Vielleicht wurde es ja geklaut?", nextNode: 8, unlockQuest: null },
                    { text: "Weiß nicht...", nextNode: 9, unlockQuest: null },
                ]
            },
            {
                index: 7,
                text: "Wo hast du es versteckt, du kleiner Gauner?",
                choices: [
                    { text: "Seh ich aus als könnte ich Holz tragen?", nextNode: 9, unlockQuest: null },
                    { text: "In meiner Speckfalte.", nextNode: 9, unlockQuest: null },
                ]
            },
            {
                index: 8,
                text: "Und ich kann mir vorstellen von wem, du kleiner Gauner.",
                choices: [
                    { text: "Ich geb dir das Holz, wenn du mit mir meine Familie suchst.", nextNode: 10, unlockQuest: null },
                ]
            },
            {
                index: 9,
                text: "Wir können das hier den ganzen Tag machen: Wo ist mein Holz?",
                choices: [
                    { text: "Ich hab in letzter Zeit kein Holz gesehen.", nextNode: 6, unlockQuest: null },
                    { text: "Vielleicht wurde es ja geklaut.", nextNode: 8, unlockQuest: null },
                    { text: "Weiß nicht...", nextNode: 6, unlockQuest: null },
                ]
            },
            {
                index: 10,
                text: "Hab ich eine Wahl?",
                choices: [
                    { text: "Nein.", nextNode: 11, unlockQuest: null },
                ]
            },
            {
                index: 11,
                text: "Ich hab keine Ahnung, wo andere Seehunde sind. Aber sieh dich in meinem Zelt um und nimm dir, was du zur Suche brauchst.",
                choices: [
                    { text: "Geht doch.", nextNode: 4, unlockQuest: QuestKeys.SearchTent },
                    { text: "Danke.", nextNode: 4, unlockQuest: QuestKeys.SearchTent },
                    { text: "Ich wüsste nicht, was mit aus einem Menschenzelt helfen könnte.", nextNode: 4, unlockQuest: QuestKeys.SearchTent },
                ]
            },
            {
                index: 12,
                text: "Danke fürs Feuermachen. Bist okay.",
                choices: [
                    { text: "Hilfst du mir?", nextNode: 11, unlockQuest: null },
                ]
            },
        ],
    }
}

export { characters }