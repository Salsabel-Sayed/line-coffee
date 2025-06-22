// ProductsList.tsx

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fullStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";


// Define Product type
type Product = {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    averageRating?: number;
};


// Props for the list
type ProductsListProps = {
    products: Product[];
};

function ProductsList({ products }: ProductsListProps) {
    const { toggleWish, wishList } = useWishList();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (product: Product) => {
        const token = localStorage.getItem("linecoffeeToken");
        if (!token) {
            toast.warning("برجاء تسجيل الدخول أولاً");
            return navigate("/login");
        }

        addToCart({ ...product, quantity: 1 });
    };
    

    const handleToggleWish = (product: Product) => {
        const token = localStorage.getItem("linecoffeeToken");
        if (!token) {
            toast.warning("برجاء تسجيل الدخول أولاً");
            return navigate("/login");
        }

        toggleWish(product);
    };
    

    return (
        <div className="container-fluid">
            <div className="row">
                {products.map((product) => {
                    const inWishList = wishList.some((p) => p.id === product.id);

                    return (
                        <div key={product.id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{ height: "250px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{product.name}</h5>
                                    <p className="card-text text-truncate">{product.description}</p>
                                    <p className="card-text fw-bold text-primary">{product.price} EGP</p>

                                    {/* Render star rating */}
                                    <div className="mb-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <FontAwesomeIcon
                                                key={i}
                                                icon={i <= Math.round(product.averageRating || 0) ? fullStar : emptyStar}
                                                className="text-warning me-1"
                                            />
                                        ))}
                                    </div>

                                    {/* Wishlist button */}
                                    <button
                                        className={`btn btn-sm ${inWishList ? "btn-warning" : "btn-outline-warning"} me-2`}
                                        onClick={() => handleToggleWish(product)}
                                    >
                                        {inWishList ? "★ Remove" : "☆ WishList"}
                                    </button>

                                    {/* Cart button */}
                                    <button
                                        className="btn btn-sm btn-outline-success me-2"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        ➕ Add to Cart
                                    </button>

                                    {/* View product */}
                                    <Link to={`/product/${product.id}`} className="btn btn-sm btn-primary">
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProductsList;
