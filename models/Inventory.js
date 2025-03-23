const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  clothingType: { type: mongoose.Schema.Types.ObjectId, ref: "ClothingType" },
  color: String,
  gender: String,
  size: String,
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model("Inventory", InventorySchema);
