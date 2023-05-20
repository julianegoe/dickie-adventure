import { SceneKeys, TextureKeys } from "@/constants";
import Rectangle = Phaser.GameObjects.Rectangle;
import Sprite = Phaser.GameObjects.Sprite;
import { useInventoryStore } from "@/stores/inventory";
import type { ItemData } from "@/dialogues/itemObjects";

export default class InteractionMenu extends Phaser.Scene {
    private location!: { x: number, y: number };
    private itemData!: ItemData;
    private menuRectangle!: Sprite;
    private lookAt!: Sprite;
    private take!: Sprite;
    private displayText!: Phaser.GameObjects.Text

    constructor() {
        super({ key: SceneKeys.InteractionMenu });
    }

    private inventoryStory!: any;
    init(data: { location: { x: number, y: number }, itemData: ItemData }) {
        this.location = data.location;
        this.itemData = data.itemData;
        this.displayText = this.add.text(50, 50, "", {
            fontFamily: "'Press Start 2P'",
            fontSize: "16px",
            color: '#000',
        }).setOrigin(0);
    }

    lookAtItem() {
        if (this.itemData.interactable) {
            this.displayText.setText(this.itemData.lookAtText)
            setTimeout(() => {
                this.displayText.setVisible(false)
            }, 3500)
        }
    }

    takeItem() {
        if (this.itemData.removeable) {
            this.inventoryStory.addItem(this.itemData.key)
        }
        this.displayText.setText(this.itemData.takeText)
        setTimeout(() => {
            this.displayText.setVisible(false)
        }, 3500)
    }

    create() {
        this.inventoryStory = useInventoryStore()
        this.menuRectangle = this.add.sprite(this.location.x, this.location.y - 50, TextureKeys.InteractionMenu).setOrigin(0).setInteractive(new Phaser.Geom.Rectangle(this.location.x, this.location.y - 50, 200, 100), (item) => {
            return !item.contains(this.input.x, this.input.y)
        })
        const rectangleColumn = this.menuRectangle.getBounds().width / 4;
        const rectangleRow = this.menuRectangle.getBounds().height / 2
        this.lookAt = this.add.sprite(this.location.x + rectangleColumn, this.location.y + rectangleRow - 50, TextureKeys.LookAt).setScale(3).setInteractive();
        this.take = this.add.sprite(this.location.x + rectangleColumn * 3, this.location.y + rectangleRow - 50, TextureKeys.Take).setScale(3).setInteractive();
        this.lookAt.on('pointerover', () => this.lookAt.setScale(3.5));
        this.take.on('pointerover', () => this.take.setScale(3.5));
        this.lookAt.on('pointerout', () => this.lookAt.setScale(3));
        this.take.on('pointerout', () => this.take.setScale(3));
        this.lookAt.on('pointerdown', () => this.lookAtItem());
        this.take.on('pointerdown', () => this.takeItem());
        this.menuRectangle.on('pointerover', () => {
            this.scene.stop(SceneKeys.InteractionMenu)
        })
    }
}