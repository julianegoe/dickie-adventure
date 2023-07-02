import { AnimationKeys, AudioKeys, CharacterKey, FrameKeys, SceneKeys, TextureKeys } from "@/constants";
import InteractiveItem from "../objects/InteractiveItem";
import { Quest } from "@/state-machines/QuestStateMachine";
import { quests } from "@/game-data/questData";
import eventsCenter from "@/events/eventsCenter";
import { InteractionManager } from "@/helpers/InteractionManager";
import { PortalItem } from "@/objects/PortalItem";
import { InventoryManager } from "@/helpers/InventoryManager";

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
    private gameWidth!: number;
    private gameHeight!: number;
    private fog!: Phaser.GameObjects.TileSprite;
    private water!: Phaser.GameObjects.TileSprite;
    public theBribe!: Quest;
    public searchTent!: Quest;
    public interactionManager!: InteractionManager;
    public inventoryManager!: InventoryManager;
    public worldItemGroup!: Phaser.GameObjects.Group;

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

    createBackground() {
        this.backgrounds.push({
            ratioX: 0.1,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Sky)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2, 2)
        });
        this.backgrounds.push({
            ratioX: 0.3,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Mountains)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2, 2)
        });
        this.backgrounds.push({
            ratioX: 0.4,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Ground)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2, 2)
        })
        this.backgrounds.push({
            ratioX: 0.35,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Middleground)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2, 2)
        });
        this.fog = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Fog)
            .setOrigin(0)
            .setScrollFactor(0)
            .setAlpha(0.3)
            .setScale(2, 2);

        this.water = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight - 100, TextureKeys.Water)
            .setOrigin(0)
            .setScrollFactor(0)
            .setScale(2, 2)
    }

    addSounds() {
        this.windSound = this.sound.add(AudioKeys.ArcticWinds)
    }

    create() {
        // Set Up Stuff
        this.inventoryManager = new InventoryManager(this);
        this.inventoryManager.initInventory((gameObject: any, dropZone: any) => {
            this.interactionManager.useWith(gameObject, dropZone.name as TextureKeys.Bonfire | TextureKeys.Tent)
        });
        this.worldItemGroup = this.add.group();
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
        this.interactionManager = new InteractionManager(this);

        // Create Sprites
        this.createBackground();

        this.tent = new PortalItem(this, 2770, this.gameHeight - 360, TextureKeys.Tent)
            .setScale(3)
        this.add.existing(this.tent);
        this.worldItemGroup.add(this.tent);
        this.tent.createDropZone(3)

        this.logs = new InteractiveItem(this, 3050, this.gameHeight - 250, TextureKeys.Logs, FrameKeys.LogQuant3)
            .setOrigin(0)
            .setScale(1.5)
        this.add.existing(this.logs);
        this.worldItemGroup.add(this.logs);

        this.bonfire = new InteractiveItem(this, 3150, this.gameHeight - 320, TextureKeys.Bonfire, FrameKeys.Bonfire1)
            .setOrigin(0)
            .setScale(1.5)
        this.add.existing(this.bonfire);
        this.worldItemGroup.add(this.bonfire);
        this.bonfire.createDropZone(1.5);

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

        /* ToDo: refactor */
        eventsCenter.on("interactInWorld", (item: InteractiveItem | PortalItem, pointer: Phaser.Math.Vector2) => {
            this.scene.launch(SceneKeys.InteractionMenu, { item, pointer })
            const portalItem = item as PortalItem;
            if (portalItem.isUnlocked) {
                this.scene.stop(SceneKeys.InteractionMenu)
                eventsCenter.destroy();
                myCam.fadeOut(1000, 0, 0, 0);
                myCam.once("camerafadeoutcomplete", () => {
                    this.scene.start(SceneKeys.TentScene)
                })
            }
        })

        this.scene.launch(SceneKeys.Snowfall, {
            player: this.player,
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
    }
}