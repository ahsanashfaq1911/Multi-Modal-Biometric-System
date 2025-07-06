// Imports stay the same
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
  TextField,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../../layout/AppLayout";
import CustomBox from "../../components/CustomBox";

function AccessControl() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedSubsections, setSelectedSubsections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false); // NEW: subsection loading
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseMsg, setResponseMsg] = useState({
    open: false,
    text: "",
    severity: "success",
  });

  // Fetch employees + departments
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/employees/overview",
          {
            params: { email: localStorage.getItem("supervisorEmail") },
          }
        );
        setEmployees(res.data.employees || res.data);
      } catch (err) {
        console.error(err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/get_departments");
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error("Failed to fetch departments");
      }
    };

    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleOpenDialog = (employee) => {
    setSelectedEmployee(employee);
    setSelectedDeptId("");
    setSelectedSubsections([]);
    setSubsections([]);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
    setSelectedDeptId("");
    setSelectedSubsections([]);
    setSubsections([]);
    setSubLoading(false);
  };

  const handleDepartmentChange = async (id) => {
    setSelectedDeptId(id);
    setSubLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/get_sections/${id}`);
      console.log("Subsection API response:", res.data); // 🔍 DEBUG LINE

      // 🔥 Update this line based on actual key
      const data =
        res.data.subsections || res.data.sections || res.data.data || [];
      setSubsections(data);
    } catch (err) {
      console.error("Error fetching subsections", err);
      setSubsections([]);
    } finally {
      setSubLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!selectedEmployee?.id || selectedSubsections.length === 0) {
      return setResponseMsg({
        open: true,
        text: "Please select department & subsection(s).",
        severity: "warning",
      });
    }

    try {
      const res = await axios.post("http://localhost:5000/grantaccess", {
        employee_id: selectedEmployee.id,
        subsection_ids: selectedSubsections.map(Number),
      });

      setResponseMsg({
        open: true,
        text: res.data.message,
        severity: "success",
      });
      handleCloseDialog();
    } catch (error) {
      const msg = error?.response?.data?.error || "Grant access failed";
      setResponseMsg({ open: true, text: msg, severity: "error" });
    }
  };

  return (
    <AppLayout>
      <CustomBox>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Grant Access to Employees
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto" }} />
        ) : employees.length === 0 ? (
          <Alert severity="info">No employees found.</Alert>
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
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenDialog(emp)}
                  >
                    Grant Access
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Grant Access to {selectedEmployee?.name}</DialogTitle>
          <DialogContent
            dividers
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            {/* Department Dropdown */}
            <TextField
              select
              label="Select Department"
              value={selectedDeptId}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              fullWidth
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Subsection Multi-select */}
            {subLoading ? (
              <CircularProgress size={20} sx={{ mx: "auto", my: 1 }} />
            ) : (
              <TextField
                select
                label="Select Subsections"
                value={selectedSubsections}
                onChange={(e) => setSelectedSubsections(e.target.value)}
                SelectProps={{ multiple: true }}
                fullWidth
                disabled={!subsections.length}
              >
                {subsections.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.name || `Subsection ${sub.id}`}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleGrantAccess}>
              Confirm Grant
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for success/error */}
        <Snackbar
          open={responseMsg.open}
          autoHideDuration={4000}
          onClose={() => setResponseMsg({ ...responseMsg, open: false })}
        >
          <Alert severity={responseMsg.severity} variant="filled">
            {responseMsg.text}
          </Alert>
        </Snackbar>
      </CustomBox>
    </AppLayout>
  );
}

export default AccessControl;
