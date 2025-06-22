import { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import CustomBox from "../../../components/CustomBox";
import AppLayout from "../../../layout/AppLayout.jsx";

function AccessLogs() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [logs, setLogs] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get_departments")
      .then((res) => {
        setDepartments(res.data.departments || []);
      })
      .catch(() =>
        setSnack({
          open: true,
          message: "Failed to load departments.",
          severity: "error",
        })
      );
  }, []);

  const handleFetchLogs = () => {
    if (!selectedDept || !startDate || !endDate) {
      return setSnack({
        open: true,
        message: "Please fill all fields before fetching logs.",
        severity: "warning",
      });
    }

    setLoading(true);

    axios
      .post("http://localhost:5000/fetch_employees_logs", {
        department_id: selectedDept.id,
        start_date: startDate,
        end_date: endDate,
      })
      .then((res) => {
        setLogs(res.data || []);
        setPopupOpen(true);
        setSnack({
          open: true,
          message: "Logs fetched successfully.",
          severity: "success",
        });
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to fetch logs.";
        setSnack({
          open: true,
          message: msg,
          severity: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleShowDetails = () => {
    if (!selectedDept || !startDate || !endDate) {
      return setSnack({
        open: true,
        message: "Please select department and date first.",
        severity: "warning",
      });
    }

    const fullStart = `${startDate}T00:00:00`;
    const fullEnd = `${endDate}T23:59:59`;

    axios
      .post("http://localhost:5000/fetch_employee_details", {
        id: selectedDept.id,
        start_date: fullStart,
        end_date: fullEnd,
      })
      .then((res) => {
        setDetailData(res.data);
        setDetailOpen(true);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to fetch department details.";
        setSnack({
          open: true,
          message: msg,
          severity: "error",
        });
      });
  };

  const handleFetchImages = () => {
    if (!selectedDept) {
      return setSnack({
        open: true,
        message: "Please select a department first.",
        severity: "warning",
      });
    }

    axios
      .post("http://localhost:5000/fetch_access_images", {
        id: selectedDept.id,
      })
      .then((res) => {
        setImages([res.data]); // Wrap single image object into array
        setImageOpen(true);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to fetch access images.";
        setSnack({
          open: true,
          message: msg,
          severity: "error",
        });
      });
  };

  return (
    <AppLayout>
      <CustomBox>
        <Typography variant="h6" gutterBottom>
          Select Department
        </Typography>

        <Box sx={{ maxWidth: 600, width: "100%" }}>
          <Autocomplete
            disablePortal
            fullWidth
            options={departments}
            value={selectedDept}
            onChange={(e, newValue) => setSelectedDept(newValue)}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Department" variant="outlined" />
            )}
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Start Date
        </Typography>
        <TextField
          fullWidth
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Typography variant="h6" sx={{ mt: 3 }}>
          End Date
        </Typography>
        <TextField
          fullWidth
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4 }}
          onClick={handleFetchLogs}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Fetch Logs"
          )}
        </Button>

        {/* Logs Popup */}
        <Dialog
          open={popupOpen}
          fullWidth
          maxWidth="sm"
          onClose={() => setPopupOpen(false)}
        >
          <DialogTitle>
            Logs Result
            <IconButton
              aria-label="close"
              onClick={() => setPopupOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {logs.length === 0 ? (
              <Typography>
                No logs found for selected department and date range.
              </Typography>
            ) : (
              <List>
                {logs.map((log) => (
                  <ListItem key={log.id} divider>
                    <ListItemText
                      primary={log.name}
                      secondary={`User ID: ${log.id}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleShowDetails}>Show Details</Button>
            <Button onClick={handleFetchImages}>Access Images</Button>
            <Button onClick={() => setPopupOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Detail Popup */}
        <Dialog
          open={detailOpen}
          fullWidth
          maxWidth="md"
          onClose={() => setDetailOpen(false)}
        >
          <DialogTitle>
            Department Details
            <IconButton
              aria-label="close"
              onClick={() => setDetailOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {detailData ? (
              <>
                <Typography variant="subtitle1">
                  <strong>Name:</strong> {detailData.name}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Role:</strong> {detailData.role}
                </Typography>
                {detailData.designation && (
                  <Typography variant="subtitle1">
                    <strong>Designation:</strong> {detailData.designation}
                  </Typography>
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Access Logs</Typography>
                {detailData.access_logs.length === 0 ? (
                  <Typography>No access logs found.</Typography>
                ) : (
                  <List>
                    {detailData.access_logs.map((log, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={`Time: ${log.date_time}`}
                          secondary={`Location: ${log.location}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            ) : (
              <Typography>No user details to show.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Access Image Popup */}
        <Dialog
          open={imageOpen}
          fullWidth
          maxWidth="md"
          onClose={() => setImageOpen(false)}
        >
          <DialogTitle>
            Access Image
            <IconButton
              aria-label="close"
              onClick={() => setImageOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {images.length === 0 ? (
              <Typography>No image found for selected department.</Typography>
            ) : (
              images.map((img, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <img
                    src={img.access_img}
                    alt={`Access at ${img.date_time}`}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Date & Time:</strong> {img.date_time}
                  </Typography>
                </Box>
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImageOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert
            onClose={() => setSnack({ ...snack, open: false })}
            severity={snack.severity}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </CustomBox>
    </AppLayout>
  );
}

export default AccessLogs;
