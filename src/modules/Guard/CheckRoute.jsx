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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";

function CheckRoute() {
  const { state } = useLocation();
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
  const [unknownVisitors, setUnknownVisitors] = useState({});
  const [deviatedVisitor, setDeviatedVisitor] = useState(null);
  const [showDeviationDialog, setShowDeviationDialog] = useState(false);
  const [visitorHistory, setVisitorHistory] = useState({});

  // 📸 Access Image Dialog
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [accessImages, setAccessImages] = useState([]);
  const [accessVisitorName, setAccessVisitorName] = useState("");

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

        if (!Array.isArray(responseArray)) return;

        responseArray.forEach((entry) => {
          pathsData[entry.visitor_name] = entry.paths || [];
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
      alert("❗ Select camera and upload video before submitting.");
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [visitorId]: true }));
      setUnknownVisitors((prev) => ({ ...prev, [visitorId]: false }));

      const formData = new FormData();
      formData.append("visitor_id", visitorId);
      formData.append("video", uploadedFile);

      const res = await axios.post(
        "http://127.0.0.1:5000/unified-recognition/start",
        formData
      );
      const taskId = res.data.task_id;

      const pollStatus = async () => {
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await axios.get(
              `http://127.0.0.1:5000/unified-recognition/status/${taskId}`
            );
            const statusData = statusRes.data;

            if (statusData.status === 1) {
              clearInterval(pollInterval);

              const face = statusData.result?.recognized_faces?.[0];
              const matchedLocation = allCameras.find(
                (c) => c.id === selectedCamera
              )?.location;

              const routeInfo = visitorRoutes.find(
                (r) => r.visitor_id === visitorId
              );
              let validPaths = visitorPaths[routeInfo?.visitor_name] || [];

              setVisitorHistory((prev) => ({
                ...prev,
                [visitorId]: [...(prev[visitorId] || []), matchedLocation],
              }));

              const history = (visitorHistory[visitorId] || []).concat(
                matchedLocation
              );
              validPaths = validPaths.filter((pathObj) => {
                const path = pathObj.path || [];
                return history.every((loc, idx) => path[idx] === loc);
              });

              setVisitorPaths((prev) => ({
                ...prev,
                [routeInfo?.visitor_name]: validPaths,
              }));

              if (face) {
                setRecognitionResults((prev) => ({
                  ...prev,
                  [visitorId]: {
                    name: face.label,
                    confidence: face.confidence,
                    user_id: face.user_id,
                  },
                }));

                setCameraMatched((prev) => ({
                  ...prev,
                  [visitorId]: matchedLocation,
                }));

                if (validPaths.length === 0) {
                  setDeviatedVisitor({
                    id: visitorId,
                    name: routeInfo?.visitor_name,
                    location: matchedLocation,
                    history: history,
                  });
                  setShowDeviationDialog(true);
                }
              } else {
                setUnknownVisitors((prev) => ({ ...prev, [visitorId]: true }));
              }

              setUploading((prev) => ({ ...prev, [visitorId]: false }));
            }
          } catch (err) {
            console.error("Polling error:", err);
            clearInterval(pollInterval);
            setUploading((prev) => ({ ...prev, [visitorId]: false }));
          }
        }, 2000);
      };

      pollStatus();
    } catch (err) {
      alert("❌ Recognition failed.");
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
            const isUnknown = unknownVisitors[route.visitor_id];

            return (
              <Box
                key={idx}
                sx={{
                  border: "2px solid #ccc",
                  borderRadius: 4,
                  p: 3,
                  mb: 4,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  👤 {route.visitor_name}
                </Typography>
                <Typography>
                  🚩 {route.source_name} ➝ 🌟 {route.destination_name}
                </Typography>

                {allPaths.length === 0 && visitorHistory[route.visitor_id] ? (
                  <Typography color="error" mt={2}>
                    ❌ No valid paths remaining. Visitor may have deviated.
                  </Typography>
                ) : (
                  allPaths.map((entry, pathIndex) => (
                    <Box key={pathIndex} mt={2}>
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
                              (visitorHistory[route.visitor_id] || []).includes(
                                step
                              )
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
                      ✅ Match: {result.name} ({result.confidence})
                    </Typography>
                  </Box>
                )}

                {isUnknown && (
                  <Box mt={2}>
                    <Typography color="orange" fontWeight="bold">
                      ❓ Unknown Visitor Detected
                    </Typography>
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

      {/* 🚨 Deviation Dialog */}
      <Dialog
        open={showDeviationDialog}
        onClose={() => setShowDeviationDialog(false)}
      >
        <DialogTitle>
          <Typography variant="h6" color="error" fontWeight="bold">
            🚨 Visitor Deviated!
          </Typography>
        </DialogTitle>
        <DialogContent>
          {deviatedVisitor && (
            <>
              <Typography>
                <strong>Visitor:</strong> {deviatedVisitor.name}
              </Typography>
              <Typography>
                <strong>Current Location:</strong> {deviatedVisitor.location}
              </Typography>
              <Typography>
                <strong>Path History:</strong>{" "}
                {deviatedVisitor.history.join(" -> ")}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeviationDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* 📸 Access Image Dialog */}
      <Dialog
        open={accessDialogOpen}
        onClose={() => setAccessDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>📸 Access Image of {accessVisitorName}</DialogTitle>
        <DialogContent dividers>
          {accessImages.length === 0 ? (
            <Typography>No access image found for this visitor.</Typography>
          ) : (
            accessImages.map((img, idx) => (
              <Box key={idx} mb={2} textAlign="center">
                <img
                  src={img.access_img}
                  alt={`Access ${idx}`}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    maxHeight: 400,
                    objectFit: "contain",
                  }}
                />
                <Typography variant="caption" display="block" mt={1}>
                  {img.date_time}
                </Typography>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccessDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}

export default CheckRoute;
