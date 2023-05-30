import type { TextureKeys } from '@/constants';
import type { ItemData } from '@/game-data/itemObjects';
import { items } from '@/game-data/itemObjects';
import Phaser, { Scene } from 'phaser'

export default class InteractiveItem extends Phaser.GameObjects.Sprite {

    private itemData!: ItemData;

    constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.setInteractive({ cursor: 'url(interact.cur), pointer' });
        this.setData(items[this.texture.key as TextureKeys] as ItemData);
        this.itemData = items[this.texture.key as TextureKeys] as ItemData;
        this.setName(texture);
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
        let fx!: Phaser.FX.Shine;
        console.log(this.scrollFactorX)
        const text = this.scene.add.text(this.x - this.width, this.y - this.height - 10, this.itemData.name, {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px",
            backgroundColor: "#fff",
            wordWrap: { width: this.scene.scale.width - 50, useAdvancedWrap: true }
        }).setScrollFactor(this.scrollFactorX).setOrigin(0).setVisible(false)
        this.on('pointerover', () => {
            fx = this.postFX.addShine(0.7, .2, 5);
            text.setVisible(true);
        });
        this.on('pointerout', () => {
            this.postFX.remove(fx)
            text.setVisible(false);
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