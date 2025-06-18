import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "../../../assets/Images/image.png";

function CreatePath() {
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState(null);

  // 🔄 Fetch all locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/all_locations");
        setLocations(res.data);
      } catch (err) {
        console.error("❌ Failed to load locations", err);
        setMessage({ type: "error", text: "Failed to load locations." });
      }
    };
    fetchLocations();
  }, []);

  // ✅ Save path handler
  const handleSave = async () => {
    setMessage(null);

    if (!selectedSource || !selectedDestination) {
      setMessage({
        type: "error",
        text: "Please select both source and destination.",
      });
      return;
    }

    if (selectedSource === selectedDestination) {
      setMessage({
        type: "error",
        text: "Source and destination cannot be the same.",
      });
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/add_path", {
        source: selectedSource,
        destination: selectedDestination,
      });

      if (res.status === 201 && res.data.message) {
        setMessage({ type: "success", text: res.data.message });
        setSelectedSource("");
        setSelectedDestination("");
      } else {
        setMessage({
          type: "error",
          text: res.data?.error || "Failed to add path.",
        });
      }
    } catch (err) {
      console.error("❌ Error adding path:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.error || "An error occurred while saving path.",
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
          mt: 2,
          textAlign: "center",
        }}
      >
        Create Path
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
        {/* ✅ Alert Message */}
        {message && (
          <Alert
            severity={message.type}
            sx={{ width: "100%", maxWidth: "400px" }}
          >
            {message.text}
          </Alert>
        )}

        {/* 📷 Image */}
        <Box display="flex" justifyContent="center">
          <img
            src={Image}
            alt="Create Path"
            style={{ width: "100%", maxWidth: 250 }}
          />
        </Box>

        {/* 🔹 Source Location Dropdown */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Source Location
          </Typography>
          <TextField
            select
            fullWidth
            label="Source Location"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* 🔹 Destination Location Dropdown */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Destination Location
          </Typography>
          <TextField
            select
            fullWidth
            label="Destination Location"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* ✅ Save Button */}
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ width: "100%", maxWidth: "150px", mt: 2 }}
        >
          Save
        </Button>
      </Box>
    </AppLayout>
  );
}

export default CreatePath;
