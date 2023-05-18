<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Game } from 'phaser'
import { useInventoryStore } from "@/stores/inventory";
import { useGameStore } from "@/stores/gameStore";

let gameInstance: Game | null = null
const containerId = 'game-container';
const game = await import('@/game');
const inventoryStore = useInventoryStore();
const gameStore = useGameStore();

onMounted(() => {
    gameInstance = game.launch(containerId)
})

onUnmounted(() => {
    gameStore.setGameScene(false);
    gameInstance?.destroy(false)
})


</script>

<template>
    <div class="game-screen">
        <div :id="containerId" />
        <!-- <div v-if="gameStore.isGameScene" class="inventory">
            <div class="inventory-slot" v-for="item in inventoryStore.items" :key="item.name">
                <img v-show="item.isInInventory" class="inventory-item" :src="`${item.name}.png`"
                    :alt="item.name">
            </div>
        </div> -->
    </div>
</template>
<style scoped>
* {
    box-sizing: border-box;
}

.game-screen {
    display: flex;
    flex-direction: column;
    margin-bottom: 4rem;
}

.inventory {
    cursor: url("crosshair.cur"), pointer;
    width: 900px;
    height: 100px;
    transform: translateY(-100%);
    background-color: lightgray;
    border: solid 16px black;
}

.inventory-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    min-width: 100px;
}

.inventory-item {
    width: 50px;
    aspect-ratio: 1;
    image-rendering: pixelated;
}
</style>