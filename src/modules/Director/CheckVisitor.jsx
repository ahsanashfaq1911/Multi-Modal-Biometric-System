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
} from "@mui/material";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";

function CheckVisitor() {
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [visitorData, setVisitorData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async (type) => {
    setDialogTitle(`${type} Visitors`);
    setOpen(true);
    setLoading(true);
    setVisitorData(null);

    let endpoint = "";
    if (type === "Daily") endpoint = "/check_daily_visitors";
    else if (type === "Monthly") endpoint = "/check_monthly_visitors";
    else if (type === "Yearly") endpoint = "/check_yearly_visitors";

    try {
      const res = await axios.get(`http://localhost:5000${endpoint}`);
      setVisitorData(res.data);
    } catch (error) {
      setVisitorData({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setVisitorData(null);
  };

  return (
    <AppLayout>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#2A9D8F", mb: 3 }}
        >
          Check Visitors
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
            Daily Visitors
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
            Monthly Visitors
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
            Yearly Visitors
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
  ) : visitorData?.error ? (
    <Typography color="error">{visitorData.error}</Typography>
  ) : visitorData ? (
    <>
      <Typography variant="h6" gutterBottom>
        Total Visitors:{" "}
        {visitorData.total_visitors_daily ||
          visitorData.total_visitors_monthly ||
          visitorData.total_visitors_yearly ||
          0}
      </Typography>

      {(visitorData.month || visitorData.year) && (
        <Typography variant="body2" sx={{ mb: 2, color: "gray" }}>
          {visitorData.month ? `Month: ${visitorData.month}, ` : ""}
          {visitorData.year ? `Year: ${visitorData.year}` : ""}
        </Typography>
      )}

      {visitorData.visitors?.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={2}
        >
          {visitorData.visitors.map((v) => (
            <Box
              key={v.id}
              p={2}
              borderRadius={2}
              boxShadow={2}
              sx={{
                backgroundColor: "#f9f9f9",
                borderLeft: "5px solid #2A9D8F",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {v.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {v.id}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No visitors found.</Typography>
      )}
    </>
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

export default CheckVisitor;
