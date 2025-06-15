import AppLayout from "../../layout/AppLayout";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
function AdminDashboard() {
    const navigate= useNavigate();
  return (
    <>
      <AppLayout>
        {/* Page Title */}
        <Box
          sx={{
            padding: { xs: "20px", sm: "30px", md: "40px" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "24px", sm: "32px", md: "40px" },
              fontWeight: "bold",
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        {/* Profile Image */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <img
            src="https://www.pfpgeeks.com/static/images/cartoon-pfp/webp/cartoon-pfp-5.webp"
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #469C9C",
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 1, sm: 2 },
          }}
        >
          {/* Button to add a new department */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
            onClick={() => navigate("/add-department")} // Navigate to Add Department page
          >
            Add Department
          </Button>

          {/* Button To manage supervisors */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
          >
            Manage Supervisors
          </Button>

          {/* Button to manage users - add, update, remove, assign roles, etc. */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
          >
            User Management
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

          {/* Button to manage camera configurations or add/remove cameras */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
          >
            Manage Cameras
          </Button>

          {/* Button to view visitor logs and visit history */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": { backgroundColor: "#357F7F" },
              maxWidth: "250px",
              width: "100%",
            }}
          >
            Visitors Logs History
          </Button>
        </Box>
      </AppLayout>
    </>
  );
}

export default AdminDashboard;
