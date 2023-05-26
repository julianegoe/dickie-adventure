import type { ItemData } from "./dialogues/itemObjects";

declare interface IInteractiveItem extends Phaser.GameObjects.Sprite
{
    onInteract(callback: (location: { x: number, y: number }, itemData: ItemData) => void): void;
    changeSizeOnHover(scaleBasis: number, scaleFactor: number): void;
    highlightOnHover(): void;
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveItem( x: number, y: number, texture: string): IInteractiveItem
    }
}