import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import MegaNav from "./components/MegaNav";
import s from "./index.module.scss";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer
        position="top-right" // Vị trí hiển thị (có thể là top-right, bottom-center,...)
        autoClose={3000} // Tự đóng sau 3000ms (3 giây)
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={s.main_wrapper}>
        <Navbar />
        <MegaNav />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
