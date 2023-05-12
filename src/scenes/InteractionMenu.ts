import {SceneKeys, TextureKeys} from "@/constants";
import Rectangle = Phaser.GameObjects.Rectangle;
import Sprite = Phaser.GameObjects.Sprite;
import {useInventoryStore} from "@/stores/inventory";

export default class InteractionMenu extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.InteractionMenu });
    }
    private location!: { x: number, y: number};
    private texture!: TextureKeys;
    private menuRectangle!: Rectangle;
    private lookAt!: Sprite;
    private take!: Sprite;
    private item!: {
        name: string;
        look_at_text: string[] | string;
        take_text: string[] | string;
    };
    private inventoryStory!: any;
    init(data: { location: { x: number, y: number}, texture: TextureKeys }) {
        this.location = data.location;
        this.texture = data.texture;
    }

    lookAtItem(text:string | string[]) {
       this.scene.launch(SceneKeys.Dialogue, { text });
        setTimeout(() => {
            this.scene.stop(SceneKeys.Dialogue)
        }, 3500)
    }

    takeItem(newItem: {
        name: string;
        isVisible: boolean;
    }) {
        this.inventoryStory.addItem(newItem)
        setTimeout(() => {
            this.scene.stop(SceneKeys.Dialogue)
        }, 3500)
    }
    create() {
        this.inventoryStory = useInventoryStore()
        this.item = this.cache.json.get(this.texture);
        this.menuRectangle = this.add.rectangle(this.location.x, this.location.y - 50, 200, 100, 0xFFFFFF, 0.2).setOrigin(0);
        const rectangleColumn = this.menuRectangle.getBounds().width / 4;
        const rectangleRow = this.menuRectangle.getBounds().height / 2
        this.lookAt = this.add.sprite(this.location.x + rectangleColumn, this.location.y + rectangleRow - 50, TextureKeys.LookAt).setScale(3).setInteractive();
        this.take = this.add.sprite(this.location.x + rectangleColumn * 3, this.location.y + rectangleRow - 50, TextureKeys.Take).setScale(3).setInteractive();

        this.lookAt.on('pointerover', () => this.lookAt.setScale(3.5));
        this.take.on('pointerover',() => this.take.setScale(3.5));
        this.lookAt.on('pointerout', () => this.lookAt.setScale(3));
        this.take.on('pointerout',() => this.take.setScale(3));
        this.lookAt.on('pointerdown', () => this.lookAtItem(this.item.look_at_text));
        this.take.on('pointerdown', () => this.takeItem({ name: this.item.name, isVisible: false }));
    }
}