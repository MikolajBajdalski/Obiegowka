import React from "react";
import EmployeeList from "./components/EmployeeList";
import ClothingList from "./components/ClothingList";
import ShortageReport from "./components/ShortageReport";
import OrderSummary from "./components/OrderSummary";
// import "./index.css";
import "./styles/styles.scss";

function App() {
  return (
    <div>
      <div className="bg-blue-500 text-white p-10">
        <h1 className="text-3xl font-bold">Tailwind działa?</h1>
      </div>
      <h1>System zarządzania odzieżą</h1>
      <EmployeeList />
      <ClothingList />
      <ShortageReport />
      <OrderSummary />
    </div>
  );
}

export default App;
