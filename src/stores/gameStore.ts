import {defineStore} from "pinia";
import {ref} from "vue";

export const useGameStore = defineStore("gameStore", () => {
    const isGameScene = ref(false)

    const setGameScene = (value: boolean) => {
        isGameScene.value = value;
    }

    return { isGameScene, setGameScene }
})