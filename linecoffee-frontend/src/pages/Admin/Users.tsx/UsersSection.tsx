import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import AddUserSection from "./AddUserSection";
// import { toast } from "react-toastify";

type User = {
    _id: string;
    userName: string;
    email: string;
    userPhone: string;
    address: string;
    password:string;
    role: "admin" | "user";
    coins?: { balance: number };
    wallet?: { balance: number };
};

export default function UsersSection() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [notificationText, setNotificationText] = useState("");

    

    const token = localStorage.getItem("linecoffeeToken");

    const fetchUsers = async () => {
        const { data } = await axios.get("https://line-coffee.onrender.com/users/getAllUsers", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.users);
      

    };

    useEffect(() => {
        fetchUsers();
    },[]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure?")) return;
        await axios.delete(`https://line-coffee.onrender.com/users/adminDeleteUser/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        fetchUsers();
    };

    const handleSendNotification = (user: User) => {
        setSelectedUser(user);
        setNotificationText("");
        setShowNotifModal(true);
    };

    const handleSubmitEdit = async () => {
        if (!selectedUser) return;

        const { _id, ...rest } = selectedUser;
        const dataToSend = { ...rest };

        delete dataToSend.coins;
        delete dataToSend.wallet;

        const {data}= await axios.put(
            `https://line-coffee.onrender.com/users/adminUpdateUser/${_id}`,
            dataToSend,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (data.authorization) {
            localStorage.setItem("linecoffeeToken", data.authorization);
          }

        setShowEditModal(false);
        fetchUsers();
        // toast.success("User updated successfully!");

    };
      

    const handleSubmitNotif = async () => {
        if (!selectedUser) return;
        await axios.post(
            "https://line-coffee.onrender.com/notifications/adminSendNotification",
            {
                userId: selectedUser._id,
                title: "رسالة من الإدارة",
                body: notificationText,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setShowNotifModal(false);
    };

    return (
        <div>
            <h3 className="mb-4">👥 Users</h3>
            <AddUserSection fetchUsers={fetchUsers} />
            <div className="row">
                {users.map((user) => (
                    <div className="col-md-6 col-lg-4 mb-4" key={user._id}>
                        <div className="card shadow p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5>
                                    {user.userName}{" "}
                                    <span className={`badge bg-${user.role === "admin" ? "dark" : "secondary"}`}>
                                        {user.role}
                                    </span>
                                </h5>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(user)}>✏️</button>
                                    <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(user._id)}>🗑</button>
                                    <button className="btn btn-sm btn-outline-success" onClick={() => handleSendNotification(user)}>🔔</button>
                                </div>
                            </div>
                            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                            <p className="mb-1"><strong>Phone:</strong> {user.userPhone}</p>
                            <p className="mb-1"><strong>Address:</strong> {user.address}</p>
                            <p className="mb-1"><strong>Coins:</strong> {user.coins?.balance ?? 0}</p>
                            <p className="mb-1"><strong>Wallet:</strong> {user.wallet?.balance ?? 0} EGP</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🛠 Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                    

                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedUser.userName}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedUser.userPhone}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, userPhone: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedUser.address}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>password</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedUser.password}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    value={selectedUser.role}
                                    onChange={(e) =>
                                        setSelectedUser({ ...selectedUser, role: e.target.value as "admin" | "user" })
                                    }
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>

                            
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmitEdit}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* 🔔 Notification Modal */}
            <Modal show={showNotifModal} onHide={() => setShowNotifModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Send Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={notificationText}
                            onChange={(e) => setNotificationText(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNotifModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleSubmitNotif}>Send</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
