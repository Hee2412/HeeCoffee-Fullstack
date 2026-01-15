// src/admin/AdminOrders.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, Eye } from "lucide-react";
import OrderWorkflow from "../components/OrderWorkflow";
import s from "./AdminOrders.module.scss";

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      fetchAllOrders(user.token);
    }
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toString().includes(searchTerm) ||
          order.guestName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) < endDate
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFrom, dateTo]);

  const fetchAllOrders = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:8080/api/order/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched orders response:", response);

      const ordersData = response.data.data || response.data;

      const sortedOrders = [...ordersData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to load orders!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      console.log("Updating order:", orderId, "to status:", newStatus);

      await axios.put(
        `http://localhost:8080/api/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`Order #${orderId} updated to ${newStatus}!`);

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Update status error:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to update status!");
    }
  };

  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.spinner}></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className={s.orders_page}>
      <div className={s.page_header}>
        <div>
          <h1>Order Management</h1>
          <p>View and manage all customer orders</p>
        </div>
        <div className={s.stats_summary}>
          <span className={s.total}>Total: {orders.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className={s.filters}>
        <div className={s.search_box}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by Order ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={s.date_filters}>
          <input
            type="date"
            className={s.date_input}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From Date"
          />
          <span className={s.date_separator}>to</span>
          <input
            type="date"
            className={s.date_input}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To Date"
          />
          {(dateFrom || dateTo) && (
            <button
              className={s.clear_date_btn}
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className={s.select_wrapper}>
          <select
            className={s.status_filter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="ACTIVE">Processing</option>
            <option value="SHIPPING">Shipping</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
            <option value="ABANDONED">Abandoned</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className={s.table_container}>
        <table className={s.orders_table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status & Actions</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className={s.no_data}>
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td className={s.order_id}>#{order.orderId}</td>
                  <td>{order.guestName || "N/A"}</td>
                  <td className={s.date_cell}>
                    <div className={s.date_wrapper}>
                      <span className={s.date_main}>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className={s.date_time}>
                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className={s.amount}>
                    {order.totalAmount?.toLocaleString("vi-VN")}đ
                  </td>
                  <td>
                    <span className={s.payment_badge}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className={s.workflow_cell}>
                    <OrderWorkflow
                      order={order}
                      onStatusUpdate={handleUpdateStatus}
                    />
                  </td>
                  <td className={s.view_cell}>
                    <button
                      className={s.view_btn}
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
