import s from "../styles/ProductCard.module.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "./CartContext.jsx";
import { ShoppingCart } from "lucide-react";

import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const spanRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(0);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const el = spanRef.current;
    if (el) {
      const delta = el.scrollHeight - 40;
      if (delta > 0) {
        setShouldScroll(true);
        setScrollAmount(delta);
      }
    }
  }, []);

  const handleAddToCart = () => {
    addToCart(product);

    toast(
      (t) => (
        <span>
          Add <strong>{product.productName}</strong> in{" "}
          <b
            onClick={() => {
              navigate("/cart");
              toast.dismiss(t.id);
            }}
            style={{
              color: "#28a745",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Cart 🛒
          </b>
        </span>
      ),
      {
        icon: "✅",
        duration: 3000,
        style: {
          border: "2px solid #28a745",
          padding: "16px",
          color: "#212529",
        },
      }
    );
  };

  return (
    <div className={s.product_card}>
      <div className={s.image_wrapper}>
        <img
          className={s.product_img}
          src={`${product.img}`}
          alt={product.productName}
        />

        <div className={s.overlay}>
          <button
            className={s.add_to_cart_btn}
            onClick={handleAddToCart}
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={24} />
            <span>Add</span>
          </button>
        </div>
      </div>
      <h4>{product.productName}</h4>
      <p className={s.desc}>
        <span
          ref={spanRef}
          style={
            shouldScroll
              ? {
                  animation: `scrollText ${
                    scrollAmount * 250
                  }ms ease-in-out infinite`,
                }
              : {}
          }
        >
          {product.description}
        </span>
      </p>
      <p className={s.price}>
        {product.price?.toLocaleString("en-US")}
        <small>đ</small>
      </p>
    </div>
  );
}
