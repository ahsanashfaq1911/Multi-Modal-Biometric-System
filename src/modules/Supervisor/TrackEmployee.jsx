import { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";

function TrackEmployee() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [allowedCameras, setAllowedCameras] = useState([]);
  const [allowedSections, setAllowedSections] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCameras, setAllCameras] = useState([]);
  const [deviationPopup, setDeviationPopup] = useState({
    open: false,
    message: "",
  });

  // Access Images Dialog State
  const [imageDialog, setImageDialog] = useState({
    open: false,
    employeeId: null,
    startDate: "",
    endDate: "",
    logs: [],
    selectedLogId: null,
    images: [],
    loading: false,
    error: "",
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const email = localStorage.getItem("supervisorEmail");
        const res = await axios.get(
          "http://localhost:5000/employees/overview",
          {
            params: { email },
          }
        );
        setEmployees(res.data.employees || res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Error fetching employee data.");
      } finally {
        setLoading(false);
      }
    };

    const loadCameras = async () => {
      try {
        const res = await axios.get("http://localhost:5000/get_cameras");
        setAllCameras(res.data || []);
      } catch (err) {
        console.error("Failed to fetch cameras:", err);
      }
    };

    loadEmployees();
    loadCameras();
  }, []);

  const handleEmployeeChange = async (id) => {
    setSelectedEmployee(id);
    setSelectedCamera("");
    setAllowedCameras([]);
    setAllowedSections([]);

    try {
      const res = await axios.get("http://localhost:5000/employee/access", {
        params: { employee_id: id },
      });

      const cameras = res.data.allowed_sections.map((s) => ({
        id: s.camera_id,
        model: s.camera_model,
        section_name: s.section_name,
      }));
      setAllowedCameras(cameras);

      setAllowedSections(res.data.allowed_sections.map((s) => s.section_name));
    } catch (err) {
      console.error("Failed to fetch allowed sections:", err);
      setError("Error loading allowed subsections and cameras.");
    }
  };

  const handleSave = () => {
    if (!selectedEmployee || !selectedCamera) return;

    const exists = savedList.find(
      (item) =>
        item.employeeId === selectedEmployee && item.cameraId === selectedCamera
    );

    if (!exists) {
      const emp = employees.find((e) => e.id === selectedEmployee);
      const cam = allowedCameras.find((c) => c.id === selectedCamera);
      setSavedList([
        ...savedList,
        {
          employeeId: selectedEmployee,
          employeeName: emp?.name || "Unknown",
          cameraId: selectedCamera,
          cameraLabel: cam?.model || "Unknown",
          sections: allowedSections,
          tracking: {
            status: null,
            result: null,
            deviation: false,
            processing: false,
            videoFile: null,
            taskId: null,
          },
        },
      ]);
    }
  };

  const handleTrack = (index) => {
    const updated = [...savedList];
    updated[index].tracking.status = "dialog_open";
    setSavedList(updated);
  };

  const handleDialogClose = (index) => {
    const updated = [...savedList];
    updated[index].tracking = {
      status: null,
      result: null,
      deviation: false,
      processing: false,
      videoFile: null,
      taskId: null,
    };
    setSavedList(updated);
  };

  const handleVideoSelect = (index, file) => {
    const updated = [...savedList];
    updated[index].tracking.videoFile = file;
    setSavedList(updated);
  };

  const handleUpload = async (index) => {
    const updated = [...savedList];
    const track = updated[index].tracking;
    if (!track.videoFile) return;

    track.processing = true;
    setSavedList([...updated]);

    const formData = new FormData();
    formData.append("user_id", updated[index].employeeId);
    formData.append("camera_id", updated[index].cameraId);
    formData.append("video", track.videoFile);

    try {
      const uploadRes = await axios.post(
        "http://localhost:5000/route_user_video",
        formData
      );
      const taskId = uploadRes.data.task_id;
      updated[index].tracking.taskId = taskId;
      setSavedList([...updated]);

      const interval = setInterval(async () => {
        const statusRes = await axios.get(
          `http://localhost:5000/route_user_video/status/${taskId}`
        );
        if (statusRes.data.status === 1) {
          clearInterval(interval);
          updated[index].tracking.processing = false;

          const result = statusRes.data.result;

          const selectedCamId = String(updated[index].cameraId);
          const allowedCamIds = allowedCameras.map((cam) => String(cam.id));
          const isDeviation = !allowedCamIds.includes(selectedCamId);

          if (isDeviation) {
            const appearedCamera = allCameras.find(
              (cam) => String(cam.id) === selectedCamId
            );
            setDeviationPopup({
              open: true,
              message: `🚨 Deviation Detected!\n\nEmployee "${
                updated[index].employeeName
              }" appeared on camera "${
                appearedCamera?.model || "Unknown"
              }" (ID: ${selectedCamId}), which is NOT in their allowed sections.`,
            });
          }

          updated[index].tracking.result = `✅ Name: ${
            result?.name || "Unknown"
          }, Gender: ${result?.gender || "Unknown"}, Confidence: ${(
            (result?.confidence || 0) * 100
          ).toFixed(2)}%, Camera: ${result?.camera_model || "Unknown"}`;
          updated[index].tracking.deviation = isDeviation;
          updated[index].tracking.status = null;
          setSavedList([...updated]);
        }
      }, 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      updated[index].tracking.processing = false;
      updated[index].tracking.result = "❌ Failed to process.";
      updated[index].tracking.deviation = false;
      setSavedList([...updated]);
    }
  };

  // Access Images Button: Open dialog, no API call yet
  const handleAccessImages = (employeeId) => {
    setImageDialog({
      open: true,
      employeeId,
      startDate: "",
      endDate: "",
      logs: [],
      selectedLogId: null,
      images: [],
      loading: false,
      error: "",
    });
  };

  // Fetch Details: Call fetch_employee_details API
  const handleFetchDetails = async () => {
    if (
      !imageDialog.employeeId ||
      !imageDialog.startDate ||
      !imageDialog.endDate
    ) {
      setImageDialog((prev) => ({
        ...prev,
        error: "Please select start and end date.",
      }));
      return;
    }
    setImageDialog((prev) => ({
      ...prev,
      loading: true,
      error: "",
      logs: [],
      selectedLogId: null,
      images: [],
    }));

    // No need to format, just use "YYYY-MM-DD" as is
    try {
      const res = await axios.post(
        "http://localhost:5000/fetch_employee_details",
        {
          id: imageDialog.employeeId,
          start_date: imageDialog.startDate,
          end_date: imageDialog.endDate,
        }
      );
      if (res.data.access_logs && res.data.access_logs.length > 0) {
        setImageDialog((prev) => ({
          ...prev,
          logs: res.data.access_logs,
          loading: false,
          error: "",
        }));
      } else {
        setImageDialog((prev) => ({
          ...prev,
          logs: [],
          loading: false,
          error: "No access logs found for this employee in selected range.",
        }));
      }
    } catch (err) {
      setImageDialog((prev) => ({
        ...prev,
        logs: [],
        loading: false,
        error: "Failed to fetch details.",
      }));
    }
  };

  // Fetch Images by log id
  const handleFetchImages = async (logId) => {
    setImageDialog((prev) => ({
      ...prev,
      loading: true,
      error: "",
      images: [],
      selectedLogId: logId,
    }));
    try {
      const res = await axios.post(
        "http://localhost:5000/fetch_access_images",
        {
          id: logId,
        }
      );
      // The API returns image_url in access_img
      setImageDialog((prev) => ({
        ...prev,
        images: [res.data.access_img],
        loading: false,
        error: "",
      }));
    } catch (err) {
      setImageDialog((prev) => ({
        ...prev,
        images: [],
        loading: false,
        error: "Failed to load access images.",
      }));
    }
  };

  return (
    <AppLayout>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h5" textAlign="center">
          Track Employee
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          select
          fullWidth
          label="Select Employee"
          value={selectedEmployee}
          onChange={(e) => handleEmployeeChange(e.target.value)}
        >
          {employees.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Select Camera"
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          disabled={allowedCameras.length === 0}
        >
          {allowedCameras.map((cam) => (
            <MenuItem key={cam.id} value={cam.id}>
              {cam.model} ({cam.section_name})
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleSave}
          disabled={!selectedEmployee || !selectedCamera}
        >
          Save Selection
        </Button>

        {savedList.map((item, idx) => (
          <Box
            key={idx}
            sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}
          >
            <Typography>
              <b>{item.employeeName}</b> → {item.cameraLabel}
            </Typography>
            <Typography variant="subtitle2" mt={1}>
              Allowed Subsections:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {item.sections.map((sec, i) => (
                <Chip key={i} label={sec} color="success" variant="outlined" />
              ))}
            </Box>

            <Box mt={2} display="flex" gap={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleTrack(idx)}
              >
                Start Tracking
              </Button>
              <Button
                variant="outlined"
                color="info"
                onClick={() => handleAccessImages(item.employeeId)}
              >
                Access Images
              </Button>
            </Box>

            {item.tracking.status === "dialog_open" && (
              <Box
                mt={2}
                sx={{ p: 2, border: "1px dashed #aaa", borderRadius: 2 }}
              >
                <Typography variant="h6">Upload Video</Typography>

                <Typography variant="subtitle1" mt={2}>
                  Select Camera for Tracking
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={item.cameraId}
                  onChange={(e) => {
                    const updated = [...savedList];
                    updated[idx].cameraId = e.target.value;
                    setSavedList(updated);
                  }}
                >
                  {allCameras.map((cam) => (
                    <MenuItem key={cam.id} value={cam.id}>
                      {cam.model} ({cam.location || "Unknown"})
                    </MenuItem>
                  ))}
                </TextField>

                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                  Select Video
                  <input
                    hidden
                    accept="video/*"
                    type="file"
                    onChange={(e) => handleVideoSelect(idx, e.target.files[0])}
                  />
                </Button>

                {item.tracking.videoFile && (
                  <Typography variant="body2" mt={1}>
                    Selected: {item.tracking.videoFile.name}
                  </Typography>
                )}

                {item.tracking.processing && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Processing video...
                  </Alert>
                )}
                {item.tracking.result && (
                  <Alert
                    severity={item.tracking.deviation ? "error" : "success"}
                    sx={{ mt: 2 }}
                  >
                    {item.tracking.result}
                  </Alert>
                )}

                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button onClick={() => handleDialogClose(idx)}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={() => handleUpload(idx)}
                    disabled={
                      !item.tracking.videoFile || item.tracking.processing
                    }
                  >
                    Upload
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Deviation Popup */}
      <Dialog
        open={deviationPopup.open}
        onClose={() => setDeviationPopup({ open: false, message: "" })}
      >
        <DialogTitle>Deviation Alert</DialogTitle>
        <DialogContent>
          <Typography>{deviationPopup.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeviationPopup({ open: false, message: "" })}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Access Images Dialog */}
      <Dialog
        open={imageDialog.open}
        onClose={() =>
          setImageDialog({
            open: false,
            employeeId: null,
            startDate: "",
            endDate: "",
            logs: [],
            selectedLogId: null,
            images: [],
            loading: false,
            error: "",
          })
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Access Images</DialogTitle>
        <DialogContent dividers>
          {/* Date Pickers */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={imageDialog.startDate}
              onChange={(e) =>
                setImageDialog((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={imageDialog.endDate}
              onChange={(e) =>
                setImageDialog((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleFetchDetails}
              disabled={imageDialog.loading}
              sx={{ minWidth: 150 }}
            >
              Fetch Details
            </Button>
          </Box>
          {/* Show logs if available */}
          {imageDialog.logs.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle1" mb={1}>
                Select Log to View Image:
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {imageDialog.logs.map((log) => (
                  <Button
                    key={log.log_id}
                    variant={
                      imageDialog.selectedLogId === log.log_id
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleFetchImages(log.log_id)}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {log.date_time} - {log.location}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Show images if available */}
          <Box
            mt={2}
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
          >
            {imageDialog.images.map((imgUrl, i) => (
              <img
                key={i}
                src={imgUrl}
                alt={`access-img-${i}`}
                style={{ width: "200px", height: "auto", borderRadius: "8px" }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setImageDialog({
                open: false,
                employeeId: null,
                startDate: "",
                endDate: "",
                logs: [],
                selectedLogId: null,
                images: [],
                loading: false,
                error: "",
              })
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}

export default TrackEmployee;
