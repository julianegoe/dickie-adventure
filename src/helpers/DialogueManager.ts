import type { Choice, IDialogue } from "@/dialogues/characters";
import { GameMode, useGameStore } from "@/stores/gameStore";
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
    }).setOrigin(0).setScrollFactor(0);
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
      this.dialogueText.setText(this.currentNode.text)
      // Display choices if available
      if (this.currentNode.choices && this.currentNode.choices.length > 0) {
        this.choices = this.currentNode.choices.map((choice, index) => {
          const choiceText = this.scene.add.text(
            this.scene.scale.width * 0.16,
            this.scene.scale.height * 0.64 + index * 30,
            choice.text,
            {
              fontSize: '14px',
              fontFamily: "'Press Start 2P'",
              color: "#000000",
              backgroundColor: "#fff",
            }
          ).setOrigin(0).setScrollFactor(0);

          // Add pointer event to the choice text
          choiceText.setInteractive().on('pointerdown', () => {
            this.handleChoiceSelection(choice);
          });

          return choiceText;
        });
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
