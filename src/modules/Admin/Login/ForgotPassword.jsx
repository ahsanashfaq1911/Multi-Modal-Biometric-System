import AppLayout from "../../../layout/AppLayout.jsx";
import ForgotPassImage from "../../../assets/Images/ForgotPassword.png";
import { Box, Button, TextField, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function ForgotPassword() {
  return (
    <AppLayout>
      {/* Image Section */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <img
          src={ForgotPassImage}
          alt="Forgot Password"
          style={{ maxWidth: "150px", width: "100%", height: "auto" }}
        />
      </Box>

      {/* Title */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Forgot Your Password?
        </Typography>
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "90%",
          maxWidth: "400px",
          margin: "auto",
          mt: 4,
        }}
      >
        {/* Upload Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography fontWeight="bold">Upload Your Image</Typography>
          <Button variant="outlined" endIcon={<CloudUploadIcon />}>
            Upload
          </Button>
        </Box>

        {/* Password Field */}
        <Typography fontWeight="bold">Enter Your Password</Typography>
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          autoComplete="current-password"
        />
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button variant="contained" size="large">
          Save
        </Button>
      </Box>
    </AppLayout>
  );
}

export default ForgotPassword;
