import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Snackbar, Alert } from "@mui/material";
import AppLayout from "../../layout/AppLayout.jsx";
import CustomBox from "../../components/CustomBox";
import CustomTextField from "../../components/CustomTextField";
import CustomButton from "../../components/CustomButton";
import axios from "axios";

function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbarMsg("Please enter both email and password.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { message, profile_img, role, user_id } = res.data;

      // ✅ Only allow Employees to log in
      if (role !== "Employee") {
        setSnackbarMsg("Access denied. Only employees can log in here.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // ✅ Save user data in sessionStorage
      sessionStorage.setItem(
        "user",
        JSON.stringify({ email, role, profile_img, user_id })
      );

      // ✅ Redirect based on profile completeness
      if (message?.includes("Pending Name")) {
        navigate("/complete-profile", {
          state: { user_id, message, profile_img, role },
        });
      } else {
        navigate("/employee-dashboard", {
          state: { user_id, message, profile_img, role },
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || "Login failed. Please try again.";
      setSnackbarMsg(msg);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <AppLayout>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "40px" },
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
        }}
      >
        Employee Login
      </Typography>

      <CustomBox sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
        <CustomTextField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <CustomTextField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Box textAlign="right">
          <CustomButton onClick={handleLogin}>Login</CustomButton>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            variant="filled"
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </CustomBox>
    </AppLayout>
  );
}

export default EmployeeLogin;
