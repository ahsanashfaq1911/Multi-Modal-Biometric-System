import AppLayout from "../../../layout/AppLayout";
import { useNavigate } from "react-router-dom";
import LocImg from "../../../assets/Images/add location.jpg";
import { Box, Typography, Button, TextField } from "@mui/material";

function AddLocation() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Title Section */}
      <Box sx={{ padding: { xs: "20px", sm: "30px", md: "40px" } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bold",
          }}
        >
          Add Location
        </Typography>
      </Box>

      {/* Image Section */}
      <Box sx={{ display: "flex", justifyContent: "center", padding: "5%" }}>
        <img src={LocImg} alt="Department" />
      </Box>

      {/* Input and Button Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: "100%",
          maxWidth: { xs: "90%", sm: "400px", md: "500px" },
          mx: "auto",
          mt: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", alignSelf: "flex-start" }}
        >
          Location
        </Typography>

        <TextField
          id="outlined-basic"
          label="Enter Location Name"
          variant="outlined"
          fullWidth
        />

        {/* Button aligned to end */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" size="small">
            Save
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              ":hover": {
                backgroundColor: "#357F7F",
              },
            }}
            onClick={() => navigate("/add-camera")}
          >
            Add Camera
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
}

export default AddLocation;
