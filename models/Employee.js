const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  clothing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Clothing" }], // ← 🔥 To jest kluczowa poprawka
});

module.exports = mongoose.model("Employee", EmployeeSchema);
