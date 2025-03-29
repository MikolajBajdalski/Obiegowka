import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import API_URL from "../api";
import DEPARTMENTS from "../constants/departments"; // Import listy działów
import { CLOTHING_SIZES, SHOE_SIZES } from "../constants/sizes"; // Import rozmiarów

const ClothingSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    clothingType: [],
    color: [],
    size: [],
    gender: [],
  });

  const getColorClass = (departmentName) => {
    const department = DEPARTMENTS.find((dept) => dept.name === departmentName);
    return department ? department.color : ""; // Zwraca klasę CSS lub pusty string
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}clothingassignments/summary`);
        setSummary(res.data);
      } catch (err) {
        console.error("❌ Błąd pobierania zestawienia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Połącz listy rozmiarów ubrań i butów
  const ALL_SIZES = [...CLOTHING_SIZES, ...SHOE_SIZES];

  // Funkcja zwracająca unikatowe wartości dla danego klucza
  const uniqueValues = (key) => {
    if (key === "size") {
      return ALL_SIZES.map((size) => ({ value: size, label: size }));
    }

    const values = [
      ...new Set(summary.map((item) => item[key]).filter(Boolean)),
    ];

    return values.map((val) => ({ value: val, label: val }));
  };

  // Funkcja do aktualizacji filtrów
  const handleFilterChange = (key, selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((opt) => opt.value)
      : [];
    setFilters((prev) => ({
      ...prev,
      [key]: selectedValues,
    }));
  };

  // Filtruje dane w zależności od zaznaczonych wartości w state.filters
  const applyFilters = (data) => {
    return data.filter((item) => {
      const matchesType =
        filters.clothingType.length === 0 ||
        filters.clothingType.includes(item.clothingType);
      const matchesColor =
        filters.color.length === 0 || filters.color.includes(item.color);
      const matchesSize =
        filters.size.length === 0 || filters.size.includes(item.size);
      const matchesGender =
        filters.gender.length === 0 || filters.gender.includes(item.gender);
      return matchesType && matchesColor && matchesSize && matchesGender;
    });
  };

  const filteredData = applyFilters(summary);

  if (loading) return <div className="p-6 text-white">Ładowanie...</div>;

  const filterLabels = {
    clothingType: "Rodzaj ubrania",
    color: "Kolor ubrania",
    size: "Rozmiar",
    gender: "Płeć",
  };

  // Style dla react-select w trybie dark mode
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937", // Ciemne tło
      borderColor: "#374151", // Ciemniejsza ramka
      color: "#ffffff", // Biały tekst
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937", // Ciemne tło menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#374151" : "#1f2937", // Podświetlenie opcji
      color: "#ffffff", // Biały tekst
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
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Zestawienie zapotrzebowania</h2>

      {/* 🔍 Filtry */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Object.keys(filters).map((key) => (
          <div key={key}>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {filterLabels[key]}
            </label>
            <Select
              options={uniqueValues(key)}
              isMulti
              value={filters[key].map((val) => ({ value: val, label: val }))}
              onChange={(selectedOptions) =>
                handleFilterChange(key, selectedOptions)
              }
              styles={customStyles} // Dodano style dla dark mode
              placeholder={`Wybierz ${filterLabels[key].toLowerCase()}`}
              closeMenuOnSelect={false}
            />
          </div>
        ))}
      </div>

      {/* 🔄 Reset filtrów */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() =>
            setFilters({ clothingType: [], color: [], size: [], gender: [] })
          }
        >
          Resetuj filtry
        </button>
      </div>

      {/* 📋 Tabela */}
      <table className="w-full table-auto border bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Rodzaj ubrania</th>
            <th className="px-4 py-2 text-left">Kolor ubrania</th>
            <th className="px-4 py-2 text-left">Rozmiar</th>
            <th className="px-4 py-2 text-left">Płeć</th>
            <th className="px-4 py-2 text-left">Ilość do zakupu</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                Brak braków do uzupełnienia 🎉
              </td>
            </tr>
          ) : (
            filteredData.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="px-4 py-2">{item.clothingType}</td>
                <td className={`px-4 py-2 ${getColorClass(item.color)}`}>
                  {item.color}
                </td>
                <td className="px-4 py-2">{item.size}</td>
                <td className="px-4 py-2">{item.gender}</td>
                <td className="px-4 py-2 font-semibold">{item.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClothingSummary;
