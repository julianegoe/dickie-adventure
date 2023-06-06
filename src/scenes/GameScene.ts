import { AnimationKeys, AudioKeys, CharacterKey, FrameKeys, SceneKeys, TextureKeys } from "@/constants";
import InteractiveItem from "../objects/InteractiveItem";
import Vector2 = Phaser.Math.Vector2;
import { Quest } from "@/state-machines/QuestStateMachine";
import { quests } from "@/game-data/questData";
import eventsCenter from "@/events/eventsCenter";
import type { ItemData } from "@/game-data/itemObjects";
import { InteractionManager } from "@/state-machines/InteractionManager";

export class GameScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private windSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private velocityX: number = 0;
    private backgrounds: { ratioX: number, sprite: Phaser.GameObjects.TileSprite }[] = [];
    private player!: Phaser.GameObjects.Sprite;
    private tent!: InteractiveItem;
    private logs!: InteractiveItem;
    private bonfire!: InteractiveItem;
    private explorer!: IInteractiveCharacter;
    private sealGroup!: Phaser.GameObjects.Group;
    private gameWidth!: number;
    private gameHeight!: number;
    private fog!: Phaser.GameObjects.TileSprite;
    private water!: Phaser.GameObjects.TileSprite;
    private bribeQuest!: Quest;
    private interactionManager!: InteractionManager;

    constructor() {
        super({ key: SceneKeys.Game });
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

    createBribeQuest(gameObject: Phaser.GameObjects.Sprite) {
        this.bribeQuest = new Quest(quests.theBribe, gameObject)
        this.bribeQuest.controller.setState("locked");
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
        
        this.interactionManager = new InteractionManager(this)

        // Create Sprites
        this.createBackground();
        this.createNpc();
        this.add.nineslice(0, this.scale.height - 100, TextureKeys.UiBox, 0, 900, 100, 32, 32, 32, 32)
            .setOrigin(0)
            .setScrollFactor(0)
            
        const inventoryGroup = this.add.group();

        this.tent = new InteractiveItem(this, 2770, this.gameHeight - 360, TextureKeys.Tent)
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
        this.createBribeQuest(this.explorer);

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

        eventsCenter.on("interactInWorld", (item: InteractiveItem, pointer: Phaser.Math.Vector2) => {
            this.scene.launch(SceneKeys.InteractionMenu, { item, pointer })
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

        this.input.on("dragend", (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
            gameObject.setAlpha(1);
        });

        this.input.on('drop', (pointer: Phaser.Math.Vector2, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) =>
        {
            this.interactionManager.useWith(gameObject, dropZone.name as TextureKeys)
        });

        // Quest Triggers
        eventsCenter.once("logsStolen", () => this.bribeQuest.controller.setState("unlocked"))
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