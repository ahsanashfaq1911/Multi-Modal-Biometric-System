import React, { useEffect, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import axios from "axios";

function VisitorLogsHistory() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/visitors")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setVisitors(res.data);
        } else {
          setVisitors([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching visitors:", err);
        setLoading(false);
      });
  }, []);

  const handleDetailsClick = async (id) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/visitors_details/${id}`
      );
      setSelectedVisitor(res.data);
      setOpenDialog(true);
    } catch (err) {
      console.error("Error fetching visitor details:", err);
    }
  };

  return (
    <AppLayout>
      <Box p={3}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Visitor Logs History
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : visitors.length === 0 ? (
          <Typography>No visitors found.</Typography>
        ) : (
          <Stack spacing={2}>
            {visitors.map((visitor, index) => (
              <Card key={index} sx={{ p: 2 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">{visitor.name}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleDetailsClick(visitor.id)}
                  >
                    Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Visitor Details Popup */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Visitor Details</DialogTitle>
        <DialogContent dividers>
          {selectedVisitor ? (
            <Box>
              <Avatar
                src={selectedVisitor.profile_img}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography>
                <strong>Name:</strong> {selectedVisitor.name}
              </Typography>
              <Typography>
                <strong>Contact:</strong> {selectedVisitor.contact}
              </Typography>
              <Typography>
                <strong>CNIC:</strong> {selectedVisitor.cnic || "N/A"}
              </Typography>
              <Typography>
                <strong>Date Assigned:</strong> {selectedVisitor.date_assigned}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}

export default VisitorLogsHistory;
