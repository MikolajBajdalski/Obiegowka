import React, { useState } from "react";
import axios from "axios";

const EmployeeEditForm = ({ employee, onCancel, onSave }) => {
  if (!employee) {
    return <div>Błąd: brak danych pracownika!</div>;
  }

  const [formData, setFormData] = useState({
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    gender: employee.gender || "Mężczyzna",
    department: employee.department || "GAZY",
    position: employee.position || "Pracownik biurowy",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Edycja pracownika:", formData);

    try {
      const response = await axios.put(
        `http://localhost:5001/employees/${employee._id}`,
        formData
      );
      console.log("✅ Odpowiedź API:", response.data);
      onSave(); // Zamykamy formularz i odświeżamy listę
    } catch (error) {
      console.error("❌ Błąd aktualizacji:", error.response?.data || error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl mb-4 font-semibold">Edytuj pracownika</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Imię</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border p-2 bg-gray-700 text-white rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Nazwisko</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border p-2 bg-gray-700 text-white rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Płeć</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 bg-gray-700 text-white rounded"
            >
              <option value="Mężczyzna">Mężczyzna</option>
              <option value="Kobieta">Kobieta</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Dział</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border p-2 bg-gray-700 text-white rounded"
              required
            >
              <option value="GAZY">GAZY</option>
              <option value="OKNA">OKNA</option>
              <option value="PPOŻ">PPOŻ</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Stanowisko</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border p-2 bg-gray-700 text-white rounded"
              required
            >
              <option value="Pracownik biurowy">Pracownik biurowy</option>
              <option value="Handlowiec">Handlowiec</option>
              <option value="Magazynier">Magazynier</option>
              <option value="Kierowca">Kierowca</option>
              <option value="Techniczny">Techniczny</option>
              <option value="Serwisant PPOŻ">Serwisant PPOŻ</option>
              <option value="Montażysta">Montażysta</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Zapisz
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditForm;
