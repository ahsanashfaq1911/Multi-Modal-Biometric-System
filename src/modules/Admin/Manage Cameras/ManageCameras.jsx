import AppLayout from "../../../layout/AppLayout";
import { Box, Typography, Button } from "@mui/material";
import cameraImg from "../../../assets/Images/AddCamera.jpg";
import { useNavigate } from "react-router-dom";
function ManageCameras() {
    const navigate = useNavigate();
  return (
    <>
      <AppLayout>
        {/* Title Section */}
        <Box sx={{ padding: { xs: "20px", sm: "30px", md: "40px" } }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "24px", sm: "32px", md: "40px" },
              fontWeight: "bold",
            }}
          >
            Manage Cameras
          </Typography>
        </Box>
        {/* Image Section */}

        <Box sx={{ display: "flex", justifyContent: "center", padding: "5%" }}>
          <img src={cameraImg} alt="Department" />
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "5%",
            gap: 2,
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 1, sm: 2 },
          }}
        >
          {/* Button to add a new location */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
            onClick={() => navigate("/add-location")} // Navigate to Add Department page
          >
            Add Location
          </Button>

          {/* Button To add new Camera */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}

            onClick={() => navigate("/add-camera")}
          >
            Add Camera
          </Button>

          {/* Button to set Connections */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
          >
            Set Connections
          </Button>

          {/* Button to view access log history of employees, supervisors, etc. */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
          >
            Access Logs History
          </Button>

          {/* Button to View Connections */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
            onClick={() => navigate("/view-connections")}
          >
            View Connections
          </Button>

          {/* Button to Create path */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
          >
            Create Path
          </Button>
        </Box>
      </AppLayout>
    </>
  );
}

export default ManageCameras;
