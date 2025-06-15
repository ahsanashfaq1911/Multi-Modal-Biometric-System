import AppLayout from "../../../layout/AppLayout.jsx";
import { Box, Typography, Button, TextField } from "@mui/material";
import DepImg from "../../../assets/Images/Add Department.png";
import { useNavigate } from "react-router-dom";
function AddDepartment() {
  const navigate = useNavigate();
  return (
    <>
      <AppLayout>
        <Box
          sx={{
            padding: { xs: "20px", sm: "30px", md: "40px" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "24px", sm: "32px", md: "40px" },
              fontWeight: "bold",
            }}
          >
            Add Department
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img src={DepImg} alt="" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            gap: 1,
            width: "100%", // optional: controls how wide the input area is
            maxWidth: "400px", // optional: limit width for better UI
            margin: "auto", // center horizontally
            mt: 4, // margin-top
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Enter Department Name
          </Typography>
          <TextField
            id="outlined-basic"
            label="Department Name"
            variant="outlined"
            fullWidth
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" sx={{ backgroundColor: "#469C9C" }}>
              {" "}
              Save
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: { xs: "20%", lg: "5%" },
          }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#469C9C" }}
            onClick={() => navigate("/add-subsection")}
          >
            Add Subsection
          </Button>
        </Box>
      </AppLayout>
    </>
  );
}

export default AddDepartment;
