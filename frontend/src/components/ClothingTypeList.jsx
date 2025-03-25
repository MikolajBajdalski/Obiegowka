import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

const ClothingTypeList = () => {
  const [clothingTypes, setClothingTypes] = useState([]);
  const [newType, setNewType] = useState({
    name: "",
    requiresDepartmentColor: true,
  });
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    requiresDepartmentColor: true,
  });

  useEffect(() => {
    fetchClothingTypes();
  }, []);

  const fetchClothingTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/clothingtype`);
      setClothingTypes(response.data);
    } catch (error) {
      console.error("Błąd pobierania rodzajów ubrań:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${API_URL}/clothingtype/add`, newType);
      fetchClothingTypes();
      setNewType({ name: "", requiresDepartmentColor: true });
    } catch (error) {
      console.error("❌ Błąd dodawania rodzaju ubrania:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/clothingtype/${id}`,
        editValues
      );
      setClothingTypes(
        clothingTypes.map((item) =>
          item._id === id ? response.data.type : item
        )
      );
      setEditingTypeId(null);
    } catch (error) {
      console.error("Błąd edycji:", error);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Rodzaje ubrań</h2>

      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Rodzaj ubrania"
          value={newType.name}
          onChange={(e) => setNewType({ ...newType, name: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newType.requiresDepartmentColor}
            onChange={(e) =>
              setNewType({
                ...newType,
                requiresDepartmentColor: e.target.checked,
              })
            }
          />
          <span>Czy kolor zależy od działu?</span>
        </label>
        <button
          onClick={handleAdd}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Dodaj
        </button>
      </div>

      <table className="w-full table-auto border bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Rodzaj</th>
            <th className="px-4 py-2 text-left">Kolor zależny od działu</th>
            <th className="px-4 py-2 text-left">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {clothingTypes.map((item) => (
            <tr key={item._id} className="border-t border-gray-700">
              <td className="px-4 py-2">
                {editingTypeId === item._id ? (
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                    className="w-full p-1 bg-gray-700 rounded"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="px-4 py-2">
                {editingTypeId === item._id ? (
                  <input
                    type="checkbox"
                    checked={editValues.requiresDepartmentColor}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        requiresDepartmentColor: e.target.checked,
                      })
                    }
                  />
                ) : item.requiresDepartmentColor ? (
                  "Tak"
                ) : (
                  "Nie"
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                {editingTypeId === item._id ? (
                  <>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-green-600 px-2 py-1 rounded"
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={() => setEditingTypeId(null)}
                      className="bg-gray-600 px-2 py-1 rounded"
                    >
                      Anuluj
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingTypeId(item._id);
                        setEditValues({
                          name: item.name,
                          requiresDepartmentColor: item.requiresDepartmentColor,
                        });
                      }}
                      className="bg-blue-600 px-2 py-1 rounded"
                    >
                      Edytuj
                    </button>
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

export default ClothingTypeList;
