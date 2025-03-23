import React, { useState } from "react";
import axios from "axios";

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    position: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/employees/add",
        formData
      );
      console.log("✅ Pracownik dodany:", response.data);
      onEmployeeAdded(); // Odświeżenie listy po dodaniu
      setFormData({
        firstName: "",
        lastName: "",
        department: "",
        position: "",
      });
    } catch (error) {
      console.error("❌ Błąd dodawania pracownika:", error);
    }
  };

  return (
    <div>
      <h3>Dodaj nowego pracownika</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Imię"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Nazwisko"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Dział"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Stanowisko"
          value={formData.position}
          onChange={handleChange}
          required
        />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
