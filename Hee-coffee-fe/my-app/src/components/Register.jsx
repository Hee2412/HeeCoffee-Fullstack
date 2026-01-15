import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import s from "../styles/Register.module.scss";

const calculateAge = (dobString) => {
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.dob ||
      !formData.phone ||
      !formData.address
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const calculatedAge = calculateAge(formData.dob);

    if (calculatedAge < 10 || calculatedAge > 100) {
      setError("Invalid date of birth.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      age: calculatedAge,
      dob: undefined,
    };

    try {
      const res = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Registration failed. Email might be in use."
        );
      }

      console.log("Register success:", data);
      
      const redirectTo = location.state?.redirectTo;
      
      if (redirectTo) {
          navigate("/login", { 
              state: { redirectTo: redirectTo } 
          });
      } else {
          navigate("/login");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={s.register_container}>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} className={s.register_form}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className={s.optional_text}>
        Already have account?{" "}
        <Link to="/login" className={s.signin_link}>
          Sign in here
        </Link>
      </p>
    </div>
  );
}