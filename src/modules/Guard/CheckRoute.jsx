import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  LinearProgress,
  Divider,
  Chip,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";

function CheckRoute() {
  const { state } = useLocation();
  const visitorRoutes = state?.routes || [];

  const [allPaths, setAllPaths] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [cameraSelections, setCameraSelections] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pathRes, locRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/all_paths"),
          axios.get("http://127.0.0.1:5000/all_locations"),
        ]);
        setAllPaths(pathRes.data.paths || []);
        setAllLocations(locRes.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleCameraChange = (visitorId, cameraId) => {
    setCameraSelections((prev) => ({ ...prev, [visitorId]: cameraId }));
  };

  const handleFileChange = (visitorId, file) => {
    setUploadedFiles((prev) => ({ ...prev, [visitorId]: file }));
  };

  const handleSubmit = (visitorId) => {
    const selectedCamera = cameraSelections[visitorId];
    const uploadedFile = uploadedFiles[visitorId];

    if (!selectedCamera || !uploadedFile) {
      alert("Please select a camera and upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("visitor_id", visitorId);
    formData.append("camera_id", selectedCamera);
    formData.append("file", uploadedFile);

    axios
      .post("http://127.0.0.1:5000/process_route", formData)
      .then((res) => {
        alert(`✅ ${res.data.message}`);
      })
      .catch(() => {
        alert("❌ Submission failed.");
      });
  };

  const extractPathsToDestination = (destinationName) => {
    return allPaths.filter((p) => p.path.endsWith(destinationName));
  };

  const splitPathSteps = (pathString) => {
    return pathString.split(" to ");
  };

  const isStepMatchedWithCamera = (step, selectedCameraId) => {
    const matchedCamera = allLocations.find(
      (loc) => loc.id === selectedCameraId
    );
    return matchedCamera?.name === step;
  };

  return (
    <AppLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Visitor Route Overview
        </Typography>

        {visitorRoutes.map((route, idx) => {
          const validPaths = extractPathsToDestination(route.destination_name);
          const currentCameraId = cameraSelections[route.visitor_id];
          const currentCameraName = allLocations.find(
            (loc) => loc.id === currentCameraId
          )?.name;

          return (
            <Box
              key={idx}
              sx={{
                border: "2px solid #ccc",
                borderRadius: 4,
                padding: 3,
                marginBottom: 4,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                👤 {route.visitor_name}
              </Typography>
              <Typography>
                🚩 {route.source_name} ➜ 🌟 {route.destination_name}
              </Typography>

              {validPaths.length === 0 ? (
                <Typography color="error" mt={2}>
                  ❌ No valid paths found to destination.
                </Typography>
              ) : (
                validPaths.map((p, i) => {
                  const steps = splitPathSteps(p.path);
                  const progress = (steps.length / 10) * 100;

                  return (
                    <Box key={i} sx={{ my: 2 }}>
                      <Typography variant="subtitle1">
                        Path {i + 1}: {p.path}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        {steps.map((step, idx) => (
                          <Chip
                            key={idx}
                            label={step}
                            color={
                              step === currentCameraName ? "success" : "default"
                            }
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  );
                })
              )}

              <Divider sx={{ my: 2 }} />

              <TextField
                select
                fullWidth
                label="Select Camera Location"
                value={currentCameraId || ""}
                onChange={(e) =>
                  handleCameraChange(route.visitor_id, Number(e.target.value))
                }
                sx={{ mb: 2 }}
              >
                {allLocations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant="contained" component="label" sx={{ mr: 2 }}>
                Browse File
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleFileChange(route.visitor_id, e.target.files[0])
                  }
                />
              </Button>

              <Button
                variant="contained"
                onClick={() => handleSubmit(route.visitor_id)}
              >
                Submit
              </Button>
            </Box>
          );
        })}
      </Box>
    </AppLayout>
  );
}

export default CheckRoute;
