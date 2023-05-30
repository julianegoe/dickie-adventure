declare interface IInteractiveCharacter extends Phaser.GameObjects.Sprite
{
    talkTo(): void
    showNameOnHover({ x: number, y: number}): void;
    setNextDialogueNode(node: number): void;
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveCharacter( x: number, y: number, texture: string): IInteractiveCharacter
    }
}