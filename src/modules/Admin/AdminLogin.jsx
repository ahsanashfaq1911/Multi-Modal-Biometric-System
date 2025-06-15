import AppLayout from "../../layout/AppLayout";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoginImage from "../../assets/Images/Login.png"; // Assuming you have a login image
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
function AdminLogin() {
  const navigate = useNavigate();
  return (
    <>
      <AppLayout>
        <Box>
          <label htmlFor="">
            <h1>Login</h1>
          </label>
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
          <Button variant="text" sx={{ maxWidt: "150px", maxHeight: "5px" }} onClick={() => navigate("/forgot-password")}>
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
