import AppLayout from "../../../layout/AppLayout.jsx";
import ForgotPassImage from "../../../assets/Images/ForgotPassword.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { Box, Typography, Button } from "@mui/material";
import CustomBox from "../../../components/CustomBox";
import CustomButton from "../../../components/CustomButton";
import CustomTextField from "../../../components/CustomTextField";

function ForgotPassword() {
  return (
    <AppLayout>
      <CustomBox title="Forgot Your Password?">
        {/* Image */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <img
            src={ForgotPassImage}
            alt="Forgot Password"
            style={{ maxWidth: "150px", width: "100%", height: "auto" }}
          />
        </Box>

        {/* Form Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "400px",
            mt: 4,
          }}
        >
          {/* Upload Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight="bold">Upload Your Image</Typography>
            <Button
              variant="outlined"
              endIcon={<CloudUploadIcon />}
              sx={{ textTransform: "none" }}
            >
              Upload
            </Button>
          </Box>

          {/* Password Field */}
          <Typography fontWeight="bold">Enter Your Password</Typography>
          <CustomTextField placeholder="Password" type="password" />
        </Box>

        {/* Submit Button */}
        <Box sx={{ width: "100%", maxWidth: 400, mt: 4 }}>
          <CustomButton size="large">Save</CustomButton>
        </Box>
      </CustomBox>
    </AppLayout>
  );
}

export default ForgotPassword;
