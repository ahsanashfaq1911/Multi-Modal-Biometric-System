import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Button,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
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

  const [savedRoutes, setSavedRoutes] = useState([]);

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
    if (!selectedVisitor || !selectedSource || !selectedDestination) {
      alert("Please select all fields before saving.");
      return;
    }

    const visitorName =
      visitors.find((v) => v.id === selectedVisitor)?.name || "Unknown";

    const sourceName =
      locations.find((l) => l.id === selectedSource)?.name || "Unknown";
    const destName =
      locations.find((l) => l.id === selectedDestination)?.name || "Unknown";

    const newEntry = {
      visitor_id: selectedVisitor,
      visitor_name: visitorName,
      source_id: selectedSource,
      source_name: sourceName,
      destination_id: selectedDestination,
      destination_name: destName,
    };

    setSavedRoutes((prev) => [...prev, newEntry]);

    // Reset selections
    setSelectedVisitor("");
    setSelectedSource("");
    setSelectedDestination("");
  };

  const handleCheckRoute = () => {
    if (savedRoutes.length === 0) {
      alert("No routes saved.");
      return;
    }
    navigate("/check-route", { state: { routes: savedRoutes } });
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
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#3e8e41" },
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

        {/* List of Saved Routes */}
        {savedRoutes.length > 0 && (
          <Box sx={{ mt: 4, width: "100%" }}>
            <Typography variant="h6">Saved Routes:</Typography>
            <List dense>
              {savedRoutes.map((route, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                    primary={`Visitor: ${route.visitor_name}`}
                    secondary={`From ${route.source_name} → To ${route.destination_name}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </AppLayout>
  );
}

export default RouteSelection;
