import {defineStore} from "pinia";
import {ref} from "vue";

export enum GameMode {
    Game = "GAME",
    Dialogue = "DIALOGUE",
}

export const useGameStore = defineStore("gameStore", () => {
    const isGameScene = ref(false);

    const setGameScene = (value: boolean) => {
        isGameScene.value = value;
    }

    return { isGameScene, setGameScene }
})