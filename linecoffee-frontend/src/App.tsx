import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import MainNavbar from './pages/NavBar'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import { LanguageProvider } from './Providers/LangugeProvider'
import './Styles/customStyles.css';
// import ProductsBase from './pages/ProductsBase'
import UserProfile from './pages/UserProfile'
import ProductsPage from './pages/ProductPage'
import Register from './pages/Register'
import Login from './pages/Login'
import { CartProvider } from './context/CartContext';
import { WishListProvider } from './context/WishListContext';
import WishListPage from './pages/WishListPage'
import CartPage from './pages/CartPage'
import ConfirmOrderPage from './pages/OrderConfimation';
import AdminLayout from './pages/Admin/AdminLayout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from './pages/Admin/Products/ProductsForm'
import AdminProductsDash from './pages/Admin/Products/AdminProductDash'
import PaymentsSection from './pages/Admin/Payments/PaymentsSection'
import NotificationWrapper from './pages/NotificationWarapper'





function App() {
  return (
    <>
     
      <ToastContainer />
        <LanguageProvider>
        <WishListProvider>
          <CartProvider>
          <BrowserRouter>
        <MainNavbar />
        <div>
          <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/" element={<ProductsBase />} /> */}
              {/* <Route path="/products" element={<ProductsList />} /> */}
              <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:productId" element={<ProductDetails />} />
                  <Route path="/profile/" element={<UserProfile />} />
                  <Route path="/profile/notifications" element={<NotificationWrapper />} />



              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
                  <Route path="/wishlist" element={<WishListPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/confirm-order" element={<ConfirmOrderPage />} />
                  <Route path="/admin/payments" element={<PaymentsSection />} />

                  {/* <Route path="/orders" element={<OrdersList orders={yourOrdersArray} />} /> */}




                  {/*admin routes*/}
                   <Route path="/admin/" element={<AdminLayout />} />
                  <Route path="/admin/products" element={<AdminProductsDash />} />
                  <Route path="/admin/add-product" element={<ProductForm onBack={() => window.history.back()} />} />
                  {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
                  {/* <Route path="/admin/products" element={<ProductsAdmin />} />
                  <Route path="/admin/orders" element={<OrdersAdmin />} />
                  <Route path="/admin/users" element={<UsersAdmin />} /> */}

              
          </Routes>
        </div>
      </BrowserRouter>
          </CartProvider>
        </WishListProvider>
        </LanguageProvider>
      
      
      
    </>

  )
}

export default App
