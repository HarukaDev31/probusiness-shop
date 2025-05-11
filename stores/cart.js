import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
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
    }
  },

  actions: {
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        this.updateItemQuantity(existingItem.id, existingItem.quantity + (product.quantity || 1));
      } else {
        // Add new item
        this.items.push({
          ...product,
          quantity: product.quantity || 1
        });
      }
      
      // Provide feedback
      this.showNotification(`${product.name} añadido al carrito`);
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
      console.log(message);
    }
  },
  
  persist: true
});