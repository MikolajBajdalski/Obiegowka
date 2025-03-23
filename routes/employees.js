const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// ✅ Pobieranie wszystkich pracowników (umieszczone na górze, przed `/:id`)
router.get("/", async (req, res) => {
  console.log("🔍 Pobieranie listy pracowników...");

  try {
    const employees = await Employee.find();
    console.log("✅ Lista pracowników:", employees);
    res.json(employees);
  } catch (error) {
    console.error("❌ Błąd pobierania pracowników:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie konkretnego pracownika po ID (musi być po `router.get("/")`)
router.get("/:id", async (req, res) => {
  console.log(`🔍 Otrzymano żądanie GET dla ID: ${req.params.id}`);

  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Pracownik nie znaleziony!" });
    }

    console.log("✅ Znaleziono pracownika:", employee);
    res.json(employee);
  } catch (error) {
    console.error("❌ Błąd pobierania pracownika:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Dodawanie nowego pracownika
router.post("/add", async (req, res) => {
  console.log("📢 Otrzymano żądanie POST na /employees/add!");
  console.log("📦 Otrzymane body:", req.body);

  try {
    const newEmployee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      department: req.body.department,
      position: req.body.position,
    });

    console.log("📝 Pracownik do zapisania:", newEmployee);
    await newEmployee.save();

    console.log("✅ Pracownik zapisany w MongoDB!");
    res.json({ message: "Pracownik dodany!", employee: newEmployee });
  } catch (error) {
    console.error("❌ Błąd dodawania pracownika:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Edytowanie pracownika po ID
router.put("/:id", async (req, res) => {
  console.log(`✏️ Otrzymano żądanie PUT dla ID: ${req.params.id}`);
  console.log("📦 Nowe dane:", req.body);

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Pracownik nie znaleziony!" });
    }

    console.log("✅ Pracownik zaktualizowany:", updatedEmployee);
    res.json({
      message: "Pracownik zaktualizowany!",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Błąd edycji pracownika:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Usuwanie pracownika po ID
router.delete("/:id", async (req, res) => {
  console.log(`🗑️ Otrzymano żądanie DELETE dla ID: ${req.params.id}`);

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Pracownik nie znaleziony!" });
    }

    console.log("✅ Pracownik usunięty:", deletedEmployee);
    res.json({ message: "Pracownik usunięty!", employee: deletedEmployee });
  } catch (error) {
    console.error("❌ Błąd usuwania pracownika:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Eksportowanie routera
module.exports = router;
