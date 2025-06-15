// src/modules/AddSubsection.jsx

import { useState } from "react";
import AppLayout from "../../layout/AppLayout";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import DepImg from "../../assets/Images/Add Department.png";

function AddSubsection() {
  // State for departments (empty initially)
  const [departments, setDepartments] = useState([]);

  return (
    <AppLayout>
      {/* Title Section */}
      <Box sx={{ padding: { xs: "20px", sm: "30px", md: "40px" } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
          }}
        >
          Add Subsection
        </Typography>
      </Box>

      {/* Image Section */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={DepImg} alt="Department" />
      </Box>

      {/* Heading + Dropdown */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "14px", sm: "18px", md: "22px" },
            fontWeight: "bold",
          }}
        >
          Select Subsection
        </Typography>

        <Autocomplete
          disablePortal
          options={departments} // Starts empty
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Subsection" variant="outlined" />
          )}
        />
        <Button
          variant="contained"
          sx={{
            // alignSelf: "flex-end", // aligns button to the right inside column layout
            borderRadius: "12px",
            paddingX: 4,
            paddingY: 1,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Save
        </Button>
      </Box>
    </AppLayout>
  );
}

export default AddSubsection;
