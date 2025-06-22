import React from "react";
import AppLayout from "../../../layout/AppLayout";

function IncompleteProfiles() {
  return (
    <AppLayout>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "40px" },
          fontWeight: "bold",
        }}
      >
        Incomplete Profiles
      </Typography>
    </AppLayout>
  );
}

export default IncompleteProfiles;
