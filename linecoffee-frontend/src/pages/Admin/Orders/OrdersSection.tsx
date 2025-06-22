import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';

type Item = {
    product: {
        _id: string;
        productsName: string;
    };
    quantity: number;
};

type Coupon = {
    _id: string;
    couponCode: string;
    discountValue: number;
};

type Order = {
    _id: string;
    user: { email: string };
    items: Item[];
    totalAmount: number;
    discount: number;
    finalAmount: number;
    coinsEarned: number;
    walletAmount: number;
    coupon?: Coupon;
    status: "pending" | "preparing" | "shipped" | "delivered" | "canceled";
    createdAt: string;
    updatedAt: string;
};
type UpdateOrderBody = {
    items: { product: string; quantity: number }[];
    couponCode?: string;
    removeCoupon?: boolean;
    walletAmount: number;
};
  

export default function OrdersSection() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [editCoupon, setEditCoupon] = useState("");
    const [editWallet, setEditWallet] = useState<number>(0);
    const [editItems, setEditItems] = useState<Item[]>([]);
    const token = localStorage.getItem("linecoffeeToken");

    const fetchOrders = async () => {
        const { data } = await axios.get("http://localhost:5000/orders/getAllOrders", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders);
        console.log("data getAllOrders",data);
        
    };

    const cancelOrder = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        await axios.delete(`http://localhost:5000/orders/cancelOrder/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchOrders();
    };

    const updateStatus = async (id: string, newStatus: string) => {
        await axios.put(`http://localhost:5000/orders/updateOrderStatus/${id}`, {
            status: newStatus,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchOrders();
    };

    const openEditModal = (order: Order) => {
        setCurrentOrder(order);
        setEditCoupon(order.coupon?.couponCode || "");
        setEditWallet(order.walletAmount || 0);
        setEditItems(order.items);
        setShowModal(true);
    };

    const handleItemChange = (index: number, quantity: number) => {
        const updated = [...editItems];
        updated[index].quantity = quantity;
        setEditItems(updated);
    };

    const removeItem = (index: number) => {
        const updated = [...editItems];
        updated.splice(index, 1);
        setEditItems(updated);
    };

    const saveChanges = async () => {
        if (!currentOrder) return;
        const body: UpdateOrderBody = {
            items: editItems.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            couponCode: editCoupon,
            walletAmount: editWallet,
        };

        await axios.put(`http://localhost:5000/orders/adminUpdateOrder/${currentOrder._id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setShowModal(false);
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-4">📦 Orders</h3>
            <div className="row">
                {orders.map((order) => (
                    <div key={order._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title">🧾 Order #{order._id.slice(-5)}</h5>
                                <p className="card-text">
                                    <strong>User:</strong> {order.user?.email || "N/A"}<br />
                                    <strong>Status:</strong>{" "}
                                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span><br />
                                    <strong>Total:</strong> {order.totalAmount} EGP<br />
                                    <strong>Discount:</strong> {order.discount} EGP<br />
                                    <strong>Wallet Used:</strong> {order.walletAmount} EGP<br />
                                    <strong>Final:</strong> {order.finalAmount} EGP<br />
                                    <strong>Coins Earned:</strong> {order.coinsEarned}<br />
                                    <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}<br />
                                    <strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}
                                </p>

                                {order.coupon && (
                                    <div className="bg-light p-2 mb-2 rounded">
                                        <strong>🎟 Coupon:</strong><br />
                                        Code: <span className="badge bg-info text-dark">{order.coupon.couponCode}</span><br />
                                        Discount: {order.discount} EGP
                                    </div>
                                )}

                                <div className="mt-3">
                                    <strong>🛍 Items:</strong>
                                    <ul className="list-group mt-2">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                {item.product?.productsName || "Unknown Product"}
                                                <span className="badge bg-secondary">x{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="d-flex flex-wrap gap-2 mt-4">
                                    <button
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => updateStatus(order._id, "preparing")}
                                    >🍳 Preparing</button>

                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => updateStatus(order._id, "shipped")}
                                    >🚚 Shipped</button>

                                    <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => updateStatus(order._id, "delivered")}
                                    >✅ Delivered</button>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => cancelOrder(order._id)}
                                    >🗑 Cancel</button>

                                    <button
                                        className="btn btn-sm btn-outline-dark"
                                        onClick={() => openEditModal(order)}
                                    >✏️ Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Modal خارج الماب */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Coupon Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={editCoupon}
                            onChange={(e) => setEditCoupon(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Wallet Amount</Form.Label>
                        <Form.Control
                            type="number"
                            value={editWallet}
                            onChange={(e) => setEditWallet(Number(e.target.value))}
                        />
                    </Form.Group>

                    <h6>Items</h6>
                    {editItems.map((item, index) => (
                        <div key={index} className="d-flex align-items-center gap-2 mb-2">
                            <span>{item.product.productsName}</span>
                            <Form.Control
                                type="number"
                                value={item.quantity}
                                style={{ width: "80px" }}
                                onChange={(e) => handleItemChange(index, Number(e.target.value))}
                            />
                            <Button variant="danger" size="sm" onClick={() => removeItem(index)}>🗑</Button>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case "pending": return "warning";
        case "preparing": return "info";
        case "shipped": return "primary";
        case "delivered": return "success";
        case "canceled": return "danger";
        default: return "secondary";
    }
}
