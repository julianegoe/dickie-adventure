import { AnimationKeys, AudioKeys, CharacterKey, SceneKeys, TextureKeys } from "@/constants";
import InteractiveItem from "../objects/InteractiveItem";
import { useInventoryStore } from "@/stores/inventory";
import { useGameStore } from "@/stores/gameStore";
import Vector2 = Phaser.Math.Vector2;

export class GameScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private windSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private velocityX: number = 0;
    private backgrounds: { ratioX: number, sprite: Phaser.GameObjects.TileSprite }[] = [];
    private player!: Phaser.GameObjects.Sprite;
    private tent!: InteractiveItem;
    private explorer!: IInteractiveCharacter;
    private sealGroup!: Phaser.GameObjects.Group;
    private gameWidth!: number;
    private gameHeight!: number;
    private inventoryStore!: any;
    private gameStore!: any;
    private fog!: Phaser.GameObjects.TileSprite;
    private water!: Phaser.GameObjects.TileSprite;

    constructor() {
        super({ key: 'GameScene' });
    }

    createPlayer() {
        return this.add.sprite(100, this.gameHeight - 120, TextureKeys.DickieMove)
            .setOrigin(0)
            .setScale(2)
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
        const seal = this.add.sprite(200, this.gameHeight - 140, TextureKeys.Seal)
            .setOrigin(0)
            .setScale(0.5);
        const seal2 = this.add.sprite(230, this.gameHeight - 145, TextureKeys.Seal)
            .setOrigin(0)
            .setScale(0.5);
        const seal3 = this.add.sprite(257, this.gameHeight - 137, TextureKeys.Seal)
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
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, TextureKeys.Sky)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        });
        this.backgrounds.push({
            ratioX: 0.3,
            sprite: this.add.tileSprite(0, 0, this.gameWidth,  this.gameHeight, TextureKeys.Mountains)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        });
        this.backgrounds.push({
            ratioX: 0.4,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, TextureKeys.Ground)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        })
        this.backgrounds.push({
            ratioX: 0.35,
            sprite: this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, TextureKeys.Middleground)
                .setOrigin(0)
                .setScrollFactor(0)
                .setScale(2,2)
        });
        this.fog = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, TextureKeys.Fog)
        .setOrigin(0)
        .setScrollFactor(0)
        .setAlpha(0.3)
        .setScale(2,2);

        this.water = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, TextureKeys.Water)
            .setOrigin(0)
            .setScrollFactor(0)
            .setScale(2,2)
    }

    createInterActiveItem(texture: string, position: Vector2, scale: number) {
        return new InteractiveItem(this, position.x, position.y, texture).setScale(scale).setVisible(this.isItemVisible(texture));
    }

    isItemVisible(itemName: string) {
        return this.inventoryStore.items.find((item: any) => item.name === itemName)?.isInGame
    }

    addSounds() {
        this.windSound = this.sound.add(AudioKeys.ArcticWinds)
    }

    initStores() {
        this.gameStore = useGameStore();
        this.gameStore.setGameScene(true);
        this.inventoryStore = useInventoryStore();
    }

    create() {
        // Set Up Stuff
        this.initStores();
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
        myCam.setBackgroundColor('#dce2ed')
        myCam.setBounds(0, 0, this.gameWidth * 5, this.gameHeight);

        // Create Sprites
        this.createBackground();
        this.createNpc();

        this.tent = new InteractiveItem(this, 2870, this.gameHeight - 210, TextureKeys.Tent)
            .setOrigin(0.5)
            .setScale(3)
            .setScrollFactor(0.9)
            .setVisible(this.isItemVisible(TextureKeys.Tent));
        this.add.existing(this.tent);

        this.explorer = this.add.interactiveCharacter(2500, this.gameHeight - 290, CharacterKey.Explorer)
            .setOrigin(0)
            .setScale(2)
            .setScrollFactor(0.9)
        this.explorer.anims.play('explorer_wind');

        this.player = this.createPlayer();
        myCam.startFollow(this.player, true, 0.05, 0.05);
        this.scene.launch(SceneKeys.Snowfall, {
            player: this.player,
        });

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

        // Game Objects Events
        this.tent.highlightOnHover();
        this.tent.onInteract((location, itemData) => {
            this.scene.launch(SceneKeys.InteractionMenu, { location, itemData })
        });
        this.explorer.showNameOnHover({ x: this.explorer.x, y: this.explorer.y - 100 });
        this.explorer.onTalkTo();


    }

    update(dt: number) {
        if (this.cursors?.left.isDown) {
            this.velocityX -= 2.5;

            this.player.anims.play('left', true);
        }
        else if (this.cursors?.right.isDown) {
            this.velocityX += 2.5;

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
        this.water.tilePositionX += 1.8

        this.sealGroup.children.entries.forEach((seal) => {
            const sealCopy = seal as Phaser.GameObjects.Sprite
            sealCopy.x -= 0.8
        })
    }
}