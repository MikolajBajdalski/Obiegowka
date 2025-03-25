import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

const ClothingAssignmentList = () => {
  const [positions, setPositions] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [assignmentMap, setAssignmentMap] = useState({});
  const [limitMap, setLimitMap] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedPosition) {
      fetchAssignmentsForPosition(selectedPosition);
    }
  }, [selectedPosition]);

  const fetchInitialData = async () => {
    try {
      const [typesRes, positionsRes] = await Promise.all([
        axios.get(`${API_URL}clothingtype`),
        axios.get(`${API_URL}positions`),
      ]);
      setClothingTypes(typesRes.data);
      setPositions(positionsRes.data);
    } catch (err) {
      console.error("❌ Błąd ładowania danych początkowych:", err);
    }
  };

  const fetchAssignmentsForPosition = async (positionId) => {
    try {
      const res = await axios.get(
        `${API_URL}clothingassignments/position/${positionId}`
      );
      const map = {};
      const limits = {};
      res.data.forEach((a) => {
        map[a.clothingType._id] = true;
        limits[a.clothingType._id] = a.limit;
      });
      setAssignmentMap(map);
      setLimitMap(limits);
    } catch (err) {
      console.error("❌ Błąd pobierania przypisań:", err);
    }
  };

  const handleCheckboxChange = async (clothingTypeId, checked) => {
    const payload = {
      clothingType: clothingTypeId,
      position: selectedPosition,
    };

    if (checked) {
      try {
        await axios.post(`${API_URL}clothingassignments/add`, {
          ...payload,
          limit: 1,
        });
        setAssignmentMap((prev) => ({ ...prev, [clothingTypeId]: true }));
        setLimitMap((prev) => ({ ...prev, [clothingTypeId]: 1 }));
      } catch (err) {
        console.error("❌ Błąd dodawania przydziału:", err);
      }
    } else {
      try {
        await axios.delete(`${API_URL}clothingassignments/byPositionAndType`, {
          data: payload,
        });
        setAssignmentMap((prev) => {
          const copy = { ...prev };
          delete copy[clothingTypeId];
          return copy;
        });
        setLimitMap((prev) => {
          const copy = { ...prev };
          delete copy[clothingTypeId];
          return copy;
        });
      } catch (err) {
        console.error("❌ Błąd usuwania przydziału:", err);
      }
    }
  };

  const updateLimit = async (clothingTypeId, delta) => {
    const newLimit = Math.max(0, (limitMap[clothingTypeId] || 0) + delta);
    try {
      const res = await axios.put(
        `${API_URL}clothingassignments/byPositionAndType`,
        {
          position: selectedPosition,
          clothingType: clothingTypeId,
          limit: newLimit,
        }
      );
      setLimitMap((prev) => ({ ...prev, [clothingTypeId]: newLimit }));
    } catch (err) {
      console.error("❌ Błąd aktualizacji limitu:", err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Przydziały ubrań wg stanowiska
      </h2>
      <p className="text-red-500 font-bold">
        UWAGA ! PO ODZNACZENIU CHECKBOXA ZRESETUJE SIĘ WARTOŚĆ LIMITU. JEŚLI
        PONOWNIE GO ZAZNACZYSZ POJAWI SIĘ DOMYŚLNA WARTOŚĆ 1 ! NIE POZBYWAJ SIĘ
        TABELI Z ROZPISKĄ !!!
      </p>

      {/* WYBÓR STANOWISKA */}
      <div className="mb-6">
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">-- Wybierz stanowisko --</option>
          {positions.map((pos) => (
            <option key={pos._id} value={pos._id}>
              {pos.name}
            </option>
          ))}
        </select>
      </div>

      {/* LISTA UBRAŃ W SIATCE */}
      {selectedPosition && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clothingTypes.map((type) => (
            <div
              key={type._id}
              className="bg-gray-800 p-4 rounded shadow flex flex-col justify-between"
            >
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={!!assignmentMap[type._id]}
                  onChange={(e) =>
                    handleCheckboxChange(type._id, e.target.checked)
                  }
                />
                <span className="font-medium">{type.name}</span>
              </label>
              {assignmentMap[type._id] && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Limit:</span>
                  <button
                    className="bg-gray-600 hover:bg-gray-500 px-2 rounded"
                    onClick={() => updateLimit(type._id, -1)}
                  >
                    -
                  </button>
                  <span>{limitMap[type._id]}</span>
                  <button
                    className="bg-gray-600 hover:bg-gray-500 px-2 rounded"
                    onClick={() => updateLimit(type._id, 1)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClothingAssignmentList;
