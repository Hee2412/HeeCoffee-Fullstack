import ReactDOM from "react-dom/client";
import s from "./index.module.scss";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./pages/HomePage";
import Banner from "./components/Banner";
import Update from "./components/Update";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import { CartProvider } from "./components/CartContext";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import PaymentQR from "./pages/PaymentQR";
import "./styles/animation.css";

// ✅ Import Auth Components
import { AuthProvider } from "./contexts/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import Admin Components
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";
import AdminUsers from "./admin/AdminUsers";
import AdminSalesReport from "./admin/AdminSalesReport";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Homepage với Banner
      {
        index: true,
        element: (
          <>
            <Banner />
            <div className={s.main_wrapper}>
              <HomePage />
            </div>
          </>
        ),
      },

      // ✅ Public Auth pages
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      // ✅ Protected User Routes
      {
        path: "update",
        element: (
          <ProtectedRoute>
            <Update />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:orderId",
        element: (
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        ),
      },

      // ⚠️ Cart & Checkout - You may want to protect these too
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />, // Consider: <ProtectedRoute><Checkout /></ProtectedRoute>
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      {
        path: "payment/:orderId",
        element: <PaymentQR />,
      },
    ],
  },

  // ✅ Admin Routes - Protected with requireAdmin
  {
    path: "admin",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "sales-report",
        element: <AdminSalesReport />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>
);

reportWebVitals();
