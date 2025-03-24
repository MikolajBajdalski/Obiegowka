import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EmployeeCreateForm from "./EmployeeCreateForm"; // Formularz do dodawania
import EmployeeEditForm from "./EmployeeEditForm"; // Formularz do edycji

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Flaga otwierania formularza dodawania

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5001/employees");
      setEmployees(response.data);
    } catch (err) {
      setError("Nie udało się pobrać danych.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsAdding(false); // Zamykamy formularz dodawania, jeśli był otwarty
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedEmployee(null); // Zamykamy formularz edycji, jeśli był otwarty
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setIsAdding(false);
    fetchEmployees(); // Odświeżamy listę po edycji/dodaniu
  };

  if (loading)
    return <div className="text-white text-center mt-5">Ładowanie...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-5">{error}</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Lista Pracowników</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Dodaj
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-gray-800 text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Imię</th>
              <th className="px-4 py-2 text-left">Nazwisko</th>
              <th className="px-4 py-2 text-left">Płeć</th>
              <th className="px-4 py-2 text-left">Dział</th>
              <th className="px-4 py-2 text-left">Stanowisko</th>
              <th className="px-4 py-2 text-left">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="border-b border-gray-700">
                <td className="px-4 py-2">{employee.firstName}</td>
                <td className="px-4 py-2">{employee.lastName}</td>
                <td className="px-4 py-2">{employee.gender}</td>
                <td className="px-4 py-2">{employee.department}</td>
                <td className="px-4 py-2">{employee.position}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edytuj
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <EmployeeCreateForm onCancel={handleClose} onSave={handleClose} />
      )}
      {selectedEmployee && (
        <EmployeeEditForm
          employee={selectedEmployee}
          onCancel={handleClose}
          onSave={handleClose}
        />
      )}
    </div>
  );
};

export default EmployeeList;
