import {ref} from 'vue'
import {defineStore} from 'pinia'
import { TextureKeys } from '@/constants';

export interface InventoryItem {
    key: string;
    isInGame: boolean;
    isInInventory: boolean;
}

export const useInventoryStore = defineStore('inventory', () => {
    const items = ref<InventoryItem[]>([
        {
            key: TextureKeys.Logs,
            isInGame: true,
            isInInventory: false,
        },
        {
            key: TextureKeys.Tent,
            isInGame: true,
            isInInventory: false,
        }])

    const addItem = (key: TextureKeys) => {
        items.value = items.value.map((item) => {
            if (item.key === key) {
                return {
                    ...item,
                    isInGame: false,
                    isInInventory: true,
                }
            } else {
                return {...item}
            }
        })
    };

    const getItem = (key: TextureKeys): InventoryItem | undefined => {
        return items.value.find((item) => item.key === key)
    }

    return {items, addItem, getItem}
})
