import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import API_URL from "../api";

const WarehouseFormIssue = ({ inventory, selectedItem, onClose }) => {
  const [formData, setFormData] = useState({
    selectedItem: selectedItem || null,
    quantity: "",
    employee: null,
  });

  const [employees, setEmployees] = useState([]);

  // Pobierz kwalifikujących się pracowników
  const fetchEligibleEmployees = async () => {
    if (!formData.selectedItem) return;

    try {
      const res = await axios.post(`${API_URL}employeeClothing/eligible`, {
        clothingType: formData.selectedItem.clothingType._id,
        department: formData.selectedItem.department,
        gender: formData.selectedItem.gender,
        size: formData.selectedItem.size,
      });

      setEmployees(
        res.data.map((emp) => ({
          value: emp._id,
          label: `${emp.firstName} ${emp.lastName} (${emp.department})`,
        }))
      );
    } catch (err) {
      console.error("Błąd pobierania kwalifikujących się pracowników:", err);
    }
  };

  useEffect(() => {
    fetchEligibleEmployees();
  }, [formData.selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.selectedItem || !formData.employee) {
      alert("Wybierz ubranie i pracownika!");
      return;
    }

    if (formData.quantity <= 0) {
      alert("Podaj poprawną ilość!");
      return;
    }

    try {
      const payload = {
        clothingType: formData.selectedItem.clothingType._id,
        department: formData.selectedItem.department,
        gender: formData.selectedItem.gender,
        size: formData.selectedItem.size,
        quantity: formData.quantity,
        employee: formData.employee.value,
      };

      await axios.post(`${API_URL}inventory/issue`, payload);
      alert("Wydanie magazynowe zapisane!");
      onClose();
    } catch (err) {
      console.error("Błąd wydania magazynowego:", err);
      alert("Nie można wydać więcej niż jest na magazynie!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded text-white w-[800px]">
        <h2 className="text-xl font-bold mb-4">Wydanie magazynowe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Co wydajemy</label>
            <div className="w-full bg-gray-700 rounded border border-gray-600">
              <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-gray-800 font-bold text-white">
                <span>Rodzaj ubrania</span>
                <span>Dział</span>
                <span>Płeć</span>
                <span>Rozmiar</span>
                <span>Ilość</span>
              </div>
              <div className="grid grid-cols-5 gap-4 px-4 py-2">
                {formData.selectedItem ? (
                  <>
                    <span>{formData.selectedItem.clothingType.name}</span>
                    <span>{formData.selectedItem.department}</span>
                    <span>{formData.selectedItem.gender}</span>
                    <span>{formData.selectedItem.size}</span>
                    <span>{formData.selectedItem.quantity} szt.</span>
                  </>
                ) : (
                  <span className="col-span-5 text-center text-gray-400">
                    Brak wybranego ubrania
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Ilość</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Pracownik</label>
            <Select
              options={employees}
              onChange={(selected) =>
                setFormData({ ...formData, employee: selected })
              }
              className="text-black"
              placeholder="Wybierz pracownika"
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#374151",
                  borderColor: "#374151",
                  color: "#ffffff",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#374151",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? "#4b5563" : "#374151",
                  color: "#ffffff",
                  cursor: "pointer",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#ffffff",
                }),
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 rounded mr-2"
            >
              Anuluj
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 rounded">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseFormIssue;
