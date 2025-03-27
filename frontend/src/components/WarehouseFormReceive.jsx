import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import API_URL from "../api";
import { CLOTHING_SIZES, SHOE_SIZES } from "../constants/sizes"; // Import rozmiarów
import DEPARTMENTS from "../constants/departments";

const WarehouseFormReceive = ({ onClose }) => {
  const [formData, setFormData] = useState({
    clothingType: null,
    department: "",
    size: "",
    quantity: 0,
  });

  const [clothingTypes, setClothingTypes] = useState([]);

  // Pobierz listę rodzajów ubrań z backendu
  useEffect(() => {
    const fetchClothingTypes = async () => {
      try {
        // Zmieniono endpoint na /clothingtype
        const res = await axios.get(`${API_URL}clothingtype`);
        setClothingTypes(
          res.data.map((type) => ({
            value: type._id, // ObjectId
            label: type.name, // Nazwa ubrania
          }))
        );
      } catch (err) {
        console.error("Błąd pobierania rodzajów ubrań:", err);
      }
    };

    fetchClothingTypes();
  }, []);

  // Połącz listy rozmiarów ubrań i butów
  const ALL_SIZES = [...CLOTHING_SIZES, ...SHOE_SIZES];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}inventory/receive`, formData);
      alert("Przyjęcie magazynowe zapisane!");
      onClose();
    } catch (err) {
      console.error("Błąd przyjęcia magazynowego:", err);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#374151", // Ciemne tło
      borderColor: "#374151", // Ciemniejsza ramka
      color: "#ffffff", // Biały tekst
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#374151", // Ciemne tło menu
    }),
    option: (provided, state) => ({
      ...provided,
      color: "#ffffff", // Biały tekst
      backgroundColor: state.isFocused ? "#1F2937" : "#374151", // Biały tekst na hover, szary tekst w stanie normalnym
      cursor: "pointer", // Zmieniamy kursor na wskaźnik
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff", // Biały tekst dla pojedynczej wartości
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#374151", // Tło wybranych wartości
      color: "#ffffff", // Biały tekst
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#ffffff", // Biały tekst dla etykiet
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#ffffff", // Biały tekst dla przycisku usuwania
      ":hover": {
        backgroundColor: "#4b5563", // Podświetlenie przycisku usuwania
        color: "#ffffff",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "#FFFFFF",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#FFFFFF",
    }),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded text-white w-96">
        <h2 className="text-xl font-bold mb-4">Przyjęcie magazynowe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Rodzaj ubrania</label>
            <Select
              options={clothingTypes}
              onChange={(selected) =>
                setFormData({ ...formData, clothingType: selected.value })
              }
              className="text-black"
              placeholder="Wybierz rodzaj ubrania"
              styles={customStyles} // Dodano style dla dark mode
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Dział</label>
            <Select
              options={DEPARTMENTS.map((dept) => ({
                value: dept.name,
                label: dept.name,
              }))}
              onChange={(selected) =>
                setFormData({ ...formData, department: selected.value })
              }
              className="text-black"
              placeholder="Wybierz dział"
              styles={customStyles} // Dodano style dla dark mode
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Rozmiar</label>
            <Select
              options={ALL_SIZES.map((size) => ({
                value: size,
                label: size,
              }))}
              onChange={(selected) =>
                setFormData({ ...formData, size: selected.value })
              }
              className="text-black"
              placeholder="Wybierz rozmiar"
              styles={customStyles} // Dodano style dla dark mode
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

export default WarehouseFormReceive;
