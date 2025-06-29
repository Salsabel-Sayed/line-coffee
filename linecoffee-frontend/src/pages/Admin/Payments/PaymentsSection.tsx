import { useEffect, useState } from "react";
import axios from "axios";


const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY!;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY!;

function getDecryptedToken() {
    const encrypted = localStorage.getItem(TOKEN_KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
type Payment = {
    _id: string;
    method: string;
    amount: number;
    status: "success" | "pending" | "failed";
    orderId: {
        _id: string;
    };
    userId: {
        _id: string;
        userName: string;
    };
    createdAt: string;
    updatedAt: string;
};

export default function PaymentsSection() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | Payment["status"]>("all");
    const [methodFilter, setMethodFilter] = useState<"all" | Payment["method"]>("all");

    const token = getDecryptedToken();


    const fetchPayments = async () => {
        const res = await axios.get("https://line-coffee.onrender.com/payments/getAllPayments", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data.payments);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleConfirm = async (orderId: string) => {
        try {
            await axios.put(`https://line-coffee.onrender.com/payments/confirmManualPayment/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Payment confirmed");
            fetchPayments();
        } catch (error) {
            alert({"❌ Failed to confirm payment":error});
        }
    };

    const filteredPayments = payments.filter((p) => {
        const matchesSearch = p.userId?.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        const matchesMethod = methodFilter === "all" || p.method === methodFilter;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    return (
        <div className="container mt-5">
            <h3 className="mb-4">💼 All Payments (Admin View)</h3>

            {/* Filters */}
            <div className="row mb-4">
                <div className="col-md-4 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Search by user name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="col-md-4 mb-2">
                    <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "success" | "pending" | "failed")}>
                        <option value="all">📋 All Status</option>
                        <option value="success">✅ Success</option>
                        <option value="pending">🕒 Pending</option>
                        <option value="failed">❌ Failed</option>
                    </select>
                </div>

                <div className="col-md-4 mb-2">
                    <select className="form-select" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value as "all" | "cash" | "vodafone" | "insta")}>
                        <option value="all">💳 All Methods</option>
                        <option value="cash">💵 Cash</option>
                        <option value="vodafone">📱 Vodafone</option>
                        <option value="insta">🏦 InstaPay</option>
                    </select>
                </div>
            </div>

            {/* Payments Cards */}
            <div className="row">
                {filteredPayments.length === 0 ? (
                    <p>No matching payments.</p>
                ) : (
                    filteredPayments.map((p) => (
                        <div key={p._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title">💰 {p.amount} EGP</h5>
                                    <p className="card-text">
                                        <strong>User:</strong> {p.userId?.userName || "N/A"}<br />
                                        <strong>Order ID:</strong> {p.orderId?._id}<br />
                                        <strong>Method:</strong> {p.method}<br />
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`badge ${p.status === "success"
                                                    ? "bg-success"
                                                    : p.status === "pending"
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                                }`}
                                        >
                                            {p.status}
                                        </span><br />
                                        <strong>Created:</strong> {new Date(p.createdAt).toLocaleString()}<br />
                                        <strong>Updated:</strong> {new Date(p.updatedAt).toLocaleString()}
                                    </p>

                                    {p.status === "pending" && (
                                        <button
                                            onClick={() => handleConfirm(p.orderId._id)}
                                            className="btn btn-sm btn-outline-success"
                                        >
                                            ✅ Confirm Payment
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
