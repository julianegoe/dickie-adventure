import { AnimationKeys, AudioKeys, CharacterKey, SceneKeys, TextureKeys } from "@/constants";
import InteractiveItem from "../objects/InteractiveItem";
import { useInventoryStore } from "@/stores/inventory";
import { useGameStore } from "@/stores/gameStore";
import Vector2 = Phaser.Math.Vector2;
import { type CharacterData } from "@/dialogues/characters";
import InteractiveCharacter from "@/objects/InteractiveCharacter";

export class GameScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private windSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private velocityX: number = 0;
    private backgrounds: { ratioX: number, sprite: Phaser.GameObjects.TileSprite }[] = [];
    private player!: Phaser.GameObjects.Sprite;
    private tent!: InteractiveItem;
    private sealGroup!: Phaser.GameObjects.Group;
    private gameWidth!: number;
    private gameHeight!: number;
    private target = { x: 0, y: 0 };
    private inventoryStore!: any;
    private star!: InteractiveItem;
    private fish!: InteractiveItem;

    constructor() {
        super({ key: 'GameScene' });
    }

    createPlayer() {
        return this.add.sprite(100, this.gameHeight - 100, TextureKeys.DickieMove)
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
            ratioX: 0.2,
            sprite: this.add.tileSprite(0, this.gameHeight - 264, this.gameWidth, 64, TextureKeys.Mountains)
                .setOrigin(0)
                .setScrollFactor(0),
        });
        this.backgrounds.push({
            ratioX: 0.3,
            sprite: this.add.tileSprite(0, this.gameHeight - 200, this.gameWidth, this.gameHeight / 2, TextureKeys.Ground)
                .setOrigin(0)
                .setScrollFactor(0)
        })
        this.backgrounds.push({
            ratioX: 0.9,
            sprite: this.add.tileSprite(0, this.gameHeight - 136, this.gameWidth, 128, TextureKeys.Foreground)
                .setOrigin(0)
                .setScrollFactor(0)
        });
        // create the Tilemap
        //const map = this.make.tilemap({ key: TilemapKeys.Mountains })
        // add the tileset image we are using
        //const tileset = map.addTilesetImage(TilesetKeys.Mountains, TextureKeys.Ice) as Phaser.Tilemaps.Tileset
        // create the layers we want in the right order
        //map.createLayer("mountains", tileset)?.setPosition(0, this.gameHeight / 2);
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

    create() {
        this.lights.enable()
        const gameStore = useGameStore();
        gameStore.setGameScene(true);
        this.inventoryStore = useInventoryStore();
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
        // Create Sprites
        const myCam = this.cameras.main;
        myCam.setBackgroundColor('#dce2ed').setZoom(1.3);
        myCam.setBounds(0, 0, this.gameWidth * 5, this.gameHeight);

        this.createBackground();
        this.tent = new InteractiveItem(this, 2870, this.gameHeight - 200, TextureKeys.Tent)
            .setOrigin(0.5)
            .setScale(3)
            .setScrollFactor(0.9)
            .setVisible(this.isItemVisible(TextureKeys.Tent));
        this.add.existing(this.tent);
        this.tent.highlightOnHover();
        this.tent.onInteract((location, itemData) => {
            this.scene.launch(SceneKeys.InteractionMenu, { location, itemData})
        })
        
        const explorer = this.add.interactiveCharacter(2500, this.gameHeight - 260, CharacterKey.Explorer)
            .setOrigin(0)
            .setScale(2)
            .setScrollFactor(0.9)
        /* explorer.onTalkTo((location, characterData) => {
            this.scene.launch(SceneKeys.Dialogue, { dialogueData: characterData, node: 0})
        })           */
        explorer.onTalkTo()
        explorer.anims.play('explorer_wind');
        this.player = this.createPlayer();
        myCam.startFollow(this.player, true, 0.05, 0.05);
        
        this.target = new Phaser.Math.Vector2();
         this.scene.launch(SceneKeys.Snowfall, {
             player: this.player,
         });

         this.createNpc();
        
    
        //this.hitArea = new Phaser.Geom.Rectangle(0, this.gameHeight / 1.7, this.gameWidth, 240)

        //this.star = this.createInterActiveItem(TextureKeys.Star, new Phaser.Math.Vector2(200, 300), 3);
        //this.fish = this.createInterActiveItem(TextureKeys.Fish, new Phaser.Math.Vector2(300, 300), 2);
        //this.add.existing(this.star);
        //this.add.existing(this.fish);

        // Game Objects Events

        const gameText1 = this.add.text(this.gameWidth * 2, 200, 'Challo?', {
            fontSize: '16px',
            fontFamily: "'Press Start 2P'",
            color: "#000000",
        })
        const gameText2 = this.add.text(this.gameWidth * 3, 200, 'Wo sind alle?', {
            fontSize: '16px',
            fontFamily: "'Press Start 2P'",
            color: "#000000",
        })
        /* this.star.onInteract((location) => {
            this.scene.launch(SceneKeys.InteractionMenu, {
                location: {
                    x: location.x,
                    y: location.y - 100
                },
                texture: TextureKeys.Star,
            })
            this.isInteractionMenuOpen = true;
        });
        this.fish.onInteract((location) => {
            this.scene.launch(SceneKeys.InteractionMenu, {
                location: {
                    x: location.x,
                    y: location.y - 100
                },
                texture: TextureKeys.Fish,
            })
            this.isInteractionMenuOpen = true;
        });
        this.star.changeSizeOnHover(3, 3.5);
        this.fish.changeSizeOnHover(2, 2.5); */
    }

    update(dt: number) {
        this.tent.setVisible(true);
        /* this.star.setVisible(this.isItemVisible(TextureKeys.Star));
        this.fish.setVisible(this.isItemVisible(TextureKeys.Fish)); */
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

        this.sealGroup.children.entries.forEach((seal) => {
            const sealCopy = seal as Phaser.GameObjects.Sprite
            sealCopy.x -= 0.8
        })
        /* if (this.hitArea.contains(this.target.x, this.target.y)) {
            if (this.player && this.player?.body.speed > 0) {
                if (distance < tolerance) {
                    this.player?.body.reset(this.target.x, this.target.y);
                    this.player.anims.stop();
                }
                if (this.target.x < this.player?.x) {
                    this.player?.anims.play('left', true);
                } else if (this.target.x > this.player?.x) {
                    this.player?.anims.play('right', true);
                }
            }
        } else {
            this.player?.body.setVelocity(0, 0);
            this.player.anims.stop();
        } */
    }
}