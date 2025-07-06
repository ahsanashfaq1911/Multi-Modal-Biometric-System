import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Paper, Button } from "@mui/material";
import AppLayout from "../../layout/AppLayout";
import CustomBox from "../../components/CustomBox";

function SupervisorDashboard() {
  const { state } = useLocation();
  const { message, role, profile_img } = state || {};
  const navigate = useNavigate();

  return (
    <AppLayout>
      <CustomBox>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Supervisor Dashboard
        </Typography>

        <Paper elevation={3} sx={{ p: 3, textAlign: "center", mb: 4 }}>
          {profile_img && (
            <Avatar
              src={profile_img}
              alt="Profile"
              sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
            />
          )}
          <Typography variant="h6">{message}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Role: {role}
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/employees-overview")}
            >
              Employees Overview
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/access-control")}
            >
              Access Control System
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/track-employee")}
            >
              Track Employee
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/access-logs")}
            >
              Access Logs History
            </Button>
          </Box>
        </Paper>
      </CustomBox>
    </AppLayout>
  );
}

export default SupervisorDashboard;
