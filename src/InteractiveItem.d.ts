import type { ItemData } from "./dialogues/itemObjects";

declare interface IInteractiveItem extends Phaser.GameObjects.Sprite
{
    onInteract(): void;
    changeSizeOnHover(): void;
    highlightOnHover(): void;
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveItem( x: number, y: number, texture: string): IInteractiveItem
    }
}