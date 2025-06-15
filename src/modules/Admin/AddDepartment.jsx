import AppLayout from "../../layout/AppLayout";
import { Box, Typography,Button,TextField } from "@mui/material";
function AddDepartment() {
  return (
    <>
      <AppLayout>
        <Box
          sx={{
            padding: { xs: "20px", sm: "30px", md: "40px" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "24px", sm: "32px", md: "40px" },
              fontWeight: "bold",
            }}
          >
            Add Department
          </Typography>
        </Box>
      </AppLayout>
    </>
  );
}

export default AddDepartment;
