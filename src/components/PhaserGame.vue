<script setup lang="ts">
import PhaserContainer from '@/components/PhaserContainer.vue'
</script>

<template>
    <Suspense>
        <PhaserContainer />

        <template #fallback>
            <div class="placeholder">
                Downloading ...
            </div>
        </template>
    </Suspense>
</template>