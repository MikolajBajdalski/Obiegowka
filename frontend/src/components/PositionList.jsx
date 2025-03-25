// src/components/PositionList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${API_URL}positions`);
      setPositions(res.data);
    } catch (err) {
      console.error("Błąd pobierania stanowisk:", err);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleAdd = async () => {
    if (!newPosition.trim()) return;
    try {
      await axios.post(`${API_URL}positions/add`, {
        name: newPosition.trim(),
      });
      setNewPosition("");
      fetchPositions();
    } catch (err) {
      console.error("Błąd dodawania:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}positions/${id}`);
      fetchPositions();
    } catch (err) {
      console.error("Błąd usuwania:", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`${API_URL}positions/${id}`, {
        name: editingValue.trim(),
      });
      setEditingId(null);
      setEditingValue("");
      fetchPositions();
    } catch (err) {
      console.error("Błąd edycji:", err);
    }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Stanowiska</h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          className="bg-gray-700 border p-2 rounded text-white flex-grow"
          placeholder="Nowe stanowisko"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          Dodaj
        </button>
      </div>

      <table className="w-full bg-gray-800 rounded shadow overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="text-left px-4 py-2">Stanowisko</th>
            <th className="text-left px-4 py-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position._id} className="border-b border-gray-700">
              <td className="px-4 py-2">
                {editingId === position._id ? (
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="bg-gray-700 border p-2 rounded text-white w-full"
                  />
                ) : (
                  position.name
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                {editingId === position._id ? (
                  <>
                    <button
                      onClick={() => handleEdit(position._id)}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded"
                    >
                      Anuluj
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(position._id);
                        setEditingValue(position.name);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                    >
                      Edytuj
                    </button>
                    {/* <button
                      onClick={() => handleDelete(position._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                      Usuń
                    </button> */}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionList;
