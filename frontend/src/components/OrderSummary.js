import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderSummary = () => {
  const [order, setOrder] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5001/clothing/order")
      .then((response) => setOrder(response.data))
      .catch((error) =>
        console.error("Błąd pobierania podsumowania zamówienia:", error)
      );
  }, []);

  return (
    <div>
      <h2>Podsumowanie zamówienia</h2>
      {Object.keys(order).length === 0 ? (
        <p>Brak brakujących ubrań.</p>
      ) : (
        <ul>
          {Object.entries(order).map(([type, count]) => (
            <li key={type}>
              {type}: {count}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderSummary;
