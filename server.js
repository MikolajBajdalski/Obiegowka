const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = 5001;

// 🔗 Połączenie z MongoDB
connectDB();

// 🛠️ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Import tras
const employeeRoutes = require("./routes/employees");
const clothingRoutes = require("./routes/clothing");
const clothingTypeRoutes = require("./routes/clothingTypes");
const positionRoutes = require("./routes/positions");
const rootRoutes = require("./routes/routes"); // ← trasa rootowa
const clothingAssignmentRoutes = require("./routes/clothingAssignments");

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

// 🚀 Start serwera
app.listen(PORT, () => {
  console.log(`🚀 Serwer nasłuchuje na porcie ${PORT}`);
});
