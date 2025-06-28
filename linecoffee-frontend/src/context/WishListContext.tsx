// WishListContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Define product types
type Product = {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    averageRating?: number;
};

type RawProductFromBackend = {
    _id: string;
    productsName: string;
    price: number;
    imageUrl?: string;
    averageRating?: number;
    productsDescription?: string;
};

type WishListContextType = {
    wishList: Product[];
    toggleWish: (product: Product) => void;
};

// Create context
const WishListContext = createContext<WishListContextType>({
    wishList: [],
    toggleWish: () => { },
});

// Provider
export const WishListProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishList, setWishList] = useState<Product[]>([]);

    // ✅ Load wishlist from backend
    useEffect(() => {
        axios
            .get("https://line-coffee.onrender.com/wishList/wishlist/me", {
                withCredentials: true,
            })
            .then((res) => {
                const mapped = res.data.wishlist.map((p: RawProductFromBackend) => ({
                    id: p._id,
                    name: p.productsName,
                    price: p.price,
                    image: p.imageUrl,
                    averageRating: p.averageRating,
                    description: p.productsDescription,
                }));
                setWishList(mapped);
            })
            .catch((err) => {
                console.log("🟡 Not logged in or failed to fetch wishlist",err);
            });
    }, []);

    // ✅ Toggle wish product
    const toggleWish = async (product: Product) => {
        try {
            await axios.post(
                "https://line-coffee.onrender.com/wishList/toggleWishlist",
                {
                    productId: product.id,
                },
                { withCredentials: true }
            );

            const exists = wishList.find((p) => p.id === product.id);

            if (exists) {
                setWishList((prev) => prev.filter((p) => p.id !== product.id));
            } else {
                setWishList((prev) => [...prev, product]);
            }
        } catch (err) {
            console.error("❌ Error toggling wishlist item:", err);
        }
    };

    return (
        <WishListContext.Provider value={{ wishList, toggleWish }}>
            {children}
        </WishListContext.Provider>
    );
};

// Hook
export const useWishList = () => useContext(WishListContext);
