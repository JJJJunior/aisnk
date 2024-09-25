import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { CartItemType } from "../types";

interface CartStore {
  cartItems: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (idToRemove: number) => void;
  increaseQuantity: (idToIncrease: number) => void;
  decreaseQuantity: (idToDecrease: number) => void;
  clearCart: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItemType) => {
        const { item, quantity, color, size } = data;
        const currentItems = get().cartItems;
        const isExisting = currentItems.find((cartItem) => cartItem.item.id === item.id);
        if (isExisting) {
          return toast("Item already in cart ❤️");
        }
        set({ cartItems: [...currentItems, { item, quantity, color, size }] });
        toast.success("👟 Item added to cart");
      },
      removeItem: (idToRemove: number) => {
        const newCartItems = get().cartItems.filter((cartItem) => cartItem.item.id !== idToRemove);
        set({ cartItems: newCartItems });
        toast.success("Item removed from cart");
      },
      increaseQuantity: (idToIncrease: number) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item.id === idToIncrease ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
        set({ cartItems: newCartItems });
        toast.success("Quantity increased");
      },
      decreaseQuantity: (idToDecrease: number) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item.id === idToDecrease ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        );
        set({ cartItems: newCartItems });
        toast.success("Quantity decreased");
      },
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
