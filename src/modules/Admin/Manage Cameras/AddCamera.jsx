import AppLayout from "../../../layout/AppLayout";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";

function AddCamera() {
  const [location, setLocation] = useState([]);

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // centers horizontally
          gap: 3,
          padding: { xs: 2, sm: 4, md: 6 },
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Add New Camera
        </Typography>

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

        {/* Save Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#469C9C",
            ":hover": { backgroundColor: "#357F7F" },
            width: "100%",
            maxWidth: "200px",
            mt: 2,
          }}
        >
          Save
        </Button>
      </Box>
    </AppLayout>
  );
}

export default AddCamera;
