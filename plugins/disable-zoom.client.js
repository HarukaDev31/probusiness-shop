export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (!process.client) return

  // Prevenir zoom por doble tap en toda la aplicación
  let lastTouchEnd = 0
  
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)

  // Prevenir zoom por pellizco (pinch)
  document.addEventListener('gesturestart', (event) => {
    event.preventDefault()
  }, false)
  
  document.addEventListener('gesturechange', (event) => {
    event.preventDefault()
  }, false)
  
  document.addEventListener('gestureend', (event) => {
    event.preventDefault()
  }, false)
}) 