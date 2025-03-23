const mongoose = require("mongoose");

const ClothingTypeSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // np. "Kurtka", "Spodnie", "Buty"
  limit: { type: Number, required: true, min: 1 }, // Minimalnie 1 sztuka
});

module.exports = mongoose.model("ClothingType", ClothingTypeSchema);
