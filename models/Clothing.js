const mongoose = require("mongoose");

const ClothingSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nazwa ubrania (np. "Kurtka zimowa")
  type: { type: String, required: true }, // Rodzaj ubrania (np. "Kurtka", "Spodnie", "Buty")
  size: { type: String, required: true }, // Rozmiar (np. "L", "XL", "42")
  departmentColor: { type: Boolean, default: true }, // Czy kolor zależy od działu
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Powiązanie z pracownikiem
});

module.exports = mongoose.model("Clothing", ClothingSchema);
