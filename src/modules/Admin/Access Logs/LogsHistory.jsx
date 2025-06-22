import { useLocation } from "react-router-dom";
import {
  Typography,
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AppLayout from "../../../layout/AppLayout";
import CustomBox from "../../../components/CustomBox";

function LogsHistory() {
  const location = useLocation();
  const logs = location.state?.logs || [];
  const startDate = location.state?.start_date;
  const endDate = location.state?.end_date;
  const departmentId = location.state?.department_id;

  return (
    <AppLayout>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "40px" },
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Logs History
      </Typography>

      <CustomBox>
        <Typography variant="subtitle1" gutterBottom>
          Department ID: {departmentId}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Date Range: {startDate} to {endDate}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {logs.length === 0 ? (
          <Typography>
            No logs found for the selected department and date range.
          </Typography>
        ) : (
          <List>
            {logs.map((user, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  mb: 2,
                  p: 2,
                  borderLeft: "6px solid #2196f3",
                  backgroundColor: "#f4f6f8",
                }}
              >
                <ListItem>
                  <ListItemText
                    primary={`Name: ${user.name}`}
                    secondary={`User ID: ${user.id}`}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </CustomBox>
    </AppLayout>
  );
}

export default LogsHistory;
