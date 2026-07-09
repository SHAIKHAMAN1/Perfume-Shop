import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Wishlist store — persisted to localStorage.
 * Stores minimal product data so the wishlist page can render offline
 * without needing an extra API call.
 */
const useWishlistStore = create(
  persist(
    (set, get) => ({
      /**
       * Array of minimal product objects:
       * { _id, name, slug, image, price, brand }
       */
      items: [],

      /** Check if a product is wishlisted by ID */
      isWishlisted: (productId) =>
        get().items.some((i) => String(i._id) === String(productId)),

      /**
       * Toggle a product in/out of the wishlist.
       * Pass the full product object when adding so we can display it.
       */
      toggle: (productId, product = null) => {
        const id = String(productId);
        set((state) => {
          const already = state.items.some((i) => String(i._id) === id);
          if (already) {
            return { items: state.items.filter((i) => String(i._id) !== id) };
          }
          // Build minimal item — use passed product or fallback to id-only
          const item = product
            ? {
                _id   : id,
                name  : product.name ?? "",
                slug  : product.slug ?? "",
                image : product.images?.[0] ?? product.image ?? "",
                price : product.salePrice ?? product.price ?? 0,
                brand : product.brand?.name ?? product.brand ?? "",
              }
            : { _id: id };
          return { items: [...state.items, item] };
        });
      },

      /** Remove by ID */
      remove: (productId) => {
        const id = String(productId);
        set((state) => ({ items: state.items.filter((i) => String(i._id) !== id) }));
      },

      /** Replace local state with server wishlist (full objects) */
      hydrateFromServer: (products) => {
        set({ items: (products ?? []).map((p) => ({
          _id  : String(p._id),
          name : p.name,
          slug : p.slug,
          image: p.images?.[0] ?? "",
          price: p.salePrice ?? p.price ?? 0,
          brand: p.brand?.name ?? "",
        })) });
      },

      /** Total count */
      count: () => get().items.length,
    }),
    { name: "lps-wishlist" }
  )
);

export default useWishlistStore;
