export default class Dialogue extends Phaser.Scene {
    constructor() {
        super({key: 'Dialogue'});
    }

    private text: string = "";

    init(data: { text: string }) {
        this.text = data.text;
    }

    create() {
        this.add.container(0, 0, [this.add.text(50, 50, this.text, {
            fontFamily: 'VT323',
            fontSize: 32,
            color: '#000',
        }).setOrigin(0)]);
    }
}