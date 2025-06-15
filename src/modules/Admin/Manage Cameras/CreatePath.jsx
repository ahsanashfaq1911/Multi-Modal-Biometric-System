import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../../assets/Images/image.png";

function CreatePath() {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  // Dummy options for design purposes
  const dummyLocations = ["Main Gate", "Library", "Lab A", "Admin Office"];

  return (
    <AppLayout>
          {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            fontWeight: "bold",
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
      

        {/* Image */}
        <Box display="flex" justifyContent="center">
          <img
            src={Image}
            alt="Create Path"
            style={{ width: "100%", maxWidth: 250 }}
          />
        </Box>

        {/* Source Location */}
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
            {dummyLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Destination Location */}
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
            {dummyLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          sx={{ width: "100%", maxWidth: "150px", mt: 2 }}
        >
          Save
        </Button>

        
      </Box>
    </AppLayout>
  );
}

export default CreatePath;
