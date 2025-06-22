import AppLayout from "../../../layout/AppLayout.jsx";
import DepImg from "../../../assets/Images/Add Department.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import { apiRequest } from "../../../services/ApiService.jsx";

import CustomBox from "../../../components/CustomBox";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";

function AddDepartment() {
  const navigate = useNavigate();
  const [departmentName, setDepartmentName] = useState("");

  const handleSave = async () => {
    if (!departmentName.trim()) {
      alert("Please enter a department name");
      return;
    }

    const response = await apiRequest({
      url: "/add_department",
      method: "POST",
      data: { name: departmentName },
    });

    if (response?.department_id) {
      alert("✅ Department added successfully!");
      setDepartmentName("");
    } else {
      alert("❌ Failed to add department");
    }
  };

  return (
    <AppLayout>
      <CustomButton onClick={() => navigate(-1)} size="small">
        Go Back
      </CustomButton>
      <CustomBox title="Add Department">
        {/* Centered Image */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img src={DepImg} alt="Add Department" style={{ maxWidth: "100%" }} />
        </Box>

        {/* Department Input */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: 1,
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Enter Department Name
          </Typography>

          <CustomTextField
            placeholder="Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <CustomButton size="small" color="primary" onClick={handleSave}>
              Save
            </CustomButton>
          </Box>
        </Box>

        {/* Add Subsection Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            padding: { xs: "20%", lg: "5%" },
          }}
        >
          <CustomButton
            size="medium"
            onClick={() => navigate("/add-subsection")}
          >
            Add Subsection
          </CustomButton>
        </Box>
      </CustomBox>
    </AppLayout>
  );
}

export default AddDepartment;
