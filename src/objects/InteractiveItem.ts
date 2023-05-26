import type { TextureKeys } from '@/constants';
import type { ItemData } from '@/dialogues/itemObjects';
import { items } from '@/dialogues/itemObjects';
import Phaser, { Scene } from 'phaser'

export default class InteractiveItem extends Phaser.GameObjects.Sprite {

    private itemData!: ItemData;

    constructor(scene: Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame)
        this.setInteractive({ cursor: 'url(interact.cur), pointer' });
        this.setData(items[this.texture.key as TextureKeys] as ItemData);
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

    public shineOnHover() {
        const text = this.scene.add.text(this.x - this.width, this.y - this.height - 10, this.itemData.name, {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px",
            backgroundColor: "#fff"
        }).setScrollFactor(this.scrollFactorX).setVisible(false)
        let fx!: Phaser.FX.Shine
        this.on('pointerover', () => {
            fx = this.postFX.addShine(0.8, .2, 5);
            text.setVisible(true)
        });
        this.on('pointerout', () => {
            this.postFX.remove(fx)
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
}
Phaser.GameObjects.GameObjectFactory.register(
    'interactiveItem',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame: string) {
        const interactiveItem = new InteractiveItem(this.scene, x, y, texture, frame)
        this.displayList.add(interactiveItem)
        this.updateList.add(interactiveItem)

        return interactiveItem
    }
)