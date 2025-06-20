import { Button } from "@mui/material";

function CustomButton({
  children,
  sx = {},
  color = "#469C9C", // default teal
  hoverColor = "#357F7F", // darker teal on hover
  size = "medium", // "small", "medium", "large"
  ...props
}) {
  // Adjusted size-based styles
  const sizeStyles =
    size === "small"
      ? {
          padding: "3px 10px",
          fontSize: "0.7rem",
          maxWidth: "120px",
          minHeight: "28px",
        }
      : size === "large"
      ? {
          padding: "12px 24px",
          fontSize: "1.05rem",
          maxWidth: "350px",
          minHeight: "50px",
        }
      : {
          // medium (default)
          padding: "10px 20px",
          fontSize: "0.9rem",
          maxWidth: "280px",
          minHeight: "42px",
        };

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: color,
        ":hover": { backgroundColor: hoverColor },
        textTransform: "none",
        width: "100%",
        borderRadius: "8px",
        ...sizeStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
