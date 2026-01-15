// src/admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import startCase from "lodash/startCase";
import { toast } from "react-toastify";
import { Plus, Edit2, Search, X, Save, Package, Image } from "lucide-react";
import s from "./AdminProducts.module.scss";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    img: "",
    status: "",
    typeIds: [],
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      fetchProducts(user.token);
      fetchTypes(user.token);
    }
  }, []);

  useEffect(() => {
    let filtered = products;

    if (typeFilter !== "ALL") {
      filtered = filtered.filter((product) =>
        product.types?.some((type) => type.id === parseInt(typeFilter))
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, typeFilter]);

  const fetchProducts = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/product/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.data || response.data;
      console.log("Fetched products:", data);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products!");
    }
  };

  const fetchTypes = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data || response.data;
      setTypes(data);
    } catch (error) {
      console.error("Fetch types error:", error);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productName: product.productName,
        description: product.description || "",
        price: product.price,
        img: product.img || "",
        status: product.status,
        typeIds: product.types?.map((t) => t.id) || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        productName: "",
        description: "",
        price: "",
        img: "",
        status: "ACTIVE",
        typeIds: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleTypeToggle = (typeId) => {
    setFormData((prev) => ({
      ...prev,
      typeIds: prev.typeIds.includes(typeId)
        ? prev.typeIds.filter((id) => id !== typeId)
        : [...prev.typeIds, typeId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (editingProduct) {
        await axios.put(
          `http://localhost:8080/api/product/${editingProduct.id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/product", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success("Product created successfully!");
      }

      handleCloseModal();
      fetchProducts(user.token);
    } catch (error) {
      console.error("Save product error:", error);
      toast.error("Failed to save product!");
    }
  };
  return (
    <div className={s.container}>
      <div className={s.header}>
        <div>
          <h1>Product Management</h1>
          <p>Manage your store products and inventory</p>
        </div>
        <button className={s.add_btn} onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className={s.filters}>
        <div className={s.search_box}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={s.select_wrapper}>
          <select
            className={s.type_filter}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {startCase(type.types)}
              </option>
            ))}
          </select>
        </div>

        <div className={s.stats}>
          <Package size={18} />
          <span>Total: {products.length} products</span>
        </div>
      </div>

      <div className={s.table_wrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Status</th>
              <th>Types</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className={s.no_data}>
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.productName}
                        className={s.product_image}
                      />
                    ) : (
                      <div className={s.no_image}>
                        <Image size={24} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={s.product_info}>
                      <strong>{product.productName}</strong>
                      <p>{product.description}</p>
                    </div>
                  </td>
                  <td>
                    <div className={s.product_status}>
                      <p
                        className={s[`status_${product.status.toLowerCase()}`]}
                      >
                        {product.status}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className={s.type_badges}>
                      {product.types?.map((type) => (
                        <span key={type.id} className={s.type_badge}>
                          {type.types}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={s.price}>
                    {product.price?.toLocaleString("vi-VN")}đ
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button
                        className={s.edit_btn}
                        onClick={() => handleOpenModal(product)}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={s.modal_overlay} onClick={handleCloseModal}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modal_header}>
              <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button className={s.close_btn} onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.form_group}>
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div className={s.form_group}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className={s.form_group}>
                <label>Price *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div className={s.form_group}>
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.img}
                  onChange={(e) =>
                    setFormData({ ...formData, img: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className={s.form_group}>
                <label>Product Types *</label>
                <div className={s.type_checkboxes}>
                  {types.map((type) => (
                    <label key={type.id} className={s.checkbox_label}>
                      <input
                        type="checkbox"
                        checked={formData.typeIds.includes(type.id)}
                        onChange={() => handleTypeToggle(type.id)}
                      />
                      <span>{type.types}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={s.form_group}>
                <label>Status *</label>
                <select
                  className={s.select_status}
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">ACTIVE (Đang bán)</option>
                  <option value="INACTIVE">INACTIVE (Ngừng bán)</option>
                </select>
              </div>

              <div className={s.modal_footer}>
                <button
                  type="button"
                  className={s.cancel_btn}
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className={s.save_btn}>
                  <Save size={18} />
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
