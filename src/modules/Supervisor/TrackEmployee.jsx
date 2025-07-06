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
} from "@mui/material";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";

function TrackEmployee() {
  const [employees, setEmployees] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setLoading(true);
        const email = localStorage.getItem("supervisorEmail");

        const [empRes, camRes] = await Promise.all([
          axios.get("http://localhost:5000/employees/overview", {
            params: { email },
          }),
          axios.get("http://localhost:5000/get_cameras"),
        ]);

        setEmployees(empRes.data.employees || empRes.data);
        setCameras(camRes.data);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
        setError("Error fetching employee or camera data.");
      } finally {
        setLoading(false);
      }
    };

    loadDropdownData();
  }, []);

  const handleSave = () => {
    if (!selectedEmployee || !selectedCamera) return;

    const exists = savedList.find(
      (item) =>
        item.employeeId === selectedEmployee && item.cameraId === selectedCamera
    );

    if (!exists) {
      setSavedList([
        ...savedList,
        {
          employeeId: selectedEmployee,
          employeeName:
            employees.find((e) => e.id === selectedEmployee)?.name || "Unknown",
          cameraId: selectedCamera,
          cameraLabel:
            cameras.find((c) => c.id === selectedCamera)?.location || "Unknown",
        },
      ]);
    }

    setSelectedEmployee("");
    setSelectedCamera("");
  };

  const handleTrack = () => {
    if (savedList.length === 0) {
      alert("Please save at least one combination.");
      return;
    }

    // Add your tracking logic here (API or navigation)
    console.log("Tracking these:", savedList);
    alert("Tracking started for saved employees and cameras.");
  };

  return (
    <AppLayout>
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Select Employee & Camera
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Employee Dropdown */}
        <TextField
          select
          fullWidth
          label="Select Employee"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          disabled={loading || employees.length === 0}
        >
          {employees.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Camera Dropdown */}
        <TextField
          select
          fullWidth
          label="Select Camera"
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          disabled={loading || cameras.length === 0}
        >
          {cameras.map((cam) => (
            <MenuItem key={cam.id} value={cam.id}>
              {cam.location} ({cam.camera_model})
            </MenuItem>
          ))}
        </TextField>

        {/* Save Button */}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSave}
          disabled={!selectedEmployee || !selectedCamera}
        >
          Save Selection
        </Button>

        {/* Show Saved Selections */}
        {savedList.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle1">Saved:</Typography>
            {savedList.map((item, idx) => (
              <Chip
                key={idx}
                label={`${item.employeeName} → ${item.cameraLabel}`}
              />
            ))}
          </Box>
        )}

        {/* Track Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTrack}
          disabled={savedList.length === 0}
        >
          Track
        </Button>
      </Box>
    </AppLayout>
  );
}

export default TrackEmployee;
