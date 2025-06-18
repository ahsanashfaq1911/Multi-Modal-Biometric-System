import AppLayout from "../../../layout/AppLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Alert,
} from "@mui/material";

function AddCamera() {
  const [cameraName, setCameraName] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch all locations
  const getLocation = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/all_locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setMessage({ type: "error", text: "Failed to load locations." });
    }
  };

  // Add a camera and create all required connections
  const handleAddCamera = async () => {
    if (!cameraName || !selectedLocation) {
      setMessage({
        type: "error",
        text: "Please enter camera name and select a location.",
      });
      return;
    }

    const trimmedCameraName = cameraName.trim();

    try {
      // Step 1: Add the new camera
      const res = await axios.post("http://127.0.0.1:5000/add_camera", {
        camera_model: trimmedCameraName,
        location_id: selectedLocation.id,
      });

      if (!res.data.message) {
        setMessage({
          type: "error",
          text: res.data.error || "Failed to add camera.",
        });
        return;
      }

      // Step 2: Fetch all cameras
      const camerasRes = await axios.get("http://127.0.0.1:5000/get_cameras");
      const allCameras = camerasRes.data;

      const otherCameras = allCameras.filter(
        (cam) => cam.camera_model !== trimmedCameraName
      );

      // Step 3: Self-connection
      console.log("Creating self-connection:", {
        camera_name_1: trimmedCameraName,
        camera_name_2: trimmedCameraName,
        delay: 0,
      });

      await axios.post("http://127.0.0.1:5000/add_connection", {
        camera_name_1: trimmedCameraName,
        camera_name_2: trimmedCameraName,
        delay: 0,
      });

      // Step 4: Mutual connections
      const connectionPromises = otherCameras.flatMap((cam) => {
        const camName = cam.camera_model.trim();
        return [
          axios.post("http://127.0.0.1:5000/add_connection", {
            camera_name_1: trimmedCameraName,
            camera_name_2: camName,
            delay: -1,
          }),
          axios.post("http://127.0.0.1:5000/add_connection", {
            camera_name_1: camName,
            camera_name_2: trimmedCameraName,
            delay: -1,
          }),
        ];
      });

      await Promise.all(connectionPromises);

      setCameraName("");
      setSelectedLocation(null);
      setMessage({
        type: "success",
        text: "Camera and connections added successfully.",
      });
    } catch (error) {
      console.error("Error during camera addition:", error);
      setMessage({
        type: "error",
        text:
          error?.response?.data?.error ||
          "An error occurred while adding the camera or connections.",
      });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <AppLayout>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "20px", sm: "24px", md: "28px" },
          fontWeight: "bold",
        }}
      >
        Add New Camera
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
        {message && (
          <Alert
            severity={message.type}
            sx={{ width: "100%", maxWidth: "400px" }}
          >
            {message.text}
          </Alert>
        )}

        {/* Camera Name Input */}
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            Camera Name
          </Typography>
          <TextField
            fullWidth
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
            label="Enter Camera Name"
            variant="outlined"
          />
        </Box>

        {/* Location Dropdown */}
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            Select Location
          </Typography>
          <Autocomplete
            disablePortal
            options={locations}
            value={selectedLocation}
            getOptionLabel={(option) => option.name || ""}
            onChange={(event, newValue) => setSelectedLocation(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Location" variant="outlined" />
            )}
          />
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddCamera}
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "200px",
              width: "100%",
            }}
          >
            Save
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/set-connections")}
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "200px",
              width: "100%",
            }}
          >
            Configure Links
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
}

export default AddCamera;
