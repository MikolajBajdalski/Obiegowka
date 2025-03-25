const express = require("express");
const router = express.Router();
const ClothingType = require("../models/ClothingType");

// ✅ Dodawanie nowego rodzaju ubrania
router.post("/add", async (req, res) => {
  try {
    const newType = new ClothingType({
      name: req.body.name,
      requiresDepartmentColor: req.body.requiresDepartmentColor,
    });
    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    console.error("❌ Błąd dodawania rodzaju ubrania:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie wszystkich rodzajów ubrań
router.get("/", async (req, res) => {
  try {
    const types = await ClothingType.find();
    res.json(types);
  } catch (error) {
    console.error("❌ Błąd pobierania rodzajów ubrań:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Edytowanie rodzaju ubrania
router.put("/:id", async (req, res) => {
  try {
    const updated = await ClothingType.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        requiresDepartmentColor: req.body.requiresDepartmentColor,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Rodzaj ubrania nie znaleziony!" });
    }

    res.json({ message: "Rodzaj ubrania zaktualizowany!", type: updated });
  } catch (error) {
    console.error("❌ Błąd edycji rodzaju ubrania:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
