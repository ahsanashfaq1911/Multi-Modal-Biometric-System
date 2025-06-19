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
  CircularProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";

// 🧠 Reconstruct a single ordered path from list of segments like "A to B"
const reconstructPath = (segments) => {
  const fromTo = new Map();
  const toSet = new Set();

  segments.forEach((seg) => {
    const [from, to] = seg.split(" to ").map((s) => s.trim());
    if (from && to) {
      fromTo.set(from, to);
      toSet.add(to);
    }
  });

  // Find the start point: something that appears in "from" but not in "to"
  let start = null;
  for (const from of fromTo.keys()) {
    if (!toSet.has(from)) {
      start = from;
      break;
    }
  }

  if (!start) return [];

  // Build full ordered path
  const path = [start];
  let current = start;
  while (fromTo.has(current)) {
    const next = fromTo.get(current);
    path.push(next);
    current = next;
  }

  return path;
};

function CheckRoute() {
  const { state } = useLocation();

  const savedRoutes = localStorage.getItem("visitor_routes");
  const visitorRoutes = state?.routes || JSON.parse(savedRoutes || "[]");

  const [allCameras, setAllCameras] = useState([]);
  const [cameraSelections, setCameraSelections] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [visitorPaths, setVisitorPaths] = useState({});
  const [loadingPaths, setLoadingPaths] = useState(false);

  useEffect(() => {
    if (visitorRoutes.length > 0) {
      localStorage.setItem("visitor_routes", JSON.stringify(visitorRoutes));
    }
  }, [visitorRoutes]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/get_cameras");
        setAllCameras(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch cameras:", err);
      }
    };
    fetchCameras();
  }, []);

  useEffect(() => {
    const fetchPathsForVisitors = async () => {
      if (visitorRoutes.length === 0) return;

      setLoadingPaths(true);
      const pathsData = {};

      try {
        const payload = visitorRoutes.map((r) => ({
          visitor_id: r.visitor_id,
          source_id: r.source_id,
          destination_id: r.destination_id,
        }));

        const res = await axios.post("http://127.0.0.1:5000/find_all_paths", payload);
        const responsePaths = res.data.paths || [];

        responsePaths.forEach((entry) => {
          const allPaths = (entry.paths || []).map((segmentList) =>
            reconstructPath(segmentList)
          );
          pathsData[entry.visitor_id] = allPaths;
        });

        setVisitorPaths(pathsData);
      } catch (err) {
        console.error("❌ Failed to fetch paths:", err);
      } finally {
        setLoadingPaths(false);
      }
    };

    fetchPathsForVisitors();
  }, [visitorRoutes]);

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
      alert("❗ Please select a camera and upload a file before submitting.");
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

  return (
    <AppLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Visitor Route Overview
        </Typography>

        {loadingPaths ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
            <Typography mt={2}>Loading all paths...</Typography>
          </Box>
        ) : (
          visitorRoutes.map((route, idx) => {
            const allPaths = visitorPaths[route.visitor_id] || [];
            const currentCameraId = cameraSelections[route.visitor_id];
            const currentCameraLocation = allCameras.find(
              (cam) => cam.id === currentCameraId
            )?.location;

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
                  🚩 {route.source_name} ➝ 🌟 {route.destination_name}
                </Typography>

                {allPaths.length === 0 ? (
                  <Typography color="error" mt={2}>
                    ❌ No valid paths found to destination.
                  </Typography>
                ) : (
                  allPaths.map((steps, pathIndex) => {
                    const progress = Math.min((steps.length / 10) * 100, 100);
                    return (
                      <Box key={pathIndex} sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">
                          Path {pathIndex + 1}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          {steps.map((step, index) => (
                            <Chip
                              key={index}
                              label={step}
                              color={
                                step === currentCameraLocation
                                  ? "success"
                                  : "default"
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
                  label="Select Camera"
                  value={currentCameraId || ""}
                  onChange={(e) =>
                    handleCameraChange(route.visitor_id, Number(e.target.value))
                  }
                  sx={{ mb: 2 }}
                >
                  {allCameras.map((cam) => (
                    <MenuItem key={cam.id} value={cam.id}>
                      {cam.location} ({cam.camera_model})
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
          })
        )}
      </Box>
    </AppLayout>
  );
}

export default CheckRoute;
