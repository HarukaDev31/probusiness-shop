import { defineStore } from 'pinia';

// Constante para el mínimo de productos por item
const MIN_QUANTITY_PER_ITEM = 1;

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
      // Obtener imagen del producto
      let image = product.image || product.main_image_url;
      
      // Si no hay imagen principal, intentar usar la primera del array media
      if ((!image || typeof image !== 'string' || image.trim() === '' || image === 'undefined' || image === 'null') && product.media && Array.isArray(product.media) && product.media.length > 0) {
        const firstMedia = product.media[0];
        if (firstMedia.url) {
          image = firstMedia.url;
        }
      }
      
      // Fallback definitivo
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
        // Validar que la cantidad no sea menor al mínimo establecido
        if (quantity < MIN_QUANTITY_PER_ITEM) {
          this.items[itemIndex].quantity = MIN_QUANTITY_PER_ITEM;
        } else {
          this.items[itemIndex].quantity = quantity;
        }
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
  persist: {
    storage: localStorage,
    key: 'cart-store'
  }
});