import s from "../styles/Banner.module.scss";

export default function Banner() {
  return (
    <section
      className={s.banner_section}
      style={{ backgroundImage: "url('/coffee/bg-cafe.jpg')" }}
    >
      <div className={s.content}>
        <h1>Welcome to Hee Café</h1>
        <p>Your cozy little corner with caffeine and calm ☕✨</p>
      </div>
    </section>
  );
}
