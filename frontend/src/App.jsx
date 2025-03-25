import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import EmployeeList from "./components/EmployeeList";
import EmployeeDetails from "./components/EmployeeDetails";
import PositionList from "./components/PositionList";
import ClothingTypeList from "./components/ClothingTypeList";
import ClothingAssignmentList from "./components/ClothingAssignmentList";
import ClothingSummary from "./components/ClothingSummary";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 p-6 w-full max-w-none mx-auto">
          <Routes>
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employee/:id" element={<EmployeeDetails />} />
            <Route path="/positions" element={<PositionList />} />
            <Route path="/clothing-types" element={<ClothingTypeList />} />
            <Route
              path="/clothing-assignments"
              element={<ClothingAssignmentList />}
            />
            <Route path="/demand" element={<ClothingSummary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
