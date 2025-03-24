const express = require("express");
const cors = require("cors"); // ✅ Importujemy CORS
const connectDB = require("./config/db");

const app = express();
const PORT = 5001;

// 🔗 Połączenie z bazą MongoDB
connectDB();

// 🛠️ Middleware (Obsługa JSON i CORS)
app.use(express.json());
app.use(cors()); // ✅ Dodajemy obsługę CORS
app.use(express.urlencoded({ extended: true }));

// 📌 Import tras API
const employeeRoutes = require("./routes/employees.js");
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
