import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeForm from "./EmployeeForm";
import EditEmployeeForm from "./EditEmployeeForm";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:5001/employees")
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Błąd pobierania pracowników:", error));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/employees/${id}`);
      console.log("✅ Pracownik usunięty!");
      fetchEmployees();
    } catch (error) {
      console.error("❌ Błąd usuwania pracownika:", error);
    }
  };

  return (
    <div>
      <h2>Lista pracowników</h2>
      <EmployeeForm onEmployeeAdded={fetchEmployees} />
      {editingEmployee ? (
        <EditEmployeeForm
          employee={editingEmployee}
          onEmployeeUpdated={() => {
            fetchEmployees();
            setEditingEmployee(null);
          }}
          onCancel={() => setEditingEmployee(null)}
        />
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee._id}>
              {employee.firstName} {employee.lastName} - {employee.department}
              <button onClick={() => setEditingEmployee(employee)}>
                Edytuj
              </button>
              <button onClick={() => handleDelete(employee._id)}>Usuń</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
