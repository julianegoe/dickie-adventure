<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Game } from 'phaser'
import { useGameStore } from "@/stores/gameStore";

let gameInstance: Game | null = null
const containerId = 'game-container';
const game = await import('@/game');
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
        <div :id="containerId"></div>
    </div>
</template>
<style scoped>
* {
    box-sizing: border-box;
}
</style>