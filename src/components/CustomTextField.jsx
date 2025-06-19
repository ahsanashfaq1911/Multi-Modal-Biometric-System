import { TextField, Typography, Box, MenuItem } from "@mui/material";

function CustomTextField({
  label,
  value,
  onChange,
  placeholder = "",
  select = false,
  options = [],
  type = "text", // ✅ Add this line to support input type
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
        type={type} // ✅ Pass the type to TextField
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
