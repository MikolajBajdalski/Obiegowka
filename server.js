// 🛠️ Załaduj zmienne środowiskowe z pliku .env
require("dotenv").config(); // ← DODANE!

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 🔧 Pobierz PORT z .env lub użyj domyślnego 5001
const PORT = process.env.PORT || 5001;

// 🔗 Połączenie z MongoDB z .env
connectDB(); // on już używa process.env.MONGODB_URI w pliku config/db.js

// 🛠️ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Import tras
const employeeRoutes = require("./routes/employees");
const clothingRoutes = require("./routes/clothing");
const clothingTypeRoutes = require("./routes/clothingTypes");
const positionRoutes = require("./routes/positions");
const rootRoutes = require("./routes/routes");
const clothingAssignmentRoutes = require("./routes/clothingAssignments");
const employeeClothingRoutes = require("./routes/employeeClothing");
const inventoryRoutes = require("./routes/inventory");

// ✅ Rejestracja tras
console.log("✅ Rejestruję trasę: /employees");
app.use("/employees", employeeRoutes);

console.log("✅ Rejestruję trasę: /clothing");
app.use("/clothing", clothingRoutes);

console.log("✅ Rejestruję trasę: /clothingtypes");
app.use("/clothingtype", clothingTypeRoutes);

console.log("✅ Rejestruję trasę: /positions");
app.use("/positions", positionRoutes);

console.log("✅ Rejestruję trasę: /");
app.use("/", rootRoutes);

console.log("✅ Rejestruję trasę: /clothingassignments");
app.use("/clothingassignments", clothingAssignmentRoutes);

console.log("✅ Rejestruję trasę: /employeeClothing");
app.use("/employeeclothing", employeeClothingRoutes);

console.log("✅ Rejestruję trasę: /inventory");
app.use("/inventory", inventoryRoutes);

// 🚀 Start serwera
app.listen(PORT, () => {
  console.log(`🚀 Serwer nasłuchuje na porcie ${PORT}`);
});
