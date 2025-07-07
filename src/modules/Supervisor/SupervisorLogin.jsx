import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import CustomBox from "../../components/CustomBox";

function SuperVisorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("⚠️ Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setAlertMsg("");

    try {
      const loginRes = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });

      const loginData = loginRes.data;
      setAlertMsg(loginData?.message || "✅ Login successful.");

      const completionRes = await axios.post(
        "http://127.0.0.1:5000/CompletionSupervisor",
        {
          email,
        }
      );

      console.log("✅ Profile Check:", completionRes.data); // Add this for debugging

      const isProfileComplete =
        completionRes.data === true || completionRes.data?.isComplete === true;

      if (isProfileComplete) {
        navigate("/supervisor-dashboard", { state: loginData });
      } else {
        navigate("/update-supervisor-profile");
      }

      localStorage.setItem("supervisorEmail", email);

      if (isProfileComplete) {
        navigate("/supervisor-dashboard", { state: loginData });
      } else {
        navigate("/update-supervisor-profile");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || "❌ Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <CustomBox>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
          }}
        >
          Supervisor Login
        </Typography>

        <TextField
          fullWidth
          label="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Enter Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {alertMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {alertMsg}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          sx={{
            backgroundColor: "#469C9C",
            "&:hover": { backgroundColor: "#3B8888" },
            fontWeight: "bold",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </CustomBox>
    </AppLayout>
  );
}

export default SuperVisorLogin;
