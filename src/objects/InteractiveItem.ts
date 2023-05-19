import Phaser, {Scene} from 'phaser'

export default class InteractiveItem extends Phaser.GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.setInteractive({ cursor: 'url(interact.cur), pointer' });
    }

    changeSizeOnHover(scaleBasis: number, scaleFactor:number) {
        this.on('pointerover', () => {
            this.setScale(scaleFactor, scaleFactor)
        })
        this.on('pointerout', () => {
            this.setScale(scaleBasis, scaleBasis)
        })
    }

    onInteract(callback: (location: { x: number, y: number }) => void) {
        this.on('pointerdown', (location: { x: number, y: number }) => callback(location))
    }

    // ... other methods and actions
}
Phaser.GameObjects.GameObjectFactory.register(
    'interactiveItem',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string) {
        const interactiveItem: InteractiveItem = new InteractiveItem(this.scene, x, y, texture)

        this.displayList.add(interactiveItem)
        this.updateList.add(interactiveItem)

        return interactiveItem
    }
)