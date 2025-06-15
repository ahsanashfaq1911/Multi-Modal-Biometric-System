import AppLayout from "../../../layout/AppLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";

function AddCamera() {
  const [location, setLocation] = useState([]);
  const navigate = useNavigate();

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
        {/* Title */}

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
            id="outlined-basic"
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
            options={location}
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
