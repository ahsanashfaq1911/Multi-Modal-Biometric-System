// components/CustomButton.jsx

import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({
  label,
  onClick,
  color = "#469C9C",
  width = "200px",
}) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: color,
        ":hover": { backgroundColor: "#357F7F" },
        maxWidth: width,
        width: "100%",
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
