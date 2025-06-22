// pages/WishListPage.tsx
import { useWishList } from "../context/WishListContext";

export default function WishListPage() {
    const { wishList, toggleWish } = useWishList();

    return (
        <div className="container mt-5">
            <h2>⭐ Your Wish List</h2>
            {wishList.length === 0 ? (
                <p>No items in wishlist.</p>
            ) : (
                <div className="row">
                    {wishList.map(product => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <div className="card">
                                <img src={product.image} className="card-img-top" />
                                <div className="card-body">
                                    <h5>{product.name}</h5>
                                    <p>{product.price} EGP</p>
                                    <button onClick={() => toggleWish(product)} className="btn btn-warning">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
