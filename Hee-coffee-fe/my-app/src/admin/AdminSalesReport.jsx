// src/admin/AdminSalesReport.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Search,
  X,
  FileText,
  DollarSign,
  Package,
} from "lucide-react";
import s from "./AdminSalesReport.module.scss";

export default function AdminSalesReport() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchSelected, setSearchSelected] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      fetchProducts(user.token);
    }
  }, []);

  const fetchProducts = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/product/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data || response.data;
      setProducts(data);
      setAvailableProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products!");
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setAvailableProducts(products);
    setSelectedProducts([]);
    setSearchAvailable("");
    setSearchSelected("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDateFrom("");
    setDateTo("");
  };

  const moveToSelected = (product) => {
    setAvailableProducts((prev) => prev.filter((p) => p.id !== product.id));
    setSelectedProducts((prev) => [...prev, product]);
  };

  const moveToAvailable = (product) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    setAvailableProducts((prev) => [...prev, product]);
  };

  const moveAllToSelected = () => {
    const filtered = getFilteredAvailable();
    setSelectedProducts((prev) => [...prev, ...filtered]);
    setAvailableProducts((prev) =>
      prev.filter((p) => !filtered.some((f) => f.id === p.id))
    );
  };

  const moveAllToAvailable = () => {
    const filtered = getFilteredSelected();
    setAvailableProducts((prev) => [...prev, ...filtered]);
    setSelectedProducts((prev) =>
      prev.filter((p) => !filtered.some((f) => f.id === p.id))
    );
  };

  const getFilteredAvailable = () => {
    return availableProducts.filter((p) =>
      p.productName.toLowerCase().includes(searchAvailable.toLowerCase())
    );
  };

  const getFilteredSelected = () => {
    return selectedProducts.filter((p) =>
      p.productName.toLowerCase().includes(searchSelected.toLowerCase())
    );
  };

  const handleSubmit = async () => {
    if (!dateFrom || !dateTo) {
      toast.error("Please select date range!");
      return;
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      toast.error("Start date must be before end date!");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const requestData = {
        dateFrom: dateFrom,
        dateTo: dateTo,
        productIds: selectedProducts.map((p) => p.id),
      };

      const response = await axios.post(
        "http://localhost:8080/api/order/sales-report",
        requestData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setReportData(response.data.data);
      setShowModal(false);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Generate report error:", error);
      toast.error("Failed to generate report!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div>
          <h1>Sales Report</h1>
          <p>Analyze product sales performance over time</p>
        </div>
        <button className={s.search_btn} onClick={handleOpenModal}>
          <Search size={20} />
          Generate Report
        </button>
      </div>

      {/* Report Results */}
      {reportData ? (
        <>
          {/* Summary Cards */}
          <div className={s.summary_grid}>
            <div className={`${s.summary_card} ${s.products}`}>
              <div className={s.card_icon}>
                <Package size={24} />
              </div>
              <div className={s.card_info}>
                <p className={s.card_label}>Products Sold</p>
                <h3 className={s.card_value}>
                  {reportData.products?.length || 0}
                </h3>
              </div>
            </div>

            <div className={`${s.summary_card} ${s.quantity}`}>
              <div className={s.card_icon}>
                <FileText size={24} />
              </div>
              <div className={s.card_info}>
                <p className={s.card_label}>Total Quantity</p>
                <h3 className={s.card_value}>
                  {reportData.summary?.totalQuantity || 0}
                </h3>
              </div>
            </div>

            <div className={`${s.summary_card} ${s.revenue}`}>
              <div className={s.card_icon}>
                <DollarSign size={24} />
              </div>
              <div className={s.card_info}>
                <p className={s.card_label}>Total Revenue</p>
                <h3 className={s.card_value}>
                  {reportData.summary?.totalRevenue?.toLocaleString("vi-VN")}đ
                </h3>
              </div>
            </div>
          </div>

          {/* Report Table */}
          <div className={s.table_wrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity Sold</th>
                  <th>Price</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.products?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={s.no_data}>
                      No sales data found for selected period
                    </td>
                  </tr>
                ) : (
                  reportData.products?.map((product) => (
                    <tr key={product.productId}>
                      <td>
                        <div className={s.product_cell}>
                          {product.productImage ? (
                            <img
                              src={product.productImage}
                              alt={product.productName}
                              className={s.product_image}
                            />
                          ) : (
                            <div className={s.no_image}>
                              <Package size={20} />
                            </div>
                          )}
                          <strong>{product.productName}</strong>
                        </div>
                      </td>
                      <td className={s.quantity_cell}>
                        {product.quantitySold}
                      </td>
                      <td className={s.price_cell}>
                        {product.price?.toLocaleString("vi-VN")}đ
                      </td>
                      <td className={s.revenue_cell}>
                        {product.totalRevenue?.toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className={s.empty_state}>
          <Search size={64} />
          <h3>No Report Generated</h3>
          <p>Click "Generate Report" to analyze your sales data</p>
        </div>
      )}

      {/* Filter Modal */}
      {showModal && (
        <div className={s.modal_overlay} onClick={handleCloseModal}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modal_header}>
              <h2>Generate Sales Report</h2>
              <button className={s.close_btn} onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <div className={s.modal_body}>
              {/* Date Range */}
              <div className={s.date_section}>
                <label>Select Date Range *</label>
                <div className={s.date_inputs}>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className={s.selection_section}>
                <label>Select Products (Optional - Leave empty for all)</label>

                <div className={s.dual_listbox}>
                  {/* Available Products */}
                  <div className={s.listbox}>
                    <div className={s.listbox_header}>
                      <span>Available Products</span>
                      <span className={s.count}>
                        {getFilteredAvailable().length}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className={s.search_input}
                      value={searchAvailable}
                      onChange={(e) => setSearchAvailable(e.target.value)}
                    />
                    <button
                      className={s.select_all_btn}
                      onClick={moveAllToSelected}
                      disabled={getFilteredAvailable().length === 0}
                    >
                      Select All
                    </button>
                    <div className={s.listbox_items}>
                      {getFilteredAvailable().map((product) => (
                        <div
                          key={product.id}
                          className={s.listbox_item}
                          onClick={() => moveToSelected(product)}
                        >
                          {product.productName}
                        </div>
                      ))}
                      {getFilteredAvailable().length === 0 && (
                        <div className={s.empty_list}>No products</div>
                      )}
                    </div>                    
                  </div>                

                  {/* Selected Products */}
                  <div className={s.listbox}>
                    
                    <div className={s.listbox_header}>
                      <span>Selected Products</span>
                      <span className={s.count}>
                        {getFilteredSelected().length}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className={s.search_input}
                      value={searchSelected}
                      onChange={(e) => setSearchSelected(e.target.value)}
                    />
                    <button
                      className={s.clear_all_btn}
                      onClick={moveAllToAvailable}
                      disabled={selectedProducts.length === 0}
                    >
                      Clear All
                    </button>
                    <div className={s.listbox_items}>
                      {getFilteredSelected().map((product) => (
                        <div
                          key={product.id}
                          className={s.listbox_item}
                          onClick={() => moveToAvailable(product)}
                        >
                          {product.productName}
                        </div>
                      ))}
                      {getFilteredSelected().length === 0 && (
                        <div className={s.empty_list}>
                          No products selected
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            <div className={s.modal_footer}>
              <button className={s.cancel_btn} onClick={handleCloseModal}>
                Cancel
              </button>
              <button
                className={s.submit_btn}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}