import { createContext, useContext, useEffect, useState } from "react";
import  type { Notification } from "../../Types/notificationTypes";
import { getDecryptedToken } from "../utils/authUtils";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const token = getDecryptedToken();

            const res = await fetch("https://line-coffee.onrender.com/getUserNotifications", {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setNotifications(data.notifications || []);
            const unread = data.notifications?.filter((n: Notification) => !n.isRead).length || 0;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within NotificationProvider");
    return context;
};
