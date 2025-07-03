class ProductService {
    async getProducts() {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products?per_category=10&all_categories=true`);
        const data = await response.json();
        return data.data;
    }
    async getProductsByCategory(categorySlug, currentPage = 1) {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products?category=${categorySlug}&per_category=50&current_page=${currentPage}`);
        const data = await response.json();
        return {
            data: data.data,
            total: data.meta?.total
        }
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
    async searchProducts(searchTerm, currentPage = 1) {
        const { public: { apiUrl } } = useRuntimeConfig();
        const response = await fetch(`${apiUrl}/products?search=${searchTerm}&per_category=50&current_page=${currentPage}`);
        const data = await response.json();
        return { data: data.data, total: data.meta.total };
    }
}
export const productService = new ProductService();