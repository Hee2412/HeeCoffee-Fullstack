import { useEffect, useState } from "react";
import s from  "../styles/CategoryFilter.module.scss";

const categories = [
  "All",
  "Espresso",
  "Milk",
  "Cold Brew",
  "Signature",
  "Tea",
  "Juice",
  "Smoothies",
];

export default function CategoryFilter({ selected, onChange }) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
<div className={`${s.category_bar} ${visible ? "show" : "hide"}`}>
      <div className="category_bar_inner">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selected === cat ? "active" : ""}
            onClick={() => onChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
