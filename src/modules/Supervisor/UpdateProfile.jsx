import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";

const UpdateProfile = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [cnic, setCnic] = useState("");

  const email = localStorage.getItem("supervisorEmail"); // Saved after login

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("❌ Email not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    if (name) formData.append("name", name);
    if (contact) formData.append("phone_number", contact);
    if (cnic) formData.append("cnic", cnic);
    if (profileImg) formData.append("profile_img", profileImg);

    try {
      const res = await fetch("http://127.0.0.1:5000/supervisor/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("❌ Failed to update profile.");
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ maxWidth: 500, mx: "auto", p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Update Supervisor Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Avatar
                src={preview}
                alt="Preview"
                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
              />
              <Button variant="contained" component="label">
                Upload Profile Picture
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Enter Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Enter Contact Number"
                fullWidth
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Enter CNIC"
                fullWidth
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button variant="contained" type="submit">
                Save Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdateProfile;
