import { SceneKeys } from "@/constants";
import eventsCenter from "@/events/eventsCenter";

export default class DisplayText extends Phaser.Scene {
    private textData: string = "";
    private displayText!: Phaser.GameObjects.Text;
    private timer!: any;

    constructor() {
        super({ key: SceneKeys.DisplayText });
    }

    init(data: { text: string}) {
        this.textData = data.text;
        this.displayText = this.add.text(50, 50, "", {
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            fontSize: "14px",
            backgroundColor: "#fff",
            wordWrap: { width: this.scale.width - 50, useAdvancedWrap: true }
        }).setScrollFactor(0).setOrigin(0);
    }

    typewriteText(text: string) {
        const length = text.length
        let i = 0
        this.time.addEvent({
          callback: () => {
            this.displayText.text += text[i]
            ++i
            if (i === length - 1) {
                eventsCenter.emit("textWritten")
            }
          },
          repeat: length - 1,
          delay: 50,
        });
      }

    create() {
        this.typewriteText(this.textData);
        eventsCenter.on("textWritten", () => setTimeout(() => this.scene.stop(SceneKeys.DisplayText), 1500))
    }
}