const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/obiegowka", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Połączono z bazą MongoDB");
  } catch (error) {
    console.error("❌ Błąd połączenia z MongoDB:", error);
    process.exit(1); // Zatrzymuje aplikację, jeśli nie można się połączyć
  }
};

module.exports = connectDB;
