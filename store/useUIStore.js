import { create } from "zustand";

const useUIStore = create((set) => ({
  // Mobile navigation drawer
  mobileMenuOpen: false,
  openMobileMenu : () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  // Search overlay
  searchOpen: false,
  openSearch : () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  // Cart drawer (slide-in from right)
  cartOpen: false,
  openCart : () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),

  // Notification panel
  notificationsOpen: false,
  toggleNotifications: () =>
    set((s) => ({ notificationsOpen: !s.notificationsOpen })),

  // Global loading overlay (e.g. during checkout)
  globalLoading: false,
  setGlobalLoading: (v) => set({ globalLoading: v }),

  // Toast / snackbar queue
  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id: Date.now(), type: "success", duration: 3000, ...toast },
      ],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // Recently viewed product IDs (last 10)
  recentlyViewed: [],
  addRecentlyViewed: (productId) =>
    set((s) => {
      const id  = String(productId);
      const arr = [id, ...s.recentlyViewed.filter((i) => i !== id)].slice(0, 10);
      return { recentlyViewed: arr };
    }),
}));

export default useUIStore;
