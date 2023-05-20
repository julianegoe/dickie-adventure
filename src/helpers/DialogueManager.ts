import type { IDialogue } from "@/dialogues/characters";
import type { Scene } from "phaser";

class DialogueManager {
    private scene!: Scene;
    private dialogueData: IDialogue[] = [];
    private currentNode!: IDialogue;
    private textDisplay!: Phaser.GameObjects.Text;
    private choicesGroup!: Phaser.GameObjects.Group;

    constructor(scene: Scene) {
      this.scene = scene;
    }
  
    startDialogue(dialogueDat: IDialogue[]) {
    this.dialogueData = dialogueDat
      this.currentNode = this.dialogueData[0];
      // Set up your text display or other visual elements
      this.textDisplay = this.scene.add.text(50, 200, "", {
        fontSize: '12px',
        fontFamily: "'Press Start 2P'",
        color: "#000000",
        backgroundColor: "#fff"
      });
      // Display the first dialogue
      this.displayDialogue();
    }
  
    displayDialogue() {
      if (this.currentNode) {
        this.textDisplay.setText(this.currentNode.text);
        // Display choices if available
        if (this.currentNode.choices.length >= 0) {
          this.displayChoices();
        }
      } else {
        this.endDialogue();
      }
    }
  
    displayChoices() {
        const choices = this.currentNode.choices;
        const choiceY = this.scene.scale.height - 100 // Starting Y position of the first choice
        const choiceSpacing = 30; // Spacing between each choice
        this.choicesGroup = this.scene.add.group()
        choices.forEach((choice, index) => {
            this.choicesGroup.add(this.scene.add.text(50, choiceY + index * choiceSpacing, choice.text, {
            fontSize: '16px',
            fontFamily: "'Press Start 2P'",
            color: "#000000",
            backgroundColor: "#fff"
          }).setInteractive().setData({...choice, index}));
        });
        this.choicesGroup.children.entries.forEach((choice) => {
            choice.on('pointerdown', () => {
                // Update currentNode based on the chosen option
                if (choice.data.list.nextNode >= 0) {
                    this.currentNode = this.dialogueData[choice.data.list.nextNode];
                } else {
                    this.endDialogue();
                    return
                }
                console.log(choice.data.list)
                this.choicesGroup.destroy(true);
                // Continue the dialogue
                this.displayDialogue();
              })
        })
      }
      
  
      endDialogue() {
        console.log('end dialog')
        // Clean up any visual elements or event listeners
        this.textDisplay.destroy(true);
        this.choicesGroup.destroy(true);
        // Additional cleanup for choices display if needed
        // ...
      
        // Dialogue ended, perform any necessary actions
        // Example: Resume normal gameplay, trigger an event, etc.
      }
      
  }

  export default DialogueManager
  