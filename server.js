const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = 5001;

// 🔗 Połączenie z bazą MongoDB
connectDB();

// 🛠️ Middleware (Obsługa JSON)
app.use(express.json());

// 📌 Import tras API
const employeeRoutes = require("./routes/employees");
const clothingRoutes = require("./routes/clothing");
const routes = require("./routes/routes");
const clothingTypeRoutes = require("./routes/clothingtype");

// ✅ Rejestrowanie tras
console.log("✅ Rejestruję trasę: /employees");
app.use("/employees", employeeRoutes);

console.log("✅ Rejestruję trasę: /clothing");
app.use("/clothing", clothingRoutes);

console.log("✅ Rejestruję trasę: /");
app.use("/", routes);

console.log("✅ Rejestruję trasę: /clothingtype");
app.use("/clothingtype", clothingTypeRoutes);

// 🚀 Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`🚀 Serwer nasłuchuje na porcie ${PORT}`);
});
