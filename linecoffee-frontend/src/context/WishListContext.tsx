import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

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

const WishListContext = createContext<WishListContextType>({
    wishList: [],
    toggleWish: () => { },
});

export const WishListProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishList, setWishList] = useState<Product[]>([]);
    const userId = localStorage.getItem("userId");

    // ✅ Load wishlist from backend
    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:5000/wishList/wishlist/${userId}`).then((res) => {
            const mapped = res.data.wishlist.map((p: RawProductFromBackend) => ({
                id: p._id,
                name: p.productsName,
                price: p.price,
                image: p.imageUrl,
                averageRating: p.averageRating,
                description: p.productsDescription,
            }));
            setWishList(mapped);
        });
    }, [userId]);

    // ✅ Toggle wish from backend
    const toggleWish = async (product: Product) => {
        if (!userId) return;

        const inList = wishList.find((p) => p.id === product.id);

        await axios.post("http://localhost:5000/wishList/toggleWishlist", {
            userId,
            productId: product.id,
        });

        if (inList) {
            setWishList((prev) => prev.filter((p) => p.id !== product.id));
        } else {
            setWishList((prev) => [...prev, product]);
        }
    };

    return (
        <WishListContext.Provider value={{ wishList, toggleWish }}>
            {children}
        </WishListContext.Provider>
    );
};

export const useWishList = () => useContext(WishListContext);
