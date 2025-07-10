<template>
    <div class="min-h-screen flex flex-col relative">
      <main class="flex-grow"
      
      >
        <slot />
      </main>
      <!-- Loader global con fade -->
      <Transition name="fade">
        <div v-if="isNavigating" class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 pointer-events-none">
          <span class="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      </Transition>
      
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
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useModal } from '~/composables/useModal'
  
  const isNavigating = ref(false)
  const router = useRouter()
  const modal = useModal()
  
  let start, end
  onMounted(() => {
    start = router.beforeEach((to, from, next) => {
      isNavigating.value = true
      next()
    })
    end = router.afterEach(() => {
      isNavigating.value = false
    })
  })
  onUnmounted(() => {
    if (start) start()
    if (end) end()
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