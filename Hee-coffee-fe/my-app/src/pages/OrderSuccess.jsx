// src/pages/OrderSuccess.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, Package } from "lucide-react";
import { useEffect } from "react";
import s from "../styles/OrderSuccess.module.scss";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderInfo = location.state;

  const userString = localStorage.getItem("user");
  const isLoggedIn = !!userString;

  useEffect(() => {
    if (!orderInfo) {
      navigate("/");
    }
  }, [orderInfo, navigate]);

  if (!orderInfo) {
    return null;
  }
  const handleViewOrder = () => {
    const orderId = orderInfo.orderId;

    if (isLoggedIn) {
      navigate("/my-orders"); 
    } else {
      navigate("/login", { 
        state: { 
          from: "/checkout", 
          redirectTo: `/orders/${orderId}`
        } 
      });
    }
  };

  return (
    <div className={s.success_page}>
      <div className={s.success_card}>
        <div className={s.icon_wrapper}>
          <CheckCircle size={80} className={s.success_icon} />
        </div>

        <h1>Order Placed Successfully!</h1>
        <p className={s.subtitle}>Thank you for your purchase</p>

        <div className={s.order_details}>
          <div className={s.detail_row}>
            <span className={s.label}>Order ID:</span>
            <span className={s.value}>#{orderInfo.orderId}</span>
          </div>

          <div className={s.detail_row}>
            <span className={s.label}>Customer:</span>
            <span className={s.value}>{orderInfo.customerName}</span>
          </div>

          <div className={s.detail_row}>
            <span className={s.label}>Total Amount:</span>
            <span className={s.value_highlight}>
              {orderInfo.totalAmount?.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className={s.detail_row}>
            <span className={s.label}>Payment Method:</span>
            <span className={s.value}>
              {orderInfo.paymentMethod === "CASH"
                ? "Cash on Delivery (COD)"
                : orderInfo.paymentMethod}
            </span>
          </div>
        </div>

        {orderInfo.paymentMethod === "CASH" && (
          <div className={s.info_box}>
            <p>
              💵 Please prepare exact cash amount when receiving your order.
            </p>
          </div>
        )}

        <div className={s.action_buttons}>
          <button onClick={() => navigate("/")} className={s.btn_home}>
            <Home size={20} />
            Continue Shopping
          </button>

          {orderInfo.orderId && (
            <button
              onClick={handleViewOrder} 
              className={s.btn_orders}
            >
              <Package size={20} />
              {isLoggedIn ? "View My Orders" : "Login to View Order"}
            </button>
          )}
        </div>

        <p className={s.footer_note}>
          We've sent order confirmation to your email.
          {isLoggedIn &&
            ' You can track your order in "My Orders" page.'}
        </p>
      </div>
    </div>
  );
}
