import { create } from "zustand";
import { delay } from "@/utils/delay";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { COUPONS } from "@/utils/coupons";

const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title,
  price: product.price,
  thumbnail: product.thumbnail,
  discountPercentage: product.discountPercentage || 0,
  quantity: 1,
  url: `/product/${product.id}`,
});

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      loadingItems: {},
      coupon: null,
      couponDiscount: 0,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addToCart: async (product) => {
        set((state) => ({
          loadingItems: { ...state.loadingItems, [product.id]: true },
        }));

        await delay(800);

        const existing = get().cart.find((item) => item.id === product.id);

        if (existing) {
          set({
            cart: get().cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
          toast.success(`${product.title} quantity updated!`);
        } else {
          const normalized = normalizeProduct(product);

          set({
            cart: [...get().cart, normalized],
          });
          toast.success(`${product.title} added to cart!`);
        }

        set((state) => {
          const updated = { ...state.loadingItems };
          delete updated[product.id];

          return {
            loadingItems: updated,
            isCartOpen: true,
          };
        });
      },

      removeFromCart: async (id) => {
        set((state) => ({
          loadingItems: { ...state.loadingItems, [id]: true },
        }));

        await delay(500);

        const product = get().cart.find((item) => item.id === id);
        const productTitle = product?.title || "Product";

        set((state) => {
          const updated = { ...state.loadingItems };
          delete updated[id];

          return {
            cart: state.cart.filter((item) => item.id !== id),
            loadingItems: updated,
          };
        });

        toast.error(`${productTitle} removed from cart`);
      },

      updateQuantity: async (id, quantity) => {
        set((state) => ({
          loadingItems: { ...state.loadingItems, [id]: true },
        }));

        await delay(400);

        set((state) => {
          const updated = { ...state.loadingItems };
          delete updated[id];

          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
            loadingItems: updated,
          };
        });
      },
      applyCoupon: async (code) => {
        const found = COUPONS.find((c) => c.code === code.toUpperCase());

        if (!found) {
          return { success: false, message: "Invalid coupon" };
        }

        set({
          coupon: found.code,
          couponDiscount: found.discount,
        });

        toast.success(`Coupon ${found.code} applied!`);

        return { success: true };
      },
      removeCoupon: () => {
        set({
          coupon: null,
          couponDiscount: 0,
        });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        coupon: state.coupon,
        couponDiscount: state.couponDiscount,
      }),
    },
  ),
);
