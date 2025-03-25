import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

const ClothingSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}/clothingassignments/summary`);
        setSummary(res.data);
      } catch (err) {
        console.error("❌ Błąd pobierania zestawienia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="p-6 text-white">Ładowanie...</div>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Zestawienie zapotrzebowania</h2>
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
          {summary.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                Brak braków do uzupełnienia 🎉
              </td>
            </tr>
          ) : (
            summary.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="px-4 py-2">{item.clothingType}</td>
                <td className="px-4 py-2">{item.color}</td>
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
