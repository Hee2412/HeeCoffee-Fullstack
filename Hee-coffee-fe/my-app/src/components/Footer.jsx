import s from "../styles/Footer.module.scss";
import {
  faFacebookF,
  faXTwitter,
  faDribbble,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faLocationDot,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footer_column}>
        <h2>Hee Càfe</h2>
        <p>
          Carrot is the biggest market of grocery products. Get your daily needs
          from our store.
        </p>
        <ul className={s.contact_info}>
          <li>
            <FontAwesomeIcon icon={faLocationDot} /> 4-6 Ap Bac, Ward 13, Tan
            Binh District
          </li>
          <li>
            <FontAwesomeIcon icon={faEnvelope} />

            <button className={s.fake_link} onClick={() => {}}>
              heecafe@email.com
            </button>
          </li>
          <li>
            <FontAwesomeIcon icon={faPhone} />{" "}
            <button className={s.fake_link} onClick={() => {}}>
              0912345678
            </button>
          </li>
        </ul>
      </div>

      <div className={s.footer_column}>
        <h3>Company</h3>
        <ul>
          <li>
            {" "}
            <button className={s.fake_link} onClick={() => {}}>
              About Us
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Delivery Information
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Privacy Policy
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Terms & Conditions
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Contact Us
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Support Center
            </button>
          </li>
        </ul>
      </div>

      <div className={s.footer_column}>
        <h3>Category</h3>
        <ul>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Dairy & Bakery
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Fruits & Vegetable
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Snack & Spice
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Juice & Drinks
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Chicken & Meat
            </button>
          </li>
          <li>
            <button className={s.fake_link} onClick={() => {}}>
              Fast Food
            </button>
          </li>
        </ul>
      </div>

      <div className={s.footer_column}>
        <h3>Subscribe Our Newsletter</h3>
        <div className={s.newsletter}>
          <input type="text" placeholder="Search here..." />
          <button type="submit">
            <i className={s.icon_send} />
          </button>
        </div>
        <div className={s.social_icons}>
          <button>
            <FontAwesomeIcon icon={faFacebookF} />
          </button>
          <button>
            <FontAwesomeIcon icon={faXTwitter} />
          </button>
          <button>
            <FontAwesomeIcon icon={faDribbble} />
          </button>
          <button>
            <FontAwesomeIcon icon={faInstagram} />
          </button>
        </div>
        <div className={s.footer_images}>
          <img src="/coffee/img1.jpg" alt="img1" />
          <img src="/coffee/img2.jpg" alt="img2" />
          <img src="/coffee/img3.jpg" alt="img3" />
          <img src="/coffee/img4.jpg" alt="img4" />
          <img src="/coffee/img5.jpg" alt="img5" />
        </div>
      </div>
    </footer>
  );
}
