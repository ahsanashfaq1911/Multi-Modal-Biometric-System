import CustomBox from "../components/CustomBox";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import imgTest from "../assets/Images/Add Department.png";
import { Typography } from "@mui/material";

function TestPage() {
  return (
    <CustomBox>
      <img
        src={imgTest}
        alt="Add Department"
        style={{ width: "100%", borderRadius: "12px" }}
      />

      <Typography variant="h5" fontWeight="bold" textAlign="center">
        Add Department
      </Typography>

      <CustomTextField placeholder="Enter Department Name" />
      <CustomTextField placeholder="Department ID" />

      <CustomButton>Submit</CustomButton>
    </CustomBox>
  );
}

export default TestPage;
