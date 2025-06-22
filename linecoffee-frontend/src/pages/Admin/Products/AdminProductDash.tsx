
import { useState } from "react";
import ProductList from "./ProductsList";



export default function AdminProductsDash() {
    const [section, setSection] = useState("products");

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-12 col-md-3 mb-3">
                    <div className="list-group">
                        <button className={`list-group-item list-group-item-action ${section === "products" ? "active" : ""}`} onClick={() => setSection("products")}>
                            🛍 Products
                        </button>
                        <button className="list-group-item list-group-item-action" onClick={() => setSection("notifications")}>
                            🔔 Notifications
                        </button>
                        <button className="list-group-item list-group-item-action" onClick={() => setSection("reports")}>
                            🧾 Reports
                        </button>
                        <button className="list-group-item list-group-item-action" onClick={() => setSection("wallets")}>
                            💰 Wallets & Coins
                        </button>
                        <button className="list-group-item list-group-item-action" onClick={() => setSection("support")}>
                            🧑‍💬 User Reports
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-12 col-md-9">
                    {section === "products" && <ProductList />}
                    {/* باقي الأقسام هنكملها بعدين زي NotificationManager, WalletManager... */}
                </div>
            </div>
        </div>
    );
}
