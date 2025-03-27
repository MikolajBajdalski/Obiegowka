import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import DEPARTMENTS from "@/constants/departments";

const EmployeeCreateForm = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    department: "",
    position: "",
  });

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(`${API_URL}positions`);
        setPositions(response.data);
      } catch (error) {
        console.error("❌ Błąd pobierania stanowisk:", error);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Dodawanie nowego pracownika:", formData);
    console.log("📤 Wysyłam dane do API:", formData);

    try {
      const response = await axios.post(`${API_URL}employees/add`, formData);
      console.log("✅ Pracownik dodany:", response.data);
      onSave();
    } catch (error) {
      console.error(
        "❌ Błąd dodawania pracownika:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl text-white mb-4">Dodaj nowego pracownika</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-white">
            Imię:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-gray-700 text-white"
              required
            />
          </label>

          <label className="block mb-2 text-white">
            Nazwisko:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-gray-700 text-white"
              required
            />
          </label>

          <label className="block mb-2 text-white">
            Płeć:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="" disabled>
                -- Wybierz płeć --
              </option>
              <option value="Mężczyzna">Mężczyzna</option>
              <option value="Kobieta">Kobieta</option>
            </select>
          </label>

          <label className="block mb-2 text-white">
            Dział:
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="" disabled>
                -- Wybierz dział --
              </option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-2 text-white">
            Stanowisko:
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="" disabled>
                -- Wybierz stanowisko --
              </option>
              {positions.map((pos) => (
                <option key={pos._id} value={pos.name}>
                  {pos.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
            >
              Zapisz
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreateForm;
