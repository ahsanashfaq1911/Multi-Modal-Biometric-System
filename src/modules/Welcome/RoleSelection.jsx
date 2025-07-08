import AppLayout from "../../layout/AppLayout";
import image from "../../assets/Images/image.png";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      {/* Responsive Image Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: { xs: "10%", md: "5%" },
          width: "100%",
        }}
      >
        <img
          src={image}
          alt="Welcome"
          style={{
            maxWidth: "150px",
            width: "80%",
            height: "auto",
          }}
        />
      </Box>

      {/* Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "5%",
        }}
      >
        <h4>Select Your Role To Get Started</h4>
      </Box>

      {/* Vertical Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          marginTop: "40px",
        }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#469C9C",
            width: "200px",
            ":hover": {
              backgroundColor: "#357F7F",
            },
          }}
          onClick={() => navigate("/admin-login")}
        >
          Admin
        </Button>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#469C9C",
            width: "200px",
            ":hover": {
              backgroundColor: "#357F7F",
            },
          }}
          onClick={() => navigate("/supervisor-login")}
        >
          Supervisor
        </Button>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#469C9C",
            width: "200px",
            ":hover": {
              backgroundColor: "#357F7F",
            },
          }}
          onClick={() => navigate("/employee-login")}
        >
          Employee
        </Button>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#469C9C",
            width: "200px",
            ":hover": {
              backgroundColor: "#357F7F",
            },
          }}
          onClick={() => navigate("/guard-login")}
        >
          Guard
        </Button>

         <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#469C9C",
            width: "200px",
            ":hover": {
              backgroundColor: "#357F7F",
            },
          }}
          onClick={() => navigate("/director")}
        >
          Director
        </Button>
      </Box>
    </AppLayout>
  );
}

export default RoleSelection;
