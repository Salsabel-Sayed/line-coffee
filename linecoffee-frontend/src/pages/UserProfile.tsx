import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import OrdersList from "./OrderList";
import CoinsList from "./CoinsList";
import Wallet from "./WalletList";
import type { Notification } from "../../Types/notificationTypes";
import SendReportForm from "./SendReportForm";
import EditeUserForm from "./EditeUserForm";
import NotificationsList from './NotificationList';
import { clearToken, getDecryptedToken } from "../utils/authUtils";




function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  const [userData, setUserData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [orders, setUserOrders] = useState([]);

  const [coins, setCoins] = useState({ coins: 0, logs: [] });
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchUserData = async () => {
    try {
      const token = getDecryptedToken();
      const userId = localStorage.getItem("userId");
      if (!token) return toast.error("User not logged in");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.get(`https://line-coffee.onrender.com/users/finduserInfo/${userId}`, { headers });
      const user = res.data.user;

      setUserData({
        name: user.userName || "",
        address: user.userAddress || "",
        phone: user.userPhone || "",
        email: user.email || "",
      });

      const coinsRes = await axios.get(`https://line-coffee.onrender.com/coins/getUserCoins/${userId}`, { headers });
      setCoins({
        coins: coinsRes.data.coins || 0,
        logs: coinsRes.data.logs || [],
      });

      const walletRes = await axios.get(`https://line-coffee.onrender.com/wallets/getUserWallet/${userId}`, { headers });
      setWallet(walletRes.data);

      const notiRes = await axios.get("https://line-coffee.onrender.com/notifications/getUserNotifications", { headers });
      setNotifications(notiRes.data.notifications || []);

      const ordersRes = await axios.get("https://line-coffee.onrender.com/orders/myOrders", { headers });
      setUserOrders(ordersRes.data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load user profile");
    }
  };
  

  // ✅ بعد ما خرجناها، نقدر نستدعيها هنا
  useEffect(() => {
    fetchUserData();
  }, [refreshFlag]);
  

  return (
    <section id="userProfile">
      <div className="container-fluid py-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-4 col-lg-3 mb-4">
            <div className="dashSidebar p-3 bg-light rounded shadow-sm">
              <div className="userInfo mb-4">
                <p className="mb-1">📍 {userData.name}</p>
                <p className="mb-1">📍 {userData.address}</p>
                <p className="mb-1">📞 {userData.phone}</p>
                <p className="mb-1">📧 {userData.email}</p>
              </div>
              <div className="userOpp mb-4">
                <button onClick={() => setActiveTab("profile")} className="btn btn-outline-primary w-100 mb-2">
                  👤 Edit Profile
                </button>
                <button onClick={() => setActiveTab("orders")} className="btn btn-outline-primary w-100 mb-2">
                  🛍 Orders
                </button>
                <button onClick={() => setActiveTab("coins")} className="btn btn-outline-primary w-100 mb-2">
                  💰 Coins
                </button>
                <button onClick={() => setActiveTab("wallet")} className="btn btn-outline-primary w-100 mb-2">
                  👜 Wallet
                </button>
              </div>
              <div className="userLogs mb-4">
                <button onClick={() => setActiveTab("notifications")} className="btn btn-outline-secondary w-100 mb-2">
                  🔔 Notifications
                </button>
                <button onClick={() => setActiveTab("sendReport")} className="btn btn-outline-secondary w-100 mb-2">
                  📝 Send Report
                </button>

                <button className="btn btn-danger w-100" onClick={() => {
                  clearToken();
                  localStorage.removeItem("userId");
                  window.location.href = "/login";
                }}>🚪 Sign out</button>
              </div>
            </div>
          </div>

          {/* main page */}
          <div className="col-12 col-md-8 col-lg-9">
            <div className="mainPage p-4 bg-white rounded shadow-sm">
              {activeTab === "profile" && (
                <EditeUserForm
                  userData={userData}
                  onSave={(updatedData: typeof userData) => setUserData(updatedData)}

                />
              )}
              {activeTab === "orders" && <OrdersList orders={orders} />}

              {activeTab === "coins" && <CoinsList coins={coins} onRedeemSuccess={() => setRefreshFlag(prev => !prev)} />}
              {activeTab === "wallet" && <Wallet balance={wallet.balance} transactions={wallet.transactions} />}
              {activeTab === "notifications" && (
                <NotificationsList
                  notifications={notifications}
                  onRefresh={() => setRefreshFlag(prev => !prev)} // ⬅️ دي بتعمل refetch
                />
              )}

              {activeTab === "sendReport" && <SendReportForm />}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
