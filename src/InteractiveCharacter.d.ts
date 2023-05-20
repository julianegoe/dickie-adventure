declare interface IInteractiveCharacter extends Phaser.GameObjects.Sprite
{
    //onTalkTo(callback: (location: { x: number, y: number }, characterData: CharacterData) => void): void;
    onTalkTo(): void
}

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        interactiveCharacter( x: number, y: number, texture: string): IInteractiveCharacter
    }
}