import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TrendingUp } from "lucide-react";
import s from "./AdminDashboard.module.scss";

const isPendingOrActive = (status) =>
  status === "PENDING_PAYMENT" || status === "ACTIVE";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    monthChange: 0,
    weekChange: 0,
    totalUsers: 0,
    totalProducts: 0,
    // Thay đổi: Thống kê orders trong ngày theo status
    todayPendingOrders: 0,
    todayCompletedOrders: 0,
    todayCanceledOrders: 0,
    todayTotalOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  // Helper functions to get start of periods
  const getStartOfWeek = useCallback((date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }, []);

  const getStartOfMonth = useCallback((date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }, []);

  const getStartOfDay = useCallback((date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Calculate revenue for different periods
  const calculateRevenue = useCallback(
    (orders) => {
      const now = new Date();

      // Today
      const startOfToday = getStartOfDay(now);
      const todayRevenue = orders
        .filter((o) => new Date(o.createdAt) >= startOfToday)
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // This Week
      const startOfThisWeek = getStartOfWeek(now);
      const thisWeekRevenue = orders
        .filter((o) => new Date(o.createdAt) >= startOfThisWeek)
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // Last Week
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
      const endOfLastWeek = new Date(startOfThisWeek);
      const lastWeekRevenue = orders
        .filter((o) => {
          const date = new Date(o.createdAt);
          return date >= startOfLastWeek && date < endOfLastWeek;
        })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // This Month
      const startOfThisMonth = getStartOfMonth(now);
      const thisMonthRevenue = orders
        .filter((o) => new Date(o.createdAt) >= startOfThisMonth)
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // Last Month
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthRevenue = orders
        .filter((o) => {
          const date = new Date(o.createdAt);
          return date >= startOfLastMonth && date < endOfLastMonth;
        })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // Calculate percentage changes
      const monthChange =
        lastMonthRevenue > 0
          ? (
              ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
              100
            ).toFixed(1)
          : 0;

      const weekChange =
        lastWeekRevenue > 0
          ? (
              ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) *
              100
            ).toFixed(1)
          : 0;

      return {
        today: todayRevenue,
        thisWeek: thisWeekRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        monthChange: parseFloat(monthChange),
        weekChange: parseFloat(weekChange),
      };
    },
    [getStartOfDay, getStartOfWeek, getStartOfMonth]
  );

  // Hàm tính số orders trong ngày theo status
  const calculateTodayOrders = useCallback(
    (orders) => {
      const now = new Date();
      const startOfToday = getStartOfDay(now);

      // Lọc orders trong ngày
      const todayOrders = orders.filter(
        (o) => new Date(o.createdAt) >= startOfToday
      );

      // Đếm theo từng status
      const pendingOrders = todayOrders.filter((o) =>
        isPendingOrActive(o.status)
      ).length;

      const completedOrders = todayOrders.filter(
        (o) => o.status === "COMPLETED"
      ).length;

      const canceledOrders = todayOrders.filter(
        (o) => o.status === "CANCELED"
      ).length;

      return {
        todayPendingOrders: pendingOrders,
        todayCompletedOrders: completedOrders,
        todayCanceledOrders: canceledOrders,
        todayTotalOrders: todayOrders.length,
      };
    },
    [getStartOfDay]
  );

  const fetchDashboardData = useCallback(
    async (token) => {
      try {
        setLoading(true);

        const ordersResponse = await axios.get(
          "http://localhost:8080/api/order/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const orders = ordersResponse.data.data || ordersResponse.data;
        const revenueMetrics = calculateRevenue(orders);
        const todayOrdersMetrics = calculateTodayOrders(orders);

        setStats({
          totalOrders: orders.length,
          todayRevenue: revenueMetrics.today,
          weekRevenue: revenueMetrics.thisWeek,
          monthRevenue: revenueMetrics.thisMonth,
          monthChange: revenueMetrics.monthChange,
          weekChange: revenueMetrics.weekChange,

          todayPendingOrders: todayOrdersMetrics.todayPendingOrders,
          todayCompletedOrders: todayOrdersMetrics.todayCompletedOrders,
          todayCanceledOrders: todayOrdersMetrics.todayCanceledOrders,
          todayTotalOrders: todayOrdersMetrics.todayTotalOrders,
        });

        const recent = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        setRecentOrders(recent);
      } catch (error) {
        console.error("Fetch dashboard error:", error);
        toast.error("Failed to load dashboard data!");
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      setStats,
      setRecentOrders,
      calculateRevenue,
      calculateTodayOrders,
    ]
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      fetchDashboardData(user.token);
    }
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={s.dashboard}>
      <div className={s.dashboard_header}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>
      </div>

      <div className={s.stats_grid}>
        <div className={`${s.stat_card} ${s.revenue}`}>
          <div className={s.stat_info}>
            <p className={s.stat_label}>Revenue</p>

            <div className={s.revenue_breakdown}>
              <div className={s.revenue_item}>
                <span className={s.revenue_period}>This Month:</span>
                <span className={s.revenue_amount}>
                  {stats.monthRevenue.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className={s.revenue_item}>
                <span className={s.revenue_period}>This Week:</span>
                <span className={s.revenue_amount}>
                  {stats.weekRevenue.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className={s.revenue_item}>
                <span className={s.revenue_period}>Today:</span>
                <span className={s.revenue_amount}>
                  {stats.todayRevenue.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <div className={s.trends}>
              <span
                className={`${s.stat_trend} ${
                  stats.monthChange > 0
                    ? s.positive
                    : stats.monthChange < 0
                    ? s.negative
                    : s.neutral
                }`}
              >
                <TrendingUp size={16} />
                {stats.monthChange > 0 ? "+" : ""}
                {stats.monthChange}% vs last month
              </span>

              <span
                className={`${s.stat_trend} ${
                  stats.weekChange > 0
                    ? s.positive
                    : stats.weekChange < 0
                    ? s.negative
                    : s.neutral
                }`}
              >
                <TrendingUp size={16} />
                {stats.weekChange > 0 ? "+" : ""}
                {stats.weekChange}% vs last week
              </span>
            </div>
          </div>
        </div>

        <div className={`${s.stat_card} ${s.orders}`}>
          <div className={s.stat_info}>
            <p className={s.stat_label}>Today's Orders</p>

            <div className={s.revenue_breakdown}>
              <div className={s.revenue_item}>
                <span className={s.revenue_period}>Total:</span>
                <span className={s.revenue_amount}>
                  {stats.todayTotalOrders}
                </span>
              </div>

              <div className={s.revenue_item}>
                <span className={s.revenue_period}>Pending:</span>
                <span className={s.revenue_amount} style={{ color: "#f59e0b" }}>
                  {stats.todayPendingOrders}
                </span>
              </div>

              <div className={s.revenue_item}>
                <span className={s.revenue_period}>Completed:</span>
                <span className={s.revenue_amount} style={{ color: "#10b981" }}>
                  {stats.todayCompletedOrders}
                </span>
              </div>

              <div className={s.revenue_item}>
                <span className={s.revenue_period}>Canceled:</span>
                <span className={s.revenue_amount} style={{ color: "#ef4444" }}>
                  {stats.todayCanceledOrders}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.recent_orders_section}>
        <div className={s.section_header}>
          <h2>Recent Orders</h2>
          <button
            className={s.view_all_btn}
            onClick={() => navigate("/admin/orders")}
          >
            View All Orders
          </button>
        </div>

        <div className={s.orders_table_wrapper}>
          <table className={s.orders_table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>{order.guestName || "N/A"}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className={s.amount}>
                    {order.totalAmount?.toLocaleString("vi-VN")}đ
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span
                      className={`${s.status_badge} ${
                        s[order.status?.toLowerCase()]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
