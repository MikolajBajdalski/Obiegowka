// src/components/EmployeeDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmployeeDetails = () => {
  const { id } = useParams(); // Pobieramy id z URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/employees/${id}`
        );
        setEmployee(response.data);
        setLoading(false);
      } catch (err) {
        setError("Nie udało się pobrać danych pracownika.");
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]); // Odświeżaj dane po zmianie id w URL

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>
        {employee.firstName} {employee.lastName}
      </h1>
      <p>Stanowisko: {employee.position}</p>
      <p>Dział: {employee.department}</p>
    </div>
  );
};

export default EmployeeDetails;
