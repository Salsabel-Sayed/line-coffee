import { useCart } from "../context/CartContext";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY!;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY!;

export default function ConfirmOrderPage() {
    const { cartItems, clearCart } = useCart();
    const [confirmed, setConfirmed] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("");

    const location = useLocation();
    const {
        couponDiscount = 0,
        walletAmount = 0,
        finalTotal = 0,
        couponCode = "",
    } = location.state || {};

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const getDecryptedToken = () => {
        const encrypted = localStorage.getItem(TOKEN_KEY);
        if (!encrypted) return null;
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (err) {
            console.error("Failed to decrypt token:", err);
            return null;
        }
    };

    const handleConfirm = async () => {
        if (!selectedPayment) {
            alert("Please select a payment method");
            return;
        }

        const token = getDecryptedToken();
        if (!token) {
            alert("User not authenticated");
            return;
        }

        try {
            const createRes = await fetch("https://line-coffee.onrender.com/orders/createOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        product: item.id,
                        quantity: item.quantity,
                    })),
                    couponCode,
                    walletAmount,
                }),
            });

            const created = await createRes.json();
            if (!created.success) throw new Error("Order creation failed");

            const orderId = created.order._id;

            const completeRes = await fetch(`https://line-coffee.onrender.com/orders/completeOrder/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    paymentMethod: selectedPayment,
                    walletAmount,
                }),
            });

            const completeData = await completeRes.json();
            console.log("✅ Order completed", completeData);

            setConfirmed(true);
            clearCart();
        } catch (err) {
            console.error("❌ Error confirming order:", err);
            alert("Failed to confirm order.");
        }
    };

    if (confirmed) {
        return (
            <div className="container mt-5 text-center">
                <h2>🎉 Order Confirmed!</h2>
                <p>Your order has been successfully placed.</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🧾 Confirm Your Order</h2>
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card p-3 mb-4 shadow-sm">
                        <h5>📍 Shipping Address</h5>
                        <p className="text-muted mb-0">123 Street Name, Cairo, Egypt</p>
                    </div>

                    <div className="list-group">
                        {cartItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                image={item.image}
                                name={item.name}
                                price={item.price * item.quantity}
                                quantity={item.quantity}
                                onRemove={() => { }}
                                onQuantityChange={() => { }}
                            />
                        ))}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card p-3 shadow-sm">
                        <h5>Order Summary</h5>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Subtotal</span>
                                <strong>{subtotal} EGP</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Coupon Discount</span>
                                <span>- {couponDiscount} EGP</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Wallet Used</span>
                                <span>- {walletAmount} EGP</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <strong>Total</strong>
                                <strong>{finalTotal} EGP</strong>
                            </li>
                        </ul>

                        <div className="mb-3">
                            <label className="form-label">Payment Method</label>
                            <select
                                className="form-select"
                                value={selectedPayment}
                                onChange={(e) => setSelectedPayment(e.target.value)}
                            >
                                <option value="">Select payment method</option>
                                <option value="cash">Cash on Delivery</option>
                                <option value="vodafone">Vodafone Cash</option>
                                <option value="insta">Bank Transfer</option>
                            </select>
                        </div>

                        <button className="btn btn-success w-100" onClick={handleConfirm}>
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
