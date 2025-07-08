import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Snackbar,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";

function BlockPath() {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [desiredLocation, setDesiredLocation] = useState("");
  const [paths, setPaths] = useState([]);
  const [togglingIndex, setTogglingIndex] = useState(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load blocked paths from localStorage
  const getBlockedPathsFromStorage = () =>
    JSON.parse(localStorage.getItem("blocked_paths") || "[]");

  const saveBlockedPathsToStorage = (paths) =>
    localStorage.setItem("blocked_paths", JSON.stringify(paths));

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/all_locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  };

  const fetchPaths = async () => {
    try {
      const res = await axios.post("http://localhost:5000/paths_for_dr", {
        current_location_id: currentLocation,
        desired_location_id: desiredLocation,
      });

      const result = Array.isArray(res.data) ? res.data[0] : res.data;

      const blocked = getBlockedPathsFromStorage();

      // Mark status from localStorage (overwrite)
      const mergedPaths = (result?.paths || []).map((p) => {
        const isBlocked = blocked.some(
          (bp) => JSON.stringify(bp.path) === JSON.stringify(p.path)
        );
        return { ...p, status: isBlocked ? 0 : 1 };
      });

      setPaths(mergedPaths);
    } catch (err) {
      console.error("Error fetching paths", err);
      setSnackbar({
        open: true,
        message: "Error fetching paths",
        severity: "error",
      });
    }
  };

  const handleToggleStatus = async (index) => {
    const selectedPath = paths[index];
    const newStatus = selectedPath.status === 1 ? 0 : 1;

    setTogglingIndex(index);
    try {
      await axios.post("http://localhost:5000/discard_path", {
        path: selectedPath.path,
        status: newStatus,
      });

      const updatedPaths = [...paths];
      updatedPaths[index].status = newStatus;
      setPaths(updatedPaths);

      // Update localStorage
      let blocked = getBlockedPathsFromStorage();

      if (newStatus === 0) {
        blocked.push(selectedPath);
        saveBlockedPathsToStorage(blocked);
      } else {
        blocked = blocked.filter(
          (bp) => JSON.stringify(bp.path) !== JSON.stringify(selectedPath.path)
        );
        saveBlockedPathsToStorage(blocked);
      }

      setSnackbar({
        open: true,
        message: `Path ${newStatus === 0 ? "blocked" : "enabled"}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to update path status", err);
      setSnackbar({
        open: true,
        message: "Error updating path status",
        severity: "error",
      });
    } finally {
      setTogglingIndex(null);
    }
  };

  return (
    <AppLayout>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#2A9D8F", mb: 4 }}
        >
          Manage Paths
        </Typography>

        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          alignItems="center"
          maxWidth={400}
          mx="auto"
        >
          {/* Current Location */}
          <FormControl fullWidth>
            <InputLabel>Current Location</InputLabel>
            <Select
              value={currentLocation}
              label="Current Location"
              onChange={(e) => setCurrentLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Desired Location */}
          <FormControl fullWidth>
            <InputLabel>Desired Location</InputLabel>
            <Select
              value={desiredLocation}
              label="Desired Location"
              onChange={(e) => setDesiredLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={fetchPaths}
            disabled={!currentLocation || !desiredLocation}
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
          >
            Show Paths
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              const blocked = getBlockedPathsFromStorage();
              setPaths(blocked);
              setShowBlocked(true);
            }}
          >
            Show Blocked Paths
          </Button>
        </Box>

        {/* Paths Display */}
        {paths.length > 0 && (
          <Box mt={5}>
            <Typography variant="h6" mb={2}>
              {showBlocked ? "Blocked Paths" : "Available Paths"}
            </Typography>

            <Stack spacing={2} alignItems="center">
              {paths.map((item, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    p: 2,
                    width: "90%",
                    maxWidth: 600,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box flexGrow={1}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {item.path.join(" → ")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={item.status === 1 ? "green" : "red"}
                    >
                      Status: {item.status === 1 ? "Active" : "Blocked"}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    color={item.status === 1 ? "error" : "success"}
                    onClick={() => handleToggleStatus(index)}
                    disabled={togglingIndex === index}
                  >
                    {item.status === 1 ? "Block" : "Enable"}
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Snackbar Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  );
}

export default BlockPath;
