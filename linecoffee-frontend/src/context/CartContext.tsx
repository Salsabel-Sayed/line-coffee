import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Product = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};


type CartContextType = {
    cartItems: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    updateQuantity: (id: string, quantity: number) => void; // ✅ أضفناها هنا
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        const existing = cartItems.find(p => p.id === product.id);
        if (existing) {
            setCartItems(
                cartItems.map(p =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: string) => {
        setCartItems(cartItems.filter(p => p.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQuantity = (id: string, quantity: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
