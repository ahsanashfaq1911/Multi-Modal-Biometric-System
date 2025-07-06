import { useState, useEffect } from "react";
import AppLayout from "../../../layout/AppLayout.jsx";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  MenuItem,
} from "@mui/material";
import DepImg from "../../../assets/Images/Add Department.png";
import { apiRequest } from "../../../services/ApiService.jsx";

import CustomBox from "../../../components/CustomBox";
import CustomButton from "../../../components/CustomButton";

function AddSubsection() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [subsectionName, setSubsectionName] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiRequest({
          url: "/get_departments",
          method: "GET",
        });

        if (res && Array.isArray(res.departments)) {
          const formatted = res.departments.map((dept) => ({
            id: dept.id,
            label: dept.name,
          }));
          setDepartments(formatted);
        } else {
          console.error("Invalid department data", res);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);
  // Fetch cameras
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await apiRequest({
          url: "/get_cameras",
          method: "GET",
        });

        setCameras(res || []);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);

  // Save subsection
  const handleSave = async () => {
    if (!selectedDepartment || !subsectionName.trim() || !selectedCamera) {
      alert("Please fill all fields: department, subsection name, and camera.");
      return;
    }

    try {
      const res = await apiRequest({
        url: "/add_department_section",
        method: "POST",
        data: {
          department_id: selectedDepartment.id,
          name: subsectionName,
          camera_id: selectedCamera,
        },
      });

      if (res?.message === "Subsection added successfully") {
        alert("✅ Subsection added successfully!");
        setSelectedDepartment(null);
        setSubsectionName("");
        setSelectedCamera("");
      } else {
        alert("❌ Failed to add subsection");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <AppLayout>
      <CustomBox title="Add Subsection">
        {/* Image */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={DepImg}
            alt="Department"
            style={{ maxWidth: "100%", borderRadius: "12px" }}
          />
        </Box>

        {/* Department Dropdown */}
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Select Department
          </Typography>

          <Autocomplete
            disablePortal
            options={departments}
            value={selectedDepartment}
            onChange={(event, newValue) => setSelectedDepartment(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Department" variant="outlined" />
            )}
          />
        </Box>

        {/* Subsection Name Field */}
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mt: 2, mb: 1 }}
          >
            Subsection Name
          </Typography>
          <TextField
            label="Subsection Name"
            variant="outlined"
            fullWidth
            value={subsectionName}
            onChange={(e) => setSubsectionName(e.target.value)}
          />
        </Box>

        {/* Camera Dropdown */}
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mt: 2, mb: 1 }}
          >
            Select Camera
          </Typography>
          <TextField
            select
            fullWidth
            label="Camera"
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            {cameras.map((cam) => (
              <MenuItem key={cam.id} value={cam.id}>
                {cam.location} ({cam.camera_model})
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Save Button */}
        <Box sx={{ width: "100%", maxWidth: 400, mt: 3 }}>
          <CustomButton onClick={handleSave}>Save</CustomButton>
        </Box>
      </CustomBox>
    </AppLayout>
  );
}

export default AddSubsection;
