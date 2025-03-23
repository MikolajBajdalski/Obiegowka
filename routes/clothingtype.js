const express = require("express");
const router = express.Router();
const ClothingType = require("../models/ClothingType");

// ✅ Dodawanie nowego rodzaju ubrania
router.post("/add", async (req, res) => {
  console.log("📌 Otrzymano żądanie POST na /clothingtype/add!");
  console.log("📦 Otrzymane body:", req.body);

  try {
    const newClothingType = new ClothingType({
      type: req.body.type,
      limit: req.body.limit,
    });

    await newClothingType.save();
    console.log("✅ Rodzaj ubrania dodany:", newClothingType);
    res.json({
      message: "Rodzaj ubrania dodany!",
      clothingType: newClothingType,
    });
  } catch (error) {
    console.error("❌ Błąd dodawania rodzaju ubrania:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ✅ Pobieranie wszystkich rodzajów ubrań
router.get("/", async (req, res) => {
  try {
    const clothingTypes = await ClothingType.find();
    res.json(clothingTypes);
  } catch (error) {
    console.error("❌ Błąd pobierania rodzajów ubrań:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
