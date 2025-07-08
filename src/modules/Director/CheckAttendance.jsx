import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
} from "@mui/material";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";

function CheckAttendance() {
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async (type) => {
    setDialogTitle(`${type} Attendance`);
    setOpen(true);
    setLoading(true);
    setAttendanceData(null);

    let endpoint = "";
    let query = "";

    if (type === "Daily") {
      endpoint = "/check_daily_attendance";
    } else if (type === "Monthly") {
      endpoint = "/monthy/least/most/employees";
      query = "?year=2025&month=7"; // Change dynamically if needed
    } else if (type === "Yearly") {
      endpoint = "/yearly/least/most/employees";
      query = "?year=2025"; // Change dynamically if needed
    }

    try {
      const res = await axios.get(`http://localhost:5000${endpoint}${query}`);
      setAttendanceData(res.data);
    } catch (err) {
      setAttendanceData({ error: "Failed to fetch attendance data." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAttendanceData(null);
  };

  const renderDaily = () => (
    <>
      <Typography variant="body1" gutterBottom>
        <strong>Date:</strong> {attendanceData.date}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        ✅ Present: {attendanceData.TotalPresentToday} &nbsp;&nbsp;&nbsp; ❌
        Absent: {attendanceData.TotalAbsentToday}
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr" }} gap={2}>
        {attendanceData.records.map((record, idx) => (
          <Box
            key={idx}
            p={2}
            borderRadius={2}
            boxShadow={1}
            sx={{
              backgroundColor:
                record.PresentToday === "Yes" ? "#E8F5E9" : "#FFEBEE",
              borderLeft: `6px solid ${
                record.PresentToday === "Yes" ? "#2E7D32" : "#C62828"
              }`,
            }}
          >
            <Typography fontWeight="bold">{record.Name}</Typography>
            <Typography variant="body2">
              Role: {record.Role} — Dept: {record.Department}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color:
                  record.PresentToday === "Yes" ? "#2E7D32" : "#C62828",
              }}
            >
              Present Today: {record.PresentToday}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );

  const renderMonthlyOrYearly = () => (
    <>
      <Typography variant="body1" gutterBottom>
        <strong>
          Year: {attendanceData.year}{" "}
          {attendanceData.month && <>| Month: {attendanceData.month}</>}
        </strong>
      </Typography>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        ✅ Most Regular:
        {attendanceData.MostRegular.map((name, idx) => (
          <Chip
            key={idx}
            label={name}
            size="small"
            sx={{ mx: 0.5, backgroundColor: "#C8E6C9" }}
          />
        ))}
      </Typography>

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        ❌ Least Regular:
        {attendanceData.LeastRegular.map((name, idx) => (
          <Chip
            key={idx}
            label={name}
            size="small"
            sx={{ mx: 0.5, backgroundColor: "#FFCDD2" }}
          />
        ))}
      </Typography>

      <Box display="grid" gridTemplateColumns="1fr" gap={2}>
        {attendanceData.records.map((record, idx) => (
          <Box
            key={idx}
            p={2}
            borderRadius={2}
            boxShadow={1}
            sx={{ backgroundColor: "#F9F9F9", borderLeft: "6px solid #2A9D8F" }}
          >
            <Typography fontWeight="bold">{record.Name}</Typography>
            <Typography variant="body2">
              Role: {record.Role} — Dept: {record.Department}
            </Typography>
            <Typography variant="body2">
              Total Attendance: {record.TotalAttendanceMonthly || record.TotalAttendanceYearly}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );

  return (
    <AppLayout>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#2A9D8F", mb: 3 }}
        >
          Check Attendance
        </Typography>

        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="center"
          maxWidth={300}
          mx="auto"
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleOpen("Daily")}
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
          >
            Daily Attendance
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => handleOpen("Monthly")}
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
          >
            Monthly Attendance
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => handleOpen("Yearly")}
            sx={{
              backgroundColor: "#2A9D8F",
              "&:hover": { backgroundColor: "#21867A" },
            }}
          >
            Yearly Attendance
          </Button>
        </Box>
      </Box>

      {/* Dialog Popup */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : attendanceData?.error ? (
            <Typography color="error">{attendanceData.error}</Typography>
          ) : attendanceData?.date ? (
            renderDaily()
          ) : attendanceData?.records ? (
            renderMonthlyOrYearly()
          ) : (
            <Typography>No data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}

export default CheckAttendance;
