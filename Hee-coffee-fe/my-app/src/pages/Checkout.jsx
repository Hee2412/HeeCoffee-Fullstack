// src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { toast } from "react-toastify";
import axios from "axios";
import s from "../styles/Checkout.module.scss";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || "",
        phone: "",
        email: userData.email || "",
        address: userData.address || "",
      }));
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    paymentMethod: "CASH",
    note: "",
  });

  const shippingFee = totalPrice >= 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng đang trống!");
      return;
    }

    setLoading(true);

    try {
      const checkoutRequest = {
        userId: user?.id || null,
        guestName: formData.fullName,
        guestEmail: formData.email,
        guestAddress: formData.address,
        guestPhone: formData.phone,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("Sending checkout request:", checkoutRequest);

      const response = await axios.post(
        "http://localhost:8080/api/order",
        checkoutRequest,
        {
          headers: {
            "Content-Type": "application/json",
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
        }
      );

      console.log("Checkout response:", response.data);

      const orderData = response.data.data;
      const orderId = orderData.orderId;

      if (formData.paymentMethod === "CASH") {
        toast.success(`Successfully! Order No: #${orderId}`);
        clearCart();

        navigate("/order-success", {
          state: {
            orderId: orderId,
            customerName: formData.fullName,
            totalAmount: orderData.totalAmount,
            paymentMethod: "CASH",
            isLoggedIn: !!user,
          },
        });
      } else if (
        formData.paymentMethod === "MOMO" ||
        formData.paymentMethod === "VNPay" ||
        formData.paymentMethod === "CARD"
      ) {
        toast.info("Redirecting to payment page...");
        clearCart();

        navigate(`/payment/${orderId}`, {
          state: {
            orderId: orderId,
            totalAmount: orderData.totalAmount,
          },
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.message || "Đặt hàng thất bại!";
        toast.error(errorMessage);

        if (error.response.status === 404) {
          toast.error("Một số sản phẩm không tồn tại!");
        }
      } else if (error.request) {
        toast.error("Không thể kết nối đến server!");
      } else {
        toast.error("Đã có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.checkout_page}>
      <h1>Check out</h1>

      {user ? (
        <div className={s.user_banner}>
          <p>
            ✓ Ordering with account: <strong>{user.email}</strong>
          </p>
        </div>
      ) : (
        <div className={s.guest_banner}>
          <p>
           Your are checking out as a Guest.{" "}
            <span
              onClick={() =>
                navigate("/login", { state: { from: "/checkout" } })
              }
            >
              Login
            </span>{" "}
            to save your order history.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={s.checkout_form}>
        <section className={s.form_section}>
          <h2>Customer Infomation</h2>

          <div className={s.form_grid}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className={s.form_section}>
          <h2>Shipping Address</h2>

          <div className={s.form_grid}>
            <input
              type="text"
              name="address"
              placeholder="Street/House No. *"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City/Province"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className={s.form_section}>
          <h2>Payment Method</h2>

          <div className={s.payment_options}>
            <label className={s.payment_option}>
              <input
                type="radio"
                name="paymentMethod"
                value="CASH"
                checked={formData.paymentMethod === "CASH"}
                onChange={handleChange}
              />
              <span>💵 Cash on Delivery (COD)</span>
            </label>

            <label className={s.payment_option}>
              <input
                type="radio"
                name="paymentMethod"
                value="MOMO"
                checked={formData.paymentMethod === "MOMO"}
                onChange={handleChange}
              />
              <span>📱 MoMo</span>
            </label>

            <label className={s.payment_option}>
              <input
                type="radio"
                name="paymentMethod"
                value="VNPay"
                checked={formData.paymentMethod === "VNPay"}
                onChange={handleChange}
              />
              <span>🏦 VNPay</span>
            </label>

            <label className={s.payment_option}>
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={formData.paymentMethod === "CARD"}
                onChange={handleChange}
              />
              <span>💳 Bank Transfer</span>
            </label>
          </div>
        </section>

        <section className={s.form_section}>
          <h2>Your Order</h2>

          <div className={s.order_summary}>
            <div className={s.summary_row}>
              <span>Subtotal:</span>
              <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className={s.summary_row}>
              <span>Shipping Fee:</span>
              <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className={`${s.summary_row} ${s.total}`}>
              <span>Order Total:</span>
              <span className={s.total_price}>
                {finalTotal.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </section>

        <button type="submit" disabled={loading} className={s.submit_btn}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
