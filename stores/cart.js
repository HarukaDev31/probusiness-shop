import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    selectedIds: [], 
    checkoutItems: [] 
  }),

  getters: {
    cartItems: (state) => state.items,

    cartItemCountAll: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    cartItemCount: (state) => {
      return state.items.reduce((total, item) => total + (item.quantity > 0 ? 1 : 0), 0);
    },
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    selectedItems: (state) => {
      return state.items.filter(item => state.selectedIds.includes(item.id));
    },
    selectedTotal: (state) => {
      return state.items
        .filter(item => state.selectedIds.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },

  actions: {
    addItem(product) {
      // Helper para extraer el número del string de precio
      const parsePrecio = (precioStr) => {
        if (typeof precioStr === 'number') return precioStr;
        if (!precioStr) return 0;
        // Buscar el primer número decimal en el string
        const match = precioStr.replace(',', '.').match(/([0-9]+(\.[0-9]+)?)/);
        return match ? parseFloat(match[1]) : 0;
      };

      const existingItem = this.items.find(item => item.id === product.id);
      // Fallback definitivo para imagen principal
      let image = product.image || product.main_image_url;
      if (!image || typeof image !== 'string' || image.trim() === '' || image === 'undefined' || image === 'null') {
        image = '/images/logo.png';
      }
      // Solo guardamos nombre, precio, cantidad e imagen principal
      const cleanProduct = {
        id: product.id,
        name: product.name || product.nombre || '',
        price: parsePrecio(product.price),
        quantity: product.quantity || 1,
        image
      };

      if (existingItem) {
        // Suma la cantidad
        existingItem.quantity += (product.quantity || 1);
        // Actualiza nombre, precio e imagen por si cambiaron
        existingItem.name = cleanProduct.name;
        existingItem.price = cleanProduct.price;
        existingItem.image = cleanProduct.image;
      } else {
        // Add new item
        this.items.push(cleanProduct);
      }

      // Provide feedback
      this.showNotification(`${cleanProduct.name} añadido al carrito`);
    },
    addToCart(product) {
      this.cartItems.push({
        ...product,
        selected: false // <-- importante
      })
    },
    updateItemQuantity(productId, quantity) {
      const itemIndex = this.items.findIndex(item => item.id === productId);
      if (itemIndex !== -1) {
        this.items[itemIndex].quantity = quantity;
      }
    },
    
    removeItem(productId) {
      const itemIndex = this.items.findIndex(item => item.id === productId);
      if (itemIndex !== -1) {
        const removedItem = this.items[itemIndex];
        this.items.splice(itemIndex, 1);
        
        // Provide feedback
        this.showNotification(`${removedItem.name} eliminado del carrito`);
      }
    },
    
    clearCart() {
      this.items = [];
    },
    
    showNotification(message) {
      // This would be replaced with a proper notification system
    },

    // getter
  },
    persist: true
  

});