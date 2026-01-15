import { useState, useEffect, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";
import s from "./AdminNotification.module.scss";

export default function AdminNotification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});
  };

  const handleNotificationClick = (notification) => {
    window.location.href = `/orders/${notification.orderId}`;
  };

  const handleNewNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    if (notification.type === "NEW_ORDER") {
      toast.info(
        `🔔 New Order #${notification.orderId} - ${notification.customerName}`,
        {
          position: "top-right",
          autoClose: 5000,
          onClick: () => handleNotificationClick(notification),
        }
      );
    }

    playNotificationSound();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("admin_notif") || "[]");
    setNotifications(saved);
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe("/topic/admin/orders", (message) => {
        const notification = JSON.parse(message.body);
        handleNewNotification(notification);
      });
    };

    stompClient.activate();
    return () => stompClient.deactivate();
  }, [handleNewNotification]);

  useEffect(() => {
    localStorage.setItem("admin_notif", JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = () => setUnreadCount(0);

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem("admin_notif");
  };

  return (
    <div className={s.notificationContainer}>
      <button
        className={s.notificationBell}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAsRead();
        }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className={s.badge}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={s.notificationDropdown}>
          <div className={s.notificationHeader}>
            <h3>Notifications</h3>
            <button onClick={clearAll}>Clear All</button>
          </div>

          <div className={s.notificationList}>
            {notifications.length === 0 ? (
              <p className={s.empty}>No new notifications</p>
            ) : (
              notifications.map((notif, index) => (
                <div
                  key={index}
                  className={s.notificationItem}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className={s.notifIcon}>
                    {notif.type === "NEW_ORDER" ? "🛒" : "📦"}
                  </div>

                  <div className={s.notifContent}>
                    <p className={s.notifMessage}>{notif.message}</p>
                    <p className={s.notifDetail}>
                      Order #{notif.orderId} - {notif.customerName}
                    </p>
                    <p className={s.notifAmount}>
                      {notif.totalAmount?.toLocaleString("vi-VN")}đ
                    </p>
                    <span className={s.notifTime}>
                      {new Date(notif.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
