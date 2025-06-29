
import {  Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LangugeContext";
import i18n from "../i18n";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faBell, faCartShopping, faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { useWishList } from "../context/WishListContext";
import { useCart } from "../context/CartContext";


const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY!;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY!;
interface user {
  email: string;
  name: string;
  role?: string;
  // زودي باقي البيانات حسب ما عندك
}
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean; // ✅ أهي دي المطلوبة
  createdAt: string;
}


export default function MainNavbar() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<user | null>(null);
  const { wishList } = useWishList();
  const { cartItems } = useCart();
  

  const navigate = useNavigate();

    const [, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const encrypted = localStorage.getItem(TOKEN_KEY);
      if (!encrypted) return;

      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
      const token = bytes.toString(CryptoJS.enc.Utf8);

      const res = await fetch("https://line-coffee.onrender.com/notifications/getUserNotifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const all = data.notifications || [];
      setNotifications(all);

      const lastSeen = localStorage.getItem("notificationsLastSeen");
      const lastSeenDate = lastSeen ? new Date(lastSeen) : new Date(0);

      const newNotifs = all.filter((n: Notification) => new Date(n.createdAt) > lastSeenDate);
      setUnreadCount(newNotifs.length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };
    
    

  useEffect(() => {
    fetchNotifications(); // أول تحميل

    const interval = setInterval(() => {
      fetchNotifications(); // بعدها كل شوية
    }, 15000); // كل 30 ثانية

    return () => clearInterval(interval); // تنظيف عند الخروج
  }, []);
  
  


    useEffect(() => {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 50;
        setScrolled(isScrolled);
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
      const token = localStorage.getItem("linecoffeeToken");
      const userInfo = localStorage.getItem("user");

      if (token && userInfo) {
        setUser(JSON.parse(userInfo));
      }
    }, []);

    const handleLogout = () => {
      localStorage.clear();
      setUser(null);
      navigate("/login");
    };

    const isAdminAccount = user?.email === "admin@gmail.com";
    return (
      <Navbar expand="lg" className={`fixed-top ${scrolled ? "navbar-scrolled" : "navbar-custom"}`}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
            {t("navbar.brand")}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className={language === "ar" ? "ms-auto text-end" : "me-auto text-start"}>
              <Nav.Link as={Link} to="/" className="mx-2 text-secondary fw-semibold">
                {t("navbar.home")}
              </Nav.Link>
              <Nav.Link as={Link} to="/products" className="mx-2 text-secondary fw-semibold">
                {t("navbar.products")}
              </Nav.Link>

              {user && (
                <Nav.Link as={Link} to="/profile" className="mx-2 text-secondary fw-semibold">
                  {t("navbar.profile")}
                </Nav.Link>
              )}

              {!user && (
                <>
                  <Nav.Link as={Link} to="/login" className="mx-2 text-secondary fw-semibold">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="mx-2 text-secondary fw-semibold">
                    Register
                  </Nav.Link>
                </>
              )}

              <Nav.Link as={Link} to="/wishlist" className="mx-2 text-secondary fw-semibold position-relative">
                <FontAwesomeIcon icon={faHeartSolid} />
                <span style={{ fontSize: "0.6rem" }} className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {wishList.length}
                </span>
                
              </Nav.Link>

              <Nav.Link as={Link} to="/cart" className="mx-2 text-secondary fw-semibold position-relative ">
                <FontAwesomeIcon icon={faCartShopping} />  
                <span style={{ fontSize: "0.6rem" }} className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>             
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  localStorage.setItem("notificationsLastSeen", new Date().toISOString());
                  setUnreadCount(0);
                  navigate("/profile/notifications");
                }}
                className="mx-2 text-secondary fw-semibold position-relative"
              >
                <FontAwesomeIcon icon={faBell} />
                {unreadCount > 0 && (
                  <span
                    style={{ fontSize: "0.6rem" }}
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  >
                    {unreadCount}
                  </span>
                )}
              </Nav.Link>




              


              {isAdminAccount && (
                <Nav.Link as={Link} to="/admin" className="mx-2 text-secondary fw-semibold">
                  Admin
                </Nav.Link>
              )}

              {user && (
                <Nav.Link onClick={handleLogout} className="mx-2 text-danger fw-semibold">
                  Logout
                </Nav.Link>
              )}
            </Nav>

            <button
              onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
              className="btn btn-outline-primary ms-3"
            >
              {i18n.language === "en" ? "عربية" : "English"}
            </button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
