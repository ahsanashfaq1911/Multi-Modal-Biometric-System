import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SetConnections() {
  const navigate = useNavigate();
  const [delay, setDelay] = useState("");
  const [sourceCamera, setSourceCamera] = useState(null);
  const [destinationCamera, setDestinationCamera] = useState(null);

  const cameraOptions = []; // Will be filled via API later

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
        {/* Title */}

        {/* Set Delay */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Set Delay
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="60"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
          />
        </Box>

        {/* Source Camera Dropdown */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Source Camera
          </Typography>
          <Autocomplete
            disablePortal
            options={cameraOptions}
            value={sourceCamera}
            onChange={(e, val) => setSourceCamera(val)}
            renderInput={(params) => (
              <TextField {...params} label="Source Camera" />
            )}
          />
        </Box>

        {/* Destination Camera Dropdown */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Destination Camera
          </Typography>
          <Autocomplete
            disablePortal
            options={cameraOptions}
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
        >
          Save
        </Button>

        {/* View & Add Path Buttons */}
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
