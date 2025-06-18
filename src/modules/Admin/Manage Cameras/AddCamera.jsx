import AppLayout from "../../../layout/AppLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomDropdown from "../../../components/CustomDropDown.jsx";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";

import { apiRequest } from "../../../services/ApiService";
function AddCamera() {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/all_locations");
      setLocation(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    getLocation();
  });

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
            getOptionLabel={(option) => option.name || ""} // specify what to show
            onChange={(event, newValue) => {
              console.log("Selected Location:", newValue);
              // setSelectedLocation(newValue); // if you want to store it in state
            }}
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
