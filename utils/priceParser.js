export const parseQuantityRange = (quantityRange) => {
  const trimmed = quantityRange.trim();
  
  // Caso 1: Rango "20 - 59 conjuntos"
  const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return {
      type: 'range',
      min: parseInt(rangeMatch[1]),
      max: parseInt(rangeMatch[2])
    };
  }

  // Caso 2: Mínimo ">= 180 conjuntos"
  const minMatch = trimmed.match(/^>=\s*(\d+)/);
  if (minMatch) {
    return {
      type: 'min',
      min: parseInt(minMatch[1])
    };
  }

  // Caso 3: Cantidad fija "100 conjuntos"
  const fixedMatch = trimmed.match(/^(\d+)/);
  if (fixedMatch) {
    const val = parseInt(fixedMatch[1]);
    return {
      type: 'fixed',
      min: val,
      max: val
    };
  }

  return null;
};

// Función para formatear precios en formato de dinero peruano
export const formatPrice = (price) => {
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
};