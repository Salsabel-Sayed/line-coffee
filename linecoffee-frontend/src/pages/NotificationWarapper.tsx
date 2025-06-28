import { useEffect, useState } from "react";
import NotificationsList from "./NotificationList";
import type { Notification } from "../../Types/notificationTypes";
import axios from "axios";

function NotificationWrapper() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("https://line-coffee.onrender.com/notifications/getUserNotifications", { withCredentials: true })
            const data = await res.data;
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
