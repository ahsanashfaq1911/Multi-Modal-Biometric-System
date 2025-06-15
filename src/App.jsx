import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Introduction from "./modules/Welcome/Introduction.jsx";
import RoleSelection from "./modules/Welcome/RoleSelection.jsx";
import AdminLogin from "../src/modules/Admin/Login/AdminLogin.jsx";
import ForgotPassword from "./modules/Admin/Login/ForgotPassword.jsx";
import "./index.css";
import AdminDashboard from "./modules/Admin/Login/AdminDashboard.jsx";
import AddDepartment from "./modules/Admin/Department/AddDepartment.jsx";
import AddSubsection from "./modules/Admin/Department/AddSubsection.jsx";
import ManageCameras from "./modules/Admin/Manage Cameras/ManageCameras.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/RoleSelection" element={<RoleSelection />} />
        <Route path="/admin-login" element={<AdminLogin />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
        <Route path="/add-department" element={<AddDepartment />}></Route>
        <Route path="/add-subsection" element={<AddSubsection />}></Route>
        <Route path="/manage-cameras" element={<ManageCameras />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
