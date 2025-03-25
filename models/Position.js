// backend/models/Position.js
const mongoose = require("mongoose");

const PositionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Position", PositionSchema);
