import { SceneKeys, TextureKeys } from "@/constants";
import InteractiveItem from "../objects/InteractiveItem";
import { useInventoryStore } from "@/stores/inventory";
import { useGameStore } from "@/stores/gameStore";
import Polygon = Phaser.Geom.Polygon;
import Rectangle = Phaser.Geom.Rectangle;
import Vector2 = Phaser.Math.Vector2;
export class GameScene extends Phaser.Scene {

    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private ice!: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    private gameWidth!: number;
    private gameHeight!: number;
    private target = { x: 0, y: 0 };
    private emitZone!: Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig;
    private isInteractionMenuOpen: boolean = false;
    private inventoryStore!: any;
    private star!: InteractiveItem;
    private fish!: InteractiveItem;
    private hitArea!: Polygon | Rectangle;
    private walkable!: any;

    constructor() {
        super({ key: 'GameScene' });
    }

    createBubbleEmitter(texture: string) {
        this.emitZone = {
            source: new Phaser.Geom.Rectangle(0, 0, 32, 32) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
            type: "random"
        };
        return this.add.particles(0, 0, texture, {
            moveToX: 0,
            active: true,
            speed: 500,
            maxVelocityX: 40,
            quantity: 1,
            duration: 3000,
            scale: { start: 0.9, end: 0 },
            frequency: 80,
            emitZone: this.emitZone,
        })
    }

    createWalkableArea(texture: string) {
        return this.add.rectangle(0, this.gameHeight / 1.7, this.gameWidth, 240)
        .setOrigin(0)
        .setInteractive(this.hitArea, (shape: Rectangle) => {
            return shape.contains(this.target.x, this.target.y)
        })
    }

    createPlayer() {
        return this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 1.5, TextureKeys.DickieMove, 0).setScale(3, 3);
    }

    createBackground() {
        // create the Tilemap
        const map = this.make.tilemap({ key: 'tilemap' })

        // add the tileset image we are using
        const tileset = map.addTilesetImage('background_arctic', TextureKeys.Ice) as Phaser.Tilemaps.Tileset

        // create the layers we want in the right order
        map.createLayer("ice", tileset)?.setScale(2.5);
        return {map, tileset};
    }

    createInterActiveItem(texture: string, position: Vector2, scale: number) {
        return new InteractiveItem(this, position.x, position.y, texture).setScale(scale).setVisible(this.isItemVisible(texture));
    }

    isItemVisible(itemName: string) {
        return this.inventoryStore.items.find((item: any) => item.name === itemName)?.isInGame
    }

    create() {
        const gameStore = useGameStore();
        gameStore.setGameScene(true);
        this.inventoryStore = useInventoryStore();
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.cameras.main.setBackgroundColor('#e0eef2');
        this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
        this.target = new Phaser.Math.Vector2();
        //this.hitArea = new Phaser.Geom.Polygon("160 239 522 249 748 306 834 296 859 323 871 387 830 414 739 383 634 431 514 454 413 434 315 463 295 413 261 436 192 464 112 457 78 412 14 400 21 332 139 277 162 242");
        this.hitArea = new Phaser.Geom.Rectangle(0, this.gameHeight / 1.7, this.gameWidth, 240)
        // Create Sprites
        this.walkable = this.createWalkableArea(TextureKeys.Ice);
        const tilemap = this.createBackground();
        this.player = this.createPlayer();
        tilemap.map.createLayer("water", tilemap.tileset)?.setScale(2.5);
        this.star = this.createInterActiveItem(TextureKeys.Star, new Phaser.Math.Vector2(200, 300), 3);
        this.fish = this.createInterActiveItem(TextureKeys.Fish, new Phaser.Math.Vector2(300, 300), 2);
        this.add.existing(this.star);
        this.add.existing(this.fish);

        // Game Objects Events
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.target.x = pointer.x;
            this.target.y = pointer.y;
            if (this.isInteractionMenuOpen && !this.fish.getBounds().contains(pointer.x, pointer.y) && !this.star.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.stop(SceneKeys.InteractionMenu);
                this.isInteractionMenuOpen = false;
            }
        })
        this.star.onInteract((location) => {
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
        this.fish.changeSizeOnHover(2, 2.5);
        this.walkable.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log
            this.physics.moveToObject(this.player, { x: pointer.x, y: pointer.y }, 200);
        })
    }

    update() {
        this.star.setVisible(this.isItemVisible(TextureKeys.Star));
        this.fish.setVisible(this.isItemVisible(TextureKeys.Fish));
        const tolerance = 3;
        const distance = Phaser.Math.Distance.BetweenPoints({ x: this.player?.x, y: this.player?.y }, this.target);
        if (this.hitArea.contains(this.target.x, this.target.y)) {
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
        }
    }
}