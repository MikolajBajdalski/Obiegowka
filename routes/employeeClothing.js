// routes/employeeClothing.js
const express = require("express");
const router = express.Router();
const EmployeeClothing = require("../models/EmployeeClothing");

// ✅ Pobierz wszystkie wpisy dla konkretnego pracownika
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const records = await EmployeeClothing.find({
      employee: req.params.employeeId,
    })
      .populate("clothingType")
      .populate("employee");
    res.json(records);
  } catch (error) {
    console.error("❌ Błąd pobierania danych odzieżowych pracownika:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Dodaj nowy wpis (jeśli nie istnieje)
router.post("/add", async (req, res) => {
  try {
    const newRecord = new EmployeeClothing({
      employee: req.body.employee,
      clothingType: req.body.clothingType,
      size: req.body.size,
      quantity: req.body.quantity,
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Błąd dodawania wpisu odzieżowego:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Edytuj istniejący wpis (rozmiar / ilość)
router.put("/:id", async (req, res) => {
  try {
    const updated = await EmployeeClothing.findByIdAndUpdate(
      req.params.id,
      {
        size: req.body.size,
        quantity: req.body.quantity,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Wpis nie znaleziony!" });
    }

    res.json({ message: "Zaktualizowano dane odzieżowe", record: updated });
  } catch (error) {
    console.error("❌ Błąd edycji wpisu odzieżowego:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
