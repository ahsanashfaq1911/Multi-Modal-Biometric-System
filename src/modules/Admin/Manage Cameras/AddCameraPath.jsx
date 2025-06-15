import AppLayout from "../../../layout/AppLayout";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";

function AddCameraPath() {
  // States for form data
  const [sequence, setSequence] = useState("");
  const [pathOptions, setPathOptions] = useState([]); // Will be populated by API
  const [selectedPath, setSelectedPath] = useState(null);

  const [cameraOptions, setCameraOptions] = useState([]); // Will be populated by API
  const [selectedCamera, setSelectedCamera] = useState(null);

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          maxWidth: "500px",
          margin: "auto",
          padding: { xs: 2, sm: 4, md: 6 },
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Add Path
        </Typography>

        {/* Sequence Input */}
        <Box sx={{ width: "100%", maxWidth: "150px" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            Sequence
          </Typography>
          <TextField
            label="Sequence"
            variant="outlined"
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Select Path 1 */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            Select Path
          </Typography>
          <Autocomplete
            options={pathOptions}
            value={selectedPath}
            onChange={(event, newValue) => setSelectedPath(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Path 1" variant="outlined" />
            )}
            fullWidth
          />
        </Box>

        {/* Select Camera */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            Select Camera
          </Typography>
          <Autocomplete
            options={cameraOptions}
            value={selectedCamera}
            onChange={(event, newValue) => setSelectedCamera(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Camera" variant="outlined" />
            )}
            fullWidth
          />
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          sx={{
            ":hover": { backgroundColor: "#0d3f66" }, // darker than 115293
            width: "100%",
            maxWidth: "200px",
            alignSelf: "center",
          }}
        >
          Save
        </Button>
      </Box>
    </AppLayout>
  );
}

export default AddCameraPath;
