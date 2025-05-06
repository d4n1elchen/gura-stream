<script setup lang="ts">
import { state } from '@/socket'
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const connected = computed(() => state.connected)
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">{{ connected }}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
