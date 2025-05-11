class ProductService {
    async getProducts() {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products?per_category=5`);
        const data = await response.json();
        return data.data;
    }
    async getProductsByCategory(categorySlug) {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products?category=${categorySlug}&per_category=all`);
        const data = await response.json();
        return data.data;
    }
    async getProductById(id) {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products/${id}`);
        const data = await response.json();
        return data.data;
    }
    async getRelatedProducts(category) {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products?category=${category}&per_category=4`);
        const data = await response.json();
        return data.data;
    }
    async searchProducts(searchTerm) {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products?search=${searchTerm}`);
        const data = await response.json();
        return data.data;
    }
}
export const productService = new ProductService();