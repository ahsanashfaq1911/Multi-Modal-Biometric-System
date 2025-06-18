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
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../services/ApiService";

function ViewConnections() {
  const [matrix, setMatrix] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchMatrix();
  }, []);

  const handleCellChange = async (value, row, col) => {
    if (row === col || value === "") return; // no update for self-loop or empty

    const parsed = parseInt(value);
    if (isNaN(parsed)) return;

    const cam1 = matrix.labels[row];
    const cam2 = matrix.labels[col];

    try {
      await apiRequest({
        url: "/update_connection",
        method: "PUT",
        data: {
          camera_name_1: cam1,
          camera_name_2: cam2,
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
                  <TableCell sx={{ border: "1px solid #ccc", fontWeight: "bold" }} />
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
                    <TableCell sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>
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
                            onChange={(e) => handleCellChange(e.target.value, i, j)}
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
    </AppLayout>
  );
}

export default ViewConnections;
