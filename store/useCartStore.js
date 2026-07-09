import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Cart store — persisted to localStorage.
 * Syncs with the server cart API when user is authenticated.
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /** Total item count (sum of quantities) */
      count: 0,

      /** Add a product to cart or increment quantity if already exists */
      addItem: (product, quantity = 1, volume = null) => {
        set((state) => {
          const key = `${product._id}-${volume}`;
          const existing = state.items.find(
            (i) => i._id === product._id && i.volume === volume
          );
          let newItems;
          if (existing) {
            newItems = state.items.map((i) =>
              i._id === product._id && i.volume === volume
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            newItems = [
              ...state.items,
              {
                _id      : product._id,
                name     : product.name,
                slug     : product.slug,
                image    : product.images?.[0] ?? "",
                price    : product.salePrice ?? product.price,
                brand    : product.brand?.name ?? "",
                volume,
                quantity,
              },
            ];
          }
          return {
            items: newItems,
            count: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      /** Remove an item completely from the cart */
      removeItem: (productId, volume = null) => {
        set((state) => {
          const newItems = state.items.filter(
            (i) => !(i._id === productId && i.volume === volume)
          );
          return {
            items: newItems,
            count: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      /** Update quantity of an item (removes if quantity < 1) */
      updateQuantity: (productId, volume, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, volume);
          return;
        }
        set((state) => {
          const newItems = state.items.map((i) =>
            i._id === productId && i.volume === volume
              ? { ...i, quantity }
              : i
          );
          return {
            items: newItems,
            count: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      /** Clear the entire cart */
      clearCart: () => set({ items: [], count: 0 }),

      /** Computed: subtotal */
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      /** Hydrate cart from server (replaces local state) */
      hydrateFromServer: (serverItems) => {
        const items = serverItems ?? [];
        set({ items, count: items.reduce((s, i) => s + i.quantity, 0) });
      },

      couponCode    : null,
      couponDiscount: 0,
      setCoupon: (code, discount) =>
        set({ couponCode: code, couponDiscount: discount }),
      clearCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
    }),
    {
      name: "lps-cart", // localStorage key
    }
  )
);

export default useCartStore;
