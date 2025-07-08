import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import AppLayout from "../../layout/AppLayout.jsx";
import CustomBox from "../../components/CustomBox";

function EmployeeDashboard() {
  const { state } = useLocation();
  const { message, user_id } = state || {};

  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [logs, setLogs] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleFetchLogs = async () => {
    if (!startDate || !endDate) {
      setSnackbar({
        open: true,
        message: "Both dates are required.",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/my_logs/${user_id}`,
        {
          start_date: startDate,
          end_date: endDate,
        }
      );

      setLogs(response.data);
      setSnackbar({
        open: true,
        message: "Logs fetched successfully.",
        severity: "success",
      });
      setOpenDialog(false);
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to fetch logs.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <AppLayout>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "20px", sm: "28px", md: "32px" },
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
        }}
      >
        {message}
      </Typography>

      <CustomBox>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={2}
          mt={2}
        >
          <Button
            variant="contained"
            sx={{
              aspectRatio: "1 / 1",
              fontSize: "1rem",
              borderRadius: 8,
              backgroundColor: "#2A9D8F",
              "&:hover": {
                backgroundColor: "#21867A",
              },
            }}
            fullWidth
            onClick={() => setOpenDialog(true)}
          >
            View Access Logs
          </Button>

          <Button
            variant="contained"
            sx={{
              aspectRatio: "1 / 1",
              fontSize: "1rem",
              borderRadius: 8,
              backgroundColor: "#2A9D8F",
              "&:hover": {
                backgroundColor: "#21867A",
              },
            }}
            fullWidth
          >
            Profile Management
          </Button>
        </Box>
      </CustomBox>

      {/* Access Logs Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Fetch Access Logs</DialogTitle>
        <DialogContent>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ mt: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleFetchLogs} variant="contained">
            Fetch Logs
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}

export default EmployeeDashboard;
