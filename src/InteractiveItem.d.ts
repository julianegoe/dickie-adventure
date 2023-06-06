import type { TextureKeys } from "./constants";
import type { ItemData } from "./game-data/itemObjects";
import type ItemController from "./state-machines/ItemStateMachine";

declare interface IInteractiveItem extends Phaser.GameObjects.Sprite
{
    controller: ItemController;
    createDropZone(texture: string | TextureKeys, scaleFactor: number): void
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveItem( x: number, y: number, texture: string, frame: number): IInteractiveItem
    }
}