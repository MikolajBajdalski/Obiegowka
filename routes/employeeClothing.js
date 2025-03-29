const express = require("express");
const router = express.Router();
const EmployeeClothing = require("../models/EmployeeClothing");

// ✅ Pobierz pracowników kwalifikujących się do otrzymania danego ubrania
router.post("/eligible", async (req, res) => {
  const { clothingType, department, gender, size } = req.body;

  try {
    const eligibleEmployees = await EmployeeClothing.find({
      clothingType,
      department,
      gender,
      size,
    }).populate("employee");

    // Zwracamy unikalnych pracowników
    const uniqueEmployees = [
      ...new Map(
        eligibleEmployees.map((item) => [
          item.employee._id.toString(),
          item.employee,
        ])
      ).values(),
    ];

    res.json(uniqueEmployees);
  } catch (error) {
    console.error("❌ Błąd pobierania kwalifikujących się pracowników:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

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

// ✅ Dodaj nowy wpis lub zaktualizuj istniejący
router.post("/add", async (req, res) => {
  try {
    const { employee, clothingType, size, quantity, department, gender } =
      req.body;

    console.log("Otrzymane dane:", req.body); // Logowanie danych

    // Sprawdź, czy wszystkie wymagane pola są obecne
    if (!employee || !clothingType || !size || !department || !gender) {
      console.error("Brak wymaganych danych:", req.body); // Logowanie brakujących danych
      return res.status(400).json({ message: "Brak wymaganych danych!" });
    }

    // Sprawdź, czy wpis już istnieje
    const existingRecord = await EmployeeClothing.findOne({
      employee,
      clothingType,
      size,
      department,
      gender,
    });

    if (existingRecord) {
      // Jeśli wpis istnieje, zaktualizuj ilość
      existingRecord.quantity += quantity;
      await existingRecord.save();
      return res
        .status(200)
        .json({ message: "Zaktualizowano wpis", record: existingRecord });
    }

    // Jeśli wpis nie istnieje, utwórz nowy
    const newRecord = new EmployeeClothing({
      employee,
      clothingType,
      size,
      quantity,
      department,
      gender,
    });
    await newRecord.save();

    res.status(201).json({ message: "Dodano nowy wpis", record: newRecord });
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
