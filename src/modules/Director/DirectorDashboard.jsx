import { useNavigate } from "react-router-dom";
import { Box, Button, Avatar, Typography } from "@mui/material";
import { useState, useRef } from "react";
import AppLayout from "../../layout/AppLayout";

function DirectorDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const defaultImg = "https://via.placeholder.com/150";
  const [profileImg, setProfileImg] = useState(defaultImg);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImg(imageURL);
    }
  };

  const handleRemoveImage = () => {
    setProfileImg(defaultImg);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset file input
    }
  };

  return (
    <AppLayout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        {/* Profile Picture */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <label onClick={() => fileInputRef.current.click()} style={{ cursor: "pointer" }}>
          <Avatar
            src={profileImg}
            alt="Director"
            sx={{
              width: 120,
              height: 120,
              mb: 1,
              border: "3px solid #2A9D8F",
              transition: "0.3s",
              "&:hover": { opacity: 0.8 },
            }}
          />
        </label>

        <Button
          variant="text"
          size="small"
          color="error"
          onClick={handleRemoveImage}
        >
          Remove Image
        </Button>

        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          mt={1}
          textAlign="center"
        >
          Director Dashboard
        </Typography>

        {/* VStack Buttons */}
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          width="100%"
          maxWidth={300}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
            fullWidth
            onClick={() => handleNavigate("/check-attendance")}
          >
            Check Attendance
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
            fullWidth
            onClick={() => handleNavigate("/check-visitors")}
          >
            Check Visitors
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
            fullWidth
            onClick={() => handleNavigate("/block-path")}
          >
            Block Path
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
            fullWidth
            onClick={() => handleNavigate("/employees-violations")}
          >
            Employees Violations
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
}

export default DirectorDashboard;
