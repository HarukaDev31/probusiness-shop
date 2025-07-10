export default defineNuxtRouteMiddleware((to, from) => {
  const loading = useLoadingStore()
  if (process.client) {
    loading.setLoading(true)
    setTimeout(() => {
      loading.setLoading(false)
    }, 600)
  }
}) 