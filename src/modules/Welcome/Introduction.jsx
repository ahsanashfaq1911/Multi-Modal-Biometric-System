import AppLayout from "../../layout/AppLayout";
import { Box } from "@mui/material";
import welcomeImage from "../../assets/Images/title.png";
import getStartedButton from "../../assets/Images/GetStarted.png";
import { useNavigate } from "react-router-dom";
import undrawImage from "../../assets/Images/undraw.png";
function Introduction() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/RoleSelection");
  };

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: { xs: "40px", md: "80px" },
          paddingX: 2,
          textAlign: "center",
          gap: "30px", // adds space between children
        }}
      >
        {/* Logo Image */}
        <img
          src={welcomeImage}
          alt="Welcome"
          style={{
            width: "250px", // slightly bigger
            maxWidth: "80%", // responsive
            height: "auto",
          }}
        />
        <img
          src={undrawImage}
          alt="Welcome"
          style={{
            width: "100%", // Responsive width
            maxWidth: "250px", // Limits width on large screens
            height: "150px", // Custom height
            objectFit: "contain", // Keeps aspect ratio, prevents stretch
          }}
        />

        {/* Text Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
            maxWidth: "90%",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
            BioFuse : Your Secure Gateway
          </h3>
          <p style={{ maxWidth: "700px", color: "#555", fontSize: "1rem" }}>
            BioFuse makes secure access easy by combining different biometric
            technologies into one system, ensuring fast and accurate identity
            verification.
          </p>
        </Box>

        {/* Clickable Get Started Image */}
        <img
          src={getStartedButton}
          alt="Get Started"
          onClick={handleGetStarted}
          style={{
            width: "220px",
            maxWidth: "90%",
            height: "auto",
            marginTop: "calc(10px + 10vh)", // pushes it down approx. 30% more than before
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </Box>
    </AppLayout>
  );
}

export default Introduction;
