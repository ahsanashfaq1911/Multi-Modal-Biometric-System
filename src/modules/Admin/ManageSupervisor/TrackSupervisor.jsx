import React, { useEffect, useState } from "react";
import {
  Typography,
  Autocomplete,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

import AppLayout from "../../../layout/AppLayout";
import CustomBox from "../../../components/CustomBox";

function TrackSupervisor() {
  const [supervisors, setSupervisors] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch supervisors
  useEffect(() => {
    axios.get("http://localhost:5000/supervisors").then((res) => {
      setSupervisors(res.data.supervisors || []);
    });
  }, []);

  // Fetch cameras
  useEffect(() => {
    axios.get("http://localhost:5000/get_cameras").then((res) => {
      setCameras(res.data || []);
    });
  }, []);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedSupervisor || !selectedCamera || !videoFile) {
      return setSnack({
        open: true,
        message: "Please select supervisor, camera, and video.",
        severity: "warning",
      });
    }

    const formData = new FormData();
    formData.append("user_id", selectedSupervisor.user_id);
    formData.append("camera_id", selectedCamera.id);
    formData.append("video", videoFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/route_user_video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", res.data);
      setSnack({
        open: true,
        message: "Video uploaded and tracking started!",
        severity: "success",
      });
    } catch (err) {
      const msg = err?.response?.data?.error || "Upload failed.";
      setSnack({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <AppLayout>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "40px" },
          fontWeight: "bold",
        }}
      >
        Track Supervisor
      </Typography>

      <CustomBox>
        <Autocomplete
          options={supervisors}
          value={selectedSupervisor}
          onChange={(e, newVal) => setSelectedSupervisor(newVal)}
          getOptionLabel={(opt) => opt?.name || ""}
          isOptionEqualToValue={(o, v) => o.user_id === v.user_id}
          renderInput={(params) => (
            <TextField {...params} label="Select Supervisor" />
          )}
        />

        <Autocomplete
          options={cameras}
          value={selectedCamera}
          onChange={(e, newVal) => setSelectedCamera(newVal)}
          getOptionLabel={(opt) =>
            opt?.camera_model ? `${opt.camera_model} (${opt.location})` : ""
          }
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderInput={(params) => (
            <TextField {...params} label="Select Camera" />
          )}
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" component="label">
            Browse Video
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={handleFileChange}
            />
          </Button>
        </Box>

        <Button variant="contained" sx={{ mt: 3 }} onClick={handleUpload}>
          Start Tracking
        </Button>
      </CustomBox>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}

export default TrackSupervisor;
