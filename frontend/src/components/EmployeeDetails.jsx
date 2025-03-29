import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import API_URL from "../api";
import { CLOTHING_SIZES, SHOE_SIZES } from "../constants/sizes";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [clothingList, setClothingList] = useState([]);
  const [existingClothingData, setExistingClothingData] = useState([]);
  const [issuedClothing, setIssuedClothing] = useState([]); // Nowy stan dla wydań magazynowych

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
      borderColor: "#4B5563",
      color: "#FFFFFF",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6B7280",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1F2937",
      color: "#FFFFFF",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#1a5fbe" : "#000000",
      color: "#FFFFFF",
      "&:active": {
        backgroundColor: "#6d806b",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#FFFFFF",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
    input: (provided) => ({
      ...provided,
      color: "#FFFFFF",
    }),
  };

  useEffect(() => {
    fetchEmployee();
    fetchAssignments();
    fetchExistingClothing();
    fetchIssuedClothing(); // Pobieramy dane o wydaniach magazynowych
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${API_URL}employees/${id}`);
      setEmployee(res.data);
    } catch (err) {
      console.error("Błąd ładowania pracownika:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${API_URL}clothingassignments`);
      setAssignments(res.data);
    } catch (err) {
      console.error("Błąd ładowania przydziałów:", err);
    }
  };

  const fetchExistingClothing = async () => {
    try {
      const res = await axios.get(`${API_URL}employeeclothing/employee/${id}`);
      console.log("Dane pobrane z employeeclothing:", res.data); // Logowanie danych
      setExistingClothingData(res.data);
    } catch (err) {
      console.error("Błąd ładowania danych odzieżowych pracownika:", err);
    }
  };

  const fetchIssuedClothing = async () => {
    try {
      const res = await axios.get(`${API_URL}inventory/issued/${id}`);
      setIssuedClothing(res.data); // Zapisujemy dane o wydaniach magazynowych
    } catch (err) {
      console.error("Błąd ładowania wydań magazynowych:", err);
    }
  };

  useEffect(() => {
    if (employee && assignments.length > 0) {
      generateClothingList();
    }
  }, [employee, assignments, existingClothingData, issuedClothing]);

  const generateClothingList = () => {
    const filtered = assignments.filter(
      (a) => a.position.name === employee.position
    );

    const prepared = filtered.map((entry) => {
      const existing = existingClothingData.find(
        (e) =>
          e.clothingType._id === entry.clothingType._id &&
          e.size === entry.size &&
          e.department === employee.department &&
          e.gender === employee.gender
      );

      console.log("Dopasowany wpis z existingClothingData:", existing); // Logowanie dopasowania

      return {
        clothingTypeId: entry.clothingType._id,
        name: entry.clothingType.name,
        requiresDepartmentColor: entry.clothingType.requiresDepartmentColor,
        departmentColor: entry.clothingType.requiresDepartmentColor
          ? employee.department
          : "Brak",
        gender: employee.gender,
        size: existing?.size || "",
        entitled: entry.limit,
        quantity: existing?.quantity || 0, // Ilość posiadana
        recordId: existing?._id || null,
      };
    });

    console.log("Lista ubrań:", prepared); // Logowanie listy ubrań
    setClothingList(prepared);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...clothingList];
    updated[index][field] = value;
    setClothingList(updated);
  };

  const handleSave = async () => {
    try {
      for (const item of clothingList) {
        const payload = {
          employee: id,
          clothingType: item.clothingTypeId,
          size: item.size || "Brak", // Domyślna wartość, jeśli brak rozmiaru
          quantity: item.quantity ?? 0,
          department: item.departmentColor || "Brak", // Domyślna wartość
          gender: item.gender || "Brak", // Domyślna wartość
        };

        console.log("Wysyłane dane:", payload); // Logowanie danych

        if (item.recordId) {
          await axios.put(
            `${API_URL}employeeclothing/${item.recordId}`,
            payload
          );
        } else {
          await axios.post(`${API_URL}employeeclothing/add`, payload);
        }
      }
      alert("Zapisano dane pracownika.");
    } catch (error) {
      console.error("Błąd zapisu odzieży pracownika:", error);
      alert("Wystąpił błąd podczas zapisywania danych. Sprawdź logi.");
    }
  };

  const getSizeOptions = () => {
    const combinedSizes = [...CLOTHING_SIZES, ...SHOE_SIZES];
    return combinedSizes.map((size) => ({
      value: size,
      label: size,
    }));
  };

  if (!employee) return <div className="text-white p-4">Ładowanie...</div>;

  return (
    <div className="text-white p-6">
      <h1 className="text-red-600 text-3xl font-bold mb-4">
        NIE DODAJE WYDAN MAGAZYNOWY, WYDANIA MAGAZYNOWE NIE ODNOTOWUJA SIE W
        BAZIE DANYCH
      </h1>
      <h2 className="text-2xl font-bold mb-4">Karta pracownika</h2>
      <div className="mb-4">
        <p>
          <strong>Imię:</strong> {employee.firstName}
        </p>
        <p>
          <strong>Nazwisko:</strong> {employee.lastName}
        </p>
        <p>
          <strong>Płeć:</strong> {employee.gender}
        </p>
        <p>
          <strong>Dział:</strong> {employee.department}
        </p>
        <p>
          <strong>Stanowisko:</strong> {employee.position}
        </p>
      </div>

      <table className="w-full table-auto border bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Rodzaj ubrania</th>
            <th className="px-4 py-2 text-left">Kolor ubrania</th>
            <th className="px-4 py-2 text-left">Płeć</th>
            <th className="px-4 py-2 text-left">Rozmiar</th>
            <th className="px-4 py-2 text-left">Ilość przysługująca</th>
            <th className="px-4 py-2 text-left">Ilość posiadana</th>
          </tr>
        </thead>
        <tbody>
          {clothingList.map((item, index) => (
            <tr key={index} className="border-t border-gray-700">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.departmentColor}</td>
              <td className="px-4 py-2">{item.gender}</td>
              <td className="px-4 py-2">
                <Select
                  options={getSizeOptions()}
                  value={{ value: item.size, label: item.size }}
                  onChange={(selectedOption) =>
                    handleInputChange(index, "size", selectedOption.value)
                  }
                  placeholder="Wybierz rozmiar"
                  className="text-black"
                  styles={customStyles}
                />
              </td>
              <td className="px-4 py-2">{item.entitled}</td>
              <td className="px-4 py-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button
          onClick={handleSave}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Zapisz zmiany
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
