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
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:5000";

async function apiRequest({
  url,
  method = "GET",
  data = null,
  headers = {},
  isFormData = false,
}) {
  try {
    const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

    const options = {
      method,
      headers: {
        ...headers,
        ...(data && !isFormData && { "Content-Type": "application/json" }),
      },
      ...(data && { body: isFormData ? data : JSON.stringify(data) }),
    };

    const response = await fetch(fullUrl, options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Unknown error");
    return result;
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
}

function ViewConnections() {
  const [matrix, setMatrix] = useState({ labels: [], data: [], ids: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMatrix() {
      try {
        setLoading(true);
        setError(null);

        const connections = await apiRequest({ url: "/get_connections" });
        const cameras = await apiRequest({ url: "/get_cameras" });

        const cameraMap = {};
        cameras.forEach(({ id, camera_model }) => {
          cameraMap[id] = camera_model || `Camera ${id}`;
        });

        const uniqueIds = [
          ...new Set(connections.connections.flatMap((c) => [c.camera_id_1, c.camera_id_2])),
        ];
        const labels = uniqueIds.map((id) => cameraMap[id]);
        const size = labels.length;

        const adjMatrix = Array.from({ length: size }, () => Array(size).fill("∞"));

        uniqueIds.forEach((id, i) => {
          adjMatrix[i][i] = 1;
        });

        connections.connections.forEach(({ camera_id_1, camera_id_2, delay }) => {
          const i = uniqueIds.indexOf(camera_id_1);
          const j = uniqueIds.indexOf(camera_id_2);
          if (i !== -1 && j !== -1) {
            adjMatrix[i][j] = delay;
            adjMatrix[j][i] = delay;
          }
        });

        setMatrix({ labels, data: adjMatrix, ids: uniqueIds });
      } catch (err) {
        setError("Failed to load matrix: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMatrix();
  }, []);

  const handleCellChange = async (value, row, col) => {
    if (row === col) return; // Ignore diagonal
    const parsed = parseInt(value);
    if (isNaN(parsed)) return;

    try {
      const id1 = matrix.ids[row];
      const id2 = matrix.ids[col];

      await apiRequest({
        url: "/update_connection",
        method: "POST",
        data: {
          camera_id_1: id1,
          camera_id_2: id2,
          delay: parsed,
        },
      });

      const newMatrix = [...matrix.data];
      newMatrix[row][col] = parsed;
      newMatrix[col][row] = parsed;
      setMatrix({ ...matrix, data: newMatrix });
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <AppLayout>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          View Connections
        </Typography>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        

        {loading && (
          <Box mt={2}>
            <CircularProgress />
            <Typography>Loading matrix...</Typography>
          </Box>
        )}

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

        {!loading && !error && matrix.labels.length > 0 && (
          <Box
            sx={{
              overflowX: "auto",
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: "90vw" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {matrix.labels.map((label, idx) => (
                      <TableCell
                        key={idx}
                        align="center"
                        sx={{ fontWeight: "bold" }}
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matrix.data.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {matrix.labels[i]}
                      </TableCell>
                      {row.map((value, j) => (
                        <TableCell key={j} align="center">
                          {i === j ? (
                            value
                          ) : (
                            <TextField
                              value={value}
                              variant="standard"
                              onChange={(e) =>
                                handleCellChange(e.target.value, i, j)
                              }
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  width: "40px",
                                },
                              }}
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </AppLayout>
  );
}

export default ViewConnections;
