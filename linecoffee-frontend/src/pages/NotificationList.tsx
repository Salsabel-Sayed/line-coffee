import { useState } from 'react';
import type { Notification } from "../../Types/notificationTypes"; // أو المسار الصحيح حسب البروجكت عندك
import axios from 'axios';
import { toast } from 'react-toastify';


type NotificationsProps = {
    notifications: Notification[];
    onRefresh: () => void;
};


function NotificationsList({ notifications, onRefresh }: NotificationsProps) {
    const [filter, setFilter] = useState<"all" | Notification["type"]>("all");

    const filteredNotifs = filter === "all"
        ? notifications
        : notifications.filter(n => n.type === filter);

    const handleMarkAsRead = async (notificationId: string) => {
        const token = localStorage.getItem("linecoffeeToken");
      
              if (!token) return toast.error("User not logged in");
        
        await axios.put(`/http://localhost:5000/markReportAsRead/${notificationId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

            onRefresh()

    return (
        <div className="notifications-section">
            <h3 className="mb-3">🔔 Notifications</h3>

            <div className="mb-3 d-flex gap-2 flex-wrap">
                <button className={`btn btn-sm ${filter === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter("all")}>All</button>
                <button className={`btn btn-sm ${filter === 'coins' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter("coins")}>🪙 Coins</button>
                <button className={`btn btn-sm ${filter === 'order' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter("order")}>📦 Orders</button>
                <button className={`btn btn-sm ${filter === 'report' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter("report")}>📦 report</button>
                <button className={`btn btn-sm ${filter === 'promo' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setFilter("promo")}>🎁 Promo</button>
                <button className={`btn btn-sm ${filter === 'general' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilter("general")}>📣 General</button>
            </div>

            {filteredNotifs.length === 0 ? (
                <p>No notifications found.</p>
            ) : (
                <ul className="list-group">
                    {filteredNotifs.map((notif) => (
                        <li
                            key={notif._id}
                            className={`list-group-item list-group-item-${getNotifColor(notif.type)} ${notif.isRead ? '' : 'fw-bold'}`}
                        >
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>{notif.title}</strong>
                                    <p className="mb-1">{notif.message}</p>
                                    <small className="text-muted">{new Date(notif.createdAt).toLocaleString()}</small>
                                </div>
                                {!notif.isRead && <span className="badge bg-danger">New</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function getNotifColor(type: Notification["type"]) {
    switch (type) {
        case "coins":
            return "primary";
        case "order":
            return "success";
        case "report":
            return "success";
        case "promo":
            return "warning";
        case "general":
            return "secondary";
        default:
            return "light";
    }
}

export default NotificationsList;
