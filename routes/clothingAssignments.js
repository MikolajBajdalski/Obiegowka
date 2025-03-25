const express = require("express");
const router = express.Router();
const ClothingAssignment = require("../models/ClothingAssignment");

// ✅ Pobieranie wszystkich wpisów przydziałów
router.get("/", async (req, res) => {
  try {
    const assignments = await ClothingAssignment.find()
      .populate("clothingType")
      .populate("position");
    res.json(assignments);
  } catch (error) {
    console.error("❌ Błąd pobierania przydziałów:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Dodawanie nowego przydziału
router.post("/add", async (req, res) => {
  try {
    const newAssignment = new ClothingAssignment({
      clothingType: req.body.clothingType,
      position: req.body.position,
      limit: req.body.limit,
    });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error("❌ Błąd dodawania przydziału:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Nowe: Aktualizacja limitu przydziału po position + clothingType
router.put("/byPositionAndType", async (req, res) => {
  const { position, clothingType, limit } = req.body;

  try {
    const updated = await ClothingAssignment.findOneAndUpdate(
      { position, clothingType },
      { limit },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono przypisania do aktualizacji." });
    }

    res.json({ message: "Limit zaktualizowany.", assignment: updated });
  } catch (error) {
    console.error("❌ Błąd aktualizacji limitu:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Edycja istniejącego wpisu (limit)
router.put("/:id", async (req, res) => {
  try {
    const updated = await ClothingAssignment.findByIdAndUpdate(
      req.params.id,
      { limit: req.body.limit },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Przydział nie znaleziony!" });
    }

    res.json({ message: "Przydział zaktualizowany!", assignment: updated });
  } catch (error) {
    console.error("❌ Błąd edycji przydziału:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Nowe: Pobieranie przydziałów dla konkretnego stanowiska
router.get("/position/:id", async (req, res) => {
  try {
    const assignments = await ClothingAssignment.find({
      position: req.params.id,
    })
      .populate("clothingType")
      .populate("position");
    res.json(assignments);
  } catch (error) {
    console.error("❌ Błąd pobierania przydziałów dla stanowiska:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Nowe: Usuwanie przypisania dla danego stanowiska i rodzaju ubrania
router.delete("/byPositionAndType", async (req, res) => {
  const { position, clothingType } = req.body;
  try {
    const deleted = await ClothingAssignment.findOneAndDelete({
      position,
      clothingType,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono przypisania do usunięcia." });
    }

    res.json({ message: "Przypisanie usunięte.", deleted });
  } catch (error) {
    console.error("❌ Błąd usuwania przypisania:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
