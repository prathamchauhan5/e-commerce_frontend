import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserActivityStore = create(
  persist(
    (set, get) => ({
      searches: [],
      categories: [],
      viewedProducts: [],

      addSearch: (query) => {
        if (!query) return;

        const existing = get().searches.filter((q) => q !== query);

        set({
          searches: [query, ...existing].slice(0, 5),
        });
      },

      addCategory: (category) => {
        if (!category) return;

        const existing = get().categories.filter((c) => c !== category);

        set({
          categories: [category, ...existing].slice(0, 5),
        });
      },

      addViewedProduct: (product) => {
        if (!product) return;
        const existing = get().viewedProducts.filter(
          (p) => p.id !== product.id,
        );

        set({
          viewedProducts: [product, ...existing].slice(0, 8),
        });
      },
    }),
    {
      name: "user-activity",
    },
  ),
);
