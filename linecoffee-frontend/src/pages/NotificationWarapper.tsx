import { useEffect, useState } from "react";
import NotificationsList from "./NotificationList";
import type { Notification } from "../../Types/notificationTypes";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY!;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY!;

function NotificationWrapper() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

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

    const fetchNotifications = async () => {
        try {
            const token = getDecryptedToken();
            if (!token) return;

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
