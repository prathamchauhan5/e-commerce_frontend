import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title,
  price: product.price,
  discountPercentage: product.discountPercentage || 0,
  thumbnail: product.thumbnail,
  url: `/product/${product.id}`,
});

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],

      toggleWishlist: (product) => {
        const exists = get().wishlist.find(
          (item) => item.id === product.id
        );

        if (exists) {
          set({
            wishlist: get().wishlist.filter(
              (item) => item.id !== product.id
            ),
          });
          toast.success("Removed from wishlist");
        } else {
          const normalized = normalizeProduct(product);

          set({
            wishlist: [normalized, ...get().wishlist],
          });
          toast.success("Added to wishlist");
        }
      },

      isInWishlist: (id) => {
        return get().wishlist.some((item) => item.id === id);
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);