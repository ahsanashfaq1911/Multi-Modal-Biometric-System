import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Fetch and set camera list
  useEffect(() => {
  const fetchCameras = async () => {
    const response = await apiRequest({ url: "/get_cameras", method: "GET" });

    if (Array.isArray(response)) {
      const cameras = response.map((cam) => ({
        id: cam.id,
        name: cam.camera_model, // 👈 using correct field
      }));
      setCameraOptions(cameras);
    } else {
      setError("Failed to fetch cameras.");
    }
  };

  fetchCameras();
}, []);


  // ✅ Handle Save
  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!delay || !sourceCamera || !destinationCamera) {
      setError("Please fill all fields.");
      return;
    }

    if (sourceCamera.id === destinationCamera.id) {
      setError("Source and destination cameras cannot be the same.");
      return;
    }

    setLoading(true);

    const response = await apiRequest({
      url: "/add_connection",
      method: "POST",
      data: {
        delay,
        camera_id_1: sourceCamera.id,
        camera_id_2: destinationCamera.id,
      },
    });

    if (response?.message) {
      setSuccess(response.message);
      setDelay("");
      setSourceCamera(null);
      setDestinationCamera(null);
    } else {
      setError(response?.error || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <AppLayout>
      <Typography
        variant="h5"
        sx={{ fontSize: { xs: "20px", sm: "24px", md: "28px" }, fontWeight: "bold" }}
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
        {/* Delay Field */}
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
          />
        </Box>

        {/* Source Camera */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Source Camera
          </Typography>
          <Autocomplete
            options={cameraOptions}
            value={sourceCamera}
            onChange={(e, val) => setSourceCamera(val)}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
            renderInput={(params) => <TextField {...params} label="Source Camera" />}
          />
        </Box>

        {/* Destination Camera */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Destination Camera
          </Typography>
          <Autocomplete
            options={cameraOptions}
            value={destinationCamera}
            onChange={(e, val) => setDestinationCamera(val)}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
            renderInput={(params) => <TextField {...params} label="Destination Camera" />}
          />
        </Box>

        {/* Feedback */}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography sx={{ color: "green", mt: 1 }}>
            {success}
          </Typography>
        )}
        {loading && <CircularProgress sx={{ mt: 1 }} />}

        {/* Save Button */}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{ width: "100%", maxWidth: "150px", mt: 2 }}
        >
          Save
        </Button>

        {/* Navigation */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              width: "200px",
            }}
            onClick={() => navigate("/view-connection")}
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
    </AppLayout>
  );
}

export default SetConnections;
