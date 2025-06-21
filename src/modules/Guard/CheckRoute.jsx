import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";

function CheckRoute() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const savedRoutes = localStorage.getItem("visitor_routes");
  const visitorRoutes = state?.routes || JSON.parse(savedRoutes || "[]");

  const [allCameras, setAllCameras] = useState([]);
  const [cameraSelections, setCameraSelections] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [visitorPaths, setVisitorPaths] = useState({});
  const [cameraMatched, setCameraMatched] = useState({});
  const [loadingPaths, setLoadingPaths] = useState(false);
  const [uploading, setUploading] = useState({});
  const [recognitionResults, setRecognitionResults] = useState({});

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
          current_location_id: r.source_id,
          desired_location_id: r.destination_id,
        }));

        const res = await axios.post(
          "http://127.0.0.1:5000/find_all_paths",
          payload
        );

        const responseArray = res.data;
        if (!Array.isArray(responseArray)) {
          console.error("❌ Expected array but got:", responseArray);
          return;
        }

        responseArray.forEach((entry) => {
          // Only keep full path match if it's in the actual recorded path
          const validPaths = (entry.paths || []).filter((p) =>
            p.path?.join("")?.includes(entry.original_path?.join("") || "")
          );
          pathsData[entry.visitor_name] = validPaths;
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

  const handleSubmit = async (visitorId) => {
    const selectedCamera = cameraSelections[visitorId];
    const uploadedFile = uploadedFiles[visitorId];

    if (!selectedCamera || !uploadedFile) {
      alert("❗ Please select a camera and upload a file before submitting.");
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [visitorId]: true }));

      const formData = new FormData();
      formData.append("visitor_id", visitorId);
      formData.append("video", uploadedFile);

      const res = await axios.post(
        "http://127.0.0.1:5000/unified-recognition/start",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { name, gender, gait_style } = res.data;

      if (
        !name ||
        name.toLowerCase() === "unknown" ||
        name.toLowerCase().includes("unknown")
      ) {
        navigate("/deviate");
        return;
      }

      const matchedLocation = allCameras.find(
        (c) => c.id === selectedCamera
      )?.location;

      setRecognitionResults((prev) => ({
        ...prev,
        [visitorId]: { name, gender, gait_style },
      }));

      setCameraMatched((prev) => ({
        ...prev,
        [visitorId]: matchedLocation,
      }));
    } catch (err) {
      alert("❌ Unified recognition failed.");
    } finally {
      setUploading((prev) => ({ ...prev, [visitorId]: false }));
    }
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
            const allPaths = visitorPaths[route.visitor_name] || [];
            const currentCameraId = cameraSelections[route.visitor_id];
            const uniqueCameras = [
              ...new Set(allPaths.flatMap((p) => p.cameras || [])),
            ];
            const recognizedLocation = cameraMatched[route.visitor_id];
            const result = recognitionResults[route.visitor_id];

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
                  allPaths.map((entry, pathIndex) => (
                    <Box key={pathIndex} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Path {pathIndex + 1}:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {entry.path.map((step, index) => (
                          <Chip
                            key={index}
                            label={step}
                            color={
                              recognizedLocation &&
                              entry.path.indexOf(recognizedLocation) >= index
                                ? "success"
                                : "default"
                            }
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  ))
                )}

                {result && (
                  <Box mt={2}>
                    <Typography color="green" fontWeight="bold">
                      ✅ Name: {result.name}
                    </Typography>
                    <Typography>🧠 Gender: {result.gender}</Typography>
                    <Typography>🚶‍♂️ Gait Style: {result.gait_style}</Typography>
                  </Box>
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
                  {uniqueCameras.map((cam, i) => {
                    const camObj = allCameras.find(
                      (c) => c.camera_model === cam
                    );
                    return (
                      <MenuItem key={i} value={camObj?.id || i}>
                        {camObj?.location
                          ? `${camObj.location} (${camObj.camera_model})`
                          : cam}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <Button variant="contained" component="label" sx={{ mr: 2 }}>
                  Browse File
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={(e) =>
                      handleFileChange(route.visitor_id, e.target.files[0])
                    }
                  />
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleSubmit(route.visitor_id)}
                  disabled={uploading[route.visitor_id]}
                >
                  {uploading[route.visitor_id] ? "Processing..." : "Submit"}
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
