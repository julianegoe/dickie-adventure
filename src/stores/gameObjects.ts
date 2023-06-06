import {ref} from 'vue'
import {defineStore} from 'pinia'
import type { TextureKeys } from '@/constants';
import type { Scene } from 'phaser';


export const useGameObjectStore = defineStore('gameObjects', () => {
    const gameObjects = ref(new Map());

    const inventoryGroup = ref<Phaser.GameObjects.Group>()

    const setObject = (key: TextureKeys, gameObject: Phaser.GameObjects.GameObject) => {
        gameObjects.value.set(key, gameObject)
    };


    const getObject = (key: TextureKeys): Phaser.GameObjects.GameObject | any => {
        return gameObjects.value.get(key)
    }

    const initGroup = (scene: Scene) => {
        inventoryGroup.value = scene.add.group()
    }

    const addToGroup = (gameObject: Phaser.GameObjects.Sprite) => {
        inventoryGroup.value?.add(gameObject)
    }

    const getInventoryGroup = (): Phaser.GameObjects.Group | undefined => {
        return inventoryGroup.value
    }

    return {gameObjects, setObject, getObject, initGroup, addToGroup, getInventoryGroup}
})
