// src/components/Navbar.jsx
import s from "../styles/Navbar.module.scss";
import { Search, User, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const { totalItems, clearCart } = useCart();

  useEffect(() => {
    const handleStorageUpdate = () => {
      const userData = localStorage.getItem("user");

      if (userData) {
        const userObj = JSON.parse(userData);
        setIsLoggedIn(!!userObj.token);
        setUser(userObj);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    handleStorageUpdate();

    window.addEventListener("authChange", handleStorageUpdate);

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("authChange", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    clearCart();
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <header className={s.navbar}>
      <div className={s.navbar_logo} onClick={() => navigate("/")}>
        ☕ Hee Coffee
      </div>

      <div className={s.navbar_searchbox}>
        <input type="text" placeholder="Search for items..." />

        <button>
          <Search size={18} />
        </button>
      </div>

      <div className={s.navbar_actions}>
        <div className={s.accountWrapper}>
          <div className={s.accountTitle}>
            <User size={15} />
            {user ? `Hi, ${user.name}` : "Account"}
          </div>
          <ul className={s.accountDropdown}>
            {!isLoggedIn && (
              <>
                <li>
                  <a href="/register">Register</a>
                </li>
                <li>
                  <a href="/login">Login</a>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <button
                    onClick={handleSignOut}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Sign out
                  </button>
                </li>
                <li>
                  <a href="/update">Profile</a>
                </li>
                <li>
                  <a href="/my-orders">My Orders</a>
                </li>
              </>
            )}
          </ul>
        </div>
        <button className={s.fake_link} onClick={() => {}}>
          <Heart size={15} /> <span>Wishlist</span>
        </button>
        <button className={s.fake_link} onClick={() => navigate("/cart")}>
          <ShoppingCart size={15} />
          <span>Cart</span>
          {totalItems > 0 && <span className={s.cart_badge}>{totalItems}</span>}
        </button>
      </div>
    </header>
  );
}
