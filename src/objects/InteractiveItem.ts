import type { TextureKeys } from '@/constants';
import type { ItemData } from '@/game-data/itemObjects';
import { items } from '@/game-data/itemObjects';
import Phaser, { Scene } from 'phaser'

export default class InteractiveItem extends Phaser.GameObjects.Sprite {

    private itemData!: ItemData;

    constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.setInteractive({ cursor: 'url(interact.cur), pointer' });
        this.setScrollFactor(0.9);
        this.setData(items[this.texture.key as TextureKeys] as ItemData);
        this.itemData = items[this.texture.key as TextureKeys] as ItemData;
        this.setName(texture);
        this.on("pointerdown", (pointer: Phaser.Math.Vector2) => {
            this.emit("interact", this.itemData, pointer)
        });
        let fx!: Phaser.FX.Shine;
        const text = this.scene.add.text(this.x - this.width, this.y - this.height - 10, this.itemData.name, {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px",
            backgroundColor: "#fff",
            wordWrap: { width: this.scene.scale.width - 50, useAdvancedWrap: true }
        }).setScrollFactor(0.9).setOrigin(0).setVisible(false)
        this.on('pointerover', () => {
            fx = this.postFX.addShine(0.7, .2, 5);
            text.setVisible(true);
        });
        this.on('pointerout', () => {
            this.postFX.remove(fx)
            text.setVisible(false);
        })
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