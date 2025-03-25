import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [clothingList, setClothingList] = useState([]);
  const [existingClothingData, setExistingClothingData] = useState([]);

  useEffect(() => {
    fetchEmployee();
    fetchAssignments();
    fetchExistingClothing();
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
      setExistingClothingData(res.data);
    } catch (err) {
      console.error("Błąd ładowania danych odzieżowych pracownika:", err);
    }
  };

  useEffect(() => {
    if (employee && assignments.length > 0) {
      generateClothingList();
    }
  }, [employee, assignments, existingClothingData]);

  const generateClothingList = () => {
    const filtered = assignments.filter(
      (a) => a.position.name === employee.position
    );

    const prepared = filtered.map((entry) => {
      const existing = existingClothingData.find(
        (e) => e.clothingType._id === entry.clothingType._id
      );

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
        owned: existing?.quantity || 0,
        recordId: existing?._id || null,
      };
    });

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
          size: item.size,
          quantity: item.owned ?? 0,
        };

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
    }
  };

  if (!employee) return <div className="text-white p-4">Ładowanie...</div>;

  return (
    <div className="text-white p-6">
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
                <input
                  type="text"
                  value={item.size}
                  onChange={(e) =>
                    handleInputChange(index, "size", e.target.value)
                  }
                  className="w-full p-1 bg-gray-700 rounded"
                />
              </td>
              <td className="px-4 py-2">{item.entitled}</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={item.owned}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "owned",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full p-1 bg-gray-700 rounded"
                />
              </td>
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
