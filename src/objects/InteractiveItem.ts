import type { TextureKeys } from '@/constants';
import type { ItemData } from '@/dialogues/itemObjects';
import { items } from '@/dialogues/itemObjects';
import Phaser, { Scene } from 'phaser'

export default class InteractiveItem extends Phaser.GameObjects.Sprite {

    private highlight!: Phaser.GameObjects.PointLight;
    private itemData!: ItemData;

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.setInteractive({ cursor: 'url(interact.cur), pointer' });
        this.itemData = items[this.texture.key as TextureKeys] as ItemData;
        
    }

    public changeSizeOnHover(scaleBasis: number, scaleFactor: number) {
        this.on('pointerover', () => {
            this.setScale(scaleFactor, scaleFactor)
        })
        this.on('pointerout', () => {
            this.setScale(scaleBasis, scaleBasis)
        })
    }

    public highlightOnHover() {
        this.highlight = this.scene.add.pointlight(this.x, this.y, 0xfff, 190, 0.4).setVisible(false);
        const text = this.scene.add.text(this.x - this.width, this.y - this.height - 10, "graues Ungetüm?", {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px"
        }).setScrollFactor(this.scrollFactorX).setVisible(false);

        this.on('pointerover', () => {
            this.highlight.setVisible(true)
            .setScale(this.scale)
            .setScrollFactor(this.scrollFactorX);

            text.setVisible(true)
        })
        this.on('pointerout', () => {
            this.highlight.setVisible(false);
            text.setVisible(false)
        })
    }

    public onInteract(callback: (location: { x: number, y: number }, itemData: ItemData) => void) {
        if (this.itemData.interactable) {
            this.on('pointerdown', (location: { x: number, y: number }) => callback(location, this.itemData))
        } else {
            console.debug('not interactable')
        }
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