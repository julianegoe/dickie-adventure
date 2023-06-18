import { SceneKeys, TextureKeys } from "@/constants";
import Sprite = Phaser.GameObjects.Sprite;
import eventsCenter from "@/events/eventsCenter";
import type InteractiveItem from "@/objects/InteractiveItem";

export default class InteractionMenu extends Phaser.Scene {
    private menuRectangle!: Sprite;
    private lookAt!: Sprite;
    private take!: Sprite;
    private item!: Phaser.GameObjects.Sprite | InteractiveItem;
    private pointer!: Phaser.Math.Vector2;

    constructor() {
        super({ key: SceneKeys.InteractionMenu });
    }

    init(data: {pointer: Phaser.Math.Vector2, item: InteractiveItem }) {
        this.item = data.item;
        this.pointer = data.pointer;

    }


    lookAtItem() {
        eventsCenter.emit("lookAtItem", this.item);
    }

    takeItem() {
        eventsCenter.emit("takeItem", this.item);

    }

    create() {
        this.menuRectangle = this.add.sprite(this.pointer.x, this.pointer.y - 50, TextureKeys.InteractionMenu).setOrigin(0).setInteractive(new Phaser.Geom.Rectangle(this.pointer.x, this.pointer.y - 50, 200, 100), (item) => {
            return !item.contains(this.input.x, this.input.y)
        });
        const rectangleColumn = this.menuRectangle.getBounds().width / 4;
        const rectangleRow = this.menuRectangle.getBounds().height / 2
        this.lookAt = this.add.sprite(this.pointer.x + rectangleColumn, this.pointer.y + rectangleRow - 50, TextureKeys.LookAt).setScale(3).setInteractive();
        this.take = this.add.sprite(this.pointer.x + rectangleColumn * 3, this.pointer.y + rectangleRow - 50, TextureKeys.Take).setScale(3).setInteractive();
        this.lookAt.on('pointerover', () => this.lookAt.setScale(3.5));
        this.take.on('pointerover', () => this.take.setScale(3.5));
        this.lookAt.on('pointerout', () => this.lookAt.setScale(3));
        this.take.on('pointerout', () => this.take.setScale(3));
        this.lookAt.on('pointerdown', () => this.lookAtItem());
        this.take.on('pointerdown', () => this.takeItem());
        /* this.menuRectangle.on('pointerover', () => {
            this.scene.stop(SceneKeys.InteractionMenu)
        }) */
    }
}