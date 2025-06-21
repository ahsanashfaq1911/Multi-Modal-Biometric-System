import AppLayout from "../../../layout/AppLayout";
import CustomBox from "../../../components/CustomBox";
import CustomButton from "../../../components/CustomButton";
import loginimg from "../../../assets/Images/ManageSupervisor.png";
import { Typography } from "@mui/material";

function ManageSupervisor() {
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
        <CustomButton>View All Supervisors</CustomButton>
        <CustomButton>Track Supervisor</CustomButton>
        <CustomButton>Add Supervisor</CustomButton>
      </CustomBox>
    </AppLayout>
  );
}

export default ManageSupervisor;
