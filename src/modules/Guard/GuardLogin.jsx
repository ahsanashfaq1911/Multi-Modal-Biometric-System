import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import CustomButton from "../../components/CustomButton";
import CustomTextField from "../../components/CustomTextField";
import guardLoginImg from "../../assets/Images/Vault.png";
import bifuse from "../../assets/Images/title.PNG";

function GuardLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "biit48") {
      navigate("/guard-welcome");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          gap: 3,
        }}
      >
        <img src={guardLoginImg} alt="Guard Login" style={{ maxWidth: 200 }} />
        <img src={bifuse} alt="BiFuse" style={{ maxWidth: 150 }} />

        <CustomTextField
          label="Enter Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
        />

        {error && (
          <Typography color="error" fontSize="0.9rem">
            {error}
          </Typography>
        )}

        <CustomButton label="Login" onClick={handleLogin} />
      </Box>
    </AppLayout>
  );
}

export default GuardLogin;
