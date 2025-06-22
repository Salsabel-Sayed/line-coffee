import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Product = {
    _id: string;
    productsName: string;
    imageUrl?: string;
    price: number;
    productsDescription: string;
};

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:5000/products/getAllProducts")
            .then((response) => setProducts(response.data.products))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/products/deleteProduct/${id}`);
            setProducts(products.filter((product) => product._id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={() => navigate("/admin/add-product")}>
                    ➕ Add Product
                </button>
            </div>

            <div className="row">
                {products.map((product) => (
                    <div key={product._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={`http://localhost:5000${product.imageUrl}`}
                                alt={product.productsName}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.productsName}</h5>
                                <p className="card-text text-truncate">{product.productsDescription}</p>
                                <p className="fw-bold">{product.price} EGP</p>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
