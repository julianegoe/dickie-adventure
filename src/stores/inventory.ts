import {ref} from 'vue'
import {defineStore} from 'pinia'
import type { FrameKeys, TextureKeys } from '@/constants';

export interface InventoryItem {
    key: TextureKeys;
    frame: FrameKeys | undefined;
    isInGame: boolean;
    isInInventory: boolean;
}

export const useInventoryStore = defineStore('inventory', () => {
    const items = ref(new Map())

    const addItem = (key: TextureKeys, frame?: FrameKeys, ) => {
        items.value.set(key, {
            key: key,
            frame: frame,
            isInGame: false,
            isInInventory: true,
        })
    };


    const getItem = (key: TextureKeys): InventoryItem | any => {
        console.log(items.value.get(key), key)
        return items.value.get(key)
    }

    return {items, addItem, getItem}
})
