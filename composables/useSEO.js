export const useSEO = () => {
  const setSEO = (options) => {
    const { title, description, keywords, image, url, type = 'website' } = options
    
    // Actualizar título
    if (title) {
      useHead({
        title: `${title} | ProBusiness`,
        meta: [
          { name: 'description', content: description || 'ProBusiness - Tu tienda online de confianza para productos de importación' },
          { name: 'keywords', content: keywords || 'tienda online, importación, productos, Perú' },
          // Open Graph
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:image', content: image || '/images/logo.png' },
          { property: 'og:url', content: url || 'https://tienda.probusiness.pe' },
          { property: 'og:type', content: type },
          // Twitter Card
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: image || '/images/logo.png' },
          { name: 'twitter:card', content: 'summary_large_image' }
        ]
      })
    }
  }

  const setProductSEO = (product) => {
    if (!product) return
    
    const title = `${product.name} | ProBusiness`
    const description = product.description || `Compra ${product.name} al mejor precio. Envío a todo Perú.`
    const image = product.image || product.main_image_url || '/images/logo.png'
    const url = `https://tienda.probusiness.pe/product/${product.id}`
    
    setSEO({
      title,
      description,
      keywords: `${product.name}, ${product.category_name || 'producto'}, importación, Perú`,
      image,
      url,
      type: 'product'
    })
  }

  const setCategorySEO = (category) => {
    if (!category) return
    
    const title = `${category.name} | ProBusiness`
    const description = `Explora nuestra colección de ${category.name}. Productos de calidad con envío a todo Perú.`
    const url = `https://tienda.probusiness.pe/category/${category.slug}`
    
    setSEO({
      title,
      description,
      keywords: `${category.name}, productos, importación, Perú`,
      url
    })
  }

  return {
    setSEO,
    setProductSEO,
    setCategorySEO
  }
} 