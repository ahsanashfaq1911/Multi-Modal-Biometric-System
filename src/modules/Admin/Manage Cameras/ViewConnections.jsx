import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableFooter,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../services/ApiService";
import axios from "axios";

function ViewConnections() {
  const [matrix, setMatrix] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [camera1, setCamera1] = useState("");
  const [camera2, setCamera2] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  useEffect(() => {
    async function fetchMatrix() {
      try {
        setLoading(true);
        setError(null);

        const response = await apiRequest({ url: "/get_connections" });
        const adjMatrix = response.adjacency_matrix;

        const labels = Object.keys(adjMatrix);
        const size = labels.length;
        const data = Array.from({ length: size }, () => Array(size).fill("∞"));

        labels.forEach((label, i) => {
          data[i][i] = 0;
          const connections = adjMatrix[label];
          for (const [target, delay] of Object.entries(connections)) {
            const j = labels.indexOf(target);
            if (j !== -1) {
              data[i][j] = delay;
            }
          }
        });

        setMatrix({ labels, data });
      } catch (err) {
        setError("Failed to load matrix: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCameras() {
      try {
        const res = await axios.get("http://localhost:5000/get_cameras");
        setCameras(res.data || []);
      } catch (err) {
        console.error("Failed to fetch cameras:", err.message);
      }
    }

    fetchMatrix();
    fetchCameras();
  }, []);

  const handleCellChange = (e, row, col) => {
    const value = e.target.value;

    // Update the UI instantly
    const newMatrix = [...matrix.data];
    newMatrix[row][col] = value;
    newMatrix[col][row] = value;
    setMatrix({ ...matrix, data: newMatrix });

    // Don't send update yet if input is empty
    if (value.trim() === "") return;

    const parsed = parseInt(value);
    if (isNaN(parsed)) return;

    const cam1 = matrix.labels[row];
    const cam2 = matrix.labels[col];

    // Now call the API
    apiRequest({
      url: "/update_connection",
      method: "PUT",
      data: {
        camera_name_1: cam1,
        camera_name_2: cam2,
        delay: parsed, // Ensure it's a number
      },
    })
      .then(() => {
        console.log("Connection updated");
      })
      .catch((err) => {
        console.error("Update failed:", err.message);
      });
  };

  const handleDeleteConnection = async () => {
    if (!camera1 || !camera2) {
      setDeleteMsg("❌ Both camera selections are required.");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:5000/delete_connection?camera_name_1=${camera1}&camera_name_2=${camera2}`
      );
      setDeleteMsg(`✅ ${res.data.message}`);
      setTimeout(() => {
        setDeleteDialogOpen(false);
        setCamera1("");
        setCamera2("");
        setDeleteMsg("");
        window.location.reload(); // reload to reflect changes
      }, 1500);
    } catch (err) {
      setDeleteMsg(
        err.response?.data?.error || "❌ Failed to delete connection."
      );
    }
  };

  return (
    <AppLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          View Connections
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Connection
        </Button>
      </Box>

      <Box sx={{ mt: 4, overflowX: "auto" }}>
        {loading ? (
          <Box mt={2} textAlign="center">
            <CircularProgress />
            <Typography>Loading matrix...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer sx={{ minWidth: "600px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                  />
                  {matrix.labels.map((label, idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {matrix.data.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell
                      sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                    >
                      {matrix.labels[i]}
                    </TableCell>
                    {row.map((value, j) => (
                      <TableCell
                        key={j}
                        align="center"
                        sx={{ border: "1px solid #ccc", padding: "4px" }}
                      >
                        {i === j ? (
                          value
                        ) : (
                          <input
                            type="text"
                            value={value === "∞" ? "" : value}
                            onChange={(e) => handleCellChange(e, i, j)}
                            style={{
                              width: "40px",
                              textAlign: "center",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              fontSize: "14px",
                            }}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter />
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Delete Connection Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Camera Connection</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              select
              label="Camera 1"
              value={camera1}
              onChange={(e) => setCamera1(e.target.value)}
              fullWidth
            >
              {cameras.map((cam) => (
                <MenuItem key={cam.id} value={cam.camera_model}>
                  {cam.camera_model}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Camera 2"
              value={camera2}
              onChange={(e) => setCamera2(e.target.value)}
              fullWidth
            >
              {cameras.map((cam) => (
                <MenuItem key={cam.id} value={cam.camera_model}>
                  {cam.camera_model}
                </MenuItem>
              ))}
            </TextField>
            {deleteMsg && (
              <Alert severity={deleteMsg.includes("❌") ? "error" : "success"}>
                {deleteMsg}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConnection}
          >
            Delete Connection
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}

export default ViewConnections;
