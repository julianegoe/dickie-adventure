declare interface IInteractiveItem extends Phaser.GameObjects.Sprite
{
    changeColorOnHover(): void;
    onInteract(): void;
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveItem(): IInteractiveItem
    }
}