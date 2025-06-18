import { useState, useEffect } from "react";
import AppLayout from "../../../layout/AppLayout.jsx";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import DepImg from "../../../assets/Images/Add Department.png";
import { apiRequest } from "../../../services/ApiService.jsx";

function AddSubsection() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [subsectionName, setSubsectionName] = useState("");

  // ✅ Fetch departments on mount
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

  // ✅ Handle Save Subsection
  const handleSave = async () => {
    if (!selectedDepartment || !subsectionName.trim()) {
      alert("Please select a department and enter a subsection name");
      return;
    }

    try {
      const res = await apiRequest({
        url: "/add_department_section", // ✅ Make sure this is correct
        method: "POST",
        data: {
          department_id: selectedDepartment.id,
          name: subsectionName,
        },
      });

      if (res?.message === "Subsection added successfully") {
        alert("✅ Subsection added successfully!");
        setSelectedDepartment(null);
        setSubsectionName("");
      } else {
        alert("❌ Failed to add subsection");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <AppLayout>
      <Box sx={{ padding: { xs: "20px", sm: "30px", md: "40px" } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
          }}
        >
          Add Subsection
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={DepImg} alt="Department" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "14px", sm: "18px", md: "22px" },
            fontWeight: "bold",
          }}
        >
          Select Department
        </Typography>

        <Autocomplete
          disablePortal
          options={departments}
          value={selectedDepartment}
          onChange={(event, newValue) => setSelectedDepartment(newValue)}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Department" variant="outlined" />
          )}
        />

        <TextField
          label="Subsection Name"
          variant="outlined"
          fullWidth
          value={subsectionName}
          onChange={(e) => setSubsectionName(e.target.value)}
          sx={{ width: 300 }}
        />

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            borderRadius: "12px",
            paddingX: 4,
            paddingY: 1,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Save
        </Button>
      </Box>
    </AppLayout>
  );
}

export default AddSubsection;
