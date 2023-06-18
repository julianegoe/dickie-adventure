import type { TextureKeys } from '@/constants';
import eventsCenter from '@/events/eventsCenter';
import type { ItemData } from '@/game-data/itemObjects';
import { items } from '@/game-data/itemObjects';
import type { GameScene } from '@/scenes/GameScene';
import ItemController from '@/state-machines/ItemStateMachine';
import Phaser, { Scene } from 'phaser'

export default class InteractiveItem extends Phaser.GameObjects.Sprite {

    private itemData!: ItemData;
    public controller!: ItemController;

    constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.setOrigin(0);
        this.setInteractive({ cursor: 'url(interact.cur), pointer' });
        this.setScrollFactor(1);
        this.setData(items[this.texture.key as TextureKeys] as ItemData);
        this.itemData = items[this.texture.key as TextureKeys] as ItemData;
        this.setName(texture);
        this.setDepth(1)
        this.on("pointerdown", (pointer: Phaser.Math.Vector2) => {
            this.emit("interact", this.itemData, pointer);
            eventsCenter.emit("interactInWorld", this, pointer);
        });
        let fx!: Phaser.FX.Shine;
        const text = this.scene.add.text(this.x + (this.width / 2), this.y - 50, this.itemData.name, {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px",
            backgroundColor: "#fff",
            wordWrap: { width: this.scene.scale.width - 50, useAdvancedWrap: true }
        }).setScrollFactor(1).setOrigin(0).setVisible(false).setDepth(1)
        this.on('pointerover', () => {
            fx = this.postFX.addShine(0.7, .2, 5);
            text.setVisible(true);
        });
        this.on('pointerout', () => {
            this.postFX.remove(fx)
            text.setVisible(false);
        })
        this.createController();
    }

    private createController() {
        this.controller = new ItemController(this, this.scene as GameScene)
    }

    public createDropZone(texture: TextureKeys, scaleFactor: number) {
        const zone = this.scene.add.zone(this.x, this.y, this.width, this.height)
            .setRectangleDropZone(this.width, this.height)
            .setName(texture)
            .setOrigin(0)
            .setScrollFactor(1)
            .setScale(scaleFactor)
            .setDepth(0);
            //const graphics = this.scene.add.graphics();
            //graphics.lineStyle(2, 0xffff00);
            //graphics.strokeRect(zone.x, zone.y, zone.width * scaleFactor, zone.height * scaleFactor)
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