import AppLayout from "../../../layout/AppLayout";
import { useState } from "react";
import LocImg from "../../../assets/Images/add location.jpg";
import {
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { apiRequest } from "../../../services/ApiService"; // Your shared API function
import { useNavigate } from "react-router-dom";
function AddLocation() {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSave = async () => {
    if (!locationName.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a location name.",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await apiRequest({
        url: "/add_location",
        method: "POST",
        data: { name: locationName.trim() },
      });

      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
      setLocationName(""); // Clear input after save
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add location.",
        severity: "error",
      });
    }
  };

  return (
    <AppLayout>
      {/* Title Section */}
      <Box sx={{ padding: { xs: "20px", sm: "30px", md: "40px" } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
          }}
        >
          Add Location
        </Typography>
      </Box>

      {/* Image Section */}
      <Box sx={{ display: "flex", justifyContent: "center", padding: "5%" }}>
        <img src={LocImg} alt="Department" />
      </Box>

      {/* Input and Button Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: "100%",
          maxWidth: { xs: "90%", sm: "400px", md: "500px" },
          mx: "auto",
          mt: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", alignSelf: "flex-start" }}
        >
          Location
        </Typography>

        <TextField
          label="Enter Location Name"
          variant="outlined"
          fullWidth
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" size="small" onClick={handleSave}>
            Save
          </Button>
        </Box>

        {/* (Optional) Navigation Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": {
                backgroundColor: "#357F7F",
              },
            }}
            onClick={() => navigate("/add-camera")}
          >
            Add Camera
          </Button>
        </Box>
      </Box>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}

export default AddLocation;
