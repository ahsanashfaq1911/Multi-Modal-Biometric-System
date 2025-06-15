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
  InputBase,
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
    if (row === col) return;
    const parsed = parseInt(value);
    if (isNaN(parsed)) return;

    const id1 = matrix.ids[row];
    const id2 = matrix.ids[col];

    try {
      await apiRequest({
        url: "/add_connection",
        method: "POST",
        data: {
          camera_id_1: id1,
          camera_id_2: id2,
          delay: parsed,
        },
      });

      const updatedMatrix = [...matrix.data];
      updatedMatrix[row][col] = parsed;
      updatedMatrix[col][row] = parsed;
      setMatrix((prev) => ({ ...prev, data: updatedMatrix }));
    } catch (err) {
      console.error("Failed to update connection:", err.message);
    }
  };

  return (
    <AppLayout>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        View Connections (Adjacency Matrix)
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
          <Box sx={{ overflowX: "auto", mt: 3, display: "flex", justifyContent: "center" }}>
            <TableContainer component={Paper} sx={{ maxWidth: "95vw" }}>
              <Table size="small" sx={{ borderCollapse: "collapse" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: 100 }}></TableCell>
                    {matrix.labels.map((label, idx) => (
                      <TableCell
                        key={idx}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          width: 80,
                          backgroundColor: "#e0e0e0",
                          border: "1px solid #ccc",
                        }}
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
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#e0e0e0",
                          border: "1px solid #ccc",
                        }}
                      >
                        {matrix.labels[i]}
                      </TableCell>
                      {row.map((value, j) => (
                        <TableCell
                          key={j}
                          align="center"
                          sx={{
                            border: "1px solid #ccc",
                            padding: "4px",
                            height: "50px",
                            backgroundColor: i === j ? "#f0f0f0" : "white",
                          }}
                        >
                          {i === j ? (
                            value
                          ) : (
                            <InputBase
                              type="number"
                              defaultValue={value === "∞" ? "" : value}
                              onBlur={(e) => handleCellChange(e.target.value, i, j)}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  width: "40px",
                                  border: "none",
                                  outline: "none",
                                  fontSize: "14px",
                                },
                                min: 0,
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
