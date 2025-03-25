const mongoose = require("mongoose");

const ClothingAssignmentSchema = new mongoose.Schema(
  {
    clothingType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothingType",
      required: true,
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

ClothingAssignmentSchema.index(
  { clothingType: 1, position: 1 },
  { unique: true }
);

module.exports = mongoose.model("ClothingAssignment", ClothingAssignmentSchema);
