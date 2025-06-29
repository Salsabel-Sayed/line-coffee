import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY!;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY!;

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [walletAmount, setWalletAmount] = useState(0);
    const [walletValid, setWalletValid] = useState(false);
    const [walletError, setWalletError] = useState("");
    const [finalTotal, setFinalTotal] = useState(0);
    const [coupon, setCoupon] = useState("");

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        const afterWallet = Math.max(subtotal - walletAmount, 0);
        const afterCoupon = Math.max(afterWallet - couponDiscount, 0);
        setFinalTotal(afterCoupon);
    }, [subtotal, walletAmount, couponDiscount]);

    // ✅ فك التوكن قبل الاستخدام
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

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🛒 Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>No items in cart.</p>
            ) : (
                <div className="row">
                    {/* 🟩 المنتجات */}
                    <div className="col-lg-8 mb-4">
                        <div className="list-group">
                            {cartItems.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    image={item.image}
                                    name={item.name}
                                    price={item.price * item.quantity}
                                    quantity={item.quantity}
                                    onRemove={() => removeFromCart(item.id)}
                                    onQuantityChange={(newQty) => updateQuantity(item.id, newQty)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 🟦 ملخص الطلب */}
                    <div className="col-lg-4">
                        <div className="card p-3 shadow-sm">
                            <h5>Order Summary</h5>

                            {/* الكوبون */}
                            <div className="mb-3">
                                <label htmlFor="coupon" className="form-label">
                                    Coupon Code
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="coupon"
                                        placeholder="Enter coupon"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                const token = getDecryptedToken();
                                                const res = await axios.post(
                                                    "https://line-coffee.onrender.com/coupons/validateCoupon",
                                                    {
                                                        couponCode: coupon,
                                                        totalAmount: subtotal,
                                                    },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                            "Content-Type": "application/json",
                                                        },
                                                    }
                                                );

                                                if (res.data.valid) {
                                                    setCouponDiscount(res.data.discountValue);
                                                } else {
                                                    alert(res.data.message || "Invalid coupon");
                                                }
                                            } catch (err) {
                                                console.error("Error applying coupon:", err);
                                            }
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* المحفظة */}
                            <div className="mb-3">
                                <label htmlFor="walletAmount" className="form-label">
                                    Use Wallet
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="walletAmount"
                                    placeholder="Amount to use"
                                    value={walletAmount}
                                    onChange={(e) => setWalletAmount(Number(e.target.value))}
                                />

                                <button
                                    className="btn btn-outline-success w-100 mt-2"
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            const token = getDecryptedToken();
                                            const res = await axios.post(
                                                "https://line-coffee.onrender.com/wallets/validateWalletAmount",
                                                {
                                                    walletAmount,
                                                    totalAmount: subtotal,
                                                },
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                        "Content-Type": "application/json",
                                                    },
                                                }
                                            );

                                            if (res.data.valid) {
                                                setWalletValid(true);
                                                setWalletError("");
                                            } else {
                                                setWalletValid(false);
                                                setWalletError(res.data.message);
                                            }
                                        } catch (err) {
                                            console.error("Error validating wallet:", err);
                                        }
                                    }}
                                >
                                    Validate Wallet Use
                                </button>

                                {walletError && <p className="text-danger mt-1">{walletError}</p>}
                            </div>

                            {/* الحسابات */}
                            <ul className="list-group mb-3">
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Coupon Discount</span>
                                    <span>- {couponDiscount} EGP</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Wallet Used</span>
                                    <span>- {walletValid ? walletAmount : 0} EGP</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Total</strong>
                                    <strong>{finalTotal} EGP</strong>
                                </li>
                            </ul>

                            <Link
                                to="/confirm-order"
                                state={{
                                    couponDiscount,
                                    walletAmount: walletValid ? walletAmount : 0,
                                    finalTotal,
                                    couponCode: coupon,
                                }}
                                className="btn btn-primary w-100"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
