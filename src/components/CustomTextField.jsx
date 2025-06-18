import { TextField, Typography, Box, MenuItem } from "@mui/material";

function CustomTextField({
  label,
  value,
  onChange,
  placeholder = "",
  select = false,
  options = [],
}) {
  return (
    <Box sx={{ width: "100%", maxWidth: "400px" }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", marginBottom: 1 }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        value={value}
        onChange={onChange}
        select={select}
        placeholder={placeholder}
      >
        {select &&
          options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
      </TextField>
    </Box>
  );
}

export default CustomTextField;
