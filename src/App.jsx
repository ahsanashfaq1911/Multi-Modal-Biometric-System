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

import GuardLogin from "./modules/Guard/GuardLogin.jsx";
import GuardWelcome from "./modules/Guard/GuardWelcome.jsx";
import RouteSelection from "./modules/Guard/RouteSelection.jsx";
import CheckRoute from "./modules/Guard/CheckRoute.jsx";

import ManageSupervisor from "./modules/Admin/ManageSupervisor/ManageSupervisor.jsx";
import ViewAllSupervisors from "./modules/Admin/ManageSupervisor/ViewAllSupervisors.jsx";
import AddSupervisor from "./modules/Admin/ManageSupervisor/AddSupervisor.jsx";
import TrackSupervisor from "./modules/Admin/ManageSupervisor/TrackSupervisor.jsx";

import UserManagement from "./modules/Admin/User Management/UserManagement.jsx";
import CreateEmployeeAccount from "./modules/Admin/User Management/CreateEmployeeAccount.jsx";
import VisitorLogsHistory from "./modules/Admin/Visitor Logs History/VisitorLogs.jsx";

import AccessLogs from "./modules/Admin/Access Logs/AccessLogs.jsx";
import LogsHistory from "./modules/Admin/Access Logs/LogsHistory.jsx";

import SupervisorLogin from "./modules/Supervisor/SupervisorLogin.jsx";
import UpdateProfile from "./modules/Supervisor/UpdateProfile.jsx";
import SupervisorDashboard from "./modules/Supervisor/SupervisorDashboard.jsx";
import EmployeeOverview from "./modules/Supervisor/EmployeeOverview.jsx";
import AccessControl from "./modules/Supervisor/AccessControl.jsx";
import TrackEmployee from "./modules/Supervisor/TrackEmployee.jsx";
import Tracking from "./modules/Supervisor/Tracking.jsx";
function App() {
  // return <TestPage />;
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
        <Route path="/visitor-logs" element={<VisitorLogsHistory />}></Route>
        <Route path="/access-logs" element={<AccessLogs />}></Route>
        <Route path="/guard-login" element={<GuardLogin />}></Route>
        <Route path="/guard-welcome" element={<GuardWelcome />}></Route>
        <Route path="/route-selection" element={<RouteSelection />}></Route>
        <Route path="/check-route" element={<CheckRoute />}></Route>

        <Route
          path="/manage-supervisors"
          element={<ManageSupervisor />}
        ></Route>
        <Route
          path="/view-supervisors"
          element={<ViewAllSupervisors />}
        ></Route>
        <Route path="/add-supervisor" element={<AddSupervisor />}></Route>
        <Route path="/track-supervisor" element={<TrackSupervisor />}></Route>

        <Route path="/user-management" element={<UserManagement />}></Route>

        <Route
          path="/user-credentials"
          element={<CreateEmployeeAccount />}
        ></Route>
        <Route path="/Logs-History" element={<LogsHistory />}></Route>

        <Route path="/supervisor-login" element={<SupervisorLogin />}></Route>
        <Route
          path="/update-supervisor-profile"
          element={<UpdateProfile />}
        ></Route>
        <Route
          path="/supervisor-dashboard"
          element={<SupervisorDashboard />}
        ></Route>

        <Route
          path="/employees-overview"
          element={<EmployeeOverview />}
        ></Route>
        <Route path="/access-control" element={<AccessControl />}></Route>

        <Route path="/track-employee" element={<TrackEmployee />}></Route>
        <Route path="/tracking" element={<Tracking />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
