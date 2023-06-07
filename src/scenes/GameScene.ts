import { AnimationKeys, AudioKeys, CharacterKey, FrameKeys, SceneKeys, TextureKeys } from "@/constants";
import InteractiveItem from "../objects/InteractiveItem";
import Vector2 = Phaser.Math.Vector2;
import { Quest } from "@/state-machines/QuestStateMachine";
import { quests } from "@/game-data/questData";
import eventsCenter from "@/events/eventsCenter";
import type { ItemData } from "@/game-data/itemObjects";
import { InteractionManager } from "@/helpers/InteractionManager";
import { useGameObjectStore } from "@/stores/gameObjects";
import { PortalItem } from "@/objects/PortalItem";

export class GameScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private windSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private velocityX: number = 0;
    private backgrounds: { ratioX: number, sprite: Phaser.GameObjects.TileSprite }[] = [];
    private player!: Phaser.GameObjects.Sprite;
    public tent!: PortalItem;
    public logs!: InteractiveItem;
    public bonfire!: InteractiveItem;
    public explorer!: IInteractiveCharacter;
    private sealGroup!: Phaser.GameObjects.Group;
    public inventoryGroup!: Phaser.GameObjects.Group;
    private gameWidth!: number;
    private gameHeight!: number;
    private fog!: Phaser.GameObjects.TileSprite;
    private water!: Phaser.GameObjects.TileSprite;
    public theBribe!: Quest;
    public searchTent!: Quest;
    private interactionManager!: InteractionManager;

    constructor() {
        super({ key: SceneKeys.Game });
    }

    createQuests() {
        this.searchTent = new Quest(quests.searchTent, this.tent, this)
        this.theBribe = new Quest(quests.theBribe, this.explorer, this)
        this.theBribe.controller.setState("locked");
        this.searchTent.controller.setState("locked");
    }

    createPlayer() {
        return this.add.sprite(100, this.gameHeight - 220, TextureKeys.DickieMove)
            .setOrigin(0)
            .setScale(2)
            .setDepth(10)
    }

    createNpc() {
        this.anims.create({
            key: 'npc_left',
            frames: this.anims.generateFrameNames(TextureKeys.Seal, {
                prefix: AnimationKeys.DickieMoveLeft,
                end: 3,
                zeroPad: 3,
            }),
            repeat: -1,
            frameRate: 7,
        });
        this.sealGroup = this.add.group();
        const seal = this.add.sprite(200, this.gameHeight - 240, TextureKeys.Seal)
            .setOrigin(0)
            .setScale(0.5);
        const seal2 = this.add.sprite(230, this.gameHeight - 245, TextureKeys.Seal)
            .setOrigin(0)
            .setScale(0.5);
        const seal3 = this.add.sprite(257, this.gameHeight - 237, TextureKeys.Seal)
            .setOrigin(0)
            .setScale(0.5);
        this.sealGroup.addMultiple([
            seal, seal2, seal3
        ], true);
        seal.anims.play('npc_left');
        seal2.anims.play('npc_left');
        seal3.anims.play('npc_left');

    }

    createBackground() {
        this.backgrounds.push({
            ratioX: 0.1,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Sky)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        });
        this.backgrounds.push({
            ratioX: 0.3,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Mountains)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        });
        this.backgrounds.push({
            ratioX: 0.4,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Ground)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        })
        this.backgrounds.push({
            ratioX: 0.35,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Middleground)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        });
        this.fog = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Fog)
        .setOrigin(0)
        .setScrollFactor(0)
        .setAlpha(0.3)
        .setScale(2,2);

        this.water = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Water)
            .setOrigin(0)
            .setScrollFactor(0)
            .setScale(2,2)
    }

    addSounds() {
        this.windSound = this.sound.add(AudioKeys.ArcticWinds)
    }

    create() {
        // Set Up Stuff
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.addSounds();
        this.windSound.play({
            mute: false,
            volume: 2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        })
        const myCam = this.cameras.main;
        myCam.setBackgroundColor('#dce2ed');
        myCam.setBounds(0, 0, this.gameWidth * 5, this.gameHeight);
        this.inventoryGroup = this.add.group();
        this.interactionManager = new InteractionManager(this);

        const store = useGameObjectStore()

        // Create Sprites
        this.createBackground();
        this.createNpc();
        this.add.nineslice(0, this.scale.height - 100, TextureKeys.UiBox, 0, 900, 100, 32, 32, 32, 32)
            .setOrigin(0)
            .setScrollFactor(0)
            
        this.tent = new PortalItem(this, 2770, this.gameHeight - 360, TextureKeys.Tent)
            .setScale(3)
        this.add.existing(this.tent);
        this.tent.createDropZone(TextureKeys.Tent, 3)

        this.logs = new InteractiveItem(this, 3050, this.gameHeight - 250, TextureKeys.Logs, FrameKeys.LogQuant3)
            .setOrigin(0)
            .setScale(1.5)
        this.add.existing(this.logs);

        this.bonfire = new InteractiveItem(this, 3150, this.gameHeight - 320, TextureKeys.Bonfire, FrameKeys.Bonfire1)
            .setOrigin(0)
            .setScale(1.5)
        this.add.existing(this.bonfire);
        this.bonfire.createDropZone(TextureKeys.Bonfire, 1.5)

        this.explorer = this.add.interactiveCharacter(2500, this.gameHeight - 390, CharacterKey.Explorer)
            .setOrigin(0)
            .setScale(2)
            .setScrollFactor(1)
        this.explorer.anims.play('explorer_wind');

        this.player = this.createPlayer();
        myCam.startFollow(this.player, true, 0.05, 0.05);

        this.add.text(this.gameWidth * 1.5, 200, 'Challo?', {
            fontSize: '16px',
            fontFamily: "'Press Start 2P'",
            color: "#000000",
        })
        this.add.text(this.gameWidth * 2, 200, 'Wo sind alle?', {
            fontSize: '16px',
            fontFamily: "'Press Start 2P'",
            color: "#000000",
        })

        // create quests
        this.createQuests()


        // Item Triggers
        eventsCenter.on("lookAtItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("lookAtText"), autoDelete: true })
        });
        eventsCenter.on("takeItem", (item: InteractiveItem) => {
            this.scene.launch(SceneKeys.DisplayText, { text: item.getData("takeText"), autoDelete: true });
            if (item.getData("removeable")) {
                item.controller.setState("inInventory");
            }
        });

        eventsCenter.on("interactInWorld", (item: InteractiveItem | PortalItem, pointer: Phaser.Math.Vector2) => {
            this.scene.launch(SceneKeys.InteractionMenu, { item, pointer })
            const portalItem = item as PortalItem;
            if (portalItem.isUnlocked) {
                this.scene.sleep(SceneKeys.Game)
                this.scene.sleep(SceneKeys.Snowfall)
                this.scene.stop(SceneKeys.InteractionMenu)
                myCam.fadeOut()
                this.scene.start(SceneKeys.TentScene)
            }
        })

        this.scene.launch(SceneKeys.Snowfall, {
            player: this.player,
        });

        this.input.on("dragstart", (pointer: any, gameObject: any) => {
            gameObject.setAlpha(0.7)
        })

        this.input.on("drag", (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameObject.x = dragX,
            gameObject.y = dragY
        })
        console.log(this)

        this.input.on("dragend", (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
            gameObject.setAlpha(1);
            Phaser.Actions.GridAlign(this.inventoryGroup.getChildren(), {
                width: -1,
                cellWidth: 900 * 0.12,
                cellHeight: 32,
                x: 12,
                y: 580 - 82,
            });
        });

        this.input.on('drop', (pointer: Phaser.Math.Vector2, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) =>
        {  
            this.interactionManager.useWith(gameObject, dropZone.name as TextureKeys.Bonfire | TextureKeys.Tent)
        });

        // Quest Triggers
        eventsCenter.once("logsStolen", () => this.theBribe.controller.setState("unlocked"))
    }

    update(dt: number, fr: number) {
        if (!this.logs.active) {
            eventsCenter.emit("logsStolen")
        }
        if (this.cursors?.left.isDown) {
            this.velocityX -= 2.5;

            this.player.anims.play('left', true);
        }
        else if (this.cursors?.right.isDown) {
            this.velocityX += 5.5;

            this.player.anims.play('right', true);
        } else {
            this.velocityX += 0;
            this.player.anims.play('idle', true)
        }
        this.player.x = this.velocityX

        this.backgrounds.forEach((bg) => {
            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX
        })
        this.fog.tilePositionX += 1.8
        this.water.tilePositionX += 0.8

        this.sealGroup.children.entries.forEach((seal) => {
            const sealCopy = seal as Phaser.GameObjects.Sprite
            sealCopy.x -= 0.8
        });
    }
}