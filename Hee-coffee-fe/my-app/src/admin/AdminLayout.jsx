import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogOut,
  Menu,
  X,
  User,
  FileText,
  Clock,
} from "lucide-react";
import AdminNotification from "./AdminNotification";
import s from "./AdminLayout.module.scss";
import { useAuth } from "../contexts/AuthProvider";
import { getTokenRemainingTime, formatRemainingTime } from "../utils/authUtils"

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [remainingTime, setRemainingTime] = useState(formatRemainingTime());

  // Update remaining time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTokenRemainingTime();
      if (remaining === 0) {
        // Token expired, logout will be handled by AuthProvider
        return;
      }
      setRemainingTime(formatRemainingTime());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/admin/orders",
      icon: ShoppingCart,
      label: "Orders",
    },
    {
      path: "/admin/products",
      icon: Package,
      label: "Products",
    },
    {
      path: "/admin/users",
      icon: User,
      label: "Users",
    },
    {
      path: "/admin/sales-report",
      icon: FileText,
      label: "Sales Report",
    },
  ];

  return (
    <div className={s.admin_layout}>
      {/* Sidebar */}
      <aside className={`${s.sidebar} ${!sidebarOpen ? s.closed : ""}`}>
        <div
          className={`${s.sidebar_header} ${
            !sidebarOpen ? s.closed_clickable : ""
          }`}
          onClick={() => setSidebarOpen(true)}
        >
          <div className={s.logo}>
            <Package size={32} />
            <span>Admin Panel</span>
          </div>
          <button
            className={`${s.toggle_btn} ${!sidebarOpen ? s.hide_on_close : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(false);
            }}
          >
            {sidebarOpen && <X size={24} />}
          </button>
        </div>

        <nav className={s.nav_menu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${s.nav_item} ${isActive ? s.active : ""}`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Session Info */}
        <div className={s.session_info}>
          <div className={s.session_item}>
            <Clock size={16} />
            <span>Session: {remainingTime}</span>
          </div>
        </div>

        <div className={s.sidebar_footer}>
          <button className={s.logout_btn} onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={s.main_content}>
        {/* Header */}
        <header className={s.header}>
          <button
            className={s.mobile_menu_btn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>

          <div className={s.header_right}>
            <div className={s.user_info}>
              <div className={s.user_avatar}>
                <User size={20} />
              </div>
              <div className={s.user_details}>
                <span className={s.user_name}>{user?.name || "Admin"}</span>
                <span className={s.user_role}>Administrator</span>
              </div>
            </div>
            <AdminNotification />
          </div>
        </header>

        {/* Content Area */}
        <main className={s.content}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className={s.overlay} onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}