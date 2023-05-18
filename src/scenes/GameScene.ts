import { AudioKeys, SceneKeys, TextureKeys, TilemapKeys, TilesetKeys } from "@/constants";
import InteractiveItem from "../objects/InteractiveItem";
import { useInventoryStore } from "@/stores/inventory";
import { useGameStore } from "@/stores/gameStore";
import Polygon = Phaser.Geom.Polygon;
import Rectangle = Phaser.Geom.Rectangle;
import Vector2 = Phaser.Math.Vector2;
export class GameScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private windSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private velocityX: number = 0;
    private backgrounds: { ratioX: number, sprite: Phaser.GameObjects.TileSprite }[] = [];
    private player!: Phaser.GameObjects.Sprite;
    private gameWidth!: number;
    private gameHeight!: number;
    private target = { x: 0, y: 0 };
    private emitZone!: Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig;
    private isInteractionMenuOpen: boolean = false;
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
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        /* this.cameras.main.setBounds(0,0, this.gameWidth, this.gameHeight);
        this.physics.world.setBounds(0,0, this.gameWidth, this.gameHeight); */
        const myCam = this.cameras.main;
        myCam.setBackgroundColor('#dce2ed').setZoom(1.3);
        myCam.setBounds(0, 0, this.gameWidth * 5, this.gameHeight);

        this.createBackground();
        this.player = this.createPlayer();
        myCam.startFollow(this.player, true, 0.05, 0.05);
        
        this.target = new Phaser.Math.Vector2();
         this.scene.launch(SceneKeys.Snowfall, {
             player: this.player,
         });

        //this.hitArea = new Phaser.Geom.Rectangle(0, this.gameHeight / 1.7, this.gameWidth, 240)

        //this.star = this.createInterActiveItem(TextureKeys.Star, new Phaser.Math.Vector2(200, 300), 3);
        //this.fish = this.createInterActiveItem(TextureKeys.Fish, new Phaser.Math.Vector2(300, 300), 2);
        //this.add.existing(this.star);
        //this.add.existing(this.fish);

        // Game Objects Events
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.target.x = pointer.x;
            this.target.y = pointer.y;
            if (this.isInteractionMenuOpen && !this.fish.getBounds().contains(pointer.x, pointer.y) && !this.star.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.stop(SceneKeys.InteractionMenu);
                this.isInteractionMenuOpen = false;
            }
        });

        const gameText1 = this.add.text(this.gameWidth * 2, 200, 'Challo?', {
            fontSize: '16px',
            fontFamily: "'Press Start 2P'",
            color: "#000000",
        })
        const gameText2 = this.add.text(this.gameWidth * 3, 200, 'Ist da jemand?', {
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

        for (let i = 0; i < this.backgrounds.length; ++i) {
			const bg = this.backgrounds[i]

			bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX
		}
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