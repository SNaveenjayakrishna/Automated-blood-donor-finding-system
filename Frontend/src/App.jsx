import Login from "./Pages/Login/login";
import ResetPassword from "./Pages/Components/ResetPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import HospitalDashboard from "./Pages/HospitalDashboard/HospitalDashboard";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import Signup from "./Pages/Components/Signup";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/donor/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
