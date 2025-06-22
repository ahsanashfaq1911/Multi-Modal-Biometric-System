import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";
import CustomBox from "../../components/CustomBox";

function EmployeeOverview() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const email = localStorage.getItem("supervisorEmail");
      if (!email) {
        setError("Supervisor email not found in storage.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/employees/overview",
          {
            params: { email },
          }
        );
        setEmployees(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "❌ Failed to load employee overview."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <AppLayout>
      <CustomBox>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Employees Overview
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto" }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {employees.map((emp) => (
              <Grid item xs={12} sm={6} md={4} key={emp.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={emp.profile_img}
                    alt={emp.name}
                    sx={{ width: 80, height: 80, mb: 1 }}
                  />
                  <Typography fontWeight="bold">{emp.name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </CustomBox>
    </AppLayout>
  );
}

export default EmployeeOverview;
