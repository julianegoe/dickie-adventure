import { SceneKeys } from "@/constants";

export default class DisplayText extends Phaser.Scene {
    private text: string = "";
    private position!: { x: number, y: number };
    constructor() {
        super({ key: SceneKeys.DisplayText });
    }

    init(data: { text: string, position: { x: number, y: number}}) {
        this.text = data.text;
        this.position = data.position;
    }

    create() {
        this.add.text(this.position.x, this.position.y, this.text, {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px",
            backgroundColor: "#fff",
            wordWrap: { width: this.scale.width - 50, useAdvancedWrap: true }
        }).setScrollFactor(0).setOrigin(0)
    }
}