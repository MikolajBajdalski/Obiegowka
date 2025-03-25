const mongoose = require("mongoose");

const ClothingTypeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // np. "Spodnie", "Kurtka"
  requiresDepartmentColor: { type: Boolean, default: true }, // np. buty nie muszą mieć kolorów zależnych od działu
});

module.exports = mongoose.model("ClothingType", ClothingTypeSchema);
