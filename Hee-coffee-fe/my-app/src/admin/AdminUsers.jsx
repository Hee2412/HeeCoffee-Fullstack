// src/admin/AdminUsers.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  Users,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Shield,
  User as UserIcon,
} from "lucide-react";
import s from "./AdminUsers.module.scss";
import apiClient from "../api/apiClient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    phone: "",
    role: "USER",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (roleFilter !== "ALL") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/user/all");
      const data = response.data.data || response.data;
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      oldEmail: user.email,
      email: user.email,
      age: user.age,
      address: user.address || "",
      phone: user.phoneNumber || "",
      role: user.role,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        name: formData.name,
        oldEmail: editingUser.email,
        newEmail: formData.email,
        age: parseInt(formData.age),
        address: formData.address,
        phone: formData.phone,
        role: formData.role,
      };

      await apiClient.put("/user/admin-update", dataToSend);
      toast.success("User updated successfully!");
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("Failed to update user!");
    }
  };

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Confirm to delete",
      text: `Are you sure you want to delete user "${userName}"? This action can't be undone.`,
      icon: "warning",
      showCancelButton: true,
      heightAuto: true,
      width: "350px",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/user/${userId}`);
        Swal.fire(
          "Deleted!",
          `User "${userName}" has been deleted.`,
          "success"
        );
        fetchUsers();
      } catch (error) {
        console.error("Delete user error:", error);

        // ✅ Handle different error cases
        if (error.response?.status === 400) {
          const errorMessage =
            error.response?.data?.message ||
            "Cannot delete user with existing orders.";
          Swal.fire({
            icon: "error",
            title: "Cannot Delete User",
            text: errorMessage,
            footer:
              '<span style="color: #64748b;">Consider using soft delete or deactivating the user instead.</span>',
          });
        } else {
          Swal.fire(
            "ERROR!",
            "Delete user failed, please check console for information.",
            "error"
          );
        }
      }
    }
  };

  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div>
          <h1>User Management</h1>
          <p>Manage all registered users</p>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.search_box}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={s.select_wrapper}>
          <select
            className={s.role_filter}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>

        <div className={s.stats}>
          <Users size={18} />
          <span>Total: {users.length} users</span>
        </div>
      </div>

      <div className={s.table_wrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Age</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className={s.no_data}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={s.user_info}>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.age}</td>
                  <td>{user.address || "N/A"}</td>
                  <td>
                    <span
                      className={`${s.role_badge} ${
                        user.role === "ADMIN" ? s.admin : s.user
                      }`}
                    >
                      {user.role === "ADMIN" ? (
                        <>
                          <Shield size={14} />
                          Admin
                        </>
                      ) : (
                        <>
                          <UserIcon size={14} />
                          User
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button
                        className={s.edit_btn}
                        onClick={() => handleOpenModal(user)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={s.delete_btn}
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className={s.modal_overlay} onClick={handleCloseModal}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modal_header}>
              <h2>Edit User</h2>
              <button className={s.close_btn} onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.form_group}>
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter name"
                />
              </div>

              <div className={s.form_group}>
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>

              <div className={s.form_row}>
                <div className={s.form_group}>
                  <label>Age *</label>
                  <input
                    type="number"
                    required
                    min="14"
                    max="80"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="Age"
                  />
                </div>

                <div className={s.form_group}>
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className={s.form_group}>
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                  rows="3"
                />
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
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
