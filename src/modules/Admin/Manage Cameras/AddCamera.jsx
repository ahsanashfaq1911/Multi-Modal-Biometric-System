import AppLayout from "../../../layout/AppLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";
import { apiRequest } from "../../../services/ApiService";

function AddCamera() {
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cameraName, setCameraName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      const response = await apiRequest({
        url: "/all_locations",
        method: "GET",
      });
      if (response && Array.isArray(response)) {
        setLocationList(response);
      }
    };
    fetchLocations();
  }, []);

  const handleSave = async () => {
    if (!cameraName || !selectedLocation) {
      setError("Both Camera Name and Location are required.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await apiRequest({
      url: "/add_camera",
      method: "POST",
      data: {
        camera_model: cameraName,
        location_id: selectedLocation.id || selectedLocation.location_id,
      },
    });

    if (response?.message) {
      alert(response.message);
      setCameraName("");
      setSelectedLocation(null);
    } else {
      setError(response?.error || "Failed to add camera.");
    }

    setLoading(false);
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
        Add Camera
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
            label="Enter Camera Name"
            variant="outlined"
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
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
            options={locationList}
            getOptionLabel={(option) => option.name || option.label || ""}
            value={selectedLocation}
            onChange={(event, newValue) => setSelectedLocation(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Location" variant="outlined" />
            )}
          />
        </Box>

        {/* Error or Loading */}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {loading && <CircularProgress />}

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
            onClick={handleSave}
            disabled={loading}
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "200px",
              width: "100%",
            }}
          >
            {loading ? "Saving..." : "Save"}
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
