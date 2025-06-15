import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Introduction from "./modules/Welcome/Introduction.jsx";
import RoleSelection from "./modules/Welcome/RoleSelection.jsx";
import AdminLogin from "./modules/Admin/AdminLogin.jsx";
import ForgotPassword from "./modules/Admin/ForgotPassword.jsx";
import "./index.css";
import AdminDashboard from "./modules/Admin/AdminDashboard.jsx";
import AddDepartment from "./modules/Admin/AddDepartment.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/RoleSelection" element={<RoleSelection />} />

        <Route path="/admin-login" element={<AdminLogin/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route> 
        <Route path="/add-department" element={<AddDepartment/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
