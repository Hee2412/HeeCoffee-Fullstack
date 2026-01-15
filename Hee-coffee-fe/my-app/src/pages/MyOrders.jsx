import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";
import s from "../styles/MyOrders.module.scss";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchOrders = async (userId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/order/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersData = response.data.data || response.data;
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Fetch orders error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired! Please login again.");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Failed to load orders!");
      }
    } finally {
      setLoading(false);
    }
  };

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      toast.error("Please login to view your orders!");
      navigate("/login", { state: { from: "/my-orders" } });
      return;
    }

    const userData = JSON.parse(savedUser);
    fetchOrders(userData.id, userData.token);
  }, [navigate]);


  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING_PAYMENT: {
        icon: Clock,
        color: "warning",
        text: "Pending Payment",
      },
      ACTIVE: { icon: Package, color: "info", text: "Processing" },
      COMPLETED: { icon: CheckCircle, color: "success", text: "Completed" },
      CANCELED: { icon: XCircle, color: "danger", text: "Canceled" },
      ABANDONED: { icon: XCircle, color: "secondary", text: "Abandoned" },
    };
    return statusMap[status] || { icon: Package, color: "info", text: status };
  };

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className={s.loading_container}>
        <div className={s.spinner}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className={s.orders_page}>
      <div className={s.page_header}>
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <div className={s.filter_tabs}>
        {["ALL", "PENDING_PAYMENT", "ACTIVE", "COMPLETED", "CANCELED"].map(
          (status) => (
            <button
              key={status}
              className={`${s.filter_btn} ${filter === status ? s.active : ""}`}
              onClick={() => setFilter(status)}
            >
              {status === "ALL" ? "All Orders" : getStatusInfo(status).text}
              {status === "ALL" && (
                <span className={s.count}>({orders.length})</span>
              )}
            </button>
          )
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className={s.empty_state}>
          <ShoppingBag size={80} className={s.empty_icon} />
          <h2>No orders found</h2>
          <p>
            {filter === "ALL"
              ? "You haven't placed any orders yet."
              : `No ${getStatusInfo(filter).text.toLowerCase()} orders.`}
          </p>
          <button onClick={() => navigate("/")} className={s.shop_btn}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className={s.orders_list}>
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.orderId} className={s.order_card}>
                <div className={s.order_header}>
                  <div className={s.order_id}>
                    <Package size={20} />
                    <span>Order #{order.orderId}</span>
                  </div>
                  <span className={`${s.status_badge} ${s[statusInfo.color]}`}>
                    <StatusIcon size={16} />
                    {statusInfo.text}
                  </span>
                </div>

                <div className={s.order_body}>
                  <div className={s.order_info}>
                    <div className={s.info_row}>
                      <span className={s.label}>Date:</span>
                      <span className={s.value}>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className={s.info_row}>
                      <span className={s.label}>Payment:</span>
                      <span className={s.value}>{order.paymentMethod}</span>
                    </div>

                    <div className={s.info_row}>
                      <span className={s.label}>Items:</span>
                      <span className={s.value}>
                        {order.items?.length || 0} products
                      </span>
                    </div>

                    <div className={s.info_row}>
                      <span className={s.label}>Total:</span>
                      <span className={s.total_amount}>
                        {order.totalAmount?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className={s.items_preview}>
                      <p className={s.preview_label}>Products:</p>
                      <ul className={s.items_list}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <li key={index}>
                            {item.productName} × {item.quantity}
                          </li>
                        ))}
                        {order.items.length > 3 && (
                          <li className={s.more}>
                            +{order.items.length - 3} more items
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={s.order_footer}>
                  <button
                    className={s.view_btn}
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                  >
                    <Eye size={18} />
                    View Details
                  </button>

                  {order.status === "PENDING_PAYMENT" &&
                    order.paymentMethod !== "CASH" && (
                      <button
                        className={s.pay_btn}
                        onClick={() => navigate(`/payment/${order.orderId}`)}
                      >
                        Pay Now
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
