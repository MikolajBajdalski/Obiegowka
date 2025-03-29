const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const WarehouseHistory = require("../models/WarehouseHistory");

// ✅ Przyjęcie magazynowe
router.post("/receive", async (req, res) => {
  const { clothingType, department, size, quantity } = req.body;

  try {
    // Sprawdź, czy istnieje już wpis w magazynie
    const existingItem = await Inventory.findOne({
      clothingType,
      department, // Uwzględnij department w wyszukiwaniu
      size,
    });

    if (existingItem) {
      // Aktualizuj ilość
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      // Dodaj nowy wpis
      const newItem = new Inventory({
        clothingType,
        department, // Zapisz department
        size,
        quantity,
      });
      await newItem.save();
    }

    res.status(200).json({ message: "Przyjęcie zapisane!" });
  } catch (error) {
    console.error("❌ Błąd przyjęcia magazynowego:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Wydanie magazynowe
router.post("/issue", async (req, res) => {
  const { clothingType, color, size, quantity, employee } = req.body;

  try {
    const existingItem = await Inventory.findOne({
      clothingType,
      color,
      size,
    });

    if (!existingItem || existingItem.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Niewystarczająca ilość w magazynie!" });
    }

    existingItem.quantity -= quantity;
    await existingItem.save();

    // Zapis do historii
    await WarehouseHistory.create({
      operationType: "issue",
      clothingType,
      color,
      size,
      quantity,
      employee,
    });

    res.status(200).json({ message: "Wydanie zapisane!" });
  } catch (error) {
    console.error("❌ Błąd wydania magazynowego:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie stanu magazynowego
router.get("/", async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("clothingType");
    res.json(inventory);
  } catch (error) {
    console.error("❌ Błąd pobierania stanu magazynowego:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie historii operacji magazynowych
router.get("/history", async (req, res) => {
  try {
    const history = await WarehouseHistory.find()
      .populate("clothingType")
      .populate("employee")
      .sort({ timestamp: -1 }); // Sortowanie od najnowszych
    res.json(history);
  } catch (error) {
    console.error("❌ Błąd pobierania historii magazynowej:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
