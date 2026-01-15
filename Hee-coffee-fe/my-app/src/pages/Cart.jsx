// src/pages/Cart.jsx
import s from "../styles/Cart.module.scss";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } =
    useCart();

  const handleUpdateQuantity = (id, change) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity);
      }
    }
  };

  // Cấu hình phí ship
  const shippingFee = 30000;
  const freeShippingThreshold = 500000;
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const finalShippingFee = isFreeShipping ? 0 : shippingFee;

  return (
    <div className={s.cart_page}>

      {cartItems.length === 0 ? (
        <div className={s.empty_cart}>
          <ShoppingBag size={64} className={s.empty_icon} />
          <p className={s.empty_message}>Your cart is empty</p>
          <p className={s.empty_subtitle}>
            Go discover for more new items!
          </p>
          <button
            onClick={() => navigate("/")}
            className={s.continue_shopping_btn}
          >
            Let's Shopping!
          </button>
        </div>
      ) : (
        <>
          <div className={s.cart_table_wrapper}>
            <table className={s.cart_table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className={s.cart_item}>
                    <td className={s.product_cell}>
                      <div className={s.product_info}>
                        <img
                          src={item.img || "/placeholder.jpg"}
                          alt={item.productName}
                          className={s.product_img}
                        />
                        <span className={s.product_name}>
                          {item.productName}
                        </span>
                      </div>
                    </td>
                    <td className={s.price_cell}>
                      {(item.price || 0).toLocaleString("vi-VN")}đ
                    </td>
                    <td className={s.quantity_cell}>
                      <div className={s.quantity_control}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className={s.qty_btn}
                          aria-label="Tăng số lượng"
                        >
                          <Plus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          readOnly
                          min="1"
                          className={s.qty_input}
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className={s.qty_btn}
                          aria-label="Giảm số lượng"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className={s.total_cell}>
                      {((item.price || 0) * item.quantity).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </td>
                    <td className={s.action_cell}>
                      <button
                        className={s.delete_btn}
                        onClick={() => removeFromCart(item.id)}
                        title="Xóa sản phẩm"
                        aria-label="Xóa sản phẩm khỏi giỏ hàng"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={s.cart_footer}>
            <button
              onClick={() => navigate("/")}
              className={s.continue_shopping_link}
            >
              ← Continue Shopping
            </button>

            <div className={s.cart_summary}>
              <h3 className={s.summary_title}>Summary</h3>

              <div className={s.summary_row}>
                <span>({totalItems} products):</span>
                <span className={s.subtotal}>
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className={s.summary_row}>
                <span>Shipping:</span>
                <span className={isFreeShipping ? s.free : ""}>
                  {isFreeShipping ? (
                    <span className={s.free_badge}>Free ✓</span>
                  ) : (
                    `${finalShippingFee.toLocaleString("vi-VN")}đ`
                  )}
                </span>
              </div>

              {!isFreeShipping && (
                <div className={s.shipping_notice}>
                  🎁 Buy more{" "}
                  {(freeShippingThreshold - totalPrice).toLocaleString("vi-VN")}
                  đ to get <strong>freeship</strong>!
                </div>
              )}

              {isFreeShipping && (
                <div className={s.shipping_success}>
                  🎉 Congratulation! Your order is now freeshipped.
                </div>
              )}

              <div className={`${s.summary_row} ${s.total_row}`}>
                <span>Total:</span>
                <span className={s.total_price}>
                  {(totalPrice + finalShippingFee).toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button
                className={s.checkout_btn}
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>

              <p className={s.checkout_note}>
                * You will be redirected to the checkout page to complete your
                purchase.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
