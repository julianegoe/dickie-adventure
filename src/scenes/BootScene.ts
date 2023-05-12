export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // preload assets
    }

    startLoading() {
        // Add the start text
        const startText = this.add.text(this.game.config.width as number / 2, this.game.config.height as number / 2, 'START', {
            fontSize: '64px',
            color: "#000000",
        }).setOrigin(0.5);

        // Make the text interactive
        startText.setInteractive({ useHandCursor: true });

        // Add an event listener for when the user clicks the text
        startText.on('pointerdown', () => {
            // Start the preload scene
            this.scene.start('PreloadScene');
        });
    }
    create() {
        // Set background color
        this.cameras.main.setBackgroundColor('#cccccc');
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        // start PreLoad Scene when clicking start
        this.startLoading();
    }
}