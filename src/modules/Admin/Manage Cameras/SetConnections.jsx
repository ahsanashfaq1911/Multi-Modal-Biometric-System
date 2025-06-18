import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/ApiService";

function SetConnections() {
  const navigate = useNavigate();

  const [delay, setDelay] = useState("");
  const [sourceCamera, setSourceCamera] = useState(null);
  const [destinationCamera, setDestinationCamera] = useState(null);
  const [cameraOptions, setCameraOptions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch camera options from backend
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await apiRequest({
          url: "/get_cameras",
          method: "GET",
        });

        if (Array.isArray(response)) {
          const cameraList = response.map((cam) => cam.camera_model);
          setCameraOptions(cameraList);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Camera fetch error:", error);
        setSnackbar({
          open: true,
          message: "Failed to load cameras.",
          severity: "error",
        });
      }
    };

    fetchCameras();
  }, []);

  // Save connection
  const handleSave = async () => {
    if (!sourceCamera || !destinationCamera || !delay.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "warning",
      });
      return;
    }

    if (sourceCamera === destinationCamera) {
      setSnackbar({
        open: true,
        message: "Source and destination cameras must be different.",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await apiRequest({
        url: "/add_connection", // ✅ Fixed endpoint
        method: "POST", // ✅ Changed to POST
        data: {
          camera_name_1: sourceCamera,
          camera_name_2: destinationCamera,
          delay: parseInt(delay),
        },
      });

      if (response?.message) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        setDelay("");
        setSourceCamera(null);
        setDestinationCamera(null);
      } else {
        setSnackbar({
          open: true,
          message: response?.error || "Failed to add connection.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      setSnackbar({
        open: true,
        message: "Failed to add connection.",
        severity: "error",
      });
    }
  };

  return (
    <AppLayout>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "20px", sm: "24px", md: "28px" },
          fontWeight: "bold",
        }}
      >
        Set Connections
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: { xs: 2, sm: 4, md: 6 },
        }}
      >
        {/* Delay Input */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Set Delay (in seconds)
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="60"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </Box>

        {/* Source Camera */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Source Camera
          </Typography>
          <Autocomplete
            disablePortal
            options={cameraOptions.filter((cam) => cam !== destinationCamera)}
            value={sourceCamera}
            onChange={(e, val) => setSourceCamera(val)}
            renderInput={(params) => (
              <TextField {...params} label="Source Camera" />
            )}
          />
        </Box>

        {/* Destination Camera */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Destination Camera
          </Typography>
          <Autocomplete
            disablePortal
            options={cameraOptions.filter((cam) => cam !== sourceCamera)}
            value={destinationCamera}
            onChange={(e, val) => setDestinationCamera(val)}
            renderInput={(params) => (
              <TextField {...params} label="Destination Camera" />
            )}
          />
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          sx={{ width: "100%", maxWidth: "150px", mt: 2 }}
          onClick={handleSave}
        >
          Save
        </Button>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              width: "200px",
            }}
            onClick={() => navigate("/view-connections")}
          >
            View Connections
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              width: "200px",
            }}
            onClick={() => navigate("/create-path")}
          >
            Add Path
          </Button>
        </Box>
      </Box>

      {/* Snackbar */}
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

export default SetConnections;
