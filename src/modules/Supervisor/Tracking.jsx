import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  LinearProgress,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";

function Tracking() {
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const userId = "11"; // dummy/test user

  // Get cameras on load
  useEffect(() => {
    axios
      .get("http://localhost:5000/get_cameras")
      .then((res) => {
        setCameraList(res.data);
      })
      .catch(() => {
        setError("Failed to load camera list.");
      });
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleStartTracking = async () => {
    if (!selectedCamera || !videoFile) {
      setError("Please select a camera and upload a video.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("camera_id", selectedCamera);
    formData.append("video", videoFile);

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        "http://localhost:5000/route_user_video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTaskId(res.data.task_id);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/route_user_video/status/${taskId}`
        );
        const taskStatus = res.data.status;
        const taskMessage = res.data.message || "";
        setStatus(taskStatus);
        setMessage(taskMessage);

        if (taskStatus === 1 || taskStatus === -1) {
          clearInterval(interval);
          setLoading(false);
        }
      } catch (err) {
        clearInterval(interval);
        setError("Failed to fetch tracking status.");
        setLoading(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId]);

  const renderStatus = () => {
    if (status === null) {
      return null;
    }

    if (status === 0) {
      return (
        <>
          <Typography variant="body1">🔄 Tracking in progress...</Typography>
          {message && (
            <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
              ⏳ {message}
            </Typography>
          )}
          <LinearProgress sx={{ mt: 2, width: "100%" }} />
        </>
      );
    }

    if (status === 1) {
      return <Alert severity="success">✅ Tracking completed!</Alert>;
    }

    if (status === -1) {
      return (
        <Alert severity="error">
          ❌ Tracking failed!
          {message && <div>{message}</div>}
        </Alert>
      );
    }

    if (status === -2) {
      return <Alert severity="warning">⚠️ Task ID not found!</Alert>;
    }

    return <Typography>Unknown status: {status}</Typography>;
  };

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
          gap: 3,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Track User Video
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!taskId && (
          <>
            {/* Camera Dropdown */}
            <TextField
              select
              fullWidth
              label="Select Camera"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              {cameraList.map((camera) => (
                <MenuItem key={camera.id} value={camera.id}>
                  {camera.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Upload Video */}
            <Button variant="outlined" component="label" fullWidth>
              {videoFile ? videoFile.name : "Upload Video"}
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleUpload}
              />
            </Button>

            {/* Start Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleStartTracking}
              disabled={loading}
            >
              Start Tracking
            </Button>
          </>
        )}

        {/* Loading & Progress */}
        {loading && (
          <>
            <CircularProgress />
            <Typography>Uploading and initiating tracking...</Typography>
          </>
        )}

        {/* Task Progress */}
        {!loading && taskId && renderStatus()}

        {/* Reset */}
        {status === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Track Another
          </Button>
        )}
      </Box>
    </AppLayout>
  );
}

export default Tracking;
