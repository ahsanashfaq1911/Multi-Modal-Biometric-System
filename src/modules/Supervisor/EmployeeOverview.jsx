import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";
import CustomBox from "../../components/CustomBox";

function EmployeeOverview() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
        setEmployees(res.data.employees || res.data);
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

  const handleDetails = async (employeeId) => {
    setDetailLoading(true);
    setOpenDialog(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/employee/details", {
        params: { id: employeeId },
      });
      setSelectedEmployee(res.data);
    } catch (err) {
      setSelectedEmployee({
        error: err.response?.data?.error || "❌ Failed to load details.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

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
                    gap: 1,
                  }}
                >
                  <Avatar
                    src={emp.profile_img}
                    alt={emp.name}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Typography fontWeight="bold">{emp.name}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDetails(emp.id)}
                  >
                    View Details
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ✅ Details Popup */}
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogContent dividers>
            {detailLoading ? (
              <CircularProgress />
            ) : selectedEmployee?.error ? (
              <Alert severity="error">{selectedEmployee.error}</Alert>
            ) : selectedEmployee ? (
              <>
                <Avatar
                  src={selectedEmployee.profile_img}
                  alt={selectedEmployee.name}
                  sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}
                />
                <Typography fontWeight="bold" gutterBottom>
                  {selectedEmployee.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📧 Email: {selectedEmployee.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📞 Contact: {selectedEmployee.contact}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  🆔 CNIC: {selectedEmployee.cnic}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  🧑‍💼 Designation: {selectedEmployee.designation}
                </Typography>
              </>
            ) : (
              <Typography>No details available.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </CustomBox>
    </AppLayout>
  );
}

export default EmployeeOverview;
