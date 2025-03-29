const mongoose = require("mongoose");

const EmployeeClothingSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    clothingType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothingType",
      required: true,
    },
    size: {
      type: String,
      required: false, // może być puste do czasu uzupełnienia
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    department: {
      type: String, // Kolor ubrania (dział)
      required: true,
    },
    gender: {
      type: String, // Płeć
      required: true,
      enum: ["Mężczyzna", "Kobieta"],
    },
  },
  { timestamps: true }
);

// Zapewniamy unikalność pary employee + clothingType + size + department + gender
EmployeeClothingSchema.index(
  { employee: 1, clothingType: 1, size: 1, department: 1, gender: 1 },
  { unique: true }
);

module.exports = mongoose.model("EmployeeClothing", EmployeeClothingSchema);
