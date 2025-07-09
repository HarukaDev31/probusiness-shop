export default defineNuxtPlugin(() => {
  // Función para detectar si una URL es de Alibaba
  const isAlibabaImage = (url) => {
    if (!url) return false;
    return url.includes('alicdn.com') || 
           url.includes('alibaba.com') || 
           url.includes('sc01.alicdn.com') ||
           url.includes('sc02.alicdn.com') ||
           url.includes('sc03.alicdn.com') ||
           url.includes('sc04.alicdn.com') ||
           url.includes('s.alicdn.com');
  };

  // Función para crear una imagen directa sin procesar
  const createDirectImage = (src, alt, className = '') => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    if (className) img.className = className;
    img.loading = 'lazy';
    return img;
  };

  // Proporcionar utilidades globales
  return {
    provide: {
      isAlibabaImage,
      createDirectImage
    }
  };
}); 