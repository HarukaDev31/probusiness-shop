export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatPrice: (price) => {
        if (price === null || price === undefined || isNaN(price)) {
          return 'S/ 0.00';
        }
        
        // Convertir a número si es string
        const numericPrice = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price;
        
        // Formatear con separadores de miles y dos decimales
        return new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(numericPrice);
      }
    }
  }
}) 