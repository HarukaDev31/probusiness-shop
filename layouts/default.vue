<template>
  <div class="min-h-screen flex flex-col relative">
    <Header />
    <main class="flex-grow"
    
    >
      <slot />
    </main>
    <Footer v-if="!hideFooter" />
    <!-- Loader global con logo -->
    <GlobalLoader />
    
    <!-- Modal Global -->
    <GlobalModal 
      :is-open="modal.isOpen.value" 
      :modal-config="modal.modalConfig.value"
      @confirm="modal.confirm"
      @cancel="modal.cancel"
      @hide="modal.hideModal"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from '~/composables/useModal'

const route = useRoute()
const modal = useModal()
const loading = useLoadingStore()

// Ocultar footer en carrito y checkout
const hideFooter = computed(() => {
  const currentPath = route.path
  return currentPath === '/cart' || currentPath.startsWith('/checkout')
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>