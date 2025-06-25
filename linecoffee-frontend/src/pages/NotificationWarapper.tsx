import { useEffect, useState } from "react";
import NotificationsList from "./NotificationList";
import type { Notification } from "../../Types/notificationTypes";

function NotificationWrapper() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("linecoffeeToken");
            const res = await fetch("https://line-coffee.onrender.com/notifications/getUserNotifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationsList
            notifications={notifications}
            onRefresh={fetchNotifications}
        />
    );
}

export default NotificationWrapper;
