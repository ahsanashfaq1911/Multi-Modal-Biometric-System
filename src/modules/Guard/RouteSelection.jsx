import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import AppLayout from "../../layout/AppLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RouteSelection() {
  const [visitors, setVisitors] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedVisitor, setSelectedVisitor] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [visRes, locRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/visitors"),
          axios.get("http://127.0.0.1:5000/all_locations"),
        ]);

        setVisitors(visRes.data || []);
        setLocations(locRes.data || []);
      } catch (err) {
        console.error("❌ Failed to load dropdown data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSave = () => {
    console.log("Saved Selection:", {
      visitor_id: selectedVisitor,
      source_location_id: selectedSource,
      destination_location_id: selectedDestination,
    });

    // You can send the POST request here if needed
    // axios.post('/save_path', { ... })
  };

  const handleCheckRoute = () => {
    navigate("/check-route");
  };

  if (loading) {
    return (
      <AppLayout>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography mt={2}>Loading options...</Typography>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          p: 4,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Select Route
        </Typography>

        {/* Visitors Dropdown */}
        <TextField
          select
          fullWidth
          label="Visitor"
          value={selectedVisitor}
          onChange={(e) => setSelectedVisitor(e.target.value)}
        >
          {visitors.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Source Dropdown */}
        <TextField
          select
          fullWidth
          label="Current Location"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          {locations.map((loc) => (
            <MenuItem key={loc.id} value={loc.id}>
              {loc.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Destination Dropdown */}
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

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#2196F3",
              "&:hover": { backgroundColor: "#0b7dda" },
            }}
          >
            Save
          </Button>

          <Button
            variant="contained"
            onClick={handleCheckRoute}
            sx={{
              backgroundColor: "#2196F3",
              "&:hover": { backgroundColor: "#0b7dda" },
            }}
          >
            Check Route
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
}

export default RouteSelection;
