const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const WarehouseHistory = require("../models/WarehouseHistory");
const EmployeeClothing = require("../models/EmployeeClothing");

// ✅ Przyjęcie magazynowe
router.post("/receive", async (req, res) => {
  const { clothingType, department, gender, size, quantity } = req.body;

  try {
    // Sprawdź, czy istnieje już wpis w magazynie
    const existingItem = await Inventory.findOne({
      clothingType,
      department,
      gender,
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
        department,
        gender,
        size,
        quantity,
      });
      await newItem.save();
    }

    await WarehouseHistory.create({
      operationType: "receive",
      clothingType,
      department,
      gender,
      size,
      quantity,
    });

    res.status(200).json({ message: "Przyjęcie zapisane!" });
  } catch (error) {
    console.error("❌ Błąd przyjęcia magazynowego:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

router.post("/issue", async (req, res) => {
  const { clothingType, department, gender, size, quantity, employee } =
    req.body;

  try {
    // Znajdź wpis w magazynie
    const existingItem = await Inventory.findOne({
      clothingType,
      department,
      gender,
      size,
    });

    if (!existingItem || existingItem.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Niewystarczająca ilość w magazynie!" });
    }

    // Zmniejsz ilość w magazynie
    existingItem.quantity -= quantity;
    await existingItem.save();

    // Zapisz wydanie w historii magazynowej
    await WarehouseHistory.create({
      operationType: "issue",
      clothingType,
      department,
      gender,
      size,
      quantity,
      employee,
    });

    // Zaktualizuj ilość posiadanych ubrań przez pracownika
    const existingEmployeeClothing = await EmployeeClothing.findOne({
      employee,
      clothingType,
      size,
      department,
      gender,
    });

    if (existingEmployeeClothing) {
      // Jeśli wpis istnieje, zwiększ ilość
      existingEmployeeClothing.quantity += quantity;
      await existingEmployeeClothing.save();
    } else {
      // Jeśli wpis nie istnieje, utwórz nowy
      const newEmployeeClothing = new EmployeeClothing({
        employee,
        clothingType,
        size,
        quantity,
        department,
        gender,
      });
      await newEmployeeClothing.save();
    }

    res.status(200).json({ message: "Wydanie zapisane!" });
  } catch (error) {
    console.error("❌ Błąd wydania magazynowego:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie wydań magazynowych dla konkretnego pracownika
router.get("/issued/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const issuedItems = await WarehouseHistory.find({
      operationType: "issue",
      employee: id,
    }).populate("clothingType");

    res.json(issuedItems);
  } catch (error) {
    console.error("❌ Błąd pobierania wydań magazynowych:", error);
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
