const express = require("express");
const app = express();
const PORT = 5001;

const routes = require("./routes/routes"); // Importujemy trasy
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});
