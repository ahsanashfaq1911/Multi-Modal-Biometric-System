import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
} from "@mui/material";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";

function EmployeeViolations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const [detailDialog, setDetailDialog] = useState({
    open: false,
    loading: false,
    data: null,
    error: "",
  });

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/get_emp_violations");
        setViolations(res.data.violations || []);
        setTotal(res.data.total_violations || 0);
      } catch (err) {
        console.error("Error fetching violations:", err);
        setError("Failed to load employee violations.");
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  const handleSeeDetails = async (v) => {
    setDetailDialog({ open: true, loading: true, data: null, error: "" });

    try {
      const res = await axios.get("http://localhost:5000/see_details_violation", {
        params: {
          user_id: v.user_id,
          camera_id: v.camera_id,
          violation_time: v.violation_time,
        },
      });
      setDetailDialog({
        open: true,
        loading: false,
        data: res.data,
        error: "",
      });
    } catch (err) {
      console.error("Error fetching details:", err);
      setDetailDialog({
        open: true,
        loading: false,
        data: null,
        error: "Failed to fetch violation details.",
      });
    }
  };

  return (
    <AppLayout>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#2A9D8F" }}
        >
          Employee Violations
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, color: "#555" }}>
          Total Violations: <strong>{total}</strong>
        </Typography>
      </Box>

      <Box sx={{ mt: 4, maxWidth: 800, mx: "auto" }}>
        {loading && (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        {violations.map((v, idx) => (
          <Paper
            key={idx}
            sx={{
              p: 2,
              mb: 2,
              borderLeft: "5px solid #E76F51",
              backgroundColor: "#F9F9F9",
            }}
            elevation={2}
          >
            <Typography variant="h6" sx={{ color: "#264653" }}>
              {v.name}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1">
              <strong>Camera ID:</strong> {v.camera_id}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Time:</strong>{" "}
              {new Date(v.violation_time).toLocaleString()}
            </Typography>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => handleSeeDetails(v)}
              >
                See Details
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* 🔍 Violation Details Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={() =>
          setDetailDialog({
            open: false,
            loading: false,
            data: null,
            error: "",
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Violation Details</DialogTitle>
        <DialogContent dividers>
          {detailDialog.loading && <CircularProgress />}
          {detailDialog.error && <Alert severity="error">{detailDialog.error}</Alert>}
          {detailDialog.data && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={detailDialog.data.profile_img_url}
                  sx={{ width: 70, height: 70 }}
                />
                <Box>
                  <Typography variant="h6">{detailDialog.data.name}</Typography>
                  <Typography variant="body2">{detailDialog.data.contact}</Typography>
                </Box>
              </Box>

              <Typography variant="body1">
                <strong>Department:</strong> {detailDialog.data.department || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Designation:</strong> {detailDialog.data.designation || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Violation Location:</strong>{" "}
                {detailDialog.data.violation_location || "N/A"}
              </Typography>

              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Allowed Areas:</strong>
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {detailDialog.data.allowed_areas.map((area, i) => (
                    <Chip key={i} label={area} color="success" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Access Time Image:</strong>
                </Typography>
                <img
                  src={detailDialog.data.access_time_image}
                  alt="Access Time"
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDetailDialog({
                open: false,
                loading: false,
                data: null,
                error: "",
              })
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}

export default EmployeeViolations;
