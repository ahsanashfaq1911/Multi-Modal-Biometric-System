import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import AppLayout from "../../layout/AppLayout.jsx";
import CustomBox from "../../components/CustomBox";
import CustomTextField from "../../components/CustomTextField";
import CustomButton from "../../components/CustomButton";
import axios from "axios";

function CompleteProfile() {
  const navigate = useNavigate();

  // ✅ Retrieve user_id from sessionStorage
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const user_id = userData?.user_id;

  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [contact, setContact] = useState("");
  const [designation, setDesignation] = useState("");
  const [profileImg, setProfileImg] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async () => {
    if (!user_id || !name || !cnic || !contact || !designation || !profileImg) {
      setSnackbarMsg("Please fill all fields and select a profile image.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("name", name);
    formData.append("cnic", cnic);
    formData.append("contact", contact);
    formData.append("designation_name", designation);
    formData.append("profile_img", profileImg);

    try {
      const res = await axios.post("http://localhost:5000/save_employee", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbarMsg(res.data.message || "Profile updated successfully.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/employee-dashboard");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save profile.";
      setSnackbarMsg(msg);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (!user_id) {
      setSnackbarMsg("User session expired. Please login again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/employee-login"), 2000);
    }
  }, [user_id, navigate]);

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
        Complete Your Profile
      </Typography>

      <CustomBox sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
        <CustomTextField
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <CustomTextField
          label="CNIC"
          placeholder="Enter your CNIC"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <CustomTextField
          label="Contact Number"
          placeholder="Enter your contact number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <CustomTextField
          label="Designation"
          placeholder="Enter your designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Profile Image Upload */}
        <Box sx={{ mb: 3 }}>
          <Typography mb={1}>Upload Profile Image</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setProfileImg(e.target.files[0]);
              }
            }}
          />
          {profileImg && (
            <Avatar
              src={URL.createObjectURL(profileImg)}
              sx={{ mt: 2, width: 80, height: 80 }}
            />
          )}
        </Box>

        {/* Submit Button */}
        <Box textAlign="right">
          <CustomButton onClick={handleSubmit}>Save Profile</CustomButton>
        </Box>

        {/* Snackbar Alert */}
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

export default CompleteProfile;
