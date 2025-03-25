const express = require("express");
const router = express.Router();
const Position = require("../models/Position");

router.post("/add", async (req, res) => {
  try {
    const newPosition = new Position({ name: req.body.name });
    await newPosition.save();
    res.status(201).json(newPosition);
  } catch (error) {
    console.error("❌ Błąd dodawania stanowiska:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const positions = await Position.find();
    res.json(positions);
  } catch (error) {
    console.error("❌ Błąd pobierania stanowisk:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Position.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Stanowisko nie znalezione!" });
    }

    res.json({ message: "Stanowisko zaktualizowane!", position: updated });
  } catch (error) {
    console.error("❌ Błąd edycji stanowiska:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Position.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Stanowisko nie znalezione!" });
    }

    res.json({ message: "Stanowisko usunięte!", position: deleted });
  } catch (error) {
    console.error("❌ Błąd usuwania stanowiska:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
