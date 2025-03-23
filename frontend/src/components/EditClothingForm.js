import React, { useState, useEffect } from "react";
import axios from "axios";

const EditClothingForm = ({ clothing, onClothingUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    size: "",
    departmentColor: false,
  });

  useEffect(() => {
    if (clothing) {
      setFormData({
        name: clothing.name,
        type: clothing.type,
        size: clothing.size,
        departmentColor: clothing.departmentColor,
      });
    }
  }, [clothing]);

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
      await axios.put(
        `http://localhost:5001/clothing/${clothing._id}`,
        formData
      );
      console.log("✅ Ubranie zaktualizowane!");
      onClothingUpdated();
    } catch (error) {
      console.error("❌ Błąd edycji ubrania:", error);
    }
  };

  return (
    <div>
      <h3>Edytuj ubranie</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="size"
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
        <button type="submit">Zapisz zmiany</button>
        <button type="button" onClick={onCancel}>
          Anuluj
        </button>
      </form>
    </div>
  );
};

export default EditClothingForm;
