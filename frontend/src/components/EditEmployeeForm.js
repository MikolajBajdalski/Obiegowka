import React, { useState, useEffect } from "react";
import axios from "axios";

const EditEmployeeForm = ({ employee, onEmployeeUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    position: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        department: employee.department,
        position: employee.position,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5001/employees/${employee._id}`,
        formData
      );
      console.log("✅ Pracownik zaktualizowany!");
      onEmployeeUpdated();
    } catch (error) {
      console.error("❌ Błąd edycji pracownika:", error);
    }
  };

  return (
    <div>
      <h3>Edytuj pracownika</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />
        <button type="submit">Zapisz zmiany</button>
        <button type="button" onClick={onCancel}>
          Anuluj
        </button>
      </form>
    </div>
  );
};

export default EditEmployeeForm;
