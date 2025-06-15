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
import AddLocation from "./modules/Admin/Manage Cameras/AddLocation.jsx";
import AddCamera from "./modules/Admin/Manage Cameras/AddCamera.jsx";
import SetConnections from "./modules/Admin/Manage Cameras/SetConnections.jsx";
import ViewConnections from "./modules/Admin/Manage Cameras/ViewConnections.jsx";
import CreatePath from "./modules/Admin/Manage Cameras/CreatePath.jsx";
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
        <Route path="/add-location" element={<AddLocation />}></Route>
        <Route path="/add-camera" element={<AddCamera />}></Route>
        <Route path="/set-connections" element={<SetConnections />}></Route>
        <Route path="/view-connection" element={<ViewConnections />}></Route>
        <Route path="/create-path" element={<CreatePath />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
