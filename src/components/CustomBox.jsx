// src/components/CustomBox.jsx
import { Box, Typography } from "@mui/material";

function CustomBox({ title, children, ...props }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: { xs: "20px", sm: "30px", md: "40px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // center horizontally
        gap: 3,
        ...props.sx,
      }}
      {...props}
    >
      {/* Title aligned to top-left */}
      {title && (
        <Box sx={{ width: "100%", textAlign: "left" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            {title}
          </Typography>
        </Box>
      )}

      {/* Centered Content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default CustomBox;
