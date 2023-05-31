declare interface IInteractiveCharacter extends Phaser.GameObjects.Sprite
{
    setNextDialogueNode(node: number): void;
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveCharacter( x: number, y: number, texture: string): IInteractiveCharacter
    }
}