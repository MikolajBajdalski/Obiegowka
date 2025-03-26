const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("❌ Brak zmiennej środowiskowej MONGO_URI!");
    }

    await mongoose.connect(mongoURI, {
      dbName: "odziez-robocza",
    });

    console.log("✅ Połączono z MongoDB Atlas");
  } catch (error) {
    console.error("❌ Błąd połączenia z MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
