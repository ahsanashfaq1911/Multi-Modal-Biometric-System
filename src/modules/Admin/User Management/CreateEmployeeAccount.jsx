import React, { useRef, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../../layout/AppLayout";
import CustomBox from "../../../components/CustomBox";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";
import axios from "axios";

function CreateEmployeeAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [images, setImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fileInputRef = useRef();

  // 🔁 Fetch departments
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get_departments")
      .then((res) => {
        if (res.data && Array.isArray(res.data.departments)) {
          setDepartments(res.data.departments);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch departments", err);
      });
  }, []);

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || !department || images.length < 6) {
      setSnackbarMsg("Please fill all fields and select at least 6 images.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("department_id", department);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/add_employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSnackbarMsg(res.data.message || "Employee account created!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setName("");
      setEmail("");
      setPassword("");
      setDepartment("");
      setImages([]);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to create employee account.";
      setSnackbarMsg(msg);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <AppLayout>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "40px" },
          fontWeight: "bold",
          mb: 2,
          ml: 3,
        }}
      >
        Create Employee Account
      </Typography>

      <CustomBox sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
        {/* Image Picker */}
        <Box
          onClick={() => fileInputRef.current.click()}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 3,
            mb: 3,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f9f9f9" },
          }}
        >
          {images.length === 0 ? (
            <Typography>Click here to upload at least 6 face images</Typography>
          ) : (
            <Grid container spacing={1} justifyContent="center">
              {images.slice(0, 6).map((img, idx) => (
                <Grid item key={idx}>
                  <Avatar
                    src={URL.createObjectURL(img)}
                    alt={`face-${idx}`}
                    sx={{ width: 56, height: 56 }}
                  />
                </Grid>
              ))}
              {images.length > 6 && (
                <Typography variant="caption" mt={1} width="100%">
                  +{images.length - 6} more
                </Typography>
              )}
            </Grid>
          )}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            hidden
            onChange={handleImagePick}
          />
        </Box>

        {/* Text Fields */}
        <CustomTextField
          label="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          fullWidth
          sx={{ mb: 2 }}
        />
        <CustomTextField
          label="Assign Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          fullWidth
          sx={{ mb: 2 }}
        />
        <CustomTextField
          label="Set Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Department Dropdown */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Department</InputLabel>
          <Select
            value={department}
            label="Select Department"
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Box textAlign="right">
          <CustomButton onClick={handleSubmit}>Create Account</CustomButton>
        </Box>

        {/* Snackbar Alert */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            variant="filled"
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </CustomBox>
    </AppLayout>
  );
}

export default CreateEmployeeAccount;
