import { useState } from "react";
import AppLayout from "../../../layout/AppLayout.jsx";
import TextField from "@mui/material/TextField";
import LoginImage from "../../../assets/Images/Login.png";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });

      const { role, message, profile_img, user_id } = response.data;

      // Store user data in sessionStorage
      sessionStorage.setItem(
        "user",
        JSON.stringify({ email, role, profile_img, user_id })
      );

      // Show success message briefly
      setSuccessMessage(message);
      setTimeout(() => {
        if (role === "Admin") {
          navigate("/admin-dashboard");
        } else if (role === "Supervisor" || role === "Employee") {
          navigate("/user-dashboard"); // Update if needed
        } else {
          setError("Invalid role received.");
        }
      }, 1000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Box sx={{ padding: { xs: "20px", sm: "30px", md: "40px" } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
          }}
        >
          Login
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={LoginImage} alt="Login Visual" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "300px",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <label htmlFor="email">
          <b>Enter Your Email</b>
        </label>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
        />

        <label htmlFor="outlined-password-input">
          <b>Enter Your Password</b>
        </label>
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error}
        />

        {error && (
          <Typography color="error" sx={{ fontSize: "14px" }}>
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success.main" sx={{ fontSize: "14px" }}>
            {successMessage}
          </Typography>
        )}

        <Button variant="text" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </Button>

        <Button
          variant="outlined"
          sx={{
            color: "white",
            backgroundColor: "#469C9C",
            "&:hover": {
              backgroundColor: "#367676",
            },
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </AppLayout>
  );
}

export default AdminLogin;
