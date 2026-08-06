import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, qty: i.qty + (item.qty || 1) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, qty: item.qty || 1 }] });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQty: (variantId, qty) => {
        if (qty <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      get totalAmount() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    {
      name: 'hpl-cart',
    }
  )
);

// Selector helpers for cleaner component usage
export const selectTotalAmount = (state) =>
  state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export const selectTotalItems = (state) =>
  state.items.reduce((sum, i) => sum + i.qty, 0);
