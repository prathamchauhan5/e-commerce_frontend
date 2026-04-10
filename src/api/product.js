import { apiClient } from "./client";

export const getProducts = (params) => {
  return apiClient("/products", { params });
};

export const searchProducts = (query) => {
  return apiClient("/products/search", {
    params: { q: query },
  });
};

export const getProductById = (id) => {
  return apiClient(`/products/${id}`);
};

export const getCategories = () => {
  return apiClient("/products/categories");
};

export const getProductsByCategory = (category, params) => {
  return apiClient(`/products/category/${category}`, { params });
};

export const getAllCategories = () => {
  return apiClient("/products/category-list");
};
