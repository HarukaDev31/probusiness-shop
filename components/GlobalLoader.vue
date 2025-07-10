<template>
  <Teleport to="body">
    <Loader v-if="loading.isLoading" />
  </Teleport>
</template>

<script setup>
import { useLoadingStore } from '~/stores/loading'

const loading = useLoadingStore()

// Debug: mostrar el estado del loading
console.log('GlobalLoader - isLoading:', loading.isLoading)
</script> 