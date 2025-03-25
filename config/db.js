const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin123@odziez-robocza.yorvxwh.mongodb.net/?retryWrites=true&w=majority&appName=Odziez-robocza",
      {
        dbName: "odziez-robocza",
      }
    );
    console.log("✅ Połączono z MongoDB Atlas");
  } catch (error) {
    console.error("❌ Błąd połączenia z MongoDB Atlas:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
