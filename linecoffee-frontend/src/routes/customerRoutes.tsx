import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
// import ProductsList from "../pages/ProductsBase";
import ProductDetails from "../pages/ProductDetails";
import MainLayout from "../layouts/MainLayout";
import UserProfile from "../pages/UserProfile";
import ProductsPage from "../pages/ProductPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import WishListPage from "../pages/WishListPage";
import CartPage from "../pages/CartPage";
import ConfirmOrderPage from "../pages/OrderConfimation";
import AdminLayout from "../pages/Admin/AdminLayout";



export default function CustomerRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                {/* <Route path="/products" element={<ProductsList />} /> */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/profile/" element={<UserProfile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/wishlist" element={<WishListPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/confirm-order" element={<ConfirmOrderPage />} />


                 <Route path="/admin" element={<AdminLayout />} />

              
            </Route>
        </Routes>
    );
}
