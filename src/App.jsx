import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Introduction from "./modules/Welcome/Introduction.jsx";
import RoleSelection from "./modules/Welcome/RoleSelection.jsx";
import AdminLogin from "./modules/Admin/AdminLogin.jsx";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/RoleSelection" element={<RoleSelection />} />

        <Route path="/admin-login" element={<AdminLogin/>}></Route>

      </Routes>
    </Router>
  );
}

export default App;
