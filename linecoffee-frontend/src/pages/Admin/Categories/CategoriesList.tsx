import { useEffect, useState } from "react";
import axios from "axios";
import CategoryForm from "./CategoriesForm";

type Category = {
    _id: string;
    categoryName: string;
    categoryDescription?: string;
    createdAt: string;
};

export default function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:5000/categories/getAllCategories");
            setCategories(res.data.categories);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(`http://localhost:5000/categories/deleteCategory/${id}`);
            setCategories(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            console.error("Error deleting category:", err);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setEditingCategory(null);
        setShowForm(false);
        fetchCategories();
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 fw-bold">🗂️ Manage Categories</h2>

            {showForm ? (
                <CategoryForm
                    onClose={handleFormClose}
                    existingCategory={editingCategory}
                />
            ) : (
                <>
                    <div className="d-flex justify-content-end mb-3">
                        <button
                            className="btn btn-success"
                            onClick={() => setShowForm(true)}
                        >
                            ➕ Add New Category
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped align-middle text-center">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat._id}>
                                            <td>{cat.categoryName}</td>
                                            <td>{cat.categoryDescription || "-"}</td>
                                            <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => handleEdit(cat)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(cat._id)}
                                                    >
                                                        🗑 Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
