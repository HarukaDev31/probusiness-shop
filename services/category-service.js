class CategoryService {
  async getCategories() {
    //get runtimeConfig variable
    const { public: { apiUrl } } = useRuntimeConfig();

    const response = await fetch(`${apiUrl}/categories`);
    
    const data = await response.json();
    return data.data;
  }
}
export const categoryService = new CategoryService();