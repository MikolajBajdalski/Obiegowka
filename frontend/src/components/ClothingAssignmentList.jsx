import React, { useEffect, useState } from "react";
import axios from "axios";

const ClothingAssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);
  const [positions, setPositions] = useState([]);
  const [newEntry, setNewEntry] = useState({
    clothingType: "",
    position: "",
    limit: 0,
  });
  const [editId, setEditId] = useState(null);
  const [editLimit, setEditLimit] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, typesRes, positionsRes] = await Promise.all([
        axios.get("http://localhost:5001/clothingassignments"),
        axios.get("http://localhost:5001/clothingtype"),
        axios.get("http://localhost:5001/positions"),
      ]);
      setAssignments(assignmentsRes.data);
      setClothingTypes(typesRes.data);
      setPositions(positionsRes.data);
    } catch (error) {
      console.error("❌ Błąd pobierania danych:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(
        "http://localhost:5001/clothingassignments/add",
        newEntry
      );
      setNewEntry({ clothingType: "", position: "", limit: 0 });
      fetchData();
    } catch (error) {
      console.error("❌ Błąd dodawania przydziału:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5001/clothingassignments/${id}`, {
        limit: editLimit,
      });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("❌ Błąd edycji przydziału:", error);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Przydziały ubrań wg stanowiska
      </h2>

      {/* FORMULARZ DODAWANIA */}
      <div className="mb-6 space-y-2">
        <select
          value={newEntry.clothingType}
          onChange={(e) =>
            setNewEntry({ ...newEntry, clothingType: e.target.value })
          }
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">-- Wybierz rodzaj ubrania --</option>
          {clothingTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>

        <select
          value={newEntry.position}
          onChange={(e) =>
            setNewEntry({ ...newEntry, position: e.target.value })
          }
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">-- Wybierz stanowisko --</option>
          {positions.map((pos) => (
            <option key={pos._id} value={pos._id}>
              {pos.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          value={newEntry.limit}
          onChange={(e) =>
            setNewEntry({ ...newEntry, limit: parseInt(e.target.value) })
          }
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Limit sztuk"
        />

        <button
          onClick={handleAdd}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Dodaj przydział
        </button>
      </div>

      {/* TABELA */}
      <table className="w-full table-auto border bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Rodzaj ubrania</th>
            <th className="px-4 py-2 text-left">Stanowisko</th>
            <th className="px-4 py-2 text-left">Limit</th>
            <th className="px-4 py-2 text-left">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((item) => (
            <tr key={item._id} className="border-t border-gray-700">
              <td className="px-4 py-2">{item.clothingType?.name}</td>
              <td className="px-4 py-2">{item.position?.name}</td>
              <td className="px-4 py-2">
                {editId === item._id ? (
                  <input
                    type="number"
                    value={editLimit}
                    onChange={(e) => setEditLimit(parseInt(e.target.value))}
                    className="p-1 rounded bg-gray-700"
                  />
                ) : (
                  item.limit
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                {editId === item._id ? (
                  <>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-green-600 px-2 py-1 rounded"
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-600 px-2 py-1 rounded"
                    >
                      Anuluj
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(item._id);
                      setEditLimit(item.limit);
                    }}
                    className="bg-blue-600 px-2 py-1 rounded"
                  >
                    Edytuj
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClothingAssignmentList;
