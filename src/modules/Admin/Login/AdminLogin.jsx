import AppLayout from "../../../layout/AppLayout.jsx";
import TextField from "@mui/material/TextField";

import LoginImage from "../../../assets/Images/Login.png"; // Assuming you have a login image
import { Box, Typography, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
function AdminLogin() {
  const navigate = useNavigate();
  return (
    <>
      <AppLayout>
        <Box
          sx={{
            padding: { xs: "20px", sm: "30px", md: "40px" },
          }}
        >
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
          <img src={LoginImage} alt="" />
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
          <label htmlFor="">
            <b>Enter Your Email</b>
          </label>
          <TextField id="outlined-basic" label="Email" variant="outlined" />
          <label htmlFor="">
            <b>Enter Your Password</b>
          </label>
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Button
            variant="text"
            sx={{ maxWidt: "150px", maxHeight: "5px" }}
            onClick={() => navigate("/forgot-password")}
          >
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
            onClick={() => navigate("/admin-dashboard")}
          >
            Login
          </Button>
        </Box>
      </AppLayout>
    </>
  );
}

export default AdminLogin;
