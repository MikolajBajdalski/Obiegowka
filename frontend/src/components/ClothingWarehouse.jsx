import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import WarehouseFormReceive from "./WarehouseFormReceive";
import WarehouseFormIssue from "./WarehouseFormIssue";

const ClothingWarehouse = () => {
  const [inventory, setInventory] = useState([]);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_URL}inventory`);
      setInventory(res.data);
    } catch (err) {
      console.error("Błąd pobierania stanu magazynowego:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-red-600">NIE WIDZE DZIAŁU W BAZIE DANYCH !!!!!</h1>
      <h2 className="text-2xl font-bold mb-4">Magazyn ubrań</h2>

      <div className="mb-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded mr-4"
          onClick={() => setShowReceiveForm(true)}
        >
          Przyjęcie magazynowe
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowIssueForm(true)}
        >
          Wydanie magazynowe
        </button>
      </div>

      <table className="w-full table-auto border bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Rodzaj ubrania</th>
            <th className="px-4 py-2 text-left">Dział</th>
            <th className="px-4 py-2 text-left">Rozmiar</th>
            <th className="px-4 py-2 text-left">Ilość</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-gray-400">
                Magazyn jest pusty
              </td>
            </tr>
          ) : (
            inventory.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="px-4 py-2">{item.clothingType.name}</td>
                <td className="px-4 py-2">{item.department}</td>{" "}
                {/* Wyświetlanie działu */}
                {/* <td className="px-4 py-2">{item.color}</td> */}
                <td className="px-4 py-2">{item.size}</td>
                <td className="px-4 py-2">{item.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showReceiveForm && (
        <WarehouseFormReceive
          onClose={() => {
            setShowReceiveForm(false);
            fetchInventory();
          }}
        />
      )}
      {showIssueForm && (
        <WarehouseFormIssue
          inventory={inventory}
          onClose={() => {
            setShowIssueForm(false);
            fetchInventory();
          }}
        />
      )}
    </div>
  );
};

export default ClothingWarehouse;
