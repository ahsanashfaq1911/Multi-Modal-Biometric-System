import AppLayout from "../../../layout/AppLayout";
import CustomBox from "../../../components/CustomBox";
import CustomButton from "../../../components/CustomButton";
import loginimg from "../../../assets/Images/ManageSupervisor.png";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 👈 Import this

function ManageSupervisor() {
  const navigate = useNavigate(); // 👈 Hook to navigate

  return (
    <AppLayout>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "40px" },
          fontWeight: "bold",
        }}
      >
        Manage Supervisor
      </Typography>
      <CustomBox>
        <img src={loginimg} alt="" />
        <div></div>
        <CustomButton onClick={() => navigate("/view-supervisors")}>
          View All Supervisors
        </CustomButton>
        <CustomButton onClick={() => navigate("/track-supervisor")}>
          Track Supervisor
        </CustomButton>
        <CustomButton onClick={() => navigate("/add-supervisor")}>
          Add Supervisor
        </CustomButton>
      </CustomBox>
    </AppLayout>
  );
}

export default ManageSupervisor;
