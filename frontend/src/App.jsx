import React, { useState, useEffect } from "react";
import "./index.css"; // Zaimportowanie pliku z Tailwind

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Przykładowe zapytanie do API
    fetch("http://localhost:5001/employees")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Błąd:", error));
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8">Lista pracowników</h1>
      <ul className="mt-4">
        {data.map((employee) => (
          <li key={employee._id} className="border-b p-2">
            {employee.firstName} {employee.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
