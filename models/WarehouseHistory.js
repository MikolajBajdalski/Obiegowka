const mongoose = require("mongoose");

const WarehouseHistorySchema = new mongoose.Schema(
  {
    operationType: {
      type: String,
      enum: ["receive", "issue"], // "receive" = przyjęcie, "issue" = wydanie
      required: true,
    },
    clothingType: { type: mongoose.Schema.Types.ObjectId, ref: "ClothingType" },
    department: String,
    gender: String,
    size: String,
    quantity: { type: Number, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Tylko dla wydania
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WarehouseHistory", WarehouseHistorySchema);
