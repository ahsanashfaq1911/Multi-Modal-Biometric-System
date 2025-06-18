import React from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";

const CustomDropdown = ({
  label,
  options = [],
  value,
  onChange,
  getOptionLabel = (option) => option?.label || "", // default if not passed
}) => {
  return (
    <Box sx={{ width: "100%", maxWidth: "400px" }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", marginBottom: 1 }}
      >
        {label}
      </Typography>
      <Autocomplete
        disablePortal
        options={options}
        value={value}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, val) => option?.id === val?.id}
        onChange={(event, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
      />
    </Box>
  );
};

export default CustomDropdown;
