const express = require("express");
const router = express.Router();
const Clothing = require("../models/Clothing");
const Employee = require("../models/Employee");
const ClothingType = require("../models/ClothingType");
import API_URL from "../api";

// ✅ Dodawanie nowego ubrania do systemu
router.post("/add", async (req, res) => {
  console.log("👕 Otrzymano żądanie POST na /clothing/add!");
  console.log("📦 Otrzymane body:", req.body);

  try {
    const newClothing = new Clothing({
      name: req.body.name,
      type: req.body.type,
      size: req.body.size,
      departmentColor: req.body.departmentColor,
      employee: req.body.employee || null, // Jeśli pracownik nie został przypisany
    });

    await newClothing.save();
    console.log("✅ Ubranie dodane:", newClothing);
    res.json({ message: "Ubranie dodane!", clothing: newClothing });
  } catch (error) {
    console.error("❌ Błąd dodawania ubrania:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie wszystkich ubrań
router.get("/", async (req, res) => {
  try {
    const clothing = await Clothing.find().populate("employee");
    res.json(clothing);
  } catch (error) {
    console.error("❌ Błąd pobierania ubrań:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Generowanie raportu brakującej odzieży
router.get("/shortage", async (req, res) => {
  console.log("📊 Analiza brakującej odzieży...");

  try {
    // Pobranie wszystkich pracowników z przypisanymi ubraniami
    const employees = await Employee.find().populate("clothing");
    const clothingTypes = await ClothingType.find();

    let shortageReport = [];

    employees.forEach((employee) => {
      let missingItems = {};

      clothingTypes.forEach((clothingType) => {
        // Sprawdzenie, ile sztuk danego typu ubrań ma pracownik
        const ownedCount = employee.clothing.filter(
          (item) => item.type === clothingType.type
        ).length;
        const requiredCount = clothingType.limit;
        const missingCount = requiredCount - ownedCount;

        // Jeśli brakuje ubrań → dodaj do raportu
        if (missingCount > 0) {
          missingItems[clothingType.type] = missingCount;
        }
      });

      if (Object.keys(missingItems).length > 0) {
        shortageReport.push({
          employee: `${employee.firstName} ${employee.lastName}`,
          missingItems,
        });
      }
    });

    console.log("✅ Zestawienie braków:", shortageReport);
    res.json(shortageReport);
  } catch (error) {
    console.error("❌ Błąd generowania zestawienia braków:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Generowanie zamówienia brakującej odzieży (musi być PRZED `/:id`)
router.get("/order", async (req, res) => {
  console.log("📦 Generowanie propozycji zamówienia...");

  try {
    // Pobieramy raport braków
    const shortageResponse = await fetch(`${API_URL}/clothing/shortage`);
    const shortageData = await shortageResponse.json();

    let orderSummary = {};

    shortageData.forEach((employeeShortage) => {
      Object.entries(employeeShortage.missingItems).forEach(
        ([clothingType, count]) => {
          if (!orderSummary[clothingType]) {
            orderSummary[clothingType] = 0;
          }
          orderSummary[clothingType] += count;
        }
      );
    });

    console.log("✅ Zamówienie odzieży:", orderSummary);
    res.json(orderSummary);
  } catch (error) {
    console.error("❌ Błąd generowania zamówienia:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie konkretnego ubrania po ID (musi być PO `/order`)
router.get("/:id", async (req, res) => {
  console.log(`🔍 Pobieranie ubrania o ID: ${req.params.id}`);

  try {
    // Sprawdzamy, czy ID ma poprawny format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Niepoprawny format ID!" });
    }

    const clothing = await Clothing.findById(req.params.id).populate(
      "employee"
    );

    if (!clothing) {
      return res.status(404).json({ message: "Ubranie nie znalezione!" });
    }

    console.log("✅ Znalezione ubranie:", clothing);
    res.json(clothing);
  } catch (error) {
    console.error("❌ Błąd pobierania ubrania:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Przypisanie ubrania do pracownika
router.put("/assign/:clothingId/:employeeId", async (req, res) => {
  console.log(
    `👕 Przypisywanie ubrania ${req.params.clothingId} do pracownika ${req.params.employeeId}`
  );

  try {
    const clothing = await Clothing.findById(req.params.clothingId);
    if (!clothing) {
      return res.status(404).json({ message: "Ubranie nie znalezione!" });
    }

    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Pracownik nie znaleziony!" });
    }

    clothing.employee = employee._id;
    await clothing.save();

    console.log(
      `✅ Ubranie ${clothing.name} przypisane do ${employee.firstName} ${employee.lastName}`
    );
    res.json({ message: "Ubranie przypisane!", clothing });
  } catch (error) {
    console.error("❌ Błąd przypisywania ubrania:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
