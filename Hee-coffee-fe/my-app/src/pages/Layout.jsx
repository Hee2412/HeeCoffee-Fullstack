// Layout.jsx
import Navbar from "../components/Navbar";
import MegaNav from "../components/MegaNav";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  return (
    <>
      <div className="main-wrapper">
        <Navbar />
        <MegaNav />
      </div>
      <div className="main-content">
        {children} {/* cái này sẽ thay đổi tuỳ route */}
      </div>
      <Footer />
    </>
  );
}
