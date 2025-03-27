const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  clothingType: { type: mongoose.Schema.Types.ObjectId, ref: "ClothingType" },
  color: String,
  gender: String,
  size: String,
  department: String,
  quantity: { type: Number, required: true, min: 0, default: 0 },
});

module.exports = mongoose.model("Inventory", InventorySchema);
