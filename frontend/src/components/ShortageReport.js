import React, { useState, useEffect } from "react";
import axios from "axios";

const ShortageReport = () => {
  const [shortage, setShortage] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/clothing/shortage")
      .then((response) => setShortage(response.data))
      .catch((error) =>
        console.error("Błąd pobierania raportu braków:", error)
      );
  }, []);

  return (
    <div>
      <h2>Braki odzieży</h2>
      {shortage.length === 0 ? (
        <p>Brak braków odzieży.</p>
      ) : (
        <ul>
          {shortage.map((item, index) => (
            <li key={index}>
              {item.employee}:
              <ul>
                {Object.entries(item.missingItems).map(([type, count]) => (
                  <li key={type}>
                    {type}: {count}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShortageReport;
