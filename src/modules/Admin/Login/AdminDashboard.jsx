import AppLayout from "../../../layout/AppLayout.jsx";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomBox from "../../../components/CustomBox";
import CustomButton from "../../../components/CustomButton";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <CustomBox>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
          }}
        >
          Admin Dashboard
        </Typography>

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
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <CustomButton onClick={() => navigate("/add-department")}>
            Add Department
          </CustomButton>

          <CustomButton>Manage Supervisors</CustomButton>

          <CustomButton>User Management</CustomButton>

          <CustomButton>Access Logs History</CustomButton>

          <CustomButton onClick={() => navigate("/manage-cameras")}>
            Manage Cameras
          </CustomButton>

          <CustomButton>Visitors Logs History</CustomButton>
        </Box>
      </CustomBox>
    </AppLayout>
  );
}

export default AdminDashboard;
