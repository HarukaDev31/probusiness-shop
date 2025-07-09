import { apiClient } from '~/utils/api-client'

class ProductService {
    async getProducts() {
        try {
            const data = await apiClient.api('/products?per_category=10&all_categories=true')
            return data.data
        } catch (error) {
            console.error('Error al obtener productos:', error)
            throw new Error(error.message || 'Error de conexión con el servidor')
        }
    }
    
    async getProductsByCategory(categorySlug, currentPage = 1) {
        try {
            const data = await apiClient.api(`/products?category=${categorySlug}&per_category=50&current_page=${currentPage}`)
            return {
                data: data.data,
                total: data.meta?.total
            }
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error)
            throw new Error(error.message || 'Error de conexión con el servidor')
        }
    }
    
    async getProductById(id) {
        try {
            const data = await apiClient.api(`/products/${id}`)
            return data.data
        } catch (error) {
            console.error('Error al obtener producto:', error)
            throw new Error(error.message || 'Error de conexión con el servidor')
        }
    }
    
    async getRelatedProducts(category) {
        try {
            const data = await apiClient.api(`/products?category=${category}&per_category=10`)
            return data.data
        } catch (error) {
            console.error('Error al obtener productos relacionados:', error)
            throw new Error(error.message || 'Error de conexión con el servidor')
        }
    }
    
    async getProductBySupplierId(supplierId) {
        try {
            const data = await apiClient.api(`/products?supplier=${supplierId}&per_category=10`)
            return data.data
        } catch (error) {
            console.error('Error al obtener productos por proveedor:', error)
            throw new Error(error.message || 'Error de conexión con el servidor')
        }
    }
    
    async searchProducts(searchTerm, currentPage = 1) {
        try {
            const data = await apiClient.api(`/products?search=${searchTerm}&per_category=50&current_page=${currentPage}`)
            return { data: data.data, total: data.meta.total }
        } catch (error) {
            console.error('Error al buscar productos:', error)
            throw new Error(error.message || 'Error de conexión con el servidor')
        }
    }
}

export const productService = new ProductService()