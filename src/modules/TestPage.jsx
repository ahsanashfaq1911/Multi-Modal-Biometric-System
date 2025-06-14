// src/modules/TestPage.jsx
import { Button } from "@mui/material";
import AppLayout from "../layout/AppLayout";
import { useState } from "react";
import { Box } from "@mui/material";

const TestPage = () => {
  const [count, setCount] = useState(0);

  return (
    <AppLayout>
       <Box
      sx={{
        height: "100vh", // Full screen height
        display: "flex",
        justifyContent: "center", // Horizontally center
        alignItems: "center",     // Vertically center
        backgroundColor: "white", // Background color
      }}
    >
      <Box
        sx={{
          width: 300,
          height: 200,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: 4,
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          padding: 2,
        }}
      >
        Centered Glass Box
      </Box>
    </Box>
    </AppLayout>
  );
};

export default TestPage;
