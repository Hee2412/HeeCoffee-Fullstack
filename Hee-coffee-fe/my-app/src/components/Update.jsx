import { useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "../styles/Update.module.scss";

const getDisplayBirthday = (age) => {
  if (!age) return "N/A";
  const year = new Date().getFullYear() - age;
  return `01/01/${year}`;
};

export default function ProfileCard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    age: storedUser.age || "",
    address: storedUser.address || "",
    phoneNumber: storedUser.phoneNumber || "",
    email: storedUser.email || "",
  });
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const updateData = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };

    const userStorage = localStorage.getItem("user");
    const oldUser = userStorage ? JSON.parse(userStorage) : null;

    try {
      const userStorage = localStorage.getItem("user");
      const userObject = userStorage ? JSON.parse(userStorage) : null;
      const currentToken = userObject ? userObject.token : null;

      if (!currentToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      if (!updateData.name || !updateData.address) {
        throw new Error(
          "Please fill in all required fields (Name and Address)."
        );
      }

      const res = await fetch("http://localhost:8080/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed.");
      }

      const updatedProfileData = data.data;
      const newUserObject = {
        ...oldUser,
        ...updatedProfileData,
      };

      localStorage.setItem("user", JSON.stringify(newUserObject));

      setSuccessMsg("Profile updated successfully!");
      navigate("/");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={s.card_container}>
      <div className={s.card}>
        <div className={s.avatarWrap}>
          <img src="/coffee/img1.jpg" alt="avatar" className={s.avatar} />
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            defaultValue={formData.email}
            readOnly
            style={{ backgroundColor: "#cfcdcdff" }}
          />

          <input
            type="text"
            placeholder="Birthday"
            defaultValue={getDisplayBirthday(formData.age)}
            readOnly
            style={{ backgroundColor: "#cfcdcdff" }}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
          )}
          {successMsg && (
            <p style={{ color: "green", marginTop: "0.5rem" }}>{successMsg}</p>
          )}

          <button type="submit" className={s.updateBtn} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

        <p className={s.delete}>🗑 Delete account</p>
      </div>
    </div>
  );
}
