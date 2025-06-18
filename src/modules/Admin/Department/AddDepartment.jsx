import AppLayout from "../../../layout/AppLayout.jsx";
import { Box, Typography, Button, TextField } from "@mui/material";
import DepImg from "../../../assets/Images/Add Department.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../../../services/ApiService.jsx"; // use your custom fetch utility

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
      <Box sx={{ padding: { xs: "20px", sm: "30px", md: "40px" } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
          }}
        >
          Add Department
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={DepImg} alt="Add Department" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          gap: 1,
          width: "100%",
          maxWidth: "400px",
          margin: "auto",
          mt: 4,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Enter Department Name
        </Typography>
        <TextField
          label="Department Name"
          variant="outlined"
          fullWidth
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#469C9C" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: { xs: "20%", lg: "5%" },
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "#469C9C" }}
          onClick={() => navigate("/add-subsection")}
        >
          Add Subsection
        </Button>
      </Box>
    </AppLayout>
  );
}

export default AddDepartment;
