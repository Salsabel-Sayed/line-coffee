
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../pages/Admin/AdminLayout';



{/*admin routes*/ }

export default function CustomerRoutes() {
    return (
        <Routes>
            {/*admin routes*/}
            <Route path="/admin/" element={<AdminLayout />} />
            {/* <Route path="/admin/products" element={<ProductsAdmin />} />
            <Route path="/admin/orders" element={<OrdersAdmin />} />
            <Route path="/admin/users" element={<UsersAdmin />} /> */}
        </Routes>
    );
}