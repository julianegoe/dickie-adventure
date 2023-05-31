import type { ItemData } from "./game-data/itemObjects";

declare interface IInteractiveItem extends Phaser.GameObjects.Sprite
{
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveItem( x: number, y: number, texture: string, frame: number): IInteractiveItem
    }
}