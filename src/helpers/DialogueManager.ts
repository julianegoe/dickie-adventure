import { TextureKeys } from "@/constants";
import type { Choice, IDialogue } from "@/game-data/characters";
import type { Scene } from "phaser";

class DialogueManager {
  private scene!: Scene;
  private dialogueData: IDialogue[] = [];
  private currentNode!: IDialogue;
  private dialogueText!: Phaser.GameObjects.Text;
  private choices!: Phaser.GameObjects.Text[] | null;
  private dialogueGraphics!: Phaser.GameObjects.Graphics | null;

  constructor(scene: Scene, dialogueData: IDialogue[]) {
    this.scene = scene;
    this.dialogueData = dialogueData;
    this.currentNode = this.dialogueData[0];
    this.dialogueText = this.scene.add.text(this.scene.scale.width * 0.16, 100, "", {
      fontSize: '14px',
      fontFamily: "'Press Start 2P'",
      color: "#000000",
      backgroundColor: "#fff",
      wordWrap: { width: 500, useAdvancedWrap: true },
    }).setOrigin(0).setScrollFactor(0);
  }

  typewriteText(text: string | string[]) {
    const length = text.length
    let i = 0
    this.scene.time.addEvent({
      callback: () => {
        this.dialogueText.text += text[i]
        ++i
      },
      repeat: length - 1,
      delay: 50
    })
  }

  startDialogue(dialogueId: number) {
    const dialogue = this.dialogueData[dialogueId];
    if (dialogue) {
      this.currentNode = dialogue;
      this.displayCurrentNode();
    }
  }

  displayCurrentNode() {
    if (this.currentNode) {
      this.clearDialogue();
      // Display the dialogue text
      this.typewriteText(this.currentNode.text)
      //this.dialogueText.setText(this.currentNode.text)
      // Display choices if available
      if (this.currentNode.choices && this.currentNode.choices.length > 0) {
        this.choices = this.currentNode.choices.map((choice, index) => {
          const choiceText = this.scene.add.text(
            0,
            0,
            choice.text,
            {
              fontSize: '14px',
              fontFamily: "'Press Start 2P'",
              color: "#000000",
              backgroundColor: "#fff",
              wordWrap: { width: 600, useAdvancedWrap: true },
            }
          ).setOrigin(0).setScrollFactor(0);

          // Add pointer event to the choice text
          choiceText.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
            this.handleChoiceSelection(choice);
          });
          return choiceText;
        });
        Phaser.Actions.GridAlign(this.choices, {
          height: -1,
          cellWidth: this.scene.scale.width,
          cellHeight: 32,
          x: this.scene.scale.width * 0.04,
          y: this.scene.scale.height - 200,
      });
      } else {
        setTimeout(() => this.endDialogue(), 2500)
      }
    }
  }

  handleChoiceSelection(choice: Choice) {
    if (choice.nextNode) {
      this.currentNode = this.dialogueData[choice.nextNode];
      this.displayCurrentNode();
    } else {
      this.endDialogue();
    }
  }


  endDialogue() {
    this.clearDialogue();
    // Perform any necessary cleanup or actions at the end of the dialogue
  }

  clearDialogue() {
    if (this.dialogueGraphics) {
      this.dialogueGraphics.destroy();
      this.dialogueGraphics = null;
    }

    if (this.dialogueText) {
      this.dialogueText.setText("");
    }

    if (this.choices) {
      this.choices.forEach(choice => choice.destroy());
      this.choices = null;
    }
  }

}

export default DialogueManager
