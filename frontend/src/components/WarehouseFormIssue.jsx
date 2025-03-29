import React, { useState } from "react";
import Select from "react-select";
import API_URL from "../api";

const WarehouseFormIssue = ({ inventory, onClose }) => {
  const [formData, setFormData] = useState({
    selectedItem: null,
    quantity: 0,
    employee: null,
  });

  const [employees, setEmployees] = useState([]);

  // Pobierz listę pracowników
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API_URL}employees`);
        setEmployees(
          res.data.map((emp) => ({
            value: emp._id,
            label: `${emp.firstName} ${emp.lastName} (${emp.department})`,
          }))
        );
      } catch (err) {
        console.error("Błąd pobierania pracowników:", err);
      }
    };

    fetchEmployees();
  }, []);

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
        color: formData.selectedItem.color,
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

  const inventoryOptions = inventory.map((item) => ({
    value: item,
    label: `${item.clothingType.name} (${item.color}, ${item.size}) - ${item.quantity} szt.`,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded text-white w-96">
        <h2 className="text-xl font-bold mb-4">Wydanie magazynowe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Ubranie</label>
            <Select
              options={inventoryOptions}
              onChange={(selected) =>
                setFormData({ ...formData, selectedItem: selected.value })
              }
              className="text-black"
              placeholder="Wybierz ubranie"
            />
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
