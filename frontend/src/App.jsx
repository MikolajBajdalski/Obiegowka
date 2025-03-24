import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"; // Zaimportowanie pliku z Tailwind
import EmployeeList from "./components/EmployeeList";
import EmployeeDetails from "./components/EmployeeDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/employee" element={<EmployeeList />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
