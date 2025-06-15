import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
function SetConnections() {
  return (
    <>
      <AppLayout>
        <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "20px", sm: "24px", md: "28px" },
          fontWeight: "bold",
        }}
      >
        Set Connections
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: { xs: 2, sm: 4, md: 6 },
        }}
      ></Box>
      </AppLayout>
    </>
  );
}
export default SetConnections;
