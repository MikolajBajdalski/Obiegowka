import React, { useState, useEffect } from "react";
import axios from "axios";
import ClothingForm from "./ClothingForm";
import EditClothingForm from "./EditClothingForm";

const ClothingList = () => {
  const [clothing, setClothing] = useState([]);
  const [editingClothing, setEditingClothing] = useState(null);

  const fetchClothing = () => {
    axios
      .get("http://localhost:5001/clothing")
      .then((response) => setClothing(response.data))
      .catch((error) => console.error("Błąd pobierania ubrań:", error));
  };

  useEffect(() => {
    fetchClothing();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/clothing/${id}`);
      console.log("✅ Ubranie usunięte!");
      fetchClothing();
    } catch (error) {
      console.error("❌ Błąd usuwania ubrania:", error);
    }
  };

  return (
    <div>
      <h2>Lista ubrań</h2>
      <ClothingForm onClothingAdded={fetchClothing} />
      {editingClothing ? (
        <EditClothingForm
          clothing={editingClothing}
          onClothingUpdated={() => {
            fetchClothing();
            setEditingClothing(null);
          }}
          onCancel={() => setEditingClothing(null)}
        />
      ) : (
        <ul>
          {clothing.map((item) => (
            <li key={item._id}>
              {item.name} - {item.type} (Rozmiar: {item.size})
              <button onClick={() => setEditingClothing(item)}>Edytuj</button>
              <button onClick={() => handleDelete(item._id)}>Usuń</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClothingList;
