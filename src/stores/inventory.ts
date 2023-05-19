import {ref} from 'vue'
import {defineStore} from 'pinia'
import { TextureKeys } from '@/constants';

export const useInventoryStore = defineStore('inventory', () => {
    const items = ref<Array<{
        name: string;
        isInGame: boolean;
        isInInventory: boolean;
    }>>([
        {
            name: "star",
            isInGame: true,
            isInInventory: false,
        },
        {
            name: TextureKeys.Tent,
            isInGame: true,
            isInInventory: false,
        },
        {
            name: "fish",
            isInGame: true,
            isInInventory: false,
        }])

    const addItem = (newItem: {
        name: string;
        isVisible: boolean;
    }) => {
        items.value = items.value.map((item) => {
            if (item.name === newItem.name) {
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

    return {items, addItem}
})
