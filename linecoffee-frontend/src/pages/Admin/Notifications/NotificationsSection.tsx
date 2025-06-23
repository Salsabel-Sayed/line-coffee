// src/pages/admin/sections/NotificationsSection.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from 'react-bootstrap';
// import type { Notification } from "../../Types/notificationTypes"; 

type Notification = {
    _id: string;
    user?: { email: string; _id: string }; // ✅ ضفنا _id
    title: string;
    message: string;
    type: "order" | "coins" | "promo" | "general";
    createdAt: string;
    isRead?: boolean;
};
  
  

export default function NotificationsSection() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
    const [editedData, setEditedData] = useState({ title: "", message: "" });
    const [broadcast, setBroadcast] = useState({ title: "", message: "" });
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [notif, setNotif] = useState({
        title: "",
        message: "",
        type: "general" as "order" | "coins" | "promo" | "general"
    });
    const openSendNotificationModal = (userId: string | undefined) => {
        if (!userId) return;
        setSelectedUserId(userId);
        setNotif({ title: "", message: "", type: "general" });
        setShowNotifModal(true);
    };
      


    const sendBroadcast = async () => {
        try {
            await axios.post("https://line-coffee.onrender.com/notifications/adminBroadcast", broadcast, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Broadcast sent!");
            setBroadcast({ title: "", message: "" });
            fetchNotifications();
        } catch (err) {
            console.error("Broadcast error:", err);
        }
    };


    const openEditModal = (noti: Notification) => {
        setEditingNotification(noti);
        setEditedData({ title: noti.title, message: noti.message });
        setShowEditModal(true);
    };

    const submitEdit = async () => {
        if (!editingNotification) return;
        try {
            await axios.patch(`https://line-coffee.onrender.com/notifications/${editingNotification._id}/edit`, editedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            fetchNotifications();
        } catch (err) {
            console.error("Edit error:", err);
        }
    };

    const token = localStorage.getItem("linecoffeeToken");

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get("https://line-coffee.onrender.com/notifications/adminGetNotifications", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(data.notifications);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    const deleteNotification = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notification?")) return;
        try {
            await axios.delete(`https://line-coffee.onrender.com/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications(); // reload
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };
    const submitNotifToUser = async () => {
        try {
            await axios.post("https://line-coffee.onrender.com/notifications/adminSendNotification", {
                userId: selectedUserId,
                title: notif.title,
                body: notif.message,
                type: notif.type
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Notification sent!");
            setShowNotifModal(false);
            setNotif({ title: "", message: "", type: "general" });
        } catch (err) {
            console.error("Failed to send:", err);
        }
    };
    

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div>
            <h3 className="mb-4">🔔 User Notifications</h3>
            <div className="table-responsive">
                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Title</th>
                            <th>Message</th>
                            <th>Type</th>
                            <th>Sent At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((noti, index) => (
                            <tr key={noti._id}>
                                <td>{index + 1}</td>
                                <td>{noti.user?.email || "—"}</td>
                                <td>{noti.title}</td>
                                <td>{noti.message}</td>
                                <td>{noti.type}</td>
                                <td>{new Date(noti.createdAt).toLocaleString()}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(noti)}>✏️ Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNotification(noti._id)}>🗑 Delete</button>
                                    <button className="btn btn-sm btn-outline-info"
                                        onClick={() => openSendNotificationModal(noti.user?._id)}>
                                        📣 Notify
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <div className="card p-3 mb-4 shadow">
                        <h5>📢 Send Notification to All Users</h5>
                        <div className="row">
                            <div className="col-md-5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Title"
                                    value={broadcast.title}
                                    onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })}
                                />
                            </div>
                            <div className="col-md-5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Message"
                                    value={broadcast.message}
                                    onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                                />
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-success w-100" onClick={sendBroadcast}>Send</button>
                            </div>
                        </div>
                    </div>

                </table>
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Notification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editedData.title}
                                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editedData.message}
                                    onChange={(e) => setEditedData({ ...editedData, message: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={submitEdit}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showNotifModal} onHide={() => setShowNotifModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Send Notification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" value={notif.title}
                                    onChange={(e) => setNotif({ ...notif, title: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Message</Form.Label>
                                <Form.Control as="textarea" rows={3} value={notif.message}
                                    onChange={(e) => setNotif({ ...notif, message: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Type</Form.Label>
                                <Form.Select value={notif.type}
                                    onChange={(e) =>
                                        setNotif({
                                            ...notif,
                                            type: e.target.value as "order" | "coins" | "promo" | "general",
                                        })
                                    }
                                      >
                                    <option value="general">📣 General</option>
                                    <option value="order">📦 Order</option>
                                    <option value="coins">🪙 Coins</option>
                                    <option value="promo">🎁 Promo</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowNotifModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={submitNotifToUser}>Send</Button>
                    </Modal.Footer>
                </Modal>


            </div>
        </div>
    );
}
