import { SceneKeys, TextureKeys } from "@/constants";
import eventsCenter from "@/events/eventsCenter";
import type InteractiveItem from "@/objects/InteractiveItem";
import type { PortalItem } from "@/objects/PortalItem";
import type { GameScene } from "./GameScene";
import type { TentScene } from "./TentScene";

export class Controller extends Phaser.Scene {
    /* inventoryManager!: InventoryManager;
    interactionManager!: InteractionManager; */
    outside!: GameScene;
    tent!: TentScene;
    playerOutside!: Phaser.GameObjects.Sprite;
    gameWidth!: number;
    gameHeight!: number;
    constructor() {
        super({ key: 'Controller' });
    }
    create() {
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        const myCam = this.cameras.main;
        myCam.setBounds(0, 0, this.gameWidth * 5, this.gameHeight);
        /* this.interactionManager = new InteractionManager(this);
        this.inventoryManager = new InventoryManager(this); */
        /* this.inventoryManager.initInventory((gameObject: any, dropZone: any) => {
            this.interactionManager.useWith(gameObject, dropZone.name as TextureKeys.Bonfire | TextureKeys.Tent)
        }); */
       //this.scene.launch(SceneKeys.Inventory);
        this.scene.launch(SceneKeys.Game);

        this.outside = this.scene.get(SceneKeys.Game) as GameScene;
        eventsCenter.on("openPortal", (item: PortalItem, pointer: Phaser.Math.Vector2) => {
            console.log("open tent")
            if (item.isUnlocked) {
                //this.scene.stop(SceneKeys.InteractionMenu)
                //eventsCenter.destroy();
                myCam.fadeOut(1000, 0, 0, 0);
                myCam.on("camerafadeoutcomplete", () => {
                    this.outside.scene.switch(SceneKeys.TentScene)

                })
            }
        })
        this.tent = this.scene.get(SceneKeys.TentScene) as TentScene;

        eventsCenter.on("lookAtItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("lookAtText"), autoDelete: true }).bringToTop(SceneKeys.DisplayText)
        });
        eventsCenter.on("takeItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("takeText"), autoDelete: true }).bringToTop(SceneKeys.DisplayText);
            if (item.getData("removeable")) {
                item.controller.setState("inInventory");
            }
        });

        eventsCenter.on("interact", (item: InteractiveItem, pointer: Phaser.Math.Vector2) => {
            this.scene.launch(SceneKeys.InteractionMenu, { pointer, item}).bringToTop(SceneKeys.InteractionMenu)
        }); 

        eventsCenter.on("leavingTent", () => {
            this.tent.cameras.main.fadeOut(1000, 0, 0, 0);
            this.tent.cameras.main.on("camerafadeoutcomplete", () => {
                this.tent.scene.switch(SceneKeys.Game)
                })
        });
    }

    update() {
    }
}