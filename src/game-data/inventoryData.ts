import type { TextureKeys, FrameKeys } from "@/constants";

export const Inventory = {
    items: new Map() as Map<string, {
        key: TextureKeys, frame: FrameKeys
    }>,
    addItem: function (itemData: {
        key: TextureKeys, frame: FrameKeys
    }) {
        this.items.set(itemData.key, itemData)
    },
    removeItem: function (key: TextureKeys) {
        const deleted = this.items.delete(key);
    },
    hasItem: function (itemData: {
        key: TextureKeys, frame: FrameKeys
    }) {
        return this.items.has(itemData.key)
    },
};