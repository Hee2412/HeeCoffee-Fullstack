// src/components/MegaNav.jsx
import s from "../styles/MegaNav.module.scss";
import { Menu } from "lucide-react";

export default function MegaNav({ onToggleFilter }) {
  
  return (
    <nav className={s.mega_nav}>
      <div className={s.mega_nav_left}>
        <button className={s.menu_button} onClick={onToggleFilter}>
          <Menu size={20} />
        </button>
        <ul className={s.mega_nav_menu}>
          <li>Home ▾</li>
          <li>Category ▾</li>
          <li>Products ▾</li>
          <li>Pages ▾</li>
          <li>Blog ▾</li>
          <li>Elements ▾</li>
        </ul>
      </div>
      <div className={s.mega_nav_right}>
        <span>📞 <strong>+123 ( 456 ) ( 7890 )</strong></span>
      </div>
    </nav>
  );
}

