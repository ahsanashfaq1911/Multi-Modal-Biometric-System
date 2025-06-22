import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../../layout/AppLayout";
import CustomBox from "../../../components/CustomBox";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";
import userImg from "../../../assets/Images/UserManagement.png";

function UserManagement() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <CustomBox>
        <img src={userImg} alt="User Management" />

        <CustomButton onClick={() => navigate("/user-credentials")}>
          User Credentials
        </CustomButton>
      </CustomBox>
    </AppLayout>
  );
}

export default UserManagement;
