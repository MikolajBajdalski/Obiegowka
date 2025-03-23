import React, { useState } from "react";
import axios from "axios";

const ClothingForm = ({ onClothingAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    size: "",
    departmentColor: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/clothing/add",
        formData
      );
      console.log("✅ Ubranie dodane:", response.data);
      onClothingAdded(); // Odświeżenie listy po dodaniu
      setFormData({ name: "", type: "", size: "", departmentColor: false });
    } catch (error) {
      console.error("❌ Błąd dodawania ubrania:", error);
    }
  };

  return (
    <div>
      <h3>Dodaj nowe ubranie</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nazwa"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Typ"
          value={formData.type}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="size"
          placeholder="Rozmiar"
          value={formData.size}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="departmentColor"
            checked={formData.departmentColor}
            onChange={handleChange}
          />
          Uwzględnij kolor działu
        </label>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default ClothingForm;
