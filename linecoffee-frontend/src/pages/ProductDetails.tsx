// ProductDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fullStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";
import { toast } from "react-toastify";

// Types
interface Review {
  user: string;
  rating: number;
  comment: string;
}

interface Product {
  _id: string;
  productsName: string;
  productsDescription?: string;
  price: number;
  imageUrl?: string;
  averageRating?: number;
}

// Render display stars (not interactive)
function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];

  for (let i = 0; i < full; i++) {
    stars.push(<FontAwesomeIcon key={`full-${i}`} icon={fullStar} className="text-warning" />);
  }

  if (half) {
    stars.push(<FontAwesomeIcon key="half" icon={fullStar} className="text-warning opacity-50" />);
  }

  while (stars.length < 5) {
    stars.push(<FontAwesomeIcon key={`empty-${stars.length}`} icon={emptyStar} className="text-warning" />);
  }

  return stars;
}

// StarRatingInput
function StarRatingInput({ rating, setRating }: { rating: number; setRating: (val: number) => void }) {
  return (
    <div className="fs-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={() => setRating(star)} style={{ cursor: "pointer" }}>
          <FontAwesomeIcon icon={star <= rating ? fullStar : emptyStar} className="me-1 text-warning" />
        </span>
      ))}
    </div>
  );
}

// Main Component
export default function ProductDetails() {
  // const { id } = useParams<{ id: string }>();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { addToCart } = useCart();
  const { toggleWish, wishList } = useWishList();
  const inWishList = product
    ? wishList.some((p: { id: string }) => p.id === product._id)
    : false;




  

  useEffect(() => {
    console.log("🚀 productId from URL:", productId);

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://line-coffee.onrender.com/products/getProductById/${productId}`, { withCredentials: true }
        );
        setProduct(res.data.product);
        console.log("res.data",res.data.product);
        
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`https://line-coffee.onrender.com/reviews/getProductReviews/${productId}`, { withCredentials: true }
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    if (productId) {
      fetchProduct();
      fetchReviews();
    }
  }, [productId]);

  const handleReviewSubmit = async () => {
   

    try {
      await axios.post(
        `https://line-coffee.onrender.com/reviews/addReview`,
        { productId , rating, comment },
        { withCredentials: true },
      );
      alert("Review submitted!");
      setRating(0);
      setComment("");
      const res = await axios.get(`https://line-coffee.onrender.com/reviews/getProductReviews/${productId}`, 
        { withCredentials: true });
      setReviews(res.data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      alert(err.response?.data?.message || "Error submitting review");
    }
  };
  const handleAddToCart = () => {
    axios.get("https://line-coffee.onrender.com/users/getMe", { withCredentials: true })
      .then(() => {
        if (product) {
          const formattedProduct = {
            id: product._id,
            name: product.productsName,
            image: product.imageUrl || "",
            price: product.price,
            quantity: 1
          };

          addToCart(formattedProduct);
          toast.success("تمت الإضافة إلى السلة!");
        }
      })
      .catch(() => {
        toast.warning("برجاء تسجيل الدخول أولاً");
        navigate("/login");
      });

    
  };

  const handleToggleWish = async () => {
    try {
      // مش هتحتاجي token من localStorage خالص
      const res = await axios.post("https://line-coffee.onrender.com/wishlist/toggleWishlist", { productId }, {
        withCredentials: true
      });
      
    console.log("res wishlist",res);
    


      toggleWish({
        id: product?._id || "",
        name: product?.productsName || "",
        image: product?.imageUrl || "",
        price: product?.price || 0,
      });

      toast.success("تمت الإضافة/الإزالة من المفضلة");
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  
  

  if (!product) return <div className="container mt-5">Product not found!</div>;

  return (
    <div className="container my-5">
      <div className="row gy-4 align-items-start flex-column flex-md-row">
        <div className="col-md-6 text-center">
          <img src={product.imageUrl} alt={product.productsName} className="img-fluid rounded shadow" style={{ maxHeight: "400px", objectFit: "contain" }} />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{product.productsName}</h2>
          <p className="mt-3">{product.productsDescription}</p>
          <div className="d-flex align-items-center my-2">
            {renderStars(product.averageRating ?? 0)}
            <span className="ms-2 text-muted">({(product.averageRating ?? 0).toFixed(1)})</span>

          </div>
          <h4 className="fw-bold text-success mb-3">{product.price} EGP</h4>
          <button
            className={`btn btn-sm ${inWishList ? "btn-warning" : "btn-outline-warning"} me-2`}
            onClick={handleToggleWish}
          >
            {inWishList ? "★ Remove" : "☆ WishList"}
          </button>


          <button className="btn btn-success" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>

        </div>
      </div>

      <hr className="my-5" />

      <div className="mt-5">
        <h4 className="mb-3">Customer Reviews</h4>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border rounded p-3 mb-3 shadow-sm">
              <div className="d-flex justify-content-between">
                <strong>{review.user}</strong>
                <div>{renderStars(review.rating)}</div>
              </div>
              <p className="mb-0 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-5">
        <h5>Add Your Review</h5>
        <StarRatingInput rating={rating} setRating={setRating} />
        <textarea
          className="form-control mt-3"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
        />
        <button className="btn btn-primary mt-3" onClick={handleReviewSubmit}>
          Submit Review
        </button>
      </div>
    </div>
  );
}
