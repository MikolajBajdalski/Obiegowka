const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["Mężczyzna", "Kobieta"], required: true },
  department: { type: String, enum: ["GAZY", "OKNA", "PPOŻ"], required: true },
  position: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
