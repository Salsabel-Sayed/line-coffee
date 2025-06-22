// ProductsPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import ProductsList from "./ProductsList";

type Product = {
    _id: string;
    productsName: string;
    imageUrl: string;
    price: number;
    productsDescription: string;
    category: string;
};

type Category = {
    _id: string;
    categoryName: string;
};

function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredAndSearchedProducts = filteredProducts.filter((p) =>
        p.productsName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get("http://localhost:5000/products/getAllProducts"),
                    axios.get("http://localhost:5000/categories/getAllCategories")
                ]);
                setProducts(productsRes.data.products);
                setCategories(categoriesRes.data.categories);
                setFilteredProducts(productsRes.data.products); // default
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFilter = (categoryId: string) => {
        setSelectedCategory(categoryId);
        if (categoryId === "all") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === categoryId));
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar / Categories */}
                <div className="col-12 col-md-3 mb-3 mb-md-0">
                    <div className="bg-light p-3 rounded shadow-sm">
                        <h5 className="mb-3">Categories</h5>
                        <ul className="list-group">
                            <li
                                className={`list-group-item ${selectedCategory === "all" ? "active" : ""}`}
                                onClick={() => handleFilter("all")}
                                role="button"
                            >
                                All
                            </li>
                            {categories.map((cat) => (
                                <li
                                    key={cat._id}
                                    className={`list-group-item ${selectedCategory === cat._id ? "active" : ""}`}
                                    onClick={() => handleFilter(cat._id)}
                                    role="button"
                                >
                                    {cat.categoryName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Products Area */}
                <div className="col-12 col-md-9">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="🔍 Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <ProductsList
                        products={filteredAndSearchedProducts.map((p) => ({
                            id: p._id,
                            name: p.productsName,
                            image: `http://localhost:5000${p.imageUrl}`,
                            price: p.price,
                            description: p.productsDescription,
                        }))}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;
