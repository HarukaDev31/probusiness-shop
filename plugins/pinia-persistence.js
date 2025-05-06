export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('pinia:stores:created', ({ store }) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storageKey = `cart-${store.$id}`;
      
      if (localStorage.getItem(storageKey)) {
        store.$state = JSON.parse(localStorage.getItem(storageKey));
      }
      
      store.$subscribe(() => {
        localStorage.setItem(storageKey, JSON.stringify(store.$state));
      });
    }
  });
});